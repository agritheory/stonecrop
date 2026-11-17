/**
 * Where Vitest keeps its on-disk module cache: inside each package, rather than the one directory at
 * the workspace root that Vitest defaults to.
 *
 * Vitest 5.0.4 turned the cache on by default and shared it across the workspace. `vp run -r test`
 * runs packages' suites concurrently, and one process clearing that directory while another wrote to
 * it killed a different suite at startup on each run (`ENOTEMPTY` / `ENOENT` under
 * `node_modules/.vitest-cache`). A relative path resolves against the package's own config, so each
 * suite gets a directory no other process touches.
 */
export const fsModuleCachePath = 'node_modules/.vitest-cache'
