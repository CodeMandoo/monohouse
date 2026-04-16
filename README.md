# monohouse

Scaffold a project from bundled Monohouse templates.

## Usage

```bash
npx monohouse
```

Optional flags:

```bash
npx monohouse my-app --template classic
npx monohouse my-app --template modular --force
```

## Local development

Prepare bundled templates first:

```bash
pnpm --filter monohouse prepare:templates
```

Then run the CLI locally:

```bash
node monohouse/bin/monohouse.js
```

## Publish

Before publishing, make sure the npm package name `monohouse` is available:

```bash
npm view monohouse name
```

If the name is available, publish from the package directory:

```bash
cd monohouse
npm publish --access public
```

`prepack` will validate the bundled templates under `monohouse/templates` before publish.
