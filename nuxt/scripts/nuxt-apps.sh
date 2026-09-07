#!/bin/sh
# Runs "prepare" or "typecheck" against every Nuxt app in this package.
#
# The set is derived from the presence of nuxt.config.ts, never listed. The list this replaced
# named its apps and went stale in two places at once: `documentation` reached neither dev:prepare
# nor test:types, and `playground/server/tsconfig.json` was never checked because only fullstack's
# was spelled out. A named list cannot go red when someone adds an app; this can.
set -e

mode="$1"
if [ "$mode" != 'prepare' ] && [ "$mode" != 'typecheck' ]; then
	echo "usage: nuxt-apps.sh prepare|typecheck" >&2
	exit 2
fi

package_dir="$(cd "$(dirname "$0")/.." && pwd)"
found=0

for config in "$package_dir"/*/nuxt.config.ts; do
	[ -e "$config" ] || break
	app_dir="$(dirname "$config")"
	app_name="$(basename "$app_dir")"
	found=$((found + 1))

	if [ "$mode" = 'prepare' ]; then
		echo "==> nuxi prepare $app_name"
		(cd "$package_dir" && nuxi prepare "$app_name")
		continue
	fi

	echo "==> vue-tsc $app_name"
	(cd "$app_dir" && vue-tsc --noEmit)
	if [ -f "$app_dir/server/tsconfig.json" ]; then
		echo "==> vue-tsc $app_name/server"
		(cd "$app_dir" && vue-tsc --noEmit -p server/tsconfig.json)
	fi
done

# A glob that matches nothing would otherwise make this script a silent no-op that exits 0.
if [ "$found" -eq 0 ]; then
	echo "nuxt-apps.sh: no app with a nuxt.config.ts under $package_dir" >&2
	exit 1
fi
