#!/bin/bash

# Set environment variables for build
export CI=false
export GENERATE_SOURCEMAP=false
export ESLINT_NO_DEV_ERRORS=true
export TSC_COMPILE_ON_ERROR=true

# Run the build
npm run build 