#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageRoot = path.resolve(__dirname, '..')
const templatesRoot = path.join(packageRoot, 'templates')

function parseArgs(argv) {
  const result = {
    projectName: '',
    template: '',
    force: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]

    if (!current.startsWith('-') && !result.projectName) {
      result.projectName = current
      continue
    }

    if (current === '--template' || current === '-t') {
      result.template = argv[index + 1] ?? ''
      index += 1
      continue
    }

    if (current === '--force' || current === '-f') {
      result.force = true
    }
  }

  return result
}

async function readTemplateDirs() {
  try {
    const entries = await fs.readdir(templatesRoot, { withFileTypes: true })
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort()
  } catch {
    return []
  }
}

async function exists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isDirectoryEmpty(targetPath) {
  const entries = await fs.readdir(targetPath)
  return entries.length === 0
}

async function ensureTemplateAvailable(templateName) {
  const templatePath = path.join(templatesRoot, templateName)

  if (!(await exists(templatePath))) {
    throw new Error(`Template "${templateName}" is not available.`)
  }

  return templatePath
}

function printHeader() {
  process.stdout.write('\nmonohouse\n')
  process.stdout.write('Create a project from an official template.\n\n')
}

function printUsage() {
  process.stdout.write('Usage: npx monohouse [project-name] [--template classic] [--force]\n')
}

async function selectTemplate(rl, templates, initialValue) {
  if (initialValue) {
    if (!templates.includes(initialValue)) {
      throw new Error(
        `Unknown template "${initialValue}". Available templates: ${templates.join(', ')}`,
      )
    }

    return initialValue
  }

  process.stdout.write('Available templates:\n')
  templates.forEach((templateName, index) => {
    process.stdout.write(`  ${index + 1}. ${templateName}\n`)
  })

  while (true) {
    const answer = (await rl.question('\nSelect a template by number: ')).trim()
    const selectedIndex = Number.parseInt(answer, 10)

    if (Number.isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > templates.length) {
      process.stdout.write('Please enter a valid number.\n')
      continue
    }

    return templates[selectedIndex - 1]
  }
}

async function askProjectName(rl, initialValue) {
  if (initialValue) {
    return initialValue.trim()
  }

  while (true) {
    const answer = (await rl.question('Project name: ')).trim()

    if (!answer) {
      process.stdout.write('Project name is required.\n')
      continue
    }

    return answer
  }
}

async function confirmOverwrite(rl, targetDir) {
  while (true) {
    const answer = (await rl.question(`Target "${path.basename(targetDir)}" exists. Overwrite? (y/N): `))
      .trim()
      .toLowerCase()

    if (answer === 'y' || answer === 'yes') {
      return true
    }

    if (answer === '' || answer === 'n' || answer === 'no') {
      return false
    }
  }
}

async function removeGeneratedArtifacts(targetDir) {
  const removableEntries = [
    'node_modules',
    '.turbo',
    'dist',
    'web-dev.err.log',
    'web-dev.out.log',
    'pnpm-lock.yaml',
  ]

  await Promise.all(
    removableEntries.map((entry) =>
      fs.rm(path.join(targetDir, entry), { recursive: true, force: true }),
    ),
  )
}

async function rewritePackageName(targetDir, projectName) {
  const packageJsonPath = path.join(targetDir, 'package.json')

  if (!(await exists(packageJsonPath))) {
    return
  }

  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
  packageJson.name = projectName
  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
}

async function scaffoldProject({ templateName, projectName, force }) {
  const templateDir = await ensureTemplateAvailable(templateName)
  const targetDir = path.resolve(process.cwd(), projectName)
  const targetExists = await exists(targetDir)

  if (targetExists) {
    const empty = await isDirectoryEmpty(targetDir)

    if (!empty && !force) {
      return { status: 'needs_confirm', targetDir, templateDir }
    }
  }

  if (force) {
    await fs.rm(targetDir, { recursive: true, force: true })
  }

  await fs.mkdir(path.dirname(targetDir), { recursive: true })
  await fs.cp(templateDir, targetDir, { recursive: true })
  await removeGeneratedArtifacts(targetDir)
  await rewritePackageName(targetDir, projectName)

  return { status: 'created', targetDir }
}

async function main() {
  printHeader()

  const templates = await readTemplateDirs()
  if (templates.length === 0) {
    process.stderr.write(
      'No packaged templates found. Run "pnpm --filter monohouse prepare:templates" before publishing.\n',
    )
    process.exit(1)
  }

  const args = parseArgs(process.argv.slice(2))
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  try {
    const templateName = await selectTemplate(rl, templates, args.template)
    const projectName = await askProjectName(rl, args.projectName)

    let result = await scaffoldProject({
      templateName,
      projectName,
      force: args.force,
    })

    if (result.status === 'needs_confirm') {
      const confirmed = await confirmOverwrite(rl, result.targetDir)
      if (!confirmed) {
        process.stdout.write('Canceled.\n')
        return
      }

      result = await scaffoldProject({
        templateName,
        projectName,
        force: true,
      })
    }

    process.stdout.write('\nDone.\n')
    process.stdout.write(`Template: ${templateName}\n`)
    process.stdout.write(`Project:  ${projectName}\n`)
    process.stdout.write(`Path:     ${result.targetDir}\n\n`)
    process.stdout.write('Next steps:\n')
    process.stdout.write(`  cd ${projectName}\n`)
    process.stdout.write('  pnpm install\n')
    process.stdout.write('  pnpm dev\n')
  } finally {
    rl.close()
  }
}

main().catch((error) => {
  process.stderr.write(`\n${error.message}\n`)
  printUsage()
  process.exit(1)
})
