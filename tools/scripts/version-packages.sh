#!/usr/bin/env bash
#
# Runs `changeset version`, or reports that there is nothing to release.
#
# Both jobs in release-package.yml call this, so the dry run rehearses the real bump.
#
# `changeset version` exits 1 when there is no changeset, and a change that releases nothing
# carries none, so that refusal is accepted here, but only when has-changesets.sh finds none.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if pnpm exec changeset version; then
	exit 0
fi
pending=$(bash tools/scripts/has-changesets.sh)
if [ "$pending" = true ]; then
	echo "::error::changeset version failed with changesets present"
	exit 1
fi
echo "::notice::no changesets, so there is nothing to version or release"
