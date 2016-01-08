#!/usr/bin/env bash

REMOTE_URL="https://$GH_TOKEN@github.com/tusharmath/reactive-storage.git"

git config user.email "tusharmath@gmail.com"
git config user.name "werckerbot"

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
npm version $NPM_RELEASE
git push --tags $REMOTE_URL
git push $REMOTE_URL
npm publish

