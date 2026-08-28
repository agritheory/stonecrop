#!/bin/bash
# Wrapper script to generate documentation
# Automatically installs doc-tools autoinstaller if needed
#
# Usage:
#   run-docs.sh <package-name>              # Generate docs for single package
#   run-docs.sh --aggregate                 # Aggregate all docs to nuxt/documentation/content/reference/
#   run-docs.sh <package-name> --aggregate  # Generate single package and aggregate all
#   RUSH_DOCS_AGGREGATE=1 run-docs.sh <pkg> # Used by rush docs command

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
DOC_TOOLS_DIR="$REPO_ROOT/common/autoinstallers/doc-tools"

# Ensure doc-tools is installed.
# In CI this is pre-installed by the workflow before rush build starts.
# In local dev (node_modules absent), call update-autoinstaller outside any rush build context.
if [ ! -d "$DOC_TOOLS_DIR/node_modules" ]; then
  echo "📦 Installing doc-tools..."
  node "$REPO_ROOT/common/scripts/install-run-rush.js" update-autoinstaller --name doc-tools
fi

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
  cd "$DOC_TOOLS_DIR"
  node generate-docs.cjs "$PACKAGE_NAME"
fi

# Aggregate all docs if requested
if [ "$AGGREGATE" = true ]; then
  echo ""
  echo "📚 Aggregating API documentation..."
  cd "$SCRIPT_DIR"
  node docs-aggregate.mjs
fi
