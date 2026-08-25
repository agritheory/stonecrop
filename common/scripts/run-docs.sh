#!/bin/bash
# Wrapper script to generate documentation
#
# Usage:
#   run-docs.sh <package-name>              # Generate docs for single package
#   run-docs.sh --aggregate                 # Aggregate all docs to docs/reference/
#   run-docs.sh <package-name> --aggregate  # Generate single package and aggregate all
#   RUSH_DOCS_AGGREGATE=1 run-docs.sh <pkg> # Same as --aggregate, for callers that cannot pass a flag
#
# Note: `rush docs` generates api.md per package and does NOT aggregate — it sets no environment
# variable and passes no flag. docs/reference/ is written only by `--aggregate`, which reaches it
# through `docs-full.sh` or the docs package's own build script.

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
DOC_GEN_DIR="$REPO_ROOT/tools/doc-gen"

# doc-gen is an ordinary workspace project, so the install that builds the repo installs it too.
# It used to be a Rush autoinstaller, which meant this script had to shell back into
# `install-run-rush.js update-autoinstaller` to populate its node_modules — the one place the docs
# pipeline knew it was running under Rush.

# Parse arguments
PACKAGE_NAME=""
AGGREGATE=false

for arg in "$@"; do
  if [ "$arg" = "--aggregate" ]; then
    AGGREGATE=true
  else
    PACKAGE_NAME="$arg"
  fi
done

# Check if we should aggregate (via env var or flag)
if [ "${RUSH_DOCS_AGGREGATE:-}" = "1" ]; then
  AGGREGATE=true
fi

# Generate single package docs if specified
if [ -n "$PACKAGE_NAME" ]; then
  cd "$DOC_GEN_DIR"
  node generate-docs.cjs "$PACKAGE_NAME"
fi

# Aggregate all docs if requested
if [ "$AGGREGATE" = true ]; then
  echo ""
  echo "📚 Aggregating API documentation..."
  cd "$SCRIPT_DIR"
  node docs-aggregate.mjs
fi
