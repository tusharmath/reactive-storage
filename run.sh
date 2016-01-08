#!/usr/bin/env bash

REMOTE_URL="https://$GH_TOKEN@github.com/tusharmath/reactive-storage.git"

git config user.email "tusharmath@gmail.com"
git config user.name "werckerbot"

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
npm version prerelease
git remote add release $REMOTE_URL
git push --all release
npm publish

