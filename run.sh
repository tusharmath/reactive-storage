#!/usr/bin/env bash

remote="https://$GH_TOKEN@github.com/tusharmath/reactive-storage.git"

git config user.email "tusharmath@gmail.com"
git config user.name "werckerbot"

echo "//registry.npmjs.org/:_authToken=$NPM_AUTH_TOKEN" > ~/.npmrc
npm version prerelease
git push --all
npm publish

