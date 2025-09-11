#!/bin/bash
# Fix vite permission issue
chmod +x node_modules/.bin/vite

# Run vite build
npx vite build
