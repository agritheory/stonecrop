import { loginIdentities, type LoginPreset } from '../login/loginIdentity'

/**
 * Header copy and identity field wiring for common login modes.
 * @public
 */
export function useLoginPreset(preset: LoginPreset) {
	const identity = loginIdentities[preset]
	const headerSubtitle =
		preset === 'email' ? 'Enter your email and password to login' : 'Enter your username and password to login'
	return { identity, headerSubtitle }
}
