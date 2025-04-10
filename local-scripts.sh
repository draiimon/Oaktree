#!/bin/bash
# Local scripts consolidated for convenience
# This avoids direct editing of package.json

script_name=$1

case $script_name in
  "dev")
    node server/start-local.cjs
    ;;
  "build")
    vite --config vite.config.local.ts build
    ;;
  "start")
    NODE_ENV=production node server/start-local.cjs
    ;;
  "fix")
    node fix.cjs
    ;;
  *)
    echo "Available scripts:"
    echo "  ./local-scripts.sh dev    - Run development server"
    echo "  ./local-scripts.sh build  - Build for production"
    echo "  ./local-scripts.sh start  - Start production server"
    echo "  ./local-scripts.sh fix    - Run fix script"
    ;;
esac