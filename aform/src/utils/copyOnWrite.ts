import { toRaw } from 'vue'

type Box = Record<PropertyKey, unknown>

// Only a plain object or a list is copied on write. Anything else a row holds (a Date, a Map, a class
// instance) is handed over as it is: a proxy in front of it would break the methods that read its own slots.
const isCopyable = (value: unknown): value is Box => {
	if (Array.isArray(value)) return true
	if (value === null || typeof value !== 'object') return false
	const proto: unknown = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}

const copyOf = (value: Box): Box => (Array.isArray(value) ? Object.assign([], value) : { ...value })

// Each view, to the value it shows now.
const liveValues = new WeakMap<object, () => unknown>()

const settled = (value: unknown): unknown => {
	if (value === null || typeof value !== 'object') return value
	const live = liveValues.get(value)
	if (live) return live()
	if (!isCopyable(value)) return value
	let copy: Box | undefined
	for (const key of Reflect.ownKeys(value)) {
		if (Array.isArray(value) && key === 'length') continue
		const item = value[key]
		const settledItem = settled(item)
		if (settledItem !== item) (copy ??= copyOf(value))[key] = settledItem
	}
	return copy ?? value
}

/**
 * `value` with every view `copyOnWrite` made, at any depth, swapped for the value it shows. A component
 * can hand back what it read, as a row spread into a new one or a list of the rows it was given; settled,
 * none of it reads through a view.
 */
export function settle<T>(value: T): T {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- a view reads as the value it shows, so swapping one for that value keeps `T`
	return settled(value) as T
}

// Vue's own markers: read through a view they would name the caller's object as the view's raw value,
// and so hand out the object the view keeps from being written into.
const isVueFlag = (key: PropertyKey) => typeof key === 'string' && key.startsWith('__v_')

/**
 * A view of `source` that reads as `source` does, but leaves it as it was when written into: each write,
 * at any depth, builds a new value that shares everything the write did not touch, and hands it to
 * `onWrite`. Later reads and writes through the view, or through anything read from it, see that new value.
 *
 * A table's rows are often the store's own objects. An app's component that writes a change straight into
 * a row would change the store without the store hearing of it, so nothing could undo it. Through this view
 * the write becomes a new list of rows, reported as any other edit is.
 *
 * @param source - the value to view; only a plain object or a list is viewed, anything else is returned as is
 * @param onWrite - hears the new value after each write that changes something
 */
export function copyOnWrite<T>(source: T, onWrite: (next: T) => void): T {
	if (!isCopyable(source)) return source
	let current: unknown = source

	// The value at `path` now. A path a later write took away reads as an empty object.
	const at = (path: PropertyKey[]): Box => {
		const value = path.reduce<unknown>((parent, key) => (isCopyable(parent) ? parent[key] : undefined), current)
		return isCopyable(value) ? value : {}
	}

	// A copy of `current` with the value at `path` changed by `change`, and each object on the way to it copied.
	const rebuilt = (path: PropertyKey[], change: (target: Box) => void): unknown => {
		const build = (value: unknown, depth: number): Box => {
			if (!isCopyable(value)) throw new TypeError(`Cannot write into ${String(path[depth - 1])}: it is not an object`)
			const copy = copyOf(value)
			if (depth === path.length) change(copy)
			else copy[path[depth]] = build(value[path[depth]], depth + 1)
			return copy
		}
		return build(current, 0)
	}

	const commit = (next: unknown) => {
		current = next
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- each write copies `source` and changes one value inside it, so it keeps its shape
		onWrite(next as T)
	}

	// A view reads through `path` from whatever `current` is now, so a row read before a write still shows it.
	const view = (path: PropertyKey[], shape: Box): Box => {
		// The proxy's own target: an empty list for a list, so the view still passes `Array.isArray`.
		const empty: Box = {}
		const target: Box = Array.isArray(shape) ? Object.assign([], empty) : empty
		const live = () => at(path)
		const proxy = new Proxy(target, {
			get(_, key) {
				if (isVueFlag(key)) return undefined
				const value: unknown = Reflect.get(live(), key)
				// A method is taken from the raw value: a reactive list's own methods would look for the
				// raw list through the view and find only the view again. Run against this view, `push`
				// or `splice` write through it.
				if (typeof value === 'function') return Reflect.get(toRaw(live()), key)
				if (typeof key === 'symbol' || !isCopyable(value)) return value
				return view([...path, key], value)
			},
			set(_, key, given) {
				const value = settled(given)
				if (key in live() && Object.is(Reflect.get(live(), key), value)) return true
				commit(rebuilt(path, copy => void (copy[key] = value)))
				return true
			},
			deleteProperty(_, key) {
				if (!(key in live())) return true
				commit(rebuilt(path, copy => void delete copy[key]))
				return true
			},
			has: (_, key) => key in live(),
			ownKeys: () => {
				const keys = Reflect.ownKeys(live())
				// An array target's own `length` must always be listed.
				return Array.isArray(target) && !keys.includes('length') ? [...keys, 'length'] : keys
			},
			getOwnPropertyDescriptor(_, key) {
				const descriptor = Reflect.getOwnPropertyDescriptor(live(), key)
				if (!descriptor) return undefined
				// `length` is the one property the target itself has; anything else is reported as the
				// target lacks it: configurable, so the view may change it.
				if (Array.isArray(target) && key === 'length') return { ...descriptor, configurable: false }
				return { ...descriptor, configurable: true }
			},
			getPrototypeOf: () => Object.getPrototypeOf(live()),
		})
		liveValues.set(proxy, () => settled(live()))
		return proxy
	}

	// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- the view reads as `source` does
	return view([], source) as T
}
