# Setup mkr

[![CI](https://github.com/susisu/setup-mkr/workflows/CI/badge.svg)](https://github.com/susisu/setup-mkr/actions?query=workflow%3ACI)

This action sets up [`mkr`](https://github.com/mackerelio/mkr), the official CLI for [Mackerel](https://en.mackerel.io/).

**NOTE**: This action itself is NOT an official product of Mackerel.

## Usage

``` yml
steps:
- uses: actions/checkout@v5
- uses: susisu/setup-mkr@v4
- run: mkr org # mkr throw, mkr wrap, mkr annotations create, etc.
  env:
    MACKEREL_APIKEY: ${{ secrets.MACKEREL_APIKEY }}
```

It sets up the latest version of `mkr` by default. You can optionally set `mkr-version` to select a specific version of `mkr`.

``` yml
- uses: susisu/setup-mkr@v3
  with:
    mkr-version: '^0.62.0'
```

## License

[MIT License](http://opensource.org/licenses/mit-license.php)

## Author

Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))

## Related Repos

- [mackerelio/mkr](https://github.com/mackerelio/mkr)
- [susisu/mkr-versions](https://github.com/susisu/mkr-versions)
