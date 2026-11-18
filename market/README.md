# Publishing this plugin

Two markets are involved, and they read different feeds:

- **Community market** — the **Plugins → Plugin market** tab (the `dshmarket`
  plugin) and the awesome-dsh-plugin storefronts read the curated
  [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)
  catalog. Entries point at **GitHub repositories**, not npm packages.
- **DSH Discover** — the host's own **Plugins → Discover** tab reads a
  format-1 index JSON that you host yourself. That is `index.json` here.

`npm publish` is optional for the community market and required only for the
Discover index below; it adds download counts and faster installs.

## A. Community market (what the Plugin market tab shows)

1. Push this directory to a public GitHub repository named
   `dsh-karpathy-guidelines`, and add the `dsh-plugin` repository topic.
   `package.json` already declares `dsh.bundle`, which the catalog checks.
   The repository must be at least one day old before the submission passes CI.
2. Replace `OWNER` in `awesome-dsh-plugin.yml` with your GitHub account, then
   add that file to the catalog repository as
   `data/plugins/OWNER__dsh-karpathy-guidelines.yml` and open a pull request.
   That one file is the entire submission; the list's READMEs are generated.
3. Nothing else is needed to install it. The package has no dependencies and no
   build step, so `dsh plugin add github:OWNER/dsh-karpathy-guidelines` works,
   and the market offers that GitHub source automatically.
4. **Optional npm package** — so storefronts can show download counts, add a
   `repository` field pointing at that GitHub repository, then `npm publish`.
   The catalog links an npm package to a repository only when the published
   `package.json` names it; without `repository` the entry still works, just
   without download figures.

The storefront tile falls back to your GitHub avatar because the catalog accepts
only GitHub-hosted raster images. The plugin's own icon in the DSH plugin panel
is `icon.svg`.

## B. DSH Discover (format-1 index)

`index.json` is a valid DSH plugin market index: `format: 1`, title in English
and Chinese, one plugin, one version installed from npm. It was validated with
the installed `parseMarketIndex`, and its inline icon is checked against
`icon.svg` by `check.mjs`.

It becomes installable only after the npm steps below:

1. Add the `repository` field and `npm publish`.
2. Correct `plugins[0].versions[0].publishTimestamp` to the real publish time:
   `npm view dsh-karpathy-guidelines time.1.0.0` prints an ISO time; convert it
   to Unix seconds.
3. Host `index.json` at a public `https://` URL. DSH refuses redirects, so the
   configured URL must be the final one. The icon is inlined, so this one file
   is all there is to host.
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
