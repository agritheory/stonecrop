#!/usr/bin/env bash
#
# Runs `changeset version`, or reports that there is nothing to release.
#
# Both jobs in release-package.yml call this, so the dry run rehearses the real bump.
#
# `changeset version` exits 1 when there is no changeset, and a change that releases nothing
# carries none, so that refusal is accepted here. Only when no Markdown file other than
# README.md is in .changeset: that is broader than Changesets' own rule, so if the two ever
# disagree the job fails rather than skipping a release.

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if pnpm exec changeset version; then
	exit 0
fi
if [ -n "$(find .changeset -maxdepth 1 -name '*.md' ! -name README.md -print -quit)" ]; then
	echo "::error::changeset version failed with changesets present"
	exit 1
fi
echo "::notice::no changesets, so there is nothing to version or release"
