#!/bin/bash
# Generate all API documentation and aggregate them
# This is the main entry point for complete documentation generation

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

echo "🚀 Starting full documentation generation..."
echo ""

# Step 1: Generate docs for all packages
echo "📝 Step 1: Generating API documentation for all packages..."
cd "$REPO_ROOT"

node --run docs

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
echo "   • Build VitePress site: vp -C docs run build"
echo "   • Preview VitePress site: vp -C docs run preview"
