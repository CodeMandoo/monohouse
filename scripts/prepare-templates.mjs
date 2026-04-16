import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')
const templatesRoot = path.join(packageRoot, 'templates')
const requiredTemplates = ['classic', 'modular']

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

async function main() {
  await ensureDirectory(templatesRoot)

  for (const templateName of requiredTemplates) {
    await validateTemplate(templateName)
  }

  process.stdout.write(`Templates are ready in ${templatesRoot}\n`)
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exit(1)
})
