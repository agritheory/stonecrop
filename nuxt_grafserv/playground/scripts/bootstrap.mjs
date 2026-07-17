#!/usr/bin/env node
/**
 * Bootstrap the nuxt-grafserv playground development environment.
 *
 * What this does:
 *   1. Verifies Docker is available
 *   2. Starts the PostgreSQL container via docker compose
 *   3. Copies .env.example → .env if .env doesn't exist yet
 *   4. Waits until the container is healthy (pg_isready)
 *   5. Runs migrations/001_initial.sql inside the container
 *
 * Usage:
 *   node scripts/bootstrap.mjs
 *   pnpm run bootstrap
 */

import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// ── Helpers ──────────────────────────────────────────────────────────────────

function run(cmd, args, opts = {}) {
	execFileSync(cmd, args, { stdio: 'inherit', cwd: root, ...opts })
}

function capture(cmd, args) {
	const result = spawnSync(cmd, args, { encoding: 'utf-8', cwd: root })
	return { stdout: result.stdout?.trim() ?? '', code: result.status ?? 1 }
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// ── 1. Check Docker ───────────────────────────────────────────────────────────

const { code: dockerCode } = capture('docker', ['version'])
if (dockerCode !== 0) {
	console.error('Error: Docker is not available. Install Docker Desktop or Docker Engine and try again.')
	process.exit(1)
}

// ── 2. Start the container ────────────────────────────────────────────────────

console.log('Starting PostgreSQL container...')
run('docker', ['compose', 'up', '-d', '--wait'])

// ── 3. Ensure .env exists ────────────────────────────────────────────────────

const envFile = resolve(root, '.env')
const envExample = resolve(root, '.env.example')

if (!existsSync(envFile)) {
	copyFileSync(envExample, envFile)
	console.log('Created .env from .env.example')
}

// ── 4. Wait for healthy ───────────────────────────────────────────────────────
// docker compose up --wait already waits for the healthcheck, but we also
// verify we can actually run a psql command inside the container.

console.log('Waiting for PostgreSQL to accept connections...')
const maxAttempts = 20
let ready = false
for (let i = 0; i < maxAttempts; i++) {
	const { code } = capture('docker', [
		'compose',
		'exec',
		'-T',
		'postgres',
		'pg_isready',
		'-U',
		'stonecrop',
		'-d',
		'stonecrop_playground',
	])
	if (code === 0) {
		ready = true
		break
	}
	await sleep(500)
}

if (!ready) {
	console.error('Error: PostgreSQL did not become ready in time. Check `docker compose logs postgres`.')
	process.exit(1)
}

// ── 5. Run migration ──────────────────────────────────────────────────────────

const migrationFile = resolve(root, 'migrations', '001_initial.sql')
if (!existsSync(migrationFile)) {
	console.error(`Error: Migration file not found: ${migrationFile}`)
	process.exit(1)
}

console.log('Running migrations/001_initial.sql...')
const sql = readFileSync(migrationFile, 'utf-8')
execFileSync('docker', ['compose', 'exec', '-T', 'postgres', 'psql', '-U', 'stonecrop', '-d', 'stonecrop_playground'], {
	input: sql,
	stdio: ['pipe', 'inherit', 'inherit'],
	cwd: root,
})

console.log()
console.log('✔ Database ready — Postgres on localhost:5435, migrations applied.')
