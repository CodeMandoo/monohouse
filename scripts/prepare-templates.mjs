import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')
const templatesRoot = path.join(packageRoot, 'templates')
const requiredTemplates = ['classic', 'modular']
const removableNames = new Set([
  'node_modules',
  '.turbo',
  'dist',
  '.eslintcache',
  'pnpm-lock.yaml',
  'web-dev.err.log',
  'web-dev.out.log',
])

function shouldRemoveEntry(entryName) {
  return removableNames.has(entryName) || entryName.endsWith('.tsbuildinfo')
}

async function ensureDirectory(targetPath) {
  const stat = await fs.stat(targetPath).catch(() => null)

  if (!stat?.isDirectory()) {
    throw new Error(`Required directory is missing: ${targetPath}`)
  }
}

async function ensureFile(targetPath) {
  const stat = await fs.stat(targetPath).catch(() => null)

  if (!stat?.isFile()) {
    throw new Error(`Required file is missing: ${targetPath}`)
  }
}

async function validateTemplate(templateName) {
  const templateRoot = path.join(templatesRoot, templateName)
  await ensureDirectory(templateRoot)
  await ensureDirectory(path.join(templateRoot, 'apps'))
  await ensureDirectory(path.join(templateRoot, 'packages'))
  await ensureFile(path.join(templateRoot, 'package.json'))
  await ensureFile(path.join(templateRoot, 'pnpm-workspace.yaml'))
  await ensureFile(path.join(templateRoot, 'turbo.json'))
}

async function removeGeneratedArtifacts(targetPath) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(targetPath, entry.name)

      if (shouldRemoveEntry(entry.name)) {
        await fs.rm(entryPath, { recursive: true, force: true })
        return
      }

      if (entry.isDirectory()) {
        await removeGeneratedArtifacts(entryPath)
      }
    }),
  )
}

async function main() {
  await ensureDirectory(templatesRoot)

  for (const templateName of requiredTemplates) {
    await removeGeneratedArtifacts(path.join(templatesRoot, templateName))
    await validateTemplate(templateName)
  }

  process.stdout.write(`Templates are ready in ${templatesRoot}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exit(1)
})
