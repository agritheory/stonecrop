import {
	shallowRef as Xt,
	unref as he,
	computed as V,
	reactive as Et,
	nextTick as Qt,
	defineComponent as bt,
	inject as ie,
	h as Ot,
	provide as be,
	ref as Jt,
	watch as Tt,
	getCurrentInstance as _t,
	watchEffect as Zt,
} from 'vue'
const Oe = (() => {
		let t
		try {
			t = process.env.NODE_ENV
		} catch {
			t = 'development'
		}
		return t
	})(),
	M = Symbol('IS_PROXY'),
	W = Symbol('PATH'),
	q = Symbol('VALUE'),
	en = Symbol('PROXY_TREE'),
	tn = t => String(t) === '[object Object]' && t.constructor.name === 'Object',
	Ke = /* @__PURE__ */ new Set(['push', 'shift', 'pop', 'unshift', 'splice', 'reverse', 'sort', 'copyWithin']),
	We = t => (t && t[M] ? t[q] : t),
	de = t =>
		typeof t == 'object' &&
		t !== null &&
		!Array.isArray(t) &&
		t.constructor.name !== 'Object' &&
		Object.isExtensible(t),
	qe = t => t !== void 0 && (!de(t) || (de(t) && !(t instanceof Date) && !(t instanceof Map) && !(t instanceof Set)))
class Ne {
	constructor(e) {
		;(this.tree = e),
			(this.CACHED_PROXY = Symbol('CACHED_PROXY')),
			(this.delimiter = e.master.options.delimiter),
			(this.ssr = Boolean(e.master.options.ssr))
	}
	concat(e, n) {
		return e ? e + this.delimiter + n : n
	}
	ensureMutationTrackingIsEnabled(e) {
		if (Oe !== 'production' && this.tree.master.options.devmode && !this.tree.canMutate())
			throw new Error(`proxy-state-tree - You are mutating the path "${e}", but it is not allowed. The following could have happened:
        
        - The mutation is explicitly being blocket
        - You are passing state to a 3rd party tool trying to manipulate the state
        - You are running asynchronous code and forgot to "await" its execution
        `)
	}
	isDefaultProxifier() {
		return this.tree.proxifier === this.tree.master.proxifier
	}
	ensureValueDosntExistInStateTreeElsewhere(e) {
		if (Oe !== 'production') {
			if (e && e[M] === !0)
				throw new Error(
					`proxy-state-tree - You are trying to insert a value that already exists in the state tree on path "${e[W]}"`
				)
			return e
		}
	}
	trackPath(e) {
		if (!!this.tree.canTrack())
			if (this.isDefaultProxifier()) {
				const n = this.tree.master.currentTree
				if (!n) return
				n.addTrackingPath(e)
			} else this.tree.addTrackingPath(e)
	}
	getTrackingTree() {
		return this.tree.master.currentTree && this.isDefaultProxifier()
			? this.tree.master.currentTree
			: this.tree.canTrack() && this.tree.canTrack()
			? this.tree
			: null
	}
	getMutationTree() {
		return this.tree.master.mutationTree || this.tree
	}
	isProxyCached(e, n) {
		return e[this.CACHED_PROXY] && String(e[this.CACHED_PROXY][W]) === String(n)
	}
	createArrayProxy(e, n) {
		if (!this.ssr && this.isProxyCached(e, n)) return e[this.CACHED_PROXY]
		const s = this,
			r = new Proxy(e, {
				get(i, o) {
					if (o === M) return !0
					if (o === W) return n
					if (o === q) return e
					if (o === 'indexOf') return (h, f) => e.indexOf(We(h), We(f))
					if (o === 'length' || (typeof i[o] == 'function' && !Ke.has(String(o))) || typeof o == 'symbol') return i[o]
					const l = s.getTrackingTree(),
						c = s.concat(n, o),
						u = l || s.tree
					l && l.proxifier.trackPath(c), u.trackPathListeners.forEach(h => h(c))
					const a = String(o)
					return Ke.has(a)
						? (...h) => {
								const f = s.getMutationTree()
								let p
								return (
									Oe === 'production'
										? (p = i[o](...h))
										: (p = i[o](...h.map(y => /* @__PURE__ */ s.ensureValueDosntExistInStateTreeElsewhere(y)))),
									f.addMutation({
										method: a,
										path: n,
										delimiter: s.delimiter,
										args: h,
										hasChangedValue: !0,
									}),
									p
								)
						  }
						: qe(i[o])
						? s.proxify(i[o], c)
						: i[o]
				},
				set(i, o, l) {
					const c = s.concat(n, o),
						u = s.getMutationTree(),
						a = Reflect.set(i, o, l)
					return (
						u.addMutation({
							method: 'set',
							path: c,
							args: [l],
							delimiter: s.delimiter,
							hasChangedValue: !0,
						}),
						a
					)
				},
			})
		return (
			this.ssr ||
				Object.defineProperty(e, this.CACHED_PROXY, {
					value: r,
					configurable: !0,
				}),
			r
		)
	}
	createObjectProxy(e, n) {
		if (!this.ssr && this.isProxyCached(e, n)) return e[this.CACHED_PROXY]
		const s = this,
			r = new Proxy(e, {
				get(i, o) {
					if (o === M) return !0
					if (o === W) return n
					if (o === q) return e
					if (o === en) return s.tree
					if (typeof o == 'symbol' || o in Object.prototype) return i[o]
					const l =
						Object.getOwnPropertyDescriptor(i, o) ||
						(Object.getPrototypeOf(i) && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), o))
					if (l && 'get' in l) {
						const f = l.get.call(r)
						return (
							s.tree.master.options.devmode &&
								s.tree.master.options.onGetter &&
								s.tree.master.options.onGetter(s.concat(n, o), f),
							f
						)
					}
					const c = s.getTrackingTree(),
						u = i[o],
						a = s.concat(n, o),
						h = c || s.tree
					return typeof u == 'function'
						? s.tree.master.options.onGetFunction
							? s.tree.master.options.onGetFunction(c || s.tree, a, i, o)
							: de(i)
							? u
							: u.call(i, s.tree, a)
						: (h.trackPathListeners.forEach(f => f(a)), c && c.proxifier.trackPath(a), qe(u) ? s.proxify(u, a) : u)
				},
				set(i, o, l) {
					const c = s.concat(n, o)
					let u
					o in i || (u = n)
					const a = s.getMutationTree(),
						h = i[o]
					typeof l == 'function' &&
						s.tree.master.options.onSetFunction &&
						(l = s.tree.master.options.onSetFunction(s.getTrackingTree() || s.tree, c, i, o, l))
					const f = h !== l,
						p = Reflect.set(i, o, l)
					return (
						a.addMutation(
							{
								method: 'set',
								path: c,
								args: [l],
								delimiter: s.delimiter,
								hasChangedValue: f,
							},
							u
						),
						p
					)
				},
				deleteProperty(i, o) {
					const l = s.concat(n, o)
					let c
					o in i && (c = n)
					const u = s.getMutationTree()
					return (
						delete i[o],
						u.addMutation(
							{
								method: 'unset',
								path: l,
								args: [],
								delimiter: s.delimiter,
								hasChangedValue: !0,
							},
							c
						),
						!0
					)
				},
			})
		return (
			this.ssr ||
				Object.defineProperty(e, this.CACHED_PROXY, {
					value: r,
					configurable: !0,
				}),
			r
		)
	}
	proxify(e, n) {
		if (e) {
			if (e[M] && (String(e[W]) !== String(n) || e[q][this.CACHED_PROXY] !== e)) return this.proxify(e[q], n)
			if (e[M]) return e
			if (Array.isArray(e)) return this.createArrayProxy(e, n)
			if (tn(e) || de(e)) return this.createObjectProxy(e, n)
		}
		return e
	}
}
class Te {
	constructor(e, n) {
		;(this.mutationCallbacks = []),
			(this.mutations = []),
			(this.objectChanges = /* @__PURE__ */ new Set()),
			(this.isTracking = !1),
			(this.isBlocking = !1),
			(this.trackPathListeners = []),
			(this.isTracking = !0),
			(this.master = e),
			(this.proxifier = n || new Ne(this)),
			(this.state = this.proxifier.proxify(e.sourceState, ''))
	}
	trackPaths() {
		const e = /* @__PURE__ */ new Set(),
			n = s => {
				e.add(s)
			}
		return (
			this.trackPathListeners.push(n), () => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e)
		)
	}
	getMutations() {
		const e = this.mutations.slice()
		return (this.mutations.length = 0), e
	}
	getObjectChanges() {
		const e = /* @__PURE__ */ new Set([...this.objectChanges])
		return this.objectChanges.clear(), e
	}
	addMutation(e, n) {
		const s = this.master.currentFlushId
		this.mutations.push(e), n && this.objectChanges.add(n)
		for (const r of this.master.mutationCallbacks) r(e, new Set(n ? [e.path, n] : [e.path]), s)
		for (const r of this.mutationCallbacks) r(e, new Set(n ? [e.path, n] : [e.path]), s)
	}
	flush(e = !1) {
		return this.master.flush(this, e)
	}
	onMutation(e) {
		this.mutationCallbacks.push(e)
	}
	canMutate() {
		return this.isTracking && !this.isBlocking
	}
	canTrack() {
		return !1
	}
	blockMutations() {
		this.isBlocking = !0
	}
	enableMutations() {
		this.isBlocking = !1
	}
	dispose() {
		return (this.isTracking = !1), (this.mutationCallbacks.length = 0), (this.proxifier = this.master.proxifier), this
	}
}
class fe {
	constructor(e) {
		;(this.pathDependencies = /* @__PURE__ */ new Set()),
			(this.shouldTrack = !1),
			(this.trackPathListeners = []),
			(this.master = e),
			(this.proxifier = e.proxifier),
			(this.state = e.state)
	}
	trackPaths() {
		const e = /* @__PURE__ */ new Set(),
			n = s => {
				e.add(s)
			}
		return (
			this.trackPathListeners.push(n), () => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e)
		)
	}
	canMutate() {
		return !1
	}
	canTrack() {
		return !0
	}
	addTrackingPath(e) {
		!this.shouldTrack ||
			(this.pathDependencies.add(e), this.callback && this.master.addPathDependency(e, this.callback))
	}
	track(e) {
		return (
			this.master.changeTrackStateTree(this),
			(this.shouldTrack = !0),
			this.clearTracking(),
			e &&
				(this.callback = (...n) => {
					!this.callback || e(...n)
				}),
			this
		)
	}
	clearTracking() {
		if (this.callback) for (const e of this.pathDependencies) this.master.removePathDependency(e, this.callback)
		this.pathDependencies.clear()
	}
	stopTracking() {
		this.shouldTrack = !1
	}
	trackScope(e, n) {
		const s = this.master.previousTree,
			r = this.master.currentTree
		;(this.master.currentTree = this), this.track(n)
		const i = e(this)
		return (this.master.currentTree = r), (this.master.previousTree = s), this.stopTracking(), i
	}
	dispose() {
		return this.callback
			? (this.clearTracking(),
			  (this.callback = null),
			  (this.proxifier = this.master.proxifier),
			  this.master.currentTree === this && (this.master.currentTree = null),
			  this)
			: (this.pathDependencies.clear(), this)
	}
}
class nn {
	constructor(e, n = {}) {
		;(this.cache = {
			mutationTree: [],
			trackStateTree: [],
		}),
			(this.flushCallbacks = []),
			(this.mutationCallbacks = []),
			(this.currentFlushId = 0),
			(this.pathDependencies = {}),
			typeof n.devmode > 'u' && (n.devmode = !0),
			n.delimiter || (n.delimiter = '.'),
			(this.master = this),
			(this.sourceState = e),
			(this.options = n),
			this.createTrackStateProxifier()
	}
	createTrackStateProxifier() {
		const e = new fe(this)
		;(this.proxifier = e.proxifier = new Ne(e)), (this.state = e.state = this.proxifier.proxify(this.sourceState, ''))
	}
	getMutationTree() {
		return this.options.devmode
			? this.cache.mutationTree.pop() || new Te(this)
			: (this.mutationTree = this.mutationTree || new Te(this, this.proxifier))
	}
	getTrackStateTree() {
		return this.cache.trackStateTree.pop() || new fe(this)
	}
	getTrackStateTreeWithProxifier() {
		const e = this.getTrackStateTree()
		return (
			this.options.ssr
				? (e.state = this.sourceState)
				: ((e.proxifier = new Ne(e)), (e.state = e.proxifier.proxify(this.sourceState, ''))),
			e
		)
	}
	changeTrackStateTree(e) {
		;(this.previousTree = this.currentTree), (this.currentTree = e)
	}
	disposeTree(e) {
		e instanceof Te
			? this.cache.mutationTree.push(e.dispose())
			: e instanceof fe && this.cache.trackStateTree.push(e.dispose())
	}
	onMutation(e) {
		return (
			this.mutationCallbacks.push(e),
			() => {
				this.mutationCallbacks.splice(this.mutationCallbacks.indexOf(e), 1)
			}
		)
	}
	forceFlush() {
		const e = [],
			n = []
		for (const s in this.pathDependencies)
			this.pathDependencies[s].forEach(i => {
				i(e, n, this.currentFlushId++, !1)
			})
	}
	flush(e, n = !1) {
		let s
		if (
			(Array.isArray(e)
				? (s = e.reduce(
						(u, a) => ({
							mutations: u.mutations.concat(a.getMutations()),
							objectChanges: /* @__PURE__ */ new Set([...u.objectChanges, ...a.getObjectChanges()]),
						}),
						{
							mutations: [],
							objectChanges: /* @__PURE__ */ new Set(),
						}
				  ))
				: (s = {
						mutations: e.getMutations(),
						objectChanges: e.getObjectChanges(),
				  }),
			!s.mutations.length && !s.objectChanges.size)
		)
			return {
				mutations: [],
				flushId: null,
			}
		const r = /* @__PURE__ */ new Set(),
			i = /* @__PURE__ */ new Set(),
			o = this.currentFlushId++
		for (const u of s.objectChanges) this.pathDependencies[u] && r.add(u)
		for (const u of s.mutations) u.hasChangedValue && r.add(u.path)
		const l = Array.from(r).sort()
		for (const u of l) if (this.pathDependencies[u]) for (const a of this.pathDependencies[u]) i.add(a)
		for (const u of i) u(s.mutations, l, o, n)
		const c = this.flushCallbacks.slice()
		for (const u of c) this.flushCallbacks.includes(u) && u(s.mutations, l, o, n)
		return (
			r.clear(),
			i.clear(),
			{
				mutations: s.mutations,
				flushId: o,
			}
		)
	}
	onFlush(e) {
		return this.flushCallbacks.push(e), () => this.flushCallbacks.splice(this.flushCallbacks.indexOf(e), 1)
	}
	rescope(e, n) {
		return e && e[M] ? n.proxifier.proxify(e[q], e[W]) : e
	}
	addPathDependency(e, n) {
		this.pathDependencies[e] || (this.pathDependencies[e] = /* @__PURE__ */ new Set()), this.pathDependencies[e].add(n)
	}
	removePathDependency(e, n) {
		this.pathDependencies[e].delete(n), this.pathDependencies[e].size || delete this.pathDependencies[e]
	}
	toJSON() {
		return this.sourceState
	}
}
var E
;(function (t) {
	;(t.ACTION_START = 'action:start'),
		(t.ACTION_END = 'action:end'),
		(t.OPERATOR_START = 'operator:start'),
		(t.OPERATOR_END = 'operator:end'),
		(t.OPERATOR_ASYNC = 'operator:async'),
		(t.MUTATIONS = 'mutations'),
		(t.EFFECT = 'effect'),
		(t.DERIVED = 'derived'),
		(t.DERIVED_DIRTY = 'derived:dirty'),
		(t.COMPONENT_ADD = 'component:add'),
		(t.COMPONENT_UPDATE = 'component:update'),
		(t.COMPONENT_REMOVE = 'component:remove'),
		(t.GETTER = 'getter')
})(E || (E = {}))
const St = Symbol('IS_DERIVED'),
	Ae = Symbol('IS_DERIVED_CONSTRUCTOR')
class Xe {
	constructor(e) {
		;(this.cb = e), (this.isDirty = !0), (this.updateCount = 0)
		const n = this.evaluate.bind(this)
		return (
			process.env.NODE_ENV === 'development' &&
				(n.dispose = () => {
					this.disposeOnMutation()
				}),
			(n[St] = !0),
			n
		)
	}
	runScope(e, n) {
		const s = n.slice(0, n.length - 1).reduce((r, i) => r[i], e.state)
		return this.cb(s, e.state)
	}
	evaluate(e, n, s, r) {
		if (
			(this.disposeOnMutation ||
				(this.disposeOnMutation = s.onMutation((i, o, l) => {
					if (typeof r.reduce((c, u) => c && c[u], s.sourceState) != 'function') {
						this.disposeOnMutation()
						return
					}
					if (!this.isDirty) {
						for (const c of o)
							if (this.paths.has(c)) {
								;(this.isDirty = !0),
									e.emitAsync(E.DERIVED_DIRTY, {
										derivedPath: r,
										path: c,
										flushId: l,
									})
								return
							}
					}
				})),
			this.isDirty || this.previousProxifier !== n.proxifier)
		) {
			const i = n.trackPaths()
			;(this.value = this.runScope(n, r)),
				(this.isDirty = !1),
				(this.paths = i()),
				process.env.NODE_ENV === 'development' &&
					(e.emitAsync(E.DERIVED, {
						path: r,
						paths: Array.from(this.paths),
						updateCount: this.updateCount,
						value: this.value,
					}),
					this.updateCount++)
		}
		if (n instanceof fe) for (const i of this.paths) n.addTrackingPath(i), n.trackPathListeners.forEach(o => o(i))
		return (this.previousProxifier = n.proxifier), this.value && this.value[M] ? s.rescope(this.value, n) : this.value
	}
}
var sn = (function () {
		function t() {
			this.events = /* @__PURE__ */ new Map()
		}
		return (
			(t.prototype.emit = function (e, n) {
				for (var s = this.events.get(e) || [], r = s.length - 1; r >= 0; r--) {
					var i = s[r]
					i.cb(n), i.once && s.splice(r, 1)
				}
			}),
			(t.prototype.emitAsync = function (e, n) {
				var s = this.events.get(e) || []
				setTimeout(function () {
					for (var r = s.length - 1; r >= 0; r--) {
						var i = s[r]
						i.cb(n), i.once && s.splice(r, 1)
					}
				})
			}),
			(t.prototype.on = function (e, n) {
				this.addListener(e, n, !1)
			}),
			(t.prototype.once = function (e, n) {
				this.addListener(e, n, !0)
			}),
			(t.prototype.addListener = function (e, n, s) {
				var r = this.events.get(e) || []
				r.push({
					once: s,
					cb: n,
				}),
					this.events.set(e, r)
			}),
			t
		)
	})(),
	rn = Object.prototype.toString,
	X = function (t) {
		var e
		return (
			rn.call(t) === '[object Object]' &&
			((e = Object.getPrototypeOf(t)), e === null || e === Object.getPrototypeOf({}))
		)
	}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function on(t, e, n, s) {
	function r(i) {
		return i instanceof n
			? i
			: new n(function (o) {
					o(i)
			  })
	}
	return new (n || (n = Promise))(function (i, o) {
		function l(a) {
			try {
				u(s.next(a))
			} catch (h) {
				o(h)
			}
		}
		function c(a) {
			try {
				u(s.throw(a))
			} catch (h) {
				o(h)
			}
		}
		function u(a) {
			a.done ? i(a.value) : r(a.value).then(l, c)
		}
		u((s = s.apply(t, e || [])).next())
	})
}
function Rt(t, e, n = {}) {
	if (!t || !e) throw new Error('You have to pass a "target" and "source" object to rehydrate')
	Object.keys(e).forEach(s => {
		const r = e[s],
			i = n[s]
		typeof i == 'function' && Array.isArray(t[s])
			? (t[s] = e[s].map(o => i(o)))
			: typeof i == 'function' && typeof t[s] == 'object' && t[s] !== null && t[s].constructor.name === 'Object'
			? (t[s] = Object.keys(e[s]).reduce((o, l) => ((o[l] = i(e[s][l])), o), {}))
			: typeof i == 'function'
			? (t[s] = i(e[s]))
			: typeof r == 'object' && !Array.isArray(r) && r !== null
			? (t[s] || (t[s] = {}), Rt(t[s], e[s], n[s]))
			: (t[s] = e[s])
	})
}
const an = Symbol('SERIALIZE'),
	Qe = (t, e, n = {}) => {
		Array.isArray(e)
			? e.forEach(r => {
					const i = r.path.split(r.delimiter),
						o = i.pop(),
						l = i.reduce((u, a) => u[a], t),
						c = i.reduce((u, a) => u && u[a], n)
					r.method === 'set'
						? typeof c == 'function' && Array.isArray(r.args[0])
							? (l[o] = r.args[0].map(u => c(u)))
							: typeof c == 'function'
							? (l[o] = c(r.args[0]))
							: (l[o] = r.args[0])
						: r.method === 'unset'
						? delete l[o]
						: l[o][r.method].apply(
								l[o],
								typeof c == 'function' ? r.args.map(u => (typeof u == 'object' && u !== null ? c(u) : u)) : r.args
						  )
			  })
			: Rt(t, e, n)
	}
class cn {
	constructor(e) {
		;(this.safeClassNames = /* @__PURE__ */ new Set()),
			(this.unsafeClassNames = /* @__PURE__ */ new Set()),
			(this.circularReferenceCache = []),
			(this.buffer = []),
			(this.serializer = Promise.resolve()),
			(this.isConnected = !1),
			(this.doReconnect = !1),
			(this.hasWarnedReconnect = !1),
			(this.reconnectInterval = 1e4),
			(this.connect = (n, s) => {
				;(n = n || 'localhost:3031'),
					(this.ws = new WebSocket(`ws://${n}?name=${this.name}`)),
					(this.ws.onmessage = r => {
						const i = JSON.parse(r.data)
						i.appName === this.name && s(i)
					}),
					(this.ws.onopen = () => {
						;(this.isConnected = !0), this.flushBuffer()
					}),
					(this.ws.onerror = () => {
						console.error(`OVERMIND DEVTOOLS: Not able to connect. You are trying to connect to "${n}", but there was no devtool there. Try the following:
        
          - Make sure you are running the latest version of the devtools, using "npx overmind-devtools@latest" or install latest extension for VSCode
          - Close the current tab and open a new one
          - Make sure the correct port is configured in the devtools
        `)
					}),
					(this.ws.onclose = () => {
						;(this.isConnected = !1),
							this.doReconnect &&
								!this.hasWarnedReconnect &&
								(console.warn(
									'Debugger application is not running on selected port... will reconnect automatically behind the scenes'
								),
								(this.hasWarnedReconnect = !0)),
							this.doReconnect && this.reconnect(n, s)
					})
			}),
			(this.sendMessage = n => {
				if (!this.isConnected) {
					this.buffer.push(n)
					return
				}
				this.ws.send(`{"appName":"${this.name}","message":${n}}`)
			}),
			(this.flushBuffer = () =>
				on(this, void 0, void 0, function* () {
					this.buffer.forEach(n => {
						this.sendMessage(n)
					}),
						(this.buffer.length = 0)
				})),
			(this.name =
				typeof location < 'u' && location.search.includes('OVERMIND_DEVTOOL') ? e + ' (Overmind Devtool)' : e)
	}
	reconnect(e, n) {
		setTimeout(() => this.connect(e, n), this.reconnectInterval)
	}
	send(e) {
		const n = this.safeClassNames,
			s = this.unsafeClassNames,
			r = this.circularReferenceCache
		this.sendMessage(
			JSON.stringify(e, function (i, o) {
				if (typeof o == 'function') return '[Function]'
				if (this.__CLASS__) return o
				if (o && o[an])
					return {
						__CLASS__: !0,
						name: o.constructor.name,
						value: o,
					}
				if (
					typeof o == 'object' &&
					o !== null &&
					!Array.isArray(o) &&
					o.constructor &&
					o.constructor.name !== 'Object'
				) {
					if (r.includes(o)) return `[CIRCULAR REFERENCE: ${o.constructor.name}]`
					if ((r.push(o), !n.has(o.constructor.name) && !s.has(o.constructor.name)))
						try {
							JSON.stringify(o), n.add(o.constructor.name)
						} catch {
							s.add(o.constructor.name)
						}
					return n.has(o.constructor.name)
						? {
								__CLASS__: !0,
								name: o.constructor.name,
								value: o,
						  }
						: `[${o.constructor.name || 'NOT SERIALIZABLE'}]`
				}
				return o
			})
		),
			(r.length = 0)
	}
}
function un(t) {
	return typeof t == 'object' && !Array.isArray(t) && t !== null
}
let Je = !1,
	ln = 0
const Ze = Symbol('ORIGIN_TARGET')
function Pt(t, e, n = '') {
	return !un(t) && typeof t != 'function'
		? t
		: new Proxy(t, {
				apply(s, r, i) {
					const o = ln++,
						l = n.split('.'),
						c = l.pop()
					return e({
						func: s.bind(r ? r[Ze] : void 0),
						effectId: o,
						name: l.join('.'),
						method: c,
						args: i,
					})
				},
				construct(s, r) {
					return (
						Je ||
							(console.warn(
								`EFFECTS - It is highly recommended to create a custom effect, exposing a method that deals with the instantiation of "${n}". It improves readability and debugability of your app`
							),
							(Je = !0)),
						new s(...r)
					)
				},
				get(s, r) {
					return r === Ze ? s : Pt(s[r], e, n ? n + '.' + r.toString() : r.toString())
				},
		  })
}
const hn =
		() =>
		({ actions: t }, e) => {
			const n = Nt('onInitializeOvermind', t)
			return Promise.all(n.map(s => s(e)))
		},
	j = (() => {
		let t
		try {
			t = process.env.NODE_ENV
		} catch {
			console.warn(
				'Overmind was unable to determine the NODE_ENV, which means it will run in DEVELOPMENT mode. If this is a production app, please configure your build tool to define NODE_ENV'
			),
				(t = 'development')
		}
		return t
	})(),
	fn = j === 'test',
	et = Symbol('operator'),
	dn = Symbol('origina_actions'),
	_e = Symbol('execution'),
	H = Symbol('MODE_DEFAULT'),
	ue = Symbol('MODE_TEST'),
	L = Symbol('MODE_SSR')
class pn {
	emit() {}
	emitAsync() {}
	on() {}
	once() {}
	addListener() {}
}
function tt(t) {
	return t instanceof Promise || (t && typeof t.then == 'function' && typeof t.catch == 'function')
}
function Ce(t) {
	return Object.keys(t).reduce(
		(e, n) => {
			if (n === '__esModule') return e
			const s = Object.getOwnPropertyDescriptor(t, n)
			if (s && 'get' in s) return Object.defineProperty(e, n, s), e
			const r = t[n]
			return X(r) ? (e[n] = Ce(r)) : Object.defineProperty(e, n, s), e
		},
		X(t) ? {} : t
	)
}
const nt = '.'
function wt(t, e, n = [], s = []) {
	const r = Object.keys(t),
		i = Object.keys(e)
	return (
		r.forEach(o => {
			i.includes(o) ||
				s.push({
					delimiter: nt,
					args: [],
					path: n.concat(o).join('.'),
					hasChangedValue: !1,
					method: 'unset',
				})
		}),
		i.forEach(o => {
			X(t[o]) && X(e[o])
				? wt(t[o], e[o], n.concat(o), s)
				: t[o] !== e[o] &&
				  s.push({
						delimiter: nt,
						args: [e[o]],
						path: n.concat(o).join('.'),
						hasChangedValue: !1,
						method: 'set',
				  })
		}),
		s
	)
}
function Nt(t, e = {}, n = []) {
	return Object.keys(e).reduce(
		(s, r) => (typeof e[r] == 'function' && r === t ? s.concat(e[r]) : s.concat(Nt(t, e[r], n.concat(r)))),
		[]
	)
}
function Ie(t = {}, e = []) {
	return Object.keys(t).reduce(
		(n, s) => (typeof t[s] == 'function' ? n.concat(e.concat(s).join('.')) : n.concat(Ie(t[s], e.concat(s)))),
		[]
	)
}
function At(t, e) {
	return new Proxy(t, {
		get(n, s) {
			if (s === dn) return t
			if (typeof n[s] == 'function') return e(n[s])
			if (!!n[s]) return At(n[s], e)
		},
	})
}
const Se = {}
class mn {
	constructor(
		e,
		n = {},
		s = {
			mode: H,
		}
	) {
		;(this.actionReferences = {}),
			(this.nextExecutionId = 0),
			(this.reydrateMutationsForHotReloading = []),
			(this.isStrict = !1),
			(this.reaction = (u, a, h = {}) => {
				let f
				if (h.nested) {
					const p = u(this.state)
					if (!p || !p[M])
						throw new Error(
							'You have to return an object or array from the Overmind state when using a "nested" reaction'
						)
					const y = p[W]
					f = this.addFlushListener(w => {
						w.forEach(N => {
							N.path.startsWith(y) && a(y ? y.split(this.delimiter).reduce((O, T) => O[T], this.state) : this.state)
						})
					})
				} else {
					const p = this.proxyStateTreeInstance.getTrackStateTree()
					let y
					const w = () => {
						p.trackScope(
							() => (y = u(p.state)),
							() => {
								w(), a(y)
							}
						)
					}
					w(),
						(f = () => {
							p.dispose()
						})
				}
				return h.immediate && a(u(this.state)), f
			}),
			(this.addMutationListener = u => this.proxyStateTreeInstance.onMutation(u)),
			(this.addFlushListener = u => this.proxyStateTreeInstance.onFlush(u))
		const r = n.name || 'OvermindApp',
			i = n.devEnv || 'development',
			o = typeof process < 'u' && process.title && process.title.includes('node')
		if (
			((this.delimiter = n.delimiter || '.'),
			(this.isStrict = Boolean(n.strict)),
			j === i && s.mode === H && n.hotReloading !== !1 && !o)
		) {
			if (Se[r]) return Se[r].reconfigure(e)
			Se[r] = this
		}
		const l = s.mode === L ? new pn() : new sn(),
			c = this.createProxyStateTree(e, l, s.mode === ue || j === i, s.mode === L)
		if (
			((this.originalConfiguration = e),
			(this.state = c.state),
			(this.effects = e.effects || {}),
			(this.proxyStateTreeInstance = c),
			(this.eventHub = l),
			(this.mode = s),
			(this.actions = this.getActions(e.actions)),
			s.mode !== L)
		) {
			if (j === i && s.mode === H && typeof window < 'u') {
				let u = 'OVERMIND: You are running in DEVELOPMENT mode.'
				if (n.logProxies !== !0) {
					const a = console.log
					;(console.log = (...h) =>
						a.apply(
							console,
							h.map(f => (f && f[M] ? f[q] : f))
						)),
						(u += `

 - To improve debugging experience "console.log" will NOT log proxies from Overmind, but the actual value. Please see docs to turn off this behaviour`)
				}
				if (n.devtools || (typeof location < 'u' && location.hostname === 'localhost' && n.devtools !== !1)) {
					const a = n.devtools === !0 ? 'localhost:3031' : n.devtools,
						h = n.name ? n.name : typeof document > 'u' ? 'NoName' : document.title || 'NoName'
					this.initializeDevtools(a, h, l, c.sourceState, e.actions)
				} else
					n.devtools !== !1 &&
						(u += `

 - You are not running on localhost. You will have to manually define the devtools option to connect`)
				fn || console.warn(u)
			}
			if (j === 'production' && s.mode === H) {
				l.on(E.OPERATOR_ASYNC, h => {
					;(!h.parentExecution || !h.parentExecution.isRunning) && c.getMutationTree().flush(!0)
				}),
					l.on(E.ACTION_END, h => {
						;(!h.parentExecution || !h.parentExecution.isRunning) && c.getMutationTree().flush()
					})
				let u
				const a = () => {
					c.getMutationTree().flush(!0)
				}
				this.proxyStateTreeInstance.onMutation(() => {
					u && clearTimeout(u), (u = setTimeout(a, 0))
				})
			} else
				(s.mode === H || s.mode === ue) &&
					((j === 'test' || (this.devtools && n.hotReloading !== !1)) &&
						l.on(E.MUTATIONS, u => {
							this.reydrateMutationsForHotReloading = this.reydrateMutationsForHotReloading.concat(u.mutations)
						}),
					l.on(E.OPERATOR_ASYNC, u => {
						if (!u.parentExecution || !u.parentExecution.isRunning) {
							const a = u.flush(!0)
							this.devtools &&
								a.mutations.length &&
								this.devtools.send({
									type: 'flush',
									data: Object.assign(Object.assign({}, u), a),
								})
						}
					}),
					l.on(E.ACTION_END, u => {
						if (!u.parentExecution || !u.parentExecution.isRunning) {
							const a = u.flush()
							this.devtools &&
								a.mutations.length &&
								this.devtools.send({
									type: 'flush',
									data: Object.assign(Object.assign({}, u), a),
								})
						}
					}))
			if (s.mode === H) {
				const u = this.createAction('onInitialize', hn())
				this.initialized = Promise.resolve(u(this))
			} else this.initialized = Promise.resolve(null)
		}
	}
	createProxyStateTree(e, n, s, r) {
		const i = new nn(this.getState(e), {
			devmode: s && !r,
			ssr: r,
			delimiter: this.delimiter,
			onSetFunction: (o, l, c, u, a) => (a[Ae] ? new Xe(a) : a),
			onGetFunction: (o, l, c, u) => {
				const a = c[u]
				if (a[St]) return a(n, o, i, l.split(this.delimiter))
				if (a[Ae]) {
					const h = new Xe(a)
					return (c[u] = h), h(n, o, i, l.split(this.delimiter))
				}
				return a
			},
			onGetter: s
				? (o, l) => {
						this.eventHub.emitAsync(E.GETTER, {
							path: o,
							value: l,
						})
				  }
				: void 0,
		})
		return i
	}
	createExecution(e, n, s) {
		const r = e.split('.')
		if ((r.pop(), j === 'production'))
			return {
				[_e]: !0,
				parentExecution: s,
				namespacePath: r,
				actionName: e,
				getMutationTree: () => this.proxyStateTreeInstance.getMutationTree(),
				getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
				emit: this.eventHub.emit.bind(this.eventHub),
			}
		const i = []
		return {
			[_e]: !0,
			namespacePath: r,
			actionId: e,
			executionId: this.nextExecutionId++,
			actionName: e,
			operatorId: 0,
			isRunning: !0,
			parentExecution: s,
			path: [],
			emit: this.eventHub.emit.bind(this.eventHub),
			send: this.devtools ? this.devtools.send.bind(this.devtools) : () => {},
			trackEffects: this.trackEffects.bind(this, this.effects),
			getNextOperatorId: (() => {
				let l = 0
				return () => ++l
			})(),
			flush: s ? s.flush : l => this.proxyStateTreeInstance.flush(i, l),
			getMutationTree: s
				? s.getMutationTree
				: () => {
						const l = this.proxyStateTreeInstance.getMutationTree()
						return i.push(l), l
				  },
			getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
			onFlush: l => this.proxyStateTreeInstance.onFlush(l),
			scopeValue: (l, c) => this.scopeValue(l, c),
		}
	}
	createContext(e, n) {
		return {
			state: n.state,
			actions: At(this.actions, s => r => s(r, e.isRunning ? e : null)),
			execution: e,
			proxyStateTree: this.proxyStateTreeInstance,
			effects: this.trackEffects(this.effects, e),
			addNamespace: this.addNamespace.bind(this),
			reaction: this.reaction.bind(this),
			addMutationListener: this.addMutationListener.bind(this),
			addFlushListener: this.addFlushListener.bind(this),
		}
	}
	addNamespace(e, n, s) {
		const r = s || this.state,
			i = n.pop()
		if (e.state) {
			const o = n.reduce((l, c) => l[c], r)
			o[i] = Ce(e.state)
		}
		if (e.actions) {
			const o = n.reduce((l, c) => l[c], this.actions)
			o[i] = this.getActions(e.actions)
		}
		if (e.effects) {
			const o = n.reduce((l, c) => l[c], this.effects)
			o[i] = e.effects
		}
	}
	scopeValue(e, n) {
		return (
			e &&
			(e[M]
				? this.proxyStateTreeInstance.rescope(e, n)
				: X(e)
				? Object.assign(
						{},
						...Object.keys(e).map(s => ({
							[s]: this.proxyStateTreeInstance.rescope(e[s], n),
						}))
				  )
				: e)
		)
	}
	addExecutionMutation(e) {
		this.mutations.push(e)
	}
	createAction(e, n) {
		return (
			(this.actionReferences[e] = n),
			(r, i) => {
				const o = this.actionReferences[e]
				if (((i = i && i[_e] ? i : void 0), j === 'production' || o[et] || this.mode.mode === L)) {
					const l = this.createExecution(e, o, i)
					if ((this.eventHub.emit(E.ACTION_START, Object.assign(Object.assign({}, l), { value: r })), o[et]))
						return new Promise((c, u) => {
							o(
								null,
								Object.assign(Object.assign({}, this.createContext(l, this.proxyStateTreeInstance)), { value: r }),
								(a, h) => {
									;(l.isRunning = !1),
										h &&
											this.eventHub.emit(
												E.ACTION_END,
												Object.assign(Object.assign({}, h.execution), { operatorId: h.execution.operatorId - 1 })
											),
										a ? u(a) : c(h.value)
								}
							)
						})
					{
						const c = l.getMutationTree()
						this.isStrict && c.blockMutations()
						const u = o(this.createContext(l, c), r)
						return this.eventHub.emit(E.ACTION_END, l), u
					}
				} else {
					const l = Object.assign(Object.assign({}, this.createExecution(e, o, i)), { operatorId: 0, type: 'action' })
					this.eventHub.emit(E.ACTION_START, Object.assign(Object.assign({}, l), { value: r })),
						this.eventHub.emit(E.OPERATOR_START, l)
					const c = l.getMutationTree()
					this.isStrict && c.blockMutations(),
						c.onMutation(h => {
							this.eventHub.emit(E.MUTATIONS, Object.assign(Object.assign({}, l), { mutations: [h] }))
						})
					const u = this.scopeValue(r, c),
						a = this.createContext(l, c)
					try {
						let h
						c.onMutation(p => {
							h && clearTimeout(h),
								this.mode.mode === ue
									? this.addExecutionMutation(p)
									: this.mode.mode === H &&
									  (h = setTimeout(() => {
											h = null
											const y = l.flush(!0)
											this.devtools &&
												y.mutations.length &&
												this.devtools.send({
													type: 'flush',
													data: Object.assign(Object.assign(Object.assign({}, l), y), { mutations: y.mutations }),
												})
									  }))
						})
						let f = o(a, u)
						return (
							tt(f)
								? (this.eventHub.emit(E.OPERATOR_ASYNC, l),
								  (f = f
										.then(
											p => (
												(l.isRunning = !1),
												i || c.dispose(),
												this.eventHub.emit(
													E.OPERATOR_END,
													Object.assign(Object.assign({}, l), { isAsync: !0, result: void 0 })
												),
												this.eventHub.emit(E.ACTION_END, l),
												p
											)
										)
										.catch(p => {
											throw (
												((l.isRunning = !1),
												i || c.dispose(),
												this.eventHub.emit(
													E.OPERATOR_END,
													Object.assign(Object.assign({}, l), { isAsync: !0, result: void 0, error: p.message })
												),
												this.eventHub.emit(E.ACTION_END, l),
												p)
											)
										})))
								: ((l.isRunning = !1),
								  i || c.dispose(),
								  this.eventHub.emit(
										E.OPERATOR_END,
										Object.assign(Object.assign({}, l), { isAsync: !1, result: void 0 })
								  ),
								  this.eventHub.emit(E.ACTION_END, l)),
							f
						)
					} catch (h) {
						throw (
							(this.eventHub.emit(
								E.OPERATOR_END,
								Object.assign(Object.assign({}, l), { isAsync: !1, result: void 0, error: h.message })
							),
							this.eventHub.emit(E.ACTION_END, l),
							h)
						)
					}
				}
			}
		)
	}
	trackEffects(e = {}, n) {
		return j === 'production'
			? e
			: Pt(this.effects, s => {
					let r
					try {
						this.mode.mode === ue
							? (r = this.mode.options.effectsCallback(s))
							: (this.eventHub.emit(
									E.EFFECT,
									Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })
							  ),
							  (r = s.func.apply(this, s.args)))
					} catch (i) {
						throw (
							(this.eventHub.emit(
								E.EFFECT,
								Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !1, error: i.message })
							),
							i)
						)
					}
					return tt(r)
						? (this.eventHub.emit(
								E.EFFECT,
								Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })
						  ),
						  r
								.then(
									i => (
										this.eventHub.emit(
											E.EFFECT,
											Object.assign(Object.assign(Object.assign({}, n), s), {
												args: s.args,
												result: i,
												isPending: !1,
												error: !1,
											})
										),
										i
									)
								)
								.catch(i => {
									throw (
										(this.eventHub.emit(
											E.EFFECT,
											Object.assign(Object.assign(Object.assign({}, n), s), {
												args: s.args,
												isPending: !1,
												error: i && i.message,
											})
										),
										i)
									)
								}))
						: (this.eventHub.emit(
								E.EFFECT,
								Object.assign(Object.assign(Object.assign({}, n), s), {
									args: s.args,
									result: r,
									isPending: !1,
									error: !1,
								})
						  ),
						  r)
			  })
	}
	initializeDevtools(e, n, s, r, i) {
		if (j === 'production') return
		const o = new cn(n)
		o.connect(e, l => {
			switch (l.type) {
				case 'refresh': {
					location.reload()
					break
				}
				case 'executeAction': {
					const c = l.data.name.split('.').reduce((u, a) => u[a], this.actions)
					l.data.payload ? c(JSON.parse(l.data.payload)) : c()
					break
				}
				case 'mutation': {
					const c = this.proxyStateTreeInstance.getMutationTree(),
						u = l.data.path.slice(),
						a = JSON.parse(`{ "value": ${l.data.value} }`).value,
						h = u.pop(),
						f = u.reduce((p, y) => p[y], c.state)
					;(f[h] = a),
						c.flush(!0),
						c.dispose(),
						this.devtools.send({
							type: 'state',
							data: {
								path: l.data.path,
								value: a,
							},
						})
					break
				}
			}
		})
		for (const l in E)
			s.on(
				E[l],
				(c => u => {
					o.send({
						type: E[l],
						data: u,
					}),
						c === E.MUTATIONS &&
							u.mutations.forEach(a => {
								const h = a.path.split(this.delimiter).reduce((f, p) => f[p], this.proxyStateTreeInstance.state)
								X(h)
									? Object.keys(h).forEach(f => h[f])
									: Array.isArray(h) &&
									  h.forEach(f => {
											X(f) && Object.keys(f).forEach(p => f[p])
									  })
							}),
						c === E.DERIVED_DIRTY && u.derivedPath.reduce((a, h) => a[h], this.proxyStateTreeInstance.state)
				})(E[l])
			)
		o.send({
			type: 'init',
			data: {
				state: this.proxyStateTreeInstance.state,
				actions: Ie(i),
				delimiter: this.delimiter,
			},
		}),
			(this.devtools = o)
	}
	getState(e) {
		let n = {}
		return e.state && (n = Ce(e.state)), n
	}
	getActions(e = {}, n = []) {
		return Object.keys(e).reduce((s, r) => {
			if (typeof e[r] == 'function') {
				const i = this.createAction(n.concat(r).join('.'), e[r])
				return (
					(i.displayName = n.concat(r).join('.')),
					Object.assign(s, {
						[r]: i,
					})
				)
			}
			return Object.assign(s, {
				[r]: this.getActions(e[r], n.concat(r)),
			})
		}, {})
	}
	updateActions(e = {}, n = []) {
		Object.keys(e).forEach(s => {
			if (typeof e[s] == 'function') {
				const r = n.concat(s).join('.')
				if (this.actionReferences[r]) this.actionReferences[r] = e[s]
				else {
					const i = n.reduce((o, l) => (o[l] || (o[l] = {}), o[l]), this.actions)
					;(i[s] = this.createAction(r, e[s])), (i[s].displayName = n.concat(s).join('.'))
				}
			} else this.updateActions(e[s], n.concat(s))
		}, {})
	}
	getTrackStateTree() {
		return this.proxyStateTreeInstance.getTrackStateTree()
	}
	getMutationTree() {
		return this.proxyStateTreeInstance.getMutationTree()
	}
	reconfigure(e) {
		const n = wt(this.originalConfiguration.state, e.state || {})
		this.updateActions(e.actions), (this.effects = e.effects || {})
		const s = this.proxyStateTreeInstance.getMutationTree()
		return (
			Qe(s.state, n),
			this.reydrateMutationsForHotReloading.forEach(r => {
				try {
					Qe(s.state, [r])
				} catch {}
			}),
			s.flush(),
			s.dispose(),
			this.devtools &&
				this.devtools.send({
					type: 're_init',
					data: {
						state: this.state,
						actions: Ie(e.actions),
					},
				}),
			this
		)
	}
}
const gn = t => ((t[Ae] = !0), t)
function yn(t, e) {
	return new mn(t, e, { mode: H })
}
const A = Symbol('OVERMIND'),
	st = j === 'production'
let vn = 0
function En(t, e, n = !1) {
	const s = vn++
	let r = 0
	return Object.assign(
		Object.assign(
			{
				beforeCreate() {
					t.mode.mode === L
						? ((this.overmind = {
								state: t.state,
								actions: t.actions,
								effects: t.effects,
								addMutationListener: t.addMutationListener,
								reaction: t.reaction,
						  }),
						  e &&
								Object.assign(
									this,
									e({
										state: t.state,
										actions: t.actions,
										effects: t.effects,
									})
								))
						: ((this[A] = {
								tree: t.proxyStateTreeInstance.getTrackStateTree(),
								componentInstanceId: r++,
								onUpdate: (i, o, l) => {
									;(this[A].currentFlushId = l), (this[A].isUpdating = !0), this.$forceUpdate()
								},
								isUpdating: !1,
						  }),
						  (this.overmind = {
								state: this[A].tree.state,
								actions: t.actions,
								effects: t.effects,
								addMutationListener: t.addMutationListener,
								reaction: t.reaction,
						  }),
						  this[A].tree.track(this[A].onUpdate),
						  e &&
								Object.assign(
									this,
									e({
										state: this[A].tree.state,
										actions: t.actions,
										effects: t.effects,
									})
								))
				},
				beforeUpdate() {
					t.mode.mode !== L &&
						(this[A].tree.track(this[A].onUpdate),
						e &&
							n &&
							Object.assign(
								this,
								e({
									state: this[A].tree.state,
									actions: t.actions,
									effects: t.effects,
								})
							))
				},
			},
			st
				? {
						updated() {
							this[A].tree.stopTracking()
						},
				  }
				: {
						mounted() {
							t.mode.mode !== L &&
								t.eventHub.emitAsync(E.COMPONENT_ADD, {
									componentId: s,
									componentInstanceId: this[A].componentInstanceId,
									name: this.$options.name || '',
									paths: Array.from(this[A].tree.pathDependencies),
								})
						},
						updated() {
							t.mode.mode !== L &&
								(this[A].tree.stopTracking(),
								this[A].isUpdating &&
									(t.eventHub.emitAsync(E.COMPONENT_UPDATE, {
										componentId: s,
										componentInstanceId: this[A].componentInstanceId,
										name: this.$options.name || '',
										flushId: this[A].currentFlushId,
										paths: Array.from(this[A].tree.pathDependencies),
									}),
									(this[A].isUpdating = !1)))
						},
				  }
		),
		{
			beforeDestroy() {
				t.mode.mode !== L &&
					(t.proxyStateTreeInstance.disposeTree(this[A].tree),
					!st &&
						t.eventHub.emitAsync(E.COMPONENT_REMOVE, {
							componentId: s,
							componentInstanceId: this[A].componentInstanceId,
							name: this.$options.name || '',
						}))
			},
		}
	)
}
const bn = t => ({
	install(
		e,
		n = ({ state: s, actions: r, effects: i }) => ({
			state: s,
			actions: r,
			effects: i,
		})
	) {
		e.mixin(En(t, n))
	},
})
gn((t, e) => {
	let n = []
	return (
		e.route.view == 'login' ||
			(e.route.doctype &&
				n.push({
					title: e.route.doctype,
					to: `/${e.route.doctype}`,
				}),
			e.route.document &&
				n.push({
					title: e.route.document,
					to: `/${e.route.doctype}/${e.route.document}`,
				})),
		n
	)
})
function On() {
	return Ct().__VUE_DEVTOOLS_GLOBAL_HOOK__
}
function Ct() {
	return typeof navigator < 'u' ? window : typeof global < 'u' ? global : {}
}
const Tn = 'devtools-plugin:setup'
function _n(t, e) {
	const n = On()
	if (n) n.emit(Tn, t, e)
	else {
		const s = Ct()
		;(s.__VUE_DEVTOOLS_PLUGINS__ = s.__VUE_DEVTOOLS_PLUGINS__ || []).push({
			pluginDescriptor: t,
			setupFn: e,
		})
	}
}
/*!
 * vue-router v4.0.10
 * (c) 2021 Eduardo San Martin Morote
 * @license MIT
 */
const It = typeof Symbol == 'function' && typeof Symbol.toStringTag == 'symbol',
	Z = t =>
		It
			? Symbol(process.env.NODE_ENV !== 'production' ? '[vue-router]: ' + t : t)
			: (process.env.NODE_ENV !== 'production' ? '[vue-router]: ' : '_vr_') + t,
	Sn = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'router view location matched' : 'rvlm'),
	rt = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'router view depth' : 'rvd'),
	Ve = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'router' : 'r'),
	kt = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'route location' : 'rl'),
	ke = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'router view location' : 'rvl'),
	F = typeof window < 'u'
function Rn(t) {
	return t.__esModule || (It && t[Symbol.toStringTag] === 'Module')
}
const P = Object.assign
function Re(t, e) {
	const n = {}
	for (const s in e) {
		const r = e[s]
		n[s] = Array.isArray(r) ? r.map(t) : t(r)
	}
	return n
}
let se = () => {}
function S(t) {
	const e = Array.from(arguments).slice(1)
	console.warn.apply(console, ['[Vue Router warn]: ' + t].concat(e))
}
const Pn = /\/$/,
	wn = t => t.replace(Pn, '')
function Pe(t, e, n = '/') {
	let s,
		r = {},
		i = '',
		o = ''
	const l = e.indexOf('?'),
		c = e.indexOf('#', l > -1 ? l : 0)
	return (
		l > -1 && ((s = e.slice(0, l)), (i = e.slice(l + 1, c > -1 ? c : e.length)), (r = t(i))),
		c > -1 && ((s = s || e.slice(0, c)), (o = e.slice(c, e.length))),
		(s = Cn(s != null ? s : e, n)),
		{
			fullPath: s + (i && '?') + i + o,
			path: s,
			query: r,
			hash: o,
		}
	)
}
function Nn(t, e) {
	let n = e.query ? t(e.query) : ''
	return e.path + (n && '?') + n + (e.hash || '')
}
function it(t, e) {
	return !e || !t.toLowerCase().startsWith(e.toLowerCase()) ? t : t.slice(e.length) || '/'
}
function ot(t, e, n) {
	let s = e.matched.length - 1,
		r = n.matched.length - 1
	return (
		s > -1 &&
		s === r &&
		Y(e.matched[s], n.matched[r]) &&
		xt(e.params, n.params) &&
		t(e.query) === t(n.query) &&
		e.hash === n.hash
	)
}
function Y(t, e) {
	return (t.aliasOf || t) === (e.aliasOf || e)
}
function xt(t, e) {
	if (Object.keys(t).length !== Object.keys(e).length) return !1
	for (let n in t) if (!An(t[n], e[n])) return !1
	return !0
}
function An(t, e) {
	return Array.isArray(t) ? at(t, e) : Array.isArray(e) ? at(e, t) : t === e
}
function at(t, e) {
	return Array.isArray(e) ? t.length === e.length && t.every((n, s) => n === e[s]) : t.length === 1 && t[0] === e
}
function Cn(t, e) {
	if (t.startsWith('/')) return t
	if (process.env.NODE_ENV !== 'production' && !e.startsWith('/'))
		return (
			S(
				`Cannot resolve a relative location without an absolute path. Trying to resolve "${t}" from "${e}". It should look like "/${e}".`
			),
			t
		)
	if (!t) return e
	const n = e.split('/'),
		s = t.split('/')
	let r = n.length - 1,
		i,
		o
	for (i = 0; i < s.length; i++)
		if (((o = s[i]), !(r === 1 || o === '.')))
			if (o === '..') r--
			else break
	return n.slice(0, r).join('/') + '/' + s.slice(i - (i === s.length ? 1 : 0)).join('/')
}
var oe
;(function (t) {
	;(t.pop = 'pop'), (t.push = 'push')
})(oe || (oe = {}))
var re
;(function (t) {
	;(t.back = 'back'), (t.forward = 'forward'), (t.unknown = '')
})(re || (re = {}))
function In(t) {
	if (!t)
		if (F) {
			const e = document.querySelector('base')
			;(t = (e && e.getAttribute('href')) || '/'), (t = t.replace(/^\w+:\/\/[^\/]+/, ''))
		} else t = '/'
	return t[0] !== '/' && t[0] !== '#' && (t = '/' + t), wn(t)
}
const kn = /^[^#]+#/
function xn(t, e) {
	return t.replace(kn, '#') + e
}
function Dn(t, e) {
	const n = document.documentElement.getBoundingClientRect(),
		s = t.getBoundingClientRect()
	return {
		behavior: e.behavior,
		left: s.left - n.left - (e.left || 0),
		top: s.top - n.top - (e.top || 0),
	}
}
const pe = () => ({
	left: window.pageXOffset,
	top: window.pageYOffset,
})
function jn(t) {
	let e
	if ('el' in t) {
		let n = t.el
		const s = typeof n == 'string' && n.startsWith('#')
		if (
			process.env.NODE_ENV !== 'production' &&
			typeof t.el == 'string' &&
			(!s || !document.getElementById(t.el.slice(1)))
		)
			try {
				let i = document.querySelector(t.el)
				if (s && i) {
					S(
						`The selector "${t.el}" should be passed as "el: document.querySelector('${t.el}')" because it starts with "#".`
					)
					return
				}
			} catch {
				S(
					`The selector "${t.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`
				)
				return
			}
		const r = typeof n == 'string' ? (s ? document.getElementById(n.slice(1)) : document.querySelector(n)) : n
		if (!r) {
			process.env.NODE_ENV !== 'production' &&
				S(`Couldn't find element using selector "${t.el}" returned by scrollBehavior.`)
			return
		}
		e = Dn(r, t)
	} else e = t
	'scrollBehavior' in document.documentElement.style
		? window.scrollTo(e)
		: window.scrollTo(e.left != null ? e.left : window.pageXOffset, e.top != null ? e.top : window.pageYOffset)
}
function ct(t, e) {
	return (history.state ? history.state.position - e : -1) + t
}
const xe = /* @__PURE__ */ new Map()
function Mn(t, e) {
	xe.set(t, e)
}
function $n(t) {
	const e = xe.get(t)
	return xe.delete(t), e
}
let Vn = () => location.protocol + '//' + location.host
function Dt(t, e) {
	const { pathname: n, search: s, hash: r } = e,
		i = t.indexOf('#')
	if (i > -1) {
		let l = r.includes(t.slice(i)) ? t.slice(i).length : 1,
			c = r.slice(l)
		return c[0] !== '/' && (c = '/' + c), it(c, '')
	}
	return it(n, t) + s + r
}
function Ln(t, e, n, s) {
	let r = [],
		i = [],
		o = null
	const l = ({ state: f }) => {
		const p = Dt(t, location),
			y = n.value,
			w = e.value
		let N = 0
		if (f) {
			if (((n.value = p), (e.value = f), o && o === y)) {
				o = null
				return
			}
			N = w ? f.position - w.position : 0
		} else s(p)
		r.forEach(O => {
			O(n.value, y, {
				delta: N,
				type: oe.pop,
				direction: N ? (N > 0 ? re.forward : re.back) : re.unknown,
			})
		})
	}
	function c() {
		o = n.value
	}
	function u(f) {
		r.push(f)
		const p = () => {
			const y = r.indexOf(f)
			y > -1 && r.splice(y, 1)
		}
		return i.push(p), p
	}
	function a() {
		const { history: f } = window
		!f.state || f.replaceState(P({}, f.state, { scroll: pe() }), '')
	}
	function h() {
		for (const f of i) f()
		;(i = []), window.removeEventListener('popstate', l), window.removeEventListener('beforeunload', a)
	}
	return (
		window.addEventListener('popstate', l),
		window.addEventListener('beforeunload', a),
		{
			pauseListeners: c,
			listen: u,
			destroy: h,
		}
	)
}
function ut(t, e, n, s = !1, r = !1) {
	return {
		back: t,
		current: e,
		forward: n,
		replaced: s,
		position: window.history.length,
		scroll: r ? pe() : null,
	}
}
function Hn(t) {
	const { history: e, location: n } = window
	let s = {
			value: Dt(t, n),
		},
		r = { value: e.state }
	r.value ||
		i(
			s.value,
			{
				back: null,
				current: s.value,
				forward: null,
				position: e.length - 1,
				replaced: !0,
				scroll: null,
			},
			!0
		)
	function i(c, u, a) {
		const h = t.indexOf('#'),
			f = h > -1 ? (n.host && document.querySelector('base') ? t : t.slice(h)) + c : Vn() + t + c
		try {
			e[a ? 'replaceState' : 'pushState'](u, '', f), (r.value = u)
		} catch (p) {
			process.env.NODE_ENV !== 'production' ? S('Error with push/replace State', p) : console.error(p),
				n[a ? 'replace' : 'assign'](f)
		}
	}
	function o(c, u) {
		const a = P({}, e.state, ut(r.value.back, c, r.value.forward, !0), u, { position: r.value.position })
		i(c, a, !0), (s.value = c)
	}
	function l(c, u) {
		const a = P({}, r.value, e.state, {
			forward: c,
			scroll: pe(),
		})
		process.env.NODE_ENV !== 'production' &&
			!e.state &&
			S(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`),
			i(a.current, a, !0)
		const h = P({}, ut(s.value, c, null), { position: a.position + 1 }, u)
		i(c, h, !1), (s.value = c)
	}
	return {
		location: s,
		state: r,
		push: l,
		replace: o,
	}
}
function Fn(t) {
	t = In(t)
	const e = Hn(t),
		n = Ln(t, e.state, e.location, e.replace)
	function s(i, o = !0) {
		o || n.pauseListeners(), history.go(i)
	}
	const r = P(
		{
			location: '',
			base: t,
			go: s,
			createHref: xn.bind(null, t),
		},
		e,
		n
	)
	return (
		Object.defineProperty(r, 'location', {
			enumerable: !0,
			get: () => e.location.value,
		}),
		Object.defineProperty(r, 'state', {
			enumerable: !0,
			get: () => e.state.value,
		}),
		r
	)
}
function Un(t) {
	return typeof t == 'string' || (t && typeof t == 'object')
}
function jt(t) {
	return typeof t == 'string' || typeof t == 'symbol'
}
const z = {
		path: '/',
		name: void 0,
		params: {},
		query: {},
		hash: '',
		fullPath: '/',
		matched: [],
		meta: {},
		redirectedFrom: void 0,
	},
	De = /* @__PURE__ */ Z(process.env.NODE_ENV !== 'production' ? 'navigation failure' : 'nf')
var lt
;(function (t) {
	;(t[(t.aborted = 4)] = 'aborted'), (t[(t.cancelled = 8)] = 'cancelled'), (t[(t.duplicated = 16)] = 'duplicated')
})(lt || (lt = {}))
const Yn = {
	[1]({ location: t, currentLocation: e }) {
		return `No match for
 ${JSON.stringify(t)}${
			e
				? `
while being at
` + JSON.stringify(e)
				: ''
		}`
	},
	[2]({ from: t, to: e }) {
		return `Redirected from "${t.fullPath}" to "${Gn(e)}" via a navigation guard.`
	},
	[4]({ from: t, to: e }) {
		return `Navigation aborted from "${t.fullPath}" to "${e.fullPath}" via a navigation guard.`
	},
	[8]({ from: t, to: e }) {
		return `Navigation cancelled from "${t.fullPath}" to "${e.fullPath}" with a new navigation.`
	},
	[16]({ from: t, to: e }) {
		return `Avoided redundant navigation to current location: "${t.fullPath}".`
	},
}
function J(t, e) {
	return process.env.NODE_ENV !== 'production'
		? P(
				new Error(Yn[t](e)),
				{
					type: t,
					[De]: !0,
				},
				e
		  )
		: P(
				new Error(),
				{
					type: t,
					[De]: !0,
				},
				e
		  )
}
function K(t, e) {
	return t instanceof Error && De in t && (e == null || !!(t.type & e))
}
const Bn = ['params', 'query', 'hash']
function Gn(t) {
	if (typeof t == 'string') return t
	if ('path' in t) return t.path
	const e = {}
	for (const n of Bn) n in t && (e[n] = t[n])
	return JSON.stringify(e, null, 2)
}
const ht = '[^/]+?',
	zn = {
		sensitive: !1,
		strict: !1,
		start: !0,
		end: !0,
	},
	Kn = /[.+*?^${}()[\]/\\]/g
function Wn(t, e) {
	const n = P({}, zn, e)
	let s = [],
		r = n.start ? '^' : ''
	const i = []
	for (const u of t) {
		const a = u.length ? [] : [90]
		n.strict && !u.length && (r += '/')
		for (let h = 0; h < u.length; h++) {
			const f = u[h]
			let p = 40 + (n.sensitive ? 0.25 : 0)
			if (f.type === 0) h || (r += '/'), (r += f.value.replace(Kn, '\\$&')), (p += 40)
			else if (f.type === 1) {
				const { value: y, repeatable: w, optional: N, regexp: O } = f
				i.push({
					name: y,
					repeatable: w,
					optional: N,
				})
				const T = O || ht
				if (T !== ht) {
					p += 10
					try {
						new RegExp(`(${T})`)
					} catch (x) {
						throw new Error(`Invalid custom RegExp for param "${y}" (${T}): ` + x.message)
					}
				}
				let k = w ? `((?:${T})(?:/(?:${T}))*)` : `(${T})`
				h || (k = N && u.length < 2 ? `(?:/${k})` : '/' + k),
					N && (k += '?'),
					(r += k),
					(p += 20),
					N && (p += -8),
					w && (p += -20),
					T === '.*' && (p += -50)
			}
			a.push(p)
		}
		s.push(a)
	}
	if (n.strict && n.end) {
		const u = s.length - 1
		s[u][s[u].length - 1] += 0.7000000000000001
	}
	n.strict || (r += '/?'), n.end ? (r += '$') : n.strict && (r += '(?:/|$)')
	const o = new RegExp(r, n.sensitive ? '' : 'i')
	function l(u) {
		const a = u.match(o),
			h = {}
		if (!a) return null
		for (let f = 1; f < a.length; f++) {
			const p = a[f] || '',
				y = i[f - 1]
			h[y.name] = p && y.repeatable ? p.split('/') : p
		}
		return h
	}
	function c(u) {
		let a = '',
			h = !1
		for (const f of t) {
			;(!h || !a.endsWith('/')) && (a += '/'), (h = !1)
			for (const p of f)
				if (p.type === 0) a += p.value
				else if (p.type === 1) {
					const { value: y, repeatable: w, optional: N } = p,
						O = y in u ? u[y] : ''
					if (Array.isArray(O) && !w)
						throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`)
					const T = Array.isArray(O) ? O.join('/') : O
					if (!T)
						if (N) f.length < 2 && (a.endsWith('/') ? (a = a.slice(0, -1)) : (h = !0))
						else throw new Error(`Missing required param "${y}"`)
					a += T
				}
		}
		return a
	}
	return {
		re: o,
		score: s,
		keys: i,
		parse: l,
		stringify: c,
	}
}
function qn(t, e) {
	let n = 0
	for (; n < t.length && n < e.length; ) {
		const s = e[n] - t[n]
		if (s) return s
		n++
	}
	return t.length < e.length
		? t.length === 1 && t[0] === 40 + 40
			? -1
			: 1
		: t.length > e.length
		? e.length === 1 && e[0] === 40 + 40
			? 1
			: -1
		: 0
}
function Xn(t, e) {
	let n = 0
	const s = t.score,
		r = e.score
	for (; n < s.length && n < r.length; ) {
		const i = qn(s[n], r[n])
		if (i) return i
		n++
	}
	return r.length - s.length
}
const Qn = {
		type: 0,
		value: '',
	},
	Jn = /[a-zA-Z0-9_]/
function Zn(t) {
	if (!t) return [[]]
	if (t === '/') return [[Qn]]
	if (!t.startsWith('/'))
		throw new Error(
			process.env.NODE_ENV !== 'production'
				? `Route paths should start with a "/": "${t}" should be "/${t}".`
				: `Invalid path "${t}"`
		)
	function e(p) {
		throw new Error(`ERR (${n})/"${u}": ${p}`)
	}
	let n = 0,
		s = n
	const r = []
	let i
	function o() {
		i && r.push(i), (i = [])
	}
	let l = 0,
		c,
		u = '',
		a = ''
	function h() {
		!u ||
			(n === 0
				? i.push({
						type: 0,
						value: u,
				  })
				: n === 1 || n === 2 || n === 3
				? (i.length > 1 &&
						(c === '*' || c === '+') &&
						e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`),
				  i.push({
						type: 1,
						value: u,
						regexp: a,
						repeatable: c === '*' || c === '+',
						optional: c === '*' || c === '?',
				  }))
				: e('Invalid state to consume buffer'),
			(u = ''))
	}
	function f() {
		u += c
	}
	for (; l < t.length; ) {
		if (((c = t[l++]), c === '\\' && n !== 2)) {
			;(s = n), (n = 4)
			continue
		}
		switch (n) {
			case 0:
				c === '/' ? (u && h(), o()) : c === ':' ? (h(), (n = 1)) : f()
				break
			case 4:
				f(), (n = s)
				break
			case 1:
				c === '(' ? (n = 2) : Jn.test(c) ? f() : (h(), (n = 0), c !== '*' && c !== '?' && c !== '+' && l--)
				break
			case 2:
				c === ')' ? (a[a.length - 1] == '\\' ? (a = a.slice(0, -1) + c) : (n = 3)) : (a += c)
				break
			case 3:
				h(), (n = 0), c !== '*' && c !== '?' && c !== '+' && l--, (a = '')
				break
			default:
				e('Unknown state')
				break
		}
	}
	return n === 2 && e(`Unfinished custom RegExp for param "${u}"`), h(), o(), r
}
function es(t, e, n) {
	const s = Wn(Zn(t.path), n)
	if (process.env.NODE_ENV !== 'production') {
		const i = /* @__PURE__ */ new Set()
		for (const o of s.keys)
			i.has(o.name) &&
				S(
					`Found duplicated params with name "${o.name}" for path "${t.path}". Only the last one will be available on "$route.params".`
				),
				i.add(o.name)
	}
	const r = P(s, {
		record: t,
		parent: e,
		children: [],
		alias: [],
	})
	return e && !r.record.aliasOf == !e.record.aliasOf && e.children.push(r), r
}
function ts(t, e) {
	const n = [],
		s = /* @__PURE__ */ new Map()
	e = dt({ strict: !1, end: !0, sensitive: !1 }, e)
	function r(a) {
		return s.get(a)
	}
	function i(a, h, f) {
		let p = !f,
			y = ss(a)
		y.aliasOf = f && f.record
		const w = dt(e, a),
			N = [y]
		if ('alias' in a) {
			const k = typeof a.alias == 'string' ? [a.alias] : a.alias
			for (const x of k)
				N.push(
					P({}, y, {
						components: f ? f.record.components : y.components,
						path: x,
						aliasOf: f ? f.record : y,
					})
				)
		}
		let O, T
		for (const k of N) {
			let { path: x } = k
			if (h && x[0] !== '/') {
				let B = h.record.path,
					$ = B[B.length - 1] === '/' ? '' : '/'
				k.path = h.record.path + (x && $ + x)
			}
			if (process.env.NODE_ENV !== 'production' && k.path === '*')
				throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`)
			if (
				((O = es(k, h, w)),
				process.env.NODE_ENV !== 'production' && h && x[0] === '/' && as(O, h),
				f
					? (f.alias.push(O), process.env.NODE_ENV !== 'production' && os(f, O))
					: ((T = T || O), T !== O && T.alias.push(O), p && a.name && !ft(O) && o(a.name)),
				'children' in y)
			) {
				let B = y.children
				for (let $ = 0; $ < B.length; $++) i(B[$], O, f && f.children[$])
			}
			;(f = f || O), c(O)
		}
		return T
			? () => {
					o(T)
			  }
			: se
	}
	function o(a) {
		if (jt(a)) {
			const h = s.get(a)
			h && (s.delete(a), n.splice(n.indexOf(h), 1), h.children.forEach(o), h.alias.forEach(o))
		} else {
			let h = n.indexOf(a)
			h > -1 && (n.splice(h, 1), a.record.name && s.delete(a.record.name), a.children.forEach(o), a.alias.forEach(o))
		}
	}
	function l() {
		return n
	}
	function c(a) {
		let h = 0
		for (; h < n.length && Xn(a, n[h]) >= 0; ) h++
		n.splice(h, 0, a), a.record.name && !ft(a) && s.set(a.record.name, a)
	}
	function u(a, h) {
		let f,
			p = {},
			y,
			w
		if ('name' in a && a.name) {
			if (((f = s.get(a.name)), !f))
				throw J(1, {
					location: a,
				})
			;(w = f.record.name),
				(p = P(
					ns(
						h.params,
						f.keys.filter(T => !T.optional).map(T => T.name)
					),
					a.params
				)),
				(y = f.stringify(p))
		} else if ('path' in a)
			(y = a.path),
				process.env.NODE_ENV !== 'production' &&
					!y.startsWith('/') &&
					S(
						`The Matcher cannot resolve relative paths but received "${y}". Unless you directly called \`matcher.resolve("${y}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-router-next.`
					),
				(f = n.find(T => T.re.test(y))),
				f && ((p = f.parse(y)), (w = f.record.name))
		else {
			if (((f = h.name ? s.get(h.name) : n.find(T => T.re.test(h.path))), !f))
				throw J(1, {
					location: a,
					currentLocation: h,
				})
			;(w = f.record.name), (p = P({}, h.params, a.params)), (y = f.stringify(p))
		}
		const N = []
		let O = f
		for (; O; ) N.unshift(O.record), (O = O.parent)
		return {
			name: w,
			path: y,
			params: p,
			matched: N,
			meta: is(N),
		}
	}
	return t.forEach(a => i(a)), { addRoute: i, resolve: u, removeRoute: o, getRoutes: l, getRecordMatcher: r }
}
function ns(t, e) {
	let n = {}
	for (let s of e) s in t && (n[s] = t[s])
	return n
}
function ss(t) {
	return {
		path: t.path,
		redirect: t.redirect,
		name: t.name,
		meta: t.meta || {},
		aliasOf: void 0,
		beforeEnter: t.beforeEnter,
		props: rs(t),
		children: t.children || [],
		instances: {},
		leaveGuards: /* @__PURE__ */ new Set(),
		updateGuards: /* @__PURE__ */ new Set(),
		enterCallbacks: {},
		components: 'components' in t ? t.components || {} : { default: t.component },
	}
}
function rs(t) {
	const e = {},
		n = t.props || !1
	if ('component' in t) e.default = n
	else for (let s in t.components) e[s] = typeof n == 'boolean' ? n : n[s]
	return e
}
function ft(t) {
	for (; t; ) {
		if (t.record.aliasOf) return !0
		t = t.parent
	}
	return !1
}
function is(t) {
	return t.reduce((e, n) => P(e, n.meta), {})
}
function dt(t, e) {
	let n = {}
	for (let s in t) n[s] = s in e ? e[s] : t[s]
	return n
}
function je(t, e) {
	return t.name === e.name && t.optional === e.optional && t.repeatable === e.repeatable
}
function os(t, e) {
	for (let n of t.keys)
		if (!n.optional && !e.keys.find(je.bind(null, n)))
			return S(
				`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`
			)
	for (let n of e.keys)
		if (!n.optional && !t.keys.find(je.bind(null, n)))
			return S(
				`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`
			)
}
function as(t, e) {
	for (let n of e.keys)
		if (!t.keys.find(je.bind(null, n)))
			return S(
				`Absolute path "${t.record.path}" should have the exact same param named "${n.name}" as its parent "${e.record.path}".`
			)
}
const Mt = /#/g,
	cs = /&/g,
	us = /\//g,
	ls = /=/g,
	hs = /\?/g,
	$t = /\+/g,
	fs = /%5B/g,
	ds = /%5D/g,
	Vt = /%5E/g,
	ps = /%60/g,
	Lt = /%7B/g,
	ms = /%7C/g,
	Ht = /%7D/g,
	gs = /%20/g
function Le(t) {
	return encodeURI('' + t)
		.replace(ms, '|')
		.replace(fs, '[')
		.replace(ds, ']')
}
function ys(t) {
	return Le(t).replace(Lt, '{').replace(Ht, '}').replace(Vt, '^')
}
function Me(t) {
	return Le(t)
		.replace($t, '%2B')
		.replace(gs, '+')
		.replace(Mt, '%23')
		.replace(cs, '%26')
		.replace(ps, '`')
		.replace(Lt, '{')
		.replace(Ht, '}')
		.replace(Vt, '^')
}
function vs(t) {
	return Me(t).replace(ls, '%3D')
}
function Es(t) {
	return Le(t).replace(Mt, '%23').replace(hs, '%3F')
}
function bs(t) {
	return Es(t).replace(us, '%2F')
}
function ae(t) {
	try {
		return decodeURIComponent('' + t)
	} catch {
		process.env.NODE_ENV !== 'production' && S(`Error decoding "${t}". Using original value`)
	}
	return '' + t
}
function Os(t) {
	const e = {}
	if (t === '' || t === '?') return e
	const s = (t[0] === '?' ? t.slice(1) : t).split('&')
	for (let r = 0; r < s.length; ++r) {
		const i = s[r].replace($t, ' ')
		let o = i.indexOf('='),
			l = ae(o < 0 ? i : i.slice(0, o)),
			c = o < 0 ? null : ae(i.slice(o + 1))
		if (l in e) {
			let u = e[l]
			Array.isArray(u) || (u = e[l] = [u]), u.push(c)
		} else e[l] = c
	}
	return e
}
function pt(t) {
	let e = ''
	for (let n in t) {
		const s = t[n]
		if (((n = vs(n)), s == null)) {
			s !== void 0 && (e += (e.length ? '&' : '') + n)
			continue
		}
		;(Array.isArray(s) ? s.map(i => i && Me(i)) : [s && Me(s)]).forEach(i => {
			i !== void 0 && ((e += (e.length ? '&' : '') + n), i != null && (e += '=' + i))
		})
	}
	return e
}
function Ts(t) {
	const e = {}
	for (let n in t) {
		let s = t[n]
		s !== void 0 && (e[n] = Array.isArray(s) ? s.map(r => (r == null ? null : '' + r)) : s == null ? s : '' + s)
	}
	return e
}
function te() {
	let t = []
	function e(s) {
		return (
			t.push(s),
			() => {
				const r = t.indexOf(s)
				r > -1 && t.splice(r, 1)
			}
		)
	}
	function n() {
		t = []
	}
	return {
		add: e,
		list: () => t,
		reset: n,
	}
}
function U(t, e, n, s, r) {
	const i = s && (s.enterCallbacks[r] = s.enterCallbacks[r] || [])
	return () =>
		new Promise((o, l) => {
			const c = h => {
					h === !1
						? l(
								J(4, {
									from: n,
									to: e,
								})
						  )
						: h instanceof Error
						? l(h)
						: Un(h)
						? l(
								J(2, {
									from: e,
									to: h,
								})
						  )
						: (i && s.enterCallbacks[r] === i && typeof h == 'function' && i.push(h), o())
				},
				u = t.call(s && s.instances[r], e, n, process.env.NODE_ENV !== 'production' ? _s(c, e, n) : c)
			let a = Promise.resolve(u)
			if ((t.length < 3 && (a = a.then(c)), process.env.NODE_ENV !== 'production' && t.length > 2)) {
				const h = `The "next" callback was never called inside of ${t.name ? '"' + t.name + '"' : ''}:
${t.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`
				if (typeof u == 'object' && 'then' in u)
					a = a.then(f => (c._called ? f : (S(h), Promise.reject(new Error('Invalid navigation guard')))))
				else if (u !== void 0 && !c._called) {
					S(h), l(new Error('Invalid navigation guard'))
					return
				}
			}
			a.catch(h => l(h))
		})
}
function _s(t, e, n) {
	let s = 0
	return function () {
		s++ === 1 &&
			S(
				`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${e.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`
			),
			(t._called = !0),
			s === 1 && t.apply(null, arguments)
	}
}
function we(t, e, n, s) {
	const r = []
	for (const i of t)
		for (const o in i.components) {
			let l = i.components[o]
			if (process.env.NODE_ENV !== 'production') {
				if (!l || (typeof l != 'object' && typeof l != 'function'))
					throw (
						(S(`Component "${o}" in record with path "${i.path}" is not a valid component. Received "${String(l)}".`),
						new Error('Invalid route component'))
					)
				if ('then' in l) {
					S(
						`Component "${o}" in record with path "${i.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`
					)
					let c = l
					l = () => c
				} else
					l.__asyncLoader &&
						!l.__warnedDefineAsync &&
						((l.__warnedDefineAsync = !0),
						S(
							`Component "${o}" in record with path "${i.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`
						))
			}
			if (!(e !== 'beforeRouteEnter' && !i.instances[o]))
				if (Ss(l)) {
					const u = (l.__vccOpts || l)[e]
					u && r.push(U(u, n, s, i, o))
				} else {
					let c = l()
					process.env.NODE_ENV !== 'production' &&
						!('catch' in c) &&
						(S(
							`Component "${o}" in record with path "${i.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`
						),
						(c = Promise.resolve(c))),
						r.push(() =>
							c.then(u => {
								if (!u) return Promise.reject(new Error(`Couldn't resolve component "${o}" at "${i.path}"`))
								const a = Rn(u) ? u.default : u
								i.components[o] = a
								const f = (a.__vccOpts || a)[e]
								return f && U(f, n, s, i, o)()
							})
						)
				}
		}
	return r
}
function Ss(t) {
	return typeof t == 'object' || 'displayName' in t || 'props' in t || '__vccOpts' in t
}
function mt(t) {
	const e = ie(Ve),
		n = ie(kt),
		s = V(() => e.resolve(he(t.to))),
		r = V(() => {
			let { matched: c } = s.value,
				{ length: u } = c
			const a = c[u - 1]
			let h = n.matched
			if (!a || !h.length) return -1
			let f = h.findIndex(Y.bind(null, a))
			if (f > -1) return f
			let p = gt(c[u - 2])
			return u > 1 && gt(a) === p && h[h.length - 1].path !== p ? h.findIndex(Y.bind(null, c[u - 2])) : f
		}),
		i = V(() => r.value > -1 && Ns(n.params, s.value.params)),
		o = V(() => r.value > -1 && r.value === n.matched.length - 1 && xt(n.params, s.value.params))
	function l(c = {}) {
		return ws(c) ? e[he(t.replace) ? 'replace' : 'push'](he(t.to)).catch(se) : Promise.resolve()
	}
	if ((process.env.NODE_ENV !== 'production' || !1) && F) {
		const c = _t()
		if (c) {
			const u = {
				route: s.value,
				isActive: i.value,
				isExactActive: o.value,
			}
			;(c.__vrl_devtools = c.__vrl_devtools || []),
				c.__vrl_devtools.push(u),
				Zt(
					() => {
						;(u.route = s.value), (u.isActive = i.value), (u.isExactActive = o.value)
					},
					{ flush: 'post' }
				)
		}
	}
	return {
		route: s,
		href: V(() => s.value.href),
		isActive: i,
		isExactActive: o,
		navigate: l,
	}
}
const Rs = /* @__PURE__ */ bt({
		name: 'RouterLink',
		props: {
			to: {
				type: [String, Object],
				required: !0,
			},
			replace: Boolean,
			activeClass: String,
			exactActiveClass: String,
			custom: Boolean,
			ariaCurrentValue: {
				type: String,
				default: 'page',
			},
		},
		useLink: mt,
		setup(t, { slots: e }) {
			const n = Et(mt(t)),
				{ options: s } = ie(Ve),
				r = V(() => ({
					[yt(t.activeClass, s.linkActiveClass, 'router-link-active')]: n.isActive,
					[yt(t.exactActiveClass, s.linkExactActiveClass, 'router-link-exact-active')]: n.isExactActive,
				}))
			return () => {
				const i = e.default && e.default(n)
				return t.custom
					? i
					: Ot(
							'a',
							{
								'aria-current': n.isExactActive ? t.ariaCurrentValue : null,
								href: n.href,
								onClick: n.navigate,
								class: r.value,
							},
							i
					  )
			}
		},
	}),
	Ps = Rs
function ws(t) {
	if (
		!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) &&
		!t.defaultPrevented &&
		!(t.button !== void 0 && t.button !== 0)
	) {
		if (t.currentTarget && t.currentTarget.getAttribute) {
			const e = t.currentTarget.getAttribute('target')
			if (/\b_blank\b/i.test(e)) return
		}
		return t.preventDefault && t.preventDefault(), !0
	}
}
function Ns(t, e) {
	for (let n in e) {
		let s = e[n],
			r = t[n]
		if (typeof s == 'string') {
			if (s !== r) return !1
		} else if (!Array.isArray(r) || r.length !== s.length || s.some((i, o) => i !== r[o])) return !1
	}
	return !0
}
function gt(t) {
	return t ? (t.aliasOf ? t.aliasOf.path : t.path) : ''
}
const yt = (t, e, n) => (t != null ? t : e != null ? e : n),
	As = /* @__PURE__ */ bt({
		name: 'RouterView',
		inheritAttrs: !1,
		props: {
			name: {
				type: String,
				default: 'default',
			},
			route: Object,
		},
		setup(t, { attrs: e, slots: n }) {
			process.env.NODE_ENV !== 'production' && Is()
			const s = ie(ke),
				r = V(() => t.route || s.value),
				i = ie(rt, 0),
				o = V(() => r.value.matched[i])
			be(rt, i + 1), be(Sn, o), be(ke, r)
			const l = Jt()
			return (
				Tt(
					() => [l.value, o.value, t.name],
					([c, u, a], [h, f, p]) => {
						u &&
							((u.instances[a] = c),
							f &&
								f !== u &&
								c &&
								c === h &&
								(u.leaveGuards.size || (u.leaveGuards = f.leaveGuards),
								u.updateGuards.size || (u.updateGuards = f.updateGuards))),
							c && u && (!f || !Y(u, f) || !h) && (u.enterCallbacks[a] || []).forEach(y => y(c))
					},
					{ flush: 'post' }
				),
				() => {
					const c = r.value,
						u = o.value,
						a = u && u.components[t.name],
						h = t.name
					if (!a) return vt(n.default, { Component: a, route: c })
					const f = u.props[t.name],
						p = f ? (f === !0 ? c.params : typeof f == 'function' ? f(c) : f) : null,
						w = Ot(
							a,
							P({}, p, e, {
								onVnodeUnmounted: N => {
									N.component.isUnmounted && (u.instances[h] = null)
								},
								ref: l,
							})
						)
					return vt(n.default, { Component: w, route: c }) || w
				}
			)
		},
	})
function vt(t, e) {
	if (!t) return null
	const n = t(e)
	return n.length === 1 ? n[0] : n
}
const Cs = As
function Is() {
	const t = _t(),
		e = t.parent && t.parent.type.name
	if (e && (e === 'KeepAlive' || e.includes('Transition'))) {
		const n = e === 'KeepAlive' ? 'keep-alive' : 'transition'
		S(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`)
	}
}
function ne(t, e) {
	const n = P({}, t, {
		matched: t.matched.map(s => Fs(s, ['instances', 'children', 'aliasOf'])),
	})
	return {
		_custom: {
			type: null,
			readOnly: !0,
			display: t.fullPath,
			tooltip: e,
			value: n,
		},
	}
}
function le(t) {
	return {
		_custom: {
			display: t,
		},
	}
}
let ks = 0
function xs(t, e, n) {
	if (e.__hasDevtools) return
	e.__hasDevtools = !0
	const s = ks++
	_n(
		{
			id: 'org.vuejs.router' + (s ? '.' + s : ''),
			label: 'Vue Router',
			packageName: 'vue-router',
			homepage: 'https://next.router.vuejs.org/',
			logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
			componentStateTypes: ['Routing'],
			app: t,
		},
		r => {
			r.on.inspectComponent((a, h) => {
				a.instanceData &&
					a.instanceData.state.push({
						type: 'Routing',
						key: '$route',
						editable: !1,
						value: ne(e.currentRoute.value, 'Current Route'),
					})
			}),
				r.on.visitComponentTree(({ treeNode: a, componentInstance: h }) => {
					Array.isArray(h.__vrl_devtools) &&
						((h.__devtoolsApi = r),
						h.__vrl_devtools.forEach(f => {
							let p = Yt,
								y = ''
							f.isExactActive
								? ((p = Ut), (y = 'This is exactly active'))
								: f.isActive && ((p = Ft), (y = 'This link is active')),
								a.tags.push({
									label: f.route.path,
									textColor: 0,
									tooltip: y,
									backgroundColor: p,
								})
						}))
				}),
				Tt(e.currentRoute, () => {
					c(), r.notifyComponentUpdate(), r.sendInspectorTree(l), r.sendInspectorState(l)
				})
			const i = 'router:navigations:' + s
			r.addTimelineLayer({
				id: i,
				label: `Router${s ? ' ' + s : ''} Navigations`,
				color: 4237508,
			}),
				e.onError((a, h) => {
					r.addTimelineEvent({
						layerId: i,
						event: {
							title: 'Error during Navigation',
							subtitle: h.fullPath,
							logType: 'error',
							time: Date.now(),
							data: { error: a },
							groupId: h.meta.__navigationId,
						},
					})
				})
			let o = 0
			e.beforeEach((a, h) => {
				const f = {
					guard: le('beforeEach'),
					from: ne(h, 'Current Location during this navigation'),
					to: ne(a, 'Target location'),
				}
				Object.defineProperty(a.meta, '__navigationId', {
					value: o++,
				}),
					r.addTimelineEvent({
						layerId: i,
						event: {
							time: Date.now(),
							title: 'Start of navigation',
							subtitle: a.fullPath,
							data: f,
							groupId: a.meta.__navigationId,
						},
					})
			}),
				e.afterEach((a, h, f) => {
					const p = {
						guard: le('afterEach'),
					}
					f
						? ((p.failure = {
								_custom: {
									type: Error,
									readOnly: !0,
									display: f ? f.message : '',
									tooltip: 'Navigation Failure',
									value: f,
								},
						  }),
						  (p.status = le('\u274C')))
						: (p.status = le('\u2705')),
						(p.from = ne(h, 'Current Location during this navigation')),
						(p.to = ne(a, 'Target location')),
						r.addTimelineEvent({
							layerId: i,
							event: {
								title: 'End of navigation',
								subtitle: a.fullPath,
								time: Date.now(),
								data: p,
								logType: f ? 'warning' : 'default',
								groupId: a.meta.__navigationId,
							},
						})
				})
			const l = 'router-inspector:' + s
			r.addInspector({
				id: l,
				label: 'Routes' + (s ? ' ' + s : ''),
				icon: 'book',
				treeFilterPlaceholder: 'Search routes',
			})
			function c() {
				if (!u) return
				const a = u
				let h = n.getRoutes().filter(f => !f.parent)
				h.forEach(zt),
					a.filter && (h = h.filter(f => $e(f, a.filter.toLowerCase()))),
					h.forEach(f => Gt(f, e.currentRoute.value)),
					(a.rootNodes = h.map(Bt))
			}
			let u
			r.on.getInspectorTree(a => {
				;(u = a), a.app === t && a.inspectorId === l && c()
			}),
				r.on.getInspectorState(a => {
					if (a.app === t && a.inspectorId === l) {
						const f = n.getRoutes().find(p => p.record.__vd_id === a.nodeId)
						f &&
							(a.state = {
								options: js(f),
							})
					}
				}),
				r.sendInspectorTree(l),
				r.sendInspectorState(l)
		}
	)
}
function Ds(t) {
	return t.optional ? (t.repeatable ? '*' : '?') : t.repeatable ? '+' : ''
}
function js(t) {
	const { record: e } = t,
		n = [{ editable: !1, key: 'path', value: e.path }]
	return (
		e.name != null &&
			n.push({
				editable: !1,
				key: 'name',
				value: e.name,
			}),
		n.push({ editable: !1, key: 'regexp', value: t.re }),
		t.keys.length &&
			n.push({
				editable: !1,
				key: 'keys',
				value: {
					_custom: {
						type: null,
						readOnly: !0,
						display: t.keys.map(s => `${s.name}${Ds(s)}`).join(' '),
						tooltip: 'Param keys',
						value: t.keys,
					},
				},
			}),
		e.redirect != null &&
			n.push({
				editable: !1,
				key: 'redirect',
				value: e.redirect,
			}),
		t.alias.length &&
			n.push({
				editable: !1,
				key: 'aliases',
				value: t.alias.map(s => s.record.path),
			}),
		n.push({
			key: 'score',
			editable: !1,
			value: {
				_custom: {
					type: null,
					readOnly: !0,
					display: t.score.map(s => s.join(', ')).join(' | '),
					tooltip: 'Score used to sort routes',
					value: t.score,
				},
			},
		}),
		n
	)
}
const Ms = 15485081,
	Ft = 2450411,
	Ut = 8702998,
	$s = 2282478,
	Yt = 16486972,
	Vs = 6710886
function Bt(t) {
	const e = [],
		{ record: n } = t
	n.name != null &&
		e.push({
			label: String(n.name),
			textColor: 0,
			backgroundColor: $s,
		}),
		n.aliasOf &&
			e.push({
				label: 'alias',
				textColor: 0,
				backgroundColor: Yt,
			}),
		t.__vd_match &&
			e.push({
				label: 'matches',
				textColor: 0,
				backgroundColor: Ms,
			}),
		t.__vd_exactActive &&
			e.push({
				label: 'exact',
				textColor: 0,
				backgroundColor: Ut,
			}),
		t.__vd_active &&
			e.push({
				label: 'active',
				textColor: 0,
				backgroundColor: Ft,
			}),
		n.redirect &&
			e.push({
				label: 'redirect: ' + (typeof n.redirect == 'string' ? n.redirect : 'Object'),
				textColor: 16777215,
				backgroundColor: Vs,
			})
	let s = n.__vd_id
	return (
		s == null && ((s = String(Ls++)), (n.__vd_id = s)),
		{
			id: s,
			label: n.path,
			tags: e,
			children: t.children.map(Bt),
		}
	)
}
let Ls = 0
const Hs = /^\/(.*)\/([a-z]*)$/
function Gt(t, e) {
	const n = e.matched.length && Y(e.matched[e.matched.length - 1], t.record)
	;(t.__vd_exactActive = t.__vd_active = n),
		n || (t.__vd_active = e.matched.some(s => Y(s, t.record))),
		t.children.forEach(s => Gt(s, e))
}
function zt(t) {
	;(t.__vd_match = !1), t.children.forEach(zt)
}
function $e(t, e) {
	const n = String(t.re).match(Hs)
	if (((t.__vd_match = !1), !n || n.length < 3)) return !1
	if (new RegExp(n[1].replace(/\$$/, ''), n[2]).test(e))
		return (
			t.children.forEach(o => $e(o, e)), t.record.path !== '/' || e === '/' ? ((t.__vd_match = t.re.test(e)), !0) : !1
		)
	const r = t.record.path.toLowerCase(),
		i = ae(r)
	return (!e.startsWith('/') && (i.includes(e) || r.includes(e))) ||
		i.startsWith(e) ||
		r.startsWith(e) ||
		(t.record.name && String(t.record.name).includes(e))
		? !0
		: t.children.some(o => $e(o, e))
}
function Fs(t, e) {
	const n = {}
	for (let s in t) e.includes(s) || (n[s] = t[s])
	return n
}
function Us(t) {
	const e = ts(t.routes, t)
	let n = t.parseQuery || Os,
		s = t.stringifyQuery || pt,
		r = t.history
	if (process.env.NODE_ENV !== 'production' && !r)
		throw new Error(
			'Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.'
		)
	const i = te(),
		o = te(),
		l = te(),
		c = Xt(z)
	let u = z
	F && t.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
	const a = Re.bind(null, d => '' + d),
		h = Re.bind(null, bs),
		f = Re.bind(null, ae)
	function p(d, g) {
		let m, v
		return jt(d) ? ((m = e.getRecordMatcher(d)), (v = g)) : (v = d), e.addRoute(v, m)
	}
	function y(d) {
		let g = e.getRecordMatcher(d)
		g ? e.removeRoute(g) : process.env.NODE_ENV !== 'production' && S(`Cannot remove non-existent route "${String(d)}"`)
	}
	function w() {
		return e.getRoutes().map(d => d.record)
	}
	function N(d) {
		return !!e.getRecordMatcher(d)
	}
	function O(d, g) {
		if (((g = P({}, g || c.value)), typeof d == 'string')) {
			let _ = Pe(n, d, g.path),
				I = e.resolve({ path: _.path }, g),
				G = r.createHref(_.fullPath)
			return (
				process.env.NODE_ENV !== 'production' &&
					(G.startsWith('//')
						? S(`Location "${d}" resolved to "${G}". A resolved location cannot start with multiple slashes.`)
						: I.matched.length || S(`No match found for location with path "${d}"`)),
				P(_, I, {
					params: f(I.params),
					hash: ae(_.hash),
					redirectedFrom: void 0,
					href: G,
				})
			)
		}
		let m
		'path' in d
			? (process.env.NODE_ENV !== 'production' &&
					'params' in d &&
					!('name' in d) &&
					Object.keys(d.params).length &&
					S(
						`Path "${d.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`
					),
			  (m = P({}, d, {
					path: Pe(n, d.path, g.path).path,
			  })))
			: ((m = P({}, d, {
					params: h(d.params),
			  })),
			  (g.params = h(g.params)))
		let v = e.resolve(m, g)
		const R = d.hash || ''
		process.env.NODE_ENV !== 'production' &&
			R &&
			!R.startsWith('#') &&
			S(`A \`hash\` should always start with the character "#". Replace "${R}" with "#${R}".`),
			(v.params = a(f(v.params)))
		const C = Nn(
			s,
			P({}, d, {
				hash: ys(R),
				path: v.path,
			})
		)
		let b = r.createHref(C)
		return (
			process.env.NODE_ENV !== 'production' &&
				(b.startsWith('//')
					? S(`Location "${d}" resolved to "${b}". A resolved location cannot start with multiple slashes.`)
					: v.matched.length || S(`No match found for location with path "${'path' in d ? d.path : d}"`)),
			P(
				{
					fullPath: C,
					hash: R,
					query: s === pt ? Ts(d.query) : d.query,
				},
				v,
				{
					redirectedFrom: void 0,
					href: b,
				}
			)
		)
	}
	function T(d) {
		return typeof d == 'string' ? Pe(n, d, c.value.path) : P({}, d)
	}
	function k(d, g) {
		if (u !== d)
			return J(8, {
				from: g,
				to: d,
			})
	}
	function x(d) {
		return ee(d)
	}
	function B(d) {
		return x(P(T(d), { replace: !0 }))
	}
	function $(d) {
		const g = d.matched[d.matched.length - 1]
		if (g && g.redirect) {
			const { redirect: m } = g
			let v = typeof m == 'function' ? m(d) : m
			if (
				(typeof v == 'string' && ((v = v.includes('?') || v.includes('#') ? (v = T(v)) : { path: v }), (v.params = {})),
				process.env.NODE_ENV !== 'production' && !('path' in v) && !('name' in v))
			)
				throw (
					(S(`Invalid redirect found:
${JSON.stringify(v, null, 2)}
 when navigating to "${d.fullPath}". A redirect must contain a name or path. This will break in production.`),
					new Error('Invalid redirect'))
				)
			return P(
				{
					query: d.query,
					hash: d.hash,
					params: d.params,
				},
				v
			)
		}
	}
	function ee(d, g) {
		const m = (u = O(d)),
			v = c.value,
			R = d.state,
			C = d.force,
			b = d.replace === !0,
			_ = $(m)
		if (_)
			return ee(
				P(T(_), {
					state: R,
					force: C,
					replace: b,
				}),
				g || m
			)
		const I = m
		I.redirectedFrom = g
		let G
		return (
			!C && ot(s, v, m) && ((G = J(16, { to: I, from: v })), ze(v, v, !0, !1)),
			(G ? Promise.resolve(G) : He(I, v))
				.catch(D => (K(D) ? D : ge(D, I, v)))
				.then(D => {
					if (D) {
						if (K(D, 2))
							return process.env.NODE_ENV !== 'production' &&
								ot(s, O(D.to), I) &&
								g &&
								(g._count = g._count ? g._count + 1 : 1) > 10
								? (S(
										`Detected an infinite redirection in a navigation guard when going from "${v.fullPath}" to "${I.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`
								  ),
								  Promise.reject(new Error('Infinite redirect in navigation guard')))
								: ee(
										P(T(D.to), {
											state: R,
											force: C,
											replace: b,
										}),
										g || I
								  )
					} else D = Ue(I, v, !0, b, R)
					return Fe(I, v, D), D
				})
		)
	}
	function Kt(d, g) {
		const m = k(d, g)
		return m ? Promise.reject(m) : Promise.resolve()
	}
	function He(d, g) {
		let m
		const [v, R, C] = Ys(d, g)
		m = we(v.reverse(), 'beforeRouteLeave', d, g)
		for (const _ of v)
			_.leaveGuards.forEach(I => {
				m.push(U(I, d, g))
			})
		const b = Kt.bind(null, d, g)
		return (
			m.push(b),
			Q(m)
				.then(() => {
					m = []
					for (const _ of i.list()) m.push(U(_, d, g))
					return m.push(b), Q(m)
				})
				.then(() => {
					m = we(R, 'beforeRouteUpdate', d, g)
					for (const _ of R)
						_.updateGuards.forEach(I => {
							m.push(U(I, d, g))
						})
					return m.push(b), Q(m)
				})
				.then(() => {
					m = []
					for (const _ of d.matched)
						if (_.beforeEnter && !g.matched.includes(_))
							if (Array.isArray(_.beforeEnter)) for (const I of _.beforeEnter) m.push(U(I, d, g))
							else m.push(U(_.beforeEnter, d, g))
					return m.push(b), Q(m)
				})
				.then(
					() => (
						d.matched.forEach(_ => (_.enterCallbacks = {})), (m = we(C, 'beforeRouteEnter', d, g)), m.push(b), Q(m)
					)
				)
				.then(() => {
					m = []
					for (const _ of o.list()) m.push(U(_, d, g))
					return m.push(b), Q(m)
				})
				.catch(_ => (K(_, 8) ? _ : Promise.reject(_)))
		)
	}
	function Fe(d, g, m) {
		for (const v of l.list()) v(d, g, m)
	}
	function Ue(d, g, m, v, R) {
		const C = k(d, g)
		if (C) return C
		const b = g === z,
			_ = F ? history.state : {}
		m &&
			(v || b
				? r.replace(
						d.fullPath,
						P(
							{
								scroll: b && _ && _.scroll,
							},
							R
						)
				  )
				: r.push(d.fullPath, R)),
			(c.value = d),
			ze(d, g, m, b),
			Ge()
	}
	let Ye
	function Wt() {
		Ye = r.listen((d, g, m) => {
			let v = O(d)
			const R = $(v)
			if (R) {
				ee(P(R, { replace: !0 }), v).catch(se)
				return
			}
			u = v
			const C = c.value
			F && Mn(ct(C.fullPath, m.delta), pe()),
				He(v, C)
					.catch(b =>
						K(b, 12)
							? b
							: K(b, 2)
							? (ee(b.to, v)
									.then(_ => {
										K(_, 20) && !m.delta && m.type === oe.pop && r.go(-1, !1)
									})
									.catch(se),
							  Promise.reject())
							: (m.delta && r.go(-m.delta, !1), ge(b, v, C))
					)
					.then(b => {
						;(b = b || Ue(v, C, !1)),
							b && (m.delta ? r.go(-m.delta, !1) : m.type === oe.pop && K(b, 20) && r.go(-1, !1)),
							Fe(v, C, b)
					})
					.catch(se)
		})
	}
	let me = te(),
		Be = te(),
		ce
	function ge(d, g, m) {
		Ge(d)
		const v = Be.list()
		return (
			v.length
				? v.forEach(R => R(d, g, m))
				: (process.env.NODE_ENV !== 'production' && S('uncaught error during route navigation:'), console.error(d)),
			Promise.reject(d)
		)
	}
	function qt() {
		return ce && c.value !== z
			? Promise.resolve()
			: new Promise((d, g) => {
					me.add([d, g])
			  })
	}
	function Ge(d) {
		ce || ((ce = !0), Wt(), me.list().forEach(([g, m]) => (d ? m(d) : g())), me.reset())
	}
	function ze(d, g, m, v) {
		const { scrollBehavior: R } = t
		if (!F || !R) return Promise.resolve()
		let C = (!m && $n(ct(d.fullPath, 0))) || ((v || !m) && history.state && history.state.scroll) || null
		return Qt()
			.then(() => R(d, g, C))
			.then(b => b && jn(b))
			.catch(b => ge(b, d, g))
	}
	const ye = d => r.go(d)
	let ve
	const Ee = /* @__PURE__ */ new Set()
	return {
		currentRoute: c,
		addRoute: p,
		removeRoute: y,
		hasRoute: N,
		getRoutes: w,
		resolve: O,
		options: t,
		push: x,
		replace: B,
		go: ye,
		back: () => ye(-1),
		forward: () => ye(1),
		beforeEach: i.add,
		beforeResolve: o.add,
		afterEach: l.add,
		onError: Be.add,
		isReady: qt,
		install(d) {
			const g = this
			d.component('RouterLink', Ps),
				d.component('RouterView', Cs),
				(d.config.globalProperties.$router = g),
				Object.defineProperty(d.config.globalProperties, '$route', {
					enumerable: !0,
					get: () => he(c),
				}),
				F &&
					!ve &&
					c.value === z &&
					((ve = !0),
					x(r.location).catch(R => {
						process.env.NODE_ENV !== 'production' && S('Unexpected error when starting the router:', R)
					}))
			const m = {}
			for (let R in z) m[R] = V(() => c.value[R])
			d.provide(Ve, g), d.provide(kt, Et(m)), d.provide(ke, c)
			let v = d.unmount
			Ee.add(d),
				(d.unmount = function () {
					Ee.delete(d), Ee.size < 1 && (Ye(), (c.value = z), (ve = !1), (ce = !1)), v()
				}),
				(process.env.NODE_ENV !== 'production' || !1) && F && xs(d, g, e)
		},
	}
}
function Q(t) {
	return t.reduce((e, n) => e.then(() => n()), Promise.resolve())
}
function Ys(t, e) {
	const n = [],
		s = [],
		r = [],
		i = Math.max(e.matched.length, t.matched.length)
	for (let o = 0; o < i; o++) {
		const l = e.matched[o]
		l && (t.matched.find(u => Y(u, l)) ? s.push(l) : n.push(l))
		const c = t.matched[o]
		c && (e.matched.find(u => Y(u, c)) || r.push(c))
	}
	return [n, s, r]
}
const Bs = [
		{
			path: '/',
			component: {
				template: '<div><br>Login</div>',
			},
			props: !0,
		},
		{
			path: '/home',
			component: '<div><h1>HOME</h1></div>',
			props: !0,
		},
		{
			path: '/404',
			component: { template: '<h1>404</h1>' },
		},
		{
			path: '/:table',
			component: '<div><h1>TABLE</h1></div>',
		},
		{
			path: '/:table/:id',
			component: '<div><h1>FORM</h1></div>',
		},
	],
	Gs = Us({
		history: Fn(),
		routes: Bs,
	})
class zs {
	constructor(e = void 0) {
		e === void 0 ||
			import(resolve(e)).then(n => {
				console.log(n)
			})
	}
	loadRoutes() {}
	loadEvents() {}
	loadClient() {}
	loadCustomComponents() {}
}
function Ks(t, e) {
	const n = yn(r),
		s = bn(n)
	t.use(s), t.use(Gs)
	const r = new zs()
}
const Xs = {
	install: Ks,
}
export { Xs as default }
