/**
 * Self-check for the dsh-karpathy-guidelines bundle and its market index.
 * Run with `node check.mjs` (or `npm test`). No dependencies, no network.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const json = (path) => JSON.parse(read(path))
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/
const text = (value) => typeof value === 'string' && value.trim() !== ''

const pkg = json('./package.json')
assert.equal(pkg.name, 'dsh-karpathy-guidelines')
assert.match(pkg.version, SEMVER)
assert.equal(pkg.type, 'module')
assert.equal(pkg.exports['.'], './index.js')
assert.equal(pkg.exports['./icon'], './icon.svg')
assert.equal(pkg.exports['./locale/*.json'], './locale/*.json')
assert.equal(pkg.dsh.manifestVersion, 1)
assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
assert.ok(text(pkg.engines.dsh), 'engines.dsh must declare a DSH range')

// Every runtime file must be covered by `files`, or npm publish would drop it.
const covered = (path) => pkg.files.some((entry) => path === entry || path.startsWith(`${entry}/`))
for (const path of ['index.js', 'cordis.patch.yml', 'skill/karpathy-guidelines.md', 'locale/en.json', 'locale/zh.json', 'icon.svg']) {
  assert.ok(covered(path), `files does not include ${path}`)
}

const patch = read('./cordis.patch.yml')
assert.match(patch, /id:\s*karpathy-guidelines/)
assert.ok(patch.includes(`name: '${pkg.name}'`), 'patch row must name the package')

const body = read('./skill/karpathy-guidelines.md')
assert.ok(!body.startsWith('---'), 'skill body must not carry YAML frontmatter')
for (const heading of ['Think Before Coding', 'Simplicity First', 'Surgical Changes', 'Goal-Driven Execution']) {
  assert.ok(body.includes(heading), `skill body is missing "${heading}"`)
}

for (const [language, locale] of [['en', json('./locale/en.json')], ['zh', json('./locale/zh.json')]]) {
  assert.ok(text(locale.meta?.title), `${language} meta.title is empty`)
  assert.ok(text(locale.meta?.description), `${language} meta.description is empty`)
  assert.equal(locale.meta.detail, undefined, `${language} must not declare meta.detail without docs/`)
  assert.ok(!/[<>]/.test(locale.meta.title + locale.meta.description), `${language} meta carries raw markup`)
}

const icon = read('./icon.svg')
assert.match(icon, /^<svg[\s>]/)
assert.match(icon, /viewBox="0 0 36 36"/)
for (const banned of ['<text', '<style', '<script', '<image', 'foreignObject']) {
  assert.ok(!icon.includes(banned), `icon.svg must not contain ${banned}`)
}
assert.ok(Buffer.byteLength(icon) < 256 * 1024, 'icon exceeds 256 KiB')

const index = json('./market/index.json')
assert.equal(index.format, 1)
assert.ok(text(index.title?.en), 'index title needs English')
const [plugin] = index.plugins
assert.ok(plugin, 'index lists no plugin')
assert.equal(plugin.name, pkg.name)
assert.ok(text(plugin.title?.en) && text(plugin.title?.zh), 'plugin title needs en and zh')
assert.equal(plugin.metadata.category in index.metadata.categories, true, 'plugin category is undeclared')
assert.equal(plugin.versions.length, 1)
const [entry] = plugin.versions
assert.equal(entry.version, pkg.version)
assert.ok(Number.isInteger(entry.publishTimestamp) && entry.publishTimestamp >= 0 && entry.publishTimestamp < 1e11)
assert.equal(entry.source.type, 'npm')
assert.equal(entry.engines.dsh, pkg.engines.dsh)

const dataUrl = plugin.icon
assert.ok(dataUrl.startsWith('data:image/svg+xml;base64,'), 'index icon must be an inline SVG data URL')
const embedded = Buffer.from(dataUrl.slice('data:image/svg+xml;base64,'.length), 'base64')
assert.equal(embedded.toString('utf8'), icon, 'index icon drifted from icon.svg')

console.log(`ok: ${pkg.name}@${pkg.version}, skill body ${body.length} bytes, market index consistent`)
