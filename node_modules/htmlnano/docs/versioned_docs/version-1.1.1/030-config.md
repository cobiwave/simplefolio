# Config

There are two main ways to configure htmlnano:

## Passing options to `htmlnano` directly
This is the way described above in the examples.

## Using configuration file
Alternatively, you might create a configuration file (e.g., `htmlnanorc.json` or `htmlnanorc.js`) or save options to `package.json` with `htmlnano` key.
`htmlnano` uses `cosmiconfig`, so refer to [its documentation](https://github.com/davidtheclark/cosmiconfig/blob/main/README.md) for a more detailed description.

If you want to specify a preset that way, use `preset` key:

```json
{
    "preset": "max",
}
```

Configuration files have lower precedence than passing options to `htmlnano` directly.
So if you use both ways, then the configuration file would be ignored.