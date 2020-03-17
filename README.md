# Add size labels to your PRs automatically

This is useful if you want to know, at a quick glance, if there are any particularly small PR changes which could be dealt with quickly, and if there are any very large one which may need to be discussed.

To use this action, put this in your Github Workflows file:
```
name: Add Size Label to PR
# This workflow is triggered every time a PR is edited.
on:
  pull_request:
    types: [edited]

jobs:
  build:
    name: Add Size Label to PR
    runs-on: ubuntu-latest
    steps:
      - name: Add Size Label to PR
        uses: WizardOhio24/label-pr-size-action@master
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```
