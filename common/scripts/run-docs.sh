#!/bin/bash
# Wrapper script to generate documentation
# Automatically installs doc-tools autoinstaller if needed

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
DOC_TOOLS_DIR="$REPO_ROOT/common/autoinstallers/doc-tools"

if [ ! -d "$DOC_TOOLS_DIR/node_modules" ]; then
  cd "$DOC_TOOLS_DIR"
  pnpm install --silent
fi

cd "$DOC_TOOLS_DIR"
node generate-docs.mjs "$1"
