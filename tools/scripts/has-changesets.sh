#!/usr/bin/env bash
#
# Prints `true` when `.changeset` in the current directory holds a changeset waiting for release,
# `false` when it holds none, and fails when there is no `.changeset` to look in.
#
# release-package.yml asks this before publishing, and version-packages.sh before accepting that
# `changeset version` had nothing to do.
#
# A changeset is any Markdown file there other than README.md. That is broader than Changesets'
# own rule, so if the two ever disagree `changeset version` fails rather than a release being
# skipped.

set -euo pipefail

first=$(find .changeset -maxdepth 1 -name '*.md' ! -name README.md -print -quit)
if [ -n "$first" ]; then
	echo true
else
	echo false
fi
