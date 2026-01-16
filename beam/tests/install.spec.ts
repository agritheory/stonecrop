import { describe, it, expect } from 'vitest'
import { createApp } from 'vue'
import * as BeamModule from '../src/index'

describe('Beam module', () => {
	it('exports install function', () => {
		expect(BeamModule).toHaveProperty('install')
		expect(typeof BeamModule.install).toBe('function')
	})

	it('exports all components', () => {
		expect(BeamModule).toHaveProperty('ActionFooter')
		expect(BeamModule).toHaveProperty('BeamArrow')
		expect(BeamModule).toHaveProperty('BeamBtn')
		expect(BeamModule).toHaveProperty('BeamDayDivider')
		expect(BeamModule).toHaveProperty('BeamFilter')
		expect(BeamModule).toHaveProperty('BeamFilterOption')
		expect(BeamModule).toHaveProperty('BeamHeading')
		expect(BeamModule).toHaveProperty('BeamMetadata')
		expect(BeamModule).toHaveProperty('BeamModal')
		expect(BeamModule).toHaveProperty('BeamModalOutlet')
		expect(BeamModule).toHaveProperty('BeamProgress')
		expect(BeamModule).toHaveProperty('Confirm')
		expect(BeamModule).toHaveProperty('FixedTop')
		expect(BeamModule).toHaveProperty('ItemCheck')
		expect(BeamModule).toHaveProperty('ItemCount')
		expect(BeamModule).toHaveProperty('ListAnchor')
		expect(BeamModule).toHaveProperty('ListItem')
		expect(BeamModule).toHaveProperty('ListView')
		expect(BeamModule).toHaveProperty('Navbar')
		expect(BeamModule).toHaveProperty('ScanInput')
		expect(BeamModule).toHaveProperty('SegmentedDisplay')
		expect(BeamModule).toHaveProperty('SplitColumn')
		expect(BeamModule).toHaveProperty('ToggleArrow')
	})

	it('exports useMqttStream composable', () => {
		expect(BeamModule).toHaveProperty('useMqttStream')
		expect(typeof BeamModule.useMqttStream).toBe('function')
	})

	it('installs all components in Vue app', () => {
		const app = createApp({})
		BeamModule.install(app)

		const componentNames = [
			'ActionFooter',
			'BeamArrow',
			'BeamBtn',
			'BeamDayDivider',
			'BeamFilter',
			'BeamFilterOption',
			'BeamHeading',
			'BeamMetadata',
			'BeamModal',
			'BeamModalOutlet',
			'BeamProgress',
			'Confirm',
			'FixedTop',
			'ItemCheck',
			'ItemCount',
			'ListAnchor',
			'ListItem',
			'ListView',
			'Navbar',
			'ScanInput',
			'SegmentedDisplay',
			'SplitColumn',
			'ToggleArrow',
		]

		componentNames.forEach(name => {
			expect(app.component(name)).toBeDefined()
		})
	})
})
