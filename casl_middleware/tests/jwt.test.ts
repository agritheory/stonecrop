// casl-middleware/tests/jwt.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import {
	createJWTMiddleware,
	createJWT,
	createHTTPJWTMiddleware,
	refreshTokenUtils,
	type JWTConfig,
	type JWTPayload,
} from '../src/middleware/jwt'
import type { Context, User } from '../src/types'

describe('JWT Middleware', () => {
	const TEST_SECRET = 'test-secret-key-for-testing'
	const TEST_USER: User = {
		id: 'user-123',
		roles: ['user', 'editor'],
	}

	describe('createJWT', () => {
		it('should create a valid JWT token', () => {
			const token = createJWT(TEST_USER, {
				secret: TEST_SECRET,
				expiresIn: '1h',
			})

			expect(token).toBeDefined()
			expect(token.split('.')).toHaveLength(3)

			// Verify the token
			const decoded = jwt.verify(token, TEST_SECRET) as JWTPayload
			expect(decoded.sub).toBe(TEST_USER.id)
			expect(decoded.roles).toEqual(TEST_USER.roles)
		})

		it('should include additional claims', () => {
			const token = createJWT(TEST_USER, {
				secret: TEST_SECRET,
				additionalClaims: {
					email: 'user@example.com',
					permissions: ['read:posts', 'write:posts'],
				},
			})

			const decoded = jwt.verify(token, TEST_SECRET) as any
			expect(decoded.email).toBe('user@example.com')
			expect(decoded.permissions).toEqual(['read:posts', 'write:posts'])
		})

		it('should set issuer and audience', () => {
			const token = createJWT(TEST_USER, {
				secret: TEST_SECRET,
				issuer: 'test-app',
				audience: 'api.example.com',
			})

			const decoded = jwt.verify(token, TEST_SECRET, {
				issuer: 'test-app',
				audience: 'api.example.com',
			}) as JWTPayload

			expect(decoded.iss).toBe('test-app')
			expect(decoded.aud).toBe('api.example.com')
		})
	})

	describe('createJWTMiddleware', () => {
		let mockContext: Context
		let mockNext: any

		beforeEach(() => {
			mockContext = {
				req: {
					headers: {
						get: vi.fn(),
					},
				},
				user: undefined,
			}
			mockNext = vi.fn().mockResolvedValue('next-result')
		})

		it('should extract and verify valid JWT token', async () => {
			const token = createJWT(TEST_USER, { secret: TEST_SECRET })
			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await middleware(mockContext, mockNext)

			expect(mockContext.user).toBeDefined()
			expect(mockContext.user?.id).toBe(TEST_USER.id)
			expect(mockContext.user?.roles).toEqual(TEST_USER.roles)
			expect(mockNext).toHaveBeenCalled()
		})

		it('should handle token without Bearer prefix', async () => {
			const token = createJWT(TEST_USER, { secret: TEST_SECRET })
			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(token)

			await middleware(mockContext, mockNext)

			expect(mockContext.user?.id).toBe(TEST_USER.id)
			expect(mockNext).toHaveBeenCalled()
		})

		it('should throw error for invalid token', async () => {
			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue('Bearer invalid-token')

			await expect(middleware(mockContext, mockNext)).rejects.toThrow('Invalid token')
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should throw error for expired token', async () => {
			const token = jwt.sign(
				{ sub: TEST_USER.id, roles: TEST_USER.roles },
				TEST_SECRET,
				{ expiresIn: '-1h' } // Already expired
			)

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await expect(middleware(mockContext, mockNext)).rejects.toThrow('Token has expired')
			expect(mockNext).not.toHaveBeenCalled()
		})

		it('should handle optional mode when no token is present', async () => {
			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
				optional: true,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(null)

			await middleware(mockContext, mockNext)

			expect(mockContext.user).toBeUndefined()
			expect(mockNext).toHaveBeenCalled()
		})

		it('should handle optional mode with invalid token', async () => {
			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
				optional: true,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue('Bearer invalid-token')

			// Should not throw in optional mode
			await middleware(mockContext, mockNext)

			expect(mockContext.user).toBeUndefined()
			expect(mockNext).toHaveBeenCalled()
		})

		it('should skip when disabled', async () => {
			const middleware = createJWTMiddleware({
				enabled: false,
				secret: TEST_SECRET,
			})

			await middleware(mockContext, mockNext)

			expect(mockContext.user).toBeUndefined()
			expect(mockNext).toHaveBeenCalled()
			expect(mockContext.req.headers.get).not.toHaveBeenCalled()
		})

		it('should use custom user extractor', async () => {
			const customUser = {
				id: 'custom-id',
				roles: ['custom-role'],
				customField: 'custom-value',
			}

			const token = jwt.sign({ user_id: 'custom-id', user_roles: ['custom-role'], extra: 'custom-value' }, TEST_SECRET)

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
				extractUser: payload => ({
					id: payload.user_id,
					roles: payload.user_roles,
					customField: payload.extra,
				}),
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await middleware(mockContext, mockNext)

			expect(mockContext.user).toEqual(customUser)
		})

		it('should verify with specific algorithms', async () => {
			const token = jwt.sign({ sub: TEST_USER.id, roles: TEST_USER.roles }, TEST_SECRET, { algorithm: 'HS256' })

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
				algorithms: ['HS256'],
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await middleware(mockContext, mockNext)

			expect(mockContext.user?.id).toBe(TEST_USER.id)
		})

		it('should verify issuer and audience', async () => {
			const token = jwt.sign({ sub: TEST_USER.id, roles: TEST_USER.roles }, TEST_SECRET, {
				issuer: 'test-app',
				audience: 'api.example.com',
			})

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
				issuer: 'test-app',
				audience: 'api.example.com',
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await middleware(mockContext, mockNext)

			expect(mockContext.user?.id).toBe(TEST_USER.id)
		})

		it('should store JWT payload in context', async () => {
			const token = createJWT(TEST_USER, {
				secret: TEST_SECRET,
				additionalClaims: { extra: 'data' },
			})

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			mockContext.req.headers.get = vi.fn().mockReturnValue(`Bearer ${token}`)

			await middleware(mockContext, mockNext)

			expect(mockContext.jwtPayload).toBeDefined()
			expect((mockContext.jwtPayload as any).extra).toBe('data')
		})
	})

	describe('createHTTPJWTMiddleware', () => {
		it('should work with Express-style middleware', async () => {
			const token = createJWT(TEST_USER, { secret: TEST_SECRET })
			const middleware = createHTTPJWTMiddleware({
				secret: TEST_SECRET,
			})

			const req: any = {
				headers: {
					authorization: `Bearer ${token}`,
				},
				user: undefined,
			}
			const res = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			}
			const next = vi.fn()

			await middleware(req, res, next)

			expect(req.user).toBeDefined()
			expect(req.user?.id).toBe(TEST_USER.id)
			expect(next).toHaveBeenCalled()
			expect(res.status).not.toHaveBeenCalled()
		})

		it('should return 401 for invalid token', async () => {
			const middleware = createHTTPJWTMiddleware({
				secret: TEST_SECRET,
			})

			const req = {
				headers: {
					authorization: 'Bearer invalid-token',
				},
			}
			const res = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			}
			const next = vi.fn()

			await middleware(req, res, next)

			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.json).toHaveBeenCalledWith({
				error: 'Invalid token',
				code: 'UNAUTHORIZED',
			})
			expect(next).not.toHaveBeenCalled()
		})

		it('should continue in optional mode without token', async () => {
			const middleware = createHTTPJWTMiddleware({
				secret: TEST_SECRET,
				optional: true,
			})

			const req = {
				headers: {},
				user: undefined,
			}
			const res = {
				status: vi.fn().mockReturnThis(),
				json: vi.fn(),
			}
			const next = vi.fn()

			await middleware(req, res, next)

			expect(req.user).toBeUndefined()
			expect(next).toHaveBeenCalled()
			expect(res.status).not.toHaveBeenCalled()
		})
	})

	describe('refreshTokenUtils', () => {
		it('should create access and refresh token pair', () => {
			const { accessToken, refreshToken } = refreshTokenUtils.createTokenPair(TEST_USER, {
				accessSecret: TEST_SECRET,
				refreshSecret: TEST_SECRET + '-refresh',
			})

			expect(accessToken).toBeDefined()
			expect(refreshToken).toBeDefined()

			// Verify access token
			const accessPayload = jwt.verify(accessToken, TEST_SECRET) as any
			expect(accessPayload.sub).toBe(TEST_USER.id)
			expect(accessPayload.type).toBe('access')

			// Verify refresh token
			const refreshPayload = jwt.verify(refreshToken, TEST_SECRET + '-refresh') as any
			expect(refreshPayload.sub).toBe(TEST_USER.id)
			expect(refreshPayload.type).toBe('refresh')
		})

		it('should refresh access token with valid refresh token', async () => {
			const refreshToken = jwt.sign({ sub: TEST_USER.id, type: 'refresh' }, TEST_SECRET + '-refresh', {
				expiresIn: '7d',
			})

			const mockGetUserById = vi.fn().mockResolvedValue(TEST_USER)

			const result = await refreshTokenUtils.refreshAccessToken(refreshToken, {
				accessSecret: TEST_SECRET,
				refreshSecret: TEST_SECRET + '-refresh',
				getUserById: mockGetUserById,
			})

			expect(result.accessToken).toBeDefined()
			expect(result.user).toEqual(TEST_USER)
			expect(mockGetUserById).toHaveBeenCalledWith(TEST_USER.id)

			// Verify new access token
			const decoded = jwt.verify(result.accessToken, TEST_SECRET) as any
			expect(decoded.sub).toBe(TEST_USER.id)
			expect(decoded.type).toBe('access')
		})

		it('should reject invalid refresh token type', async () => {
			// Use access token as refresh token (wrong type)
			const wrongToken = jwt.sign({ sub: TEST_USER.id, type: 'access' }, TEST_SECRET + '-refresh')

			const mockGetUserById = vi.fn()

			await expect(
				refreshTokenUtils.refreshAccessToken(wrongToken, {
					accessSecret: TEST_SECRET,
					refreshSecret: TEST_SECRET + '-refresh',
					getUserById: mockGetUserById,
				})
			).rejects.toThrow('Invalid token type')

			expect(mockGetUserById).not.toHaveBeenCalled()
		})

		it('should reject expired refresh token', async () => {
			const expiredToken = jwt.sign({ sub: TEST_USER.id, type: 'refresh' }, TEST_SECRET + '-refresh', {
				expiresIn: '-1h',
			})

			const mockGetUserById = vi.fn()

			await expect(
				refreshTokenUtils.refreshAccessToken(expiredToken, {
					accessSecret: TEST_SECRET,
					refreshSecret: TEST_SECRET + '-refresh',
					getUserById: mockGetUserById,
				})
			).rejects.toThrow('Refresh token expired')
		})

		it('should reject if user not found', async () => {
			const refreshToken = jwt.sign({ sub: 'non-existent', type: 'refresh' }, TEST_SECRET + '-refresh')

			const mockGetUserById = vi.fn().mockResolvedValue(null)

			await expect(
				refreshTokenUtils.refreshAccessToken(refreshToken, {
					accessSecret: TEST_SECRET,
					refreshSecret: TEST_SECRET + '-refresh',
					getUserById: mockGetUserById,
				})
			).rejects.toThrow('User not found')
		})
	})

	describe('JWT with permissions', () => {
		it('should handle JWT with embedded permissions', async () => {
			const tokenWithPermissions = jwt.sign(
				{
					sub: TEST_USER.id,
					roles: TEST_USER.roles,
					permissions: [
						{ action: 'create', subject: 'Post' },
						{ action: 'update', subject: 'Post', conditions: { authorId: TEST_USER.id } },
					],
				},
				TEST_SECRET
			)

			const middleware = createJWTMiddleware({
				secret: TEST_SECRET,
			})

			const mockContext: Context = {
				req: {
					headers: {
						get: vi.fn().mockReturnValue(`Bearer ${tokenWithPermissions}`),
					},
				},
				user: undefined,
			}

			await middleware(mockContext, vi.fn())

			expect(mockContext.user).toBeDefined()
			expect((mockContext.user as any).permissions).toHaveLength(2)
			expect((mockContext.user as any).permissions[0]).toEqual({
				action: 'create',
				subject: 'Post',
			})
		})
	})
})

describe('JWT Configuration Validation', () => {
	it('should throw error if neither secret nor publicKey is provided', () => {
		expect(() => {
			createJWTMiddleware({
				enabled: true,
				// No secret or publicKey
			})
		}).toThrow('JWT middleware requires either secret or publicKey')
	})

	it('should not throw when disabled without secret', () => {
		expect(() => {
			createJWTMiddleware({
				enabled: false,
				// No secret, but disabled
			})
		}).not.toThrow()
	})
})
