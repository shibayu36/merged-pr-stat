```
$ ghch -N v0.1.1 --format markdown
# Update CHANGELOG.md and commit

$ npm version patch # or npm version minor
$ git push && git push --tags
$ npm publish
```
