import { vi } from 'vitest'

// Mock all virtual Nuxt modules that are generated at build time
// These modules don't exist during testing and need to be mocked globally

// Mock the internal resolvers module
vi.mock('#internal/grafserv/resolvers', () => ({
	default: {
		Query: {
			plans: {
				hello: () => 'world',
			},
		},
	},
}))

// Mock the internal middleware module
vi.mock('#internal/grafserv/middleware', () => ({
	default: [],
}))

// NOTE: `#internal/grafserv/pgl` is deliberately NOT vi.mock'd here. vitest.config.ts already
// aliases it to ./mocks/pgl.ts, so a factory here is redundant — and worse, it re-declared the
// instance's shape in a second place. The two copies drifted: this one still described the old
// getSchema/release API long after the runtime moved to pgl.createServ(), which silently made the
// PostGraphile branch of handler.ts untestable. One definition, in ./mocks/pgl.ts.

// Mock the build-time preset module
vi.mock('#build/grafserv-preset', () => ({
	preset: {
		extends: [],
		pgServices: [],
	},
}))
