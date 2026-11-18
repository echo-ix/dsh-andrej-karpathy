# Publishing this plugin

Two markets are involved, and they read different feeds:

- **Community market** — the **Plugins → Plugin market** tab (the `dshmarket`
  plugin) and the awesome-dsh-plugin storefronts read the curated
  [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
  catalog. Entries point at **GitHub repositories**, not npm packages.
- **DSH Discover** — the host's own **Plugins → Discover** tab reads a
  format-1 index JSON that you host yourself. That is `index.json` here.

## A. Community market (what the Plugin market tab shows)

The package is already pushed to the public repository
[echo-ix/dsh-andrej-karpathy](https://github.com/echo-ix/dsh-andrej-karpathy)
(branch `master`), and `package.json` declares `dsh.bundle`, which the catalog
checks. Two manual steps remain:

1. Add the `dsh-plugin` topic on the repository page (**About** → gear).
2. Add `echo-ix__dsh-andrej-karpathy.yml` from this directory to
   [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
   as `data/plugins/echo-ix__dsh-andrej-karpathy.yml`: fork the catalog, add the
   file on a branch, and open a pull request. That one file is the entire
   submission; the catalog's READMEs are generated.

The catalog's CI also requires the repository to be at least one day old. A
younger repository fails that check, and the check re-runs by itself, so no
resubmission is needed. Nothing else is required to install it: the package has
no dependencies and no build step, so
`dsh plugin add github:echo-ix/dsh-andrej-karpathy` works, and the market offers
that GitHub source automatically.

**Optional npm package** — `repository` is already set, so `npm publish` links
the registry copy to this repository and storefronts can show download counts.
Without it the entry still works, just without download figures.

The storefront tile falls back to the GitHub avatar because the catalog accepts
only GitHub-hosted raster images. The plugin's own icon in the DSH plugin panel
is `icon.svg`.

## B. DSH Discover (format-1 index)

`index.json` is a valid DSH plugin market index: `format: 1`, title in English
and Chinese, one plugin, one version installed from npm. It was validated with
the installed `parseMarketIndex`, and its inline icon is checked against
`icon.svg` by `check.mjs`.

It becomes installable only after the npm steps below:

1. `npm publish`.
2. Correct `plugins[0].versions[0].publishTimestamp` to the real publish time:
   `npm view dsh-karpathy-guidelines time.1.0.0` prints an ISO time; convert it
   to Unix seconds.
3. Host `index.json` at a public `https://` URL. No separate hosting is needed:
   after pushing, this repository's raw URL serves it directly —
   `https://raw.githubusercontent.com/echo-ix/dsh-andrej-karpathy/master/market/index.json`.
   DSH refuses redirects, so the configured URL must answer directly; the icon is
   inlined, so this one file is all there is to host.
4. Add that URL in **Plugins → Discover → Index sources**. Discover then lists
   **Karpathy guidelines**, and Install runs the normal bundle installation.

If you publish under a different npm package name, update `plugins[0].name`
here and the `name` field in `package.json` together.

## Updating a release

Bump `version` in `package.json`, commit and push, then publish npm if you use
it. For Discover, add a version entry here with the new `publishTimestamp` and
the same `source` and `engines`; DSH treats the highest compatible version as
the default. The community market reads versions from the GitHub repository
itself, so no catalog PR is needed for a new release.
