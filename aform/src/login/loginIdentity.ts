/**
 * Configuration for the identity field on `Login`.
 * @public
 */
export type LoginIdentity = {
	label: string
	inputType: string
	autocomplete: string
	name: string
	placeholder?: string
}

/**
 * Built-in identity field presets for email and username sign-in.
 * @public
 */
export const loginIdentities = {
	email: {
		label: 'Email',
		inputType: 'email',
		autocomplete: 'email',
		name: 'email',
	},
	username: {
		label: 'Username',
		inputType: 'text',
		autocomplete: 'username',
		name: 'username',
	},
} as const satisfies Record<string, LoginIdentity>

/**
 * Keys of {@link loginIdentities}.
 * @public
 */
export type LoginPreset = keyof typeof loginIdentities
