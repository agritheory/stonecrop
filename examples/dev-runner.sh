#!/bin/bash

# Check if example name is provided
if [ -z "$1" ]; then
    echo "Usage: ./dev-runner.sh <example-name>"
    echo "Available examples: aform, atable, beam, code_editor, desktop, node_editor"
    exit 1
fi

EXAMPLE_NAME=$1
PACKAGE_NAME=""

# Map example names to package names
case $EXAMPLE_NAME in
    "aform")
        PACKAGE_NAME="@stonecrop/aform"
        ;;
    "atable")
        PACKAGE_NAME="@stonecrop/atable"
        ;;
    "beam")
        PACKAGE_NAME="@stonecrop/beam"
        ;;
    "code_editor")
        PACKAGE_NAME="@stonecrop/code-editor"
        ;;
    "desktop")
        PACKAGE_NAME="@stonecrop/desktop"
        ;;
    "docbuilder")
        ;;
    "graphql_client")
        PACKAGE_NAME="@stonecrop/graphql-client"
        ;;
    "node_editor")
        PACKAGE_NAME="@stonecrop/node-editor"
        ;;
    *)
        echo "Unknown example: $EXAMPLE_NAME"
        echo "Available examples: aform, atable, beam, code_editor, desktop, docbuilder, graphql_client, node_editor"
        exit 1
        ;;
esac

# Check if example directory exists
if [ ! -d "$EXAMPLE_NAME" ]; then
    echo "Directory $EXAMPLE_NAME does not exist"
    exit 1
fi

# Run concurrently with histoire dev and rush build watch
if [ "$EXAMPLE_NAME" == "desktop" ] || [ "$EXAMPLE_NAME" == "graphql_client" ]; then
    npx concurrently --kill-others --names "server,rush" \
    "cd $EXAMPLE_NAME/ && vite dev ./ --config vite.config.ts" \
    "rush build --watch --to $PACKAGE_NAME"
elif [ "$EXAMPLE_NAME" == "docbuilder" ]; then
    npx concurrently --kill-others --names "server,rush" \
    "cd $EXAMPLE_NAME/ && vite dev ./ --config vite.config.ts" \
    "rush build --watch"
else
    npx concurrently --kill-others --names "server,rush" \
    "cd $EXAMPLE_NAME/ && histoire dev" \
    "rush build --watch --to $PACKAGE_NAME"
fi
