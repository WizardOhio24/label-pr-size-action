# Add size labels to your PRs automatically

This is useful if you want to know, at a quick glance, if there are any particularly small PR changes which could be dealt with quickly, and if there are any very large one which may need to be discussed.

To use this action, put this in your Github Workflows file:
```
name: Add Size Label to PR
# This workflow is triggered every time a PR is changed(opened/closed or code modifed).
on:
  pull_request:

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

You can also include a custom option for the number of edits below which a label should be shown, for example, the default is

```
with:
  ...
  size-label-color: '10, very small, ffaf65 | 100, small, ff9e58 | 500, medium, ff9654 | 2000, large, ff905d'
```

Here, there will only be one label shown, that is: very small < 10 <= small < 100 <= medium < 500 <= large < 2000.  To add a new label, simple use the syntax shown:
```
| filesChanged, labelToApply, ColorOfLabel(Hex) |
```
