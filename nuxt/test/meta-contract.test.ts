/**
 * Meta-pipeline contract tests for the two host SDLs and their resolvers.
 *
 * The GraphQL meta pipeline restates @stonecrop/schema shapes in three places
 * the type system cannot see: the host SDL files (templates/, fullstack/) and
 * the resolver formatting helpers. Each restatement drifts independently —
 * fullstack's SDL rotted to 9 of 19 field keys, and both resolvers dropped
 * `format`/`source` by enumerating keys — so both are pinned here against the
 * Zod schemas as the single source of truth. The middleware's own SDL has the
 * same check in graphql_middleware/tests/typeDefs.test.ts.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { parse, Kind, type DocumentNode } from 'graphql'
import { describe, it, expect, vi } from 'vitest'

import { ActionDefinition, ValueFieldSchema, type DoctypeMeta } from '@stonecrop/schema'

import { formatDoctypeMeta as templatesFormatDoctypeMeta } from '../templates/resolvers'
import { formatDoctypeMeta as fullstackFormatDoctypeMeta } from '../fullstack/server/resolvers'

// The resolver modules imported above pull in the middleware at top level, which
// transitively boots postgraphile + pg (a server-only chain that also breaks vitest's node
// interop). vitest hoists the vi.mock below above those imports, so the stub is registered
// before the resolver modules load; the formatting helpers under test never call it.
vi.mock('@stonecrop/graphql-middleware', () => {
	const notExecutable = (name: string) => () => {
		throw new Error(`graphql-middleware stub: ${name}() must not execute in unit tests`)
	}
	return {
		getMeta: notExecutable('getMeta'),
		getAllMeta: notExecutable('getAllMeta'),
		applyGuardedTransition: notExecutable('applyGuardedTransition'),
		loadDoctypes: notExecutable('loadDoctypes'),
	}
})

const HOST_SDLS = [
	{ name: 'templates', path: '../templates/schema.graphql' },
	{ name: 'fullstack', path: '../fullstack/server/schema.graphql' },
]

function typeFieldNames(doc: DocumentNode, typeName: string): string[] | undefined {
	const typeDef = doc.definitions.find(d => d.kind === Kind.OBJECT_TYPE_DEFINITION && d.name.value === typeName)
	if (!typeDef || typeDef.kind !== Kind.OBJECT_TYPE_DEFINITION) return undefined
	return (typeDef.fields ?? []).map(f => f.name.value)
}

describe.each(HOST_SDLS)('$name SDL ⟷ @stonecrop/schema drift', { tags: ['unit', 'graphql'] }, ({ path }) => {
	const doc = parse(readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf-8'))

	it('StonecropField matches ValueFieldSchema shape exactly', () => {
		// Exact set equality, both directions: a schema key missing from the SDL is
		// unselectable (silent data loss); an SDL key missing from the schema is a
		// phantom (Zod strips unknown keys at the load gate — it can never carry data).
		const sdlFields = typeFieldNames(doc, 'StonecropField')
		expect(sdlFields, 'StonecropField type not found').toBeDefined()
		expect(sdlFields!.toSorted()).toEqual(Object.keys(ValueFieldSchema.shape).toSorted())
	})

	it('WorkflowAction matches ActionDefinition shape exactly (plus the computed `name` key)', () => {
		// `name` is the action's record key in WorkflowMeta.actions, injected by the
		// resolver when it flattens the record into a list — the one legitimate
		// computed addition.
		const sdlFields = typeFieldNames(doc, 'WorkflowAction')
		expect(sdlFields, 'WorkflowAction type not found').toBeDefined()
		expect(sdlFields!.toSorted()).toEqual(['name', ...Object.keys(ActionDefinition.shape)].toSorted())
	})

	it('WorkflowMeta.actions is a structured WorkflowAction list, not JSON', () => {
		const typeDef = doc.definitions.find(d => d.kind === Kind.OBJECT_TYPE_DEFINITION && d.name.value === 'WorkflowMeta')
		expect(typeDef).toBeDefined()
		const actionsField =
			typeDef?.kind === Kind.OBJECT_TYPE_DEFINITION ? typeDef.fields?.find(f => f.name.value === 'actions') : undefined
		expect(actionsField).toBeDefined()
		// [WorkflowAction!] — a JSON scalar here makes the client's structured
		// sub-selection (actions { label … }) invalid against this server.
		expect(JSON.stringify(actionsField!.type)).toContain('WorkflowAction')
	})
})

describe.each([
	{ name: 'templates', formatDoctypeMeta: templatesFormatDoctypeMeta },
	{ name: 'fullstack', formatDoctypeMeta: fullstackFormatDoctypeMeta },
])('$name formatDoctypeMeta preservation', { tags: ['unit', 'graphql'] }, ({ formatDoctypeMeta }) => {
	// A future key unknown to today's code stands in for the next schema addition:
	// a real preservation check pushes an UNKNOWN field through, not just known ones
	// (asserting only known fields survive is exactly how enumeration drift hides).
	const meta = {
		name: 'Widget',
		slug: 'widget',
		fields: [
			{
				kind: 'field',
				fieldname: 'amount',
				component: 'ATextInput',
				format: '0.00',
				source: 'introspected',
				cardinality: 'one',
				futureKey: 'must-survive',
			},
		],
		workflow: {
			states: ['Draft', 'Submitted'],
			actions: {
				Submit: {
					label: 'Submit',
					nextState: 'Submitted',
					allowedStates: ['Draft'],
					clientHandler: 'return 1',
					futureKey: 'must-survive',
				},
			},
		},
	} as unknown as DoctypeMeta

	it('passes every field key through, including ones this code has never heard of', () => {
		const out = formatDoctypeMeta(meta)
		expect(out.fields[0]).toMatchObject({
			fieldname: 'amount',
			format: '0.00',
			source: 'introspected',
			cardinality: 'one',
			futureKey: 'must-survive',
		})
	})

	it('passes displayField through when declared on the doctype', () => {
		const out = formatDoctypeMeta({ ...meta, displayField: 'amount' })
		expect(out.displayField).toBe('amount')
	})

	it('flattens actions to a named list and passes every action key through', () => {
		const out = formatDoctypeMeta(meta)
		expect(Array.isArray(out.workflow?.actions), 'workflow.actions must be a list').toBe(true)
		const submit = (out.workflow!.actions as Record<string, unknown>[]).find(a => a.name === 'Submit')
		expect(submit).toMatchObject({
			label: 'Submit',
			nextState: 'Submitted',
			clientHandler: 'return 1',
			futureKey: 'must-survive',
		})
		// The deleted `handler` field must not be resurrected as an explicit null.
		expect(submit).not.toHaveProperty('handler')
	})
})
