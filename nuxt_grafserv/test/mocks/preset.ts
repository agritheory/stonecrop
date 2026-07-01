import { StonecropPreset } from '@stonecrop/graphql-middleware'

// Mock build-time preset for testing
export const preset = {
	extends: [StonecropPreset],
	pgServices: [],
}
