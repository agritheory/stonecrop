import jwt from 'jsonwebtoken'
import { AbilityBuilder, PureAbility } from '@casl/ability'
import type { Context, User } from '../types'
import { defaultAbilityBuilder } from './ability'

export interface JWTConfig {
	enabled?: boolean
	secret?: string
	publicKey?: string
	algorithms?: jwt.Algorithm[]
	issuer?: string
	audience?: string
	extractUser?: (payload: any) => User | undefined
	headerName?: string // Default: 'authorization'
	tokenPrefix?: string // Default: 'Bearer '
	optional?: boolean // If true, continues without error if no token
	maxAge?: string // Maximum age of token (e.g., '1h', '7d')
}

export interface JWTPayload extends jwt.JwtPayload {
	sub?: string // Subject (user id)
	roles?: string[]
	permissions?: Array<{
		action: string
		subject: string
		conditions?: any
	}>
	[key: string]: any
}

/**
 * Default user extractor from JWT payload
 */
const defaultUserExtractor = (payload: JWTPayload): User | undefined => {
	if (!payload.sub) return undefined

	return {
		id: payload.sub,
		roles: payload.roles || [],
		...payload, // Include any additional claims
	}
}

/**
 * JWT middleware factory for GraphQL servers
 *
 * @example
 * ```typescript
 * // In Nuxt Yoga
 * export default defineNuxtConfig({
 *   yoga: {
 *     middleware: [
 *       createJWTMiddleware({
 *         enabled: true,
 *         secret: process.env.JWT_SECRET,
 *         optional: true // Don't fail if no token
 *       })
 *     ]
 *   }
 * })
 *
 * // In Postgraphile
 * const jwtPlugin = createPostgraphileJWTPlugin({
 *   secret: process.env.JWT_SECRET,
 *   extractUser: (payload) => ({
 *     id: payload.user_id,
 *     roles: payload.user_roles
 *   })
 * })
 * ```
 */
export const createJWTMiddleware = (config: JWTConfig = {}) => {
	const {
		enabled = true,
		secret,
		publicKey,
		algorithms = ['HS256'] as jwt.Algorithm[],
		issuer,
		audience,
		headerName = 'authorization',
		tokenPrefix = 'Bearer ',
		optional = false,
		extractUser = defaultUserExtractor,
		maxAge,
	} = config

	// Validate configuration
	if (enabled && !secret && !publicKey) {
		throw new Error('JWT middleware requires either secret or publicKey')
	}

	return async (context: Context, next: () => Promise<any>) => {
		// Skip if JWT is disabled
		if (!enabled) {
			return next()
		}

		try {
			// Extract token from request headers
			const authHeader =
				context.req?.headers?.get?.(headerName) ||
				context.request?.headers?.get?.(headerName) ||
				context.headers?.[headerName]

			if (!authHeader) {
				if (optional) {
					return next()
				}
				throw new Error('No authorization header found')
			}

			// Remove token prefix
			const token = authHeader.startsWith(tokenPrefix) ? authHeader.slice(tokenPrefix.length) : authHeader

			// Prepare verification options
			const verifyOptions: jwt.VerifyOptions = {
				algorithms,
				...(issuer && { issuer }),
				...(audience && { audience }),
				...(maxAge && { maxAge }),
			}

			// Verify and decode token
			const secretOrPublicKey = publicKey || secret!
			const payload = jwt.verify(token, secretOrPublicKey, verifyOptions) as JWTPayload

			// Extract user from payload
			const user = extractUser(payload)

			if (user) {
				context.user = user
				// Store the raw payload for potential use
				context.jwtPayload = payload
			}

			// Continue to next middleware
			return next()
		} catch (error: any) {
			if (optional) {
				// Log error in development
				if (process.env.NODE_ENV === 'development') {
					console.warn('JWT verification failed (optional):', error.message)
				}
				// Continue without user if optional
				return next()
			}

			// Re-throw with more specific error messages
			if (error.name === 'TokenExpiredError') {
				throw new Error('Token has expired', { cause: error })
			} else if (error.name === 'JsonWebTokenError') {
				throw new Error('Invalid token', { cause: error })
			} else if (error.name === 'NotBeforeError') {
				throw new Error('Token not active yet', { cause: error })
			}

			throw error
		}
	}
}

/**
 * Create a JWT token with user data
 */
export const createJWT = (
	user: User,
	config: {
		secret: string
		expiresIn?: string | number
		issuer?: string
		audience?: string
		additionalClaims?: Record<string, any>
	}
): string => {
	const { secret, expiresIn = '1h', issuer, audience, additionalClaims = {} } = config

	const payload: JWTPayload = {
		sub: user.id,
		roles: user.roles || [],
		...additionalClaims,
	}

	const signOptions: jwt.SignOptions = {}

	// Add optional fields only if they exist
	if (issuer !== undefined) signOptions.issuer = issuer
	if (audience !== undefined) signOptions.audience = audience
	if (expiresIn !== undefined) signOptions.expiresIn = expiresIn as any // Type cast to avoid TS issues

	return jwt.sign(payload, secret, signOptions)
}

/**
 * Integration with CASL ability builder
 */
export const createJWTAbilityBuilder = (_config: JWTConfig = {}) => {
	return async (user?: User) => {
		// If user has direct permissions in JWT, use those
		const jwtPermissions = (user as any)?.permissions

		if (jwtPermissions && Array.isArray(jwtPermissions)) {
			// Build ability from JWT permissions
			const { can, cannot, build } = new AbilityBuilder<PureAbility>(PureAbility as any)

			jwtPermissions.forEach((permission: any) => {
				if (permission.inverted) {
					cannot(permission.action, permission.subject, permission.conditions)
				} else {
					can(permission.action, permission.subject, permission.conditions)
				}
			})

			return build()
		}

		// Fall back to role-based abilities
		return defaultAbilityBuilder(user)
	}
}

/**
 * Postgraphile-specific JWT plugin
 */
export const createPostgraphileJWTPlugin = (config: JWTConfig) => {
	return {
		name: 'JWTAuthPlugin',
		version: '1.0.0',

		// Hook into Postgraphile's context building
		grafast: {
			hooks: {
				async context(ctx: any, _build: any) {
					const middleware = createJWTMiddleware(config)

					// Create a simple context object that the middleware can work with
					const context = {
						req: ctx.req,
						headers: ctx.req?.headers,
						user: undefined,
						jwtPayload: undefined,
					}

					// Run the JWT middleware
					await middleware(context, async () => {})

					// Add user to Postgraphile context
					if (context.user) {
						return { ...ctx, user: context.user, jwtPayload: context.jwtPayload }
					}

					return ctx
				},
			},
		},
	}
}

/**
 * Express/Koa middleware for REST endpoints
 */
export const createHTTPJWTMiddleware = (config: JWTConfig) => {
	const jwtMiddleware = createJWTMiddleware(config)

	// Express middleware
	return async (req: any, res: any, next: any) => {
		const context = {
			req: {
				headers: {
					get: (name: string) => req.headers[name],
				},
			},
			headers: req.headers,
			user: undefined,
			jwtPayload: undefined,
		}

		try {
			await jwtMiddleware(context, async () => {})
			req.user = context.user
			req.jwtPayload = context.jwtPayload
			next()
		} catch (error: any) {
			if (config.optional) {
				next()
			} else {
				res.status(401).json({
					error: error.message,
					code: 'UNAUTHORIZED',
				})
			}
		}
	}
}

/**
 * Refresh token utilities
 */
export const refreshTokenUtils = {
	/**
	 * Create access and refresh tokens
	 */
	createTokenPair: (
		user: User,
		config: {
			accessSecret: string
			refreshSecret: string
			accessExpiresIn?: string
			refreshExpiresIn?: string
		}
	) => {
		const { accessSecret, refreshSecret, accessExpiresIn = '15m', refreshExpiresIn = '7d' } = config

		const accessPayload: any = {
			sub: user.id,
			roles: user.roles,
			type: 'access',
		}

		const refreshPayload: any = {
			sub: user.id,
			type: 'refresh',
		}

		// Create access token with proper options
		const accessOptions: jwt.SignOptions = {}
		if (accessExpiresIn) {
			accessOptions.expiresIn = accessExpiresIn as any // Type cast to avoid TS issues
		}

		const accessToken = jwt.sign(accessPayload, accessSecret, accessOptions)

		// Create refresh token with proper options
		const refreshOptions: jwt.SignOptions = {}
		if (refreshExpiresIn) {
			refreshOptions.expiresIn = refreshExpiresIn as any // Type cast to avoid TS issues
		}

		const refreshToken = jwt.sign(refreshPayload, refreshSecret, refreshOptions)

		return { accessToken, refreshToken }
	},

	/**
	 * Verify refresh token and create new access token
	 */
	refreshAccessToken: async (
		refreshToken: string,
		config: {
			accessSecret: string
			refreshSecret: string
			getUserById: (id: string) => Promise<User | null>
			accessExpiresIn?: string
		}
	) => {
		const { accessSecret, refreshSecret, getUserById, accessExpiresIn = '15m' } = config

		try {
			// Verify refresh token
			const payload = jwt.verify(refreshToken, refreshSecret) as any

			if (payload.type !== 'refresh') {
				throw new Error('Invalid token type')
			}

			// Get fresh user data
			const user = await getUserById(payload.sub)
			if (!user) {
				throw new Error('User not found')
			}

			// Create new access token
			const accessPayload: any = {
				sub: user.id,
				roles: user.roles,
				type: 'access',
			}

			// Create access token with proper options
			const accessOptions: jwt.SignOptions = {}
			if (accessExpiresIn) {
				accessOptions.expiresIn = accessExpiresIn as any // Type cast to avoid TS issues
			}

			const accessToken = jwt.sign(accessPayload, accessSecret, accessOptions)

			return { accessToken, user }
		} catch (error: any) {
			if (error.name === 'TokenExpiredError') {
				throw new Error('Refresh token expired', { cause: error })
			}
			throw error
		}
	},
}
