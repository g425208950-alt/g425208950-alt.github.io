## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project conventions

### Never hardcode root-relative URLs

This site is deployed to GitHub Pages. For a *project* site the whole site lives
under a sub-path (`base = "/<repo-name>"`), so a hardcoded `href="/about"` or
`src="/favicon.svg"` will 404 in production even though it works in `npm run dev`.

Always build internal URLs with the helpers in `src/utils/url.ts`:

```astro
import { basePath, withBase } from '../utils/url';

<a href={withBase('blog/my-post/')}>…</a>   <!-- → /<base>/blog/my-post/ -->
<a href={basePath}>…</a>                    <!-- → /<base>/ -->
```

`import.meta.env.BASE_URL` is **not** guaranteed to end with a slash, so never
concatenate it directly (`${import.meta.env.BASE_URL}favicon.svg` breaks).

`site` and `base` are derived automatically from `GITHUB_REPOSITORY` in
`astro.config.mjs`; override with the `SITE_URL` / `BASE_PATH` env vars.

### Verifying a change

Always build once with a sub-path base before committing — this is what catches
base-path regressions that the dev server hides:

```bash
SITE_URL=https://example.github.io BASE_PATH=/blog npm run build
grep -o 'href="/[^"]*"' dist/index.html | sort -u
```

### Writing posts

Posts live in `src/content/blog/<slug>.md`; the filename becomes the URL slug.
Required frontmatter: `title`, `description`, `pubDate`. See `src/content.config.ts`.

### Windows / filesystem constraints

This repo lives on a Windows drive (`/mnt/d`, a 9p mount) and is also used through
Windows git (PowerShell / Git Bash). Two rules follow from that:

- **Never create symlinks in the repo.** Symlinks on the 9p mount are half-broken;
  Windows git fails to read them with `error: open("x"): Function not implemented`,
  which aborts `git add` entirely. To share content between files, use a real file
  plus an `@path` import — that is why `CLAUDE.md` contains `@AGENTS.md` instead of
  being a symlink. Check with `find . -type l -not -path "./node_modules/*"`.
- **Keep line endings LF.** `.gitattributes` pins `* text=auto eol=lf`; do not
  remove it. If a whole-file diff ever appears, run `git add --renormalize .`.
  Never write CRLF into a text file.

Note that `git status` can report a clean tree even when a file is unreadable,
because it short-circuits on cached stat data. Run `git add -A` (or a build)
before trusting that a checkout is healthy.
