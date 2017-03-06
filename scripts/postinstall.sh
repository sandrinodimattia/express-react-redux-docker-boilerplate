#!/bin/sh
if [ "$NODE_ENV" == "production" ]; then
  cd ..
  npm run build
fi
