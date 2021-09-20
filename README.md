# Setup mkr
[![CI](https://github.com/susisu/setup-mkr/workflows/CI/badge.svg)](https://github.com/susisu/setup-mkr/actions?query=workflow%3ACI)

This action sets up [`mkr`](https://github.com/mackerelio/mkr), the official CLI for [Mackerel](https://en.mackerel.io/).

**Please note that this action itself is NOT an official product of Mackerel.**

## Usage
``` yml
steps:
- uses: actions/checkout@v2
- uses: susisu/setup-mkr@v1
- run: mkr org # or `mkr throw`, `mkr wrap`, `mkr annotations create`, ... 
  env:
    MACKEREL_APIKEY: ${{ secrets.MACKEREL_APIKEY }}
```

It sets up the latest version of `mkr` by default. You can optionally set `mkr-version` to use a specific version of `mkr`.

``` yml
- uses: susisu/setup-mkr@v1
  with:
    mkr-version: v0.45.2
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
