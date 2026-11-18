/**
 * DeepSeek Harness bundle that contributes the `karpathy-guidelines` skill.
 *
 * The body is read once at activation, so the plugin pulls in no DSH package
 * and needs no build step or dependency.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const SKILL_DIR = fileURLToPath(new URL('./skill/', import.meta.url))
const SKILL_BODY = fileURLToPath(new URL('./skill/karpathy-guidelines.md', import.meta.url))

export const name = 'karpathy-guidelines'
export const inject = ['skills']

const DESCRIPTION = 'Behavioral guidelines that reduce common LLM coding mistakes: think before coding, keep the solution simple, make surgical changes, and work against verifiable success criteria. Use when writing, reviewing, or refactoring code.'

export function apply(ctx) {
  ctx.effect(() => ctx.skills.register({
    name: 'karpathy-guidelines',
    description: DESCRIPTION,
    source: 'bundled',
    resourceBase: { kind: 'directory', path: SKILL_DIR },
    content: readFileSync(SKILL_BODY, 'utf8'),
  }))
}
