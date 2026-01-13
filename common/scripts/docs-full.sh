#!/bin/bash
# Generate all API documentation and aggregate them
# This is the main entry point for complete documentation generation
# Note: This script is designed to run OUTSIDE of rush (not called from within rush command)

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

echo "🚀 Starting full documentation generation..."
echo ""

# Check if we're being called from within Rush
if [ -n "${RUSH_INVOKED_FOLDER:-}" ]; then
  echo "⚠️  This script cannot be run from within a Rush command."
  echo "   Please run: bash common/scripts/docs-full.sh"
  exit 1
fi

# Step 1: Generate docs for all packages
echo "📝 Step 1: Generating API documentation for all packages..."
cd "$REPO_ROOT"

# Use rush docs to generate all individual package docs
rush docs

echo ""
echo "✅ Individual package docs generated"
echo ""

# Step 2: Aggregate all docs
echo "📚 Step 2: Aggregating all documentation to docs/reference/..."
bash "$SCRIPT_DIR/run-docs.sh" --aggregate

echo ""
echo "🎉 Full documentation generation complete!"
echo ""
echo "📖 Next steps:"
echo "   • View aggregated docs: ls -la docs/reference/"
echo "   • Build VitePress site: cd docs && rushx build"
echo "   • Preview VitePress site: cd docs && rushx dev"
