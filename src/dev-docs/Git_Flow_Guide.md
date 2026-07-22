# Git Flow Guide

A lightweight branching, release, and versioning workflow for the Testing Services Employee Portal. It is intentionally simpler than full corporate Git Flow: there is no permanent release branch, but changes still move through pull requests, the integration branch, semantic versions, tags, and a changelog.

This repository is the Vite/React frontend. It follows the same basic workflow as the Testing Services backend, but maintains its own version history and release tags.

---

## 1. Branch Structure

This repository currently uses the `dh/` prefix for working branches and for its integration branch. Keep that convention so new work matches the existing Git history.

| Branch | Purpose | Long-lived? |
|---|---|---|
| `main` | Production branch; should reflect the frontend currently deployed | Yes |
| `dh/dev` | Integration branch for changes intended for the next release | Yes |
| `dh/<short-description>` | Feature, non-urgent fix, refactor, or documentation work | No |
| `dh/hotfix-<short-description>` | Urgent production repair branched from `main` | No |

Examples: `dh/add-appointment-form`, `dh/fix-calendar-timezone`, and `dh/update-ui-docs`.

If more contributors join later, each person can use their own initials or username as the prefix. The important rule is that normal work starts from `dh/dev`, while emergency production fixes start from `main`.

### Normal feature or fix flow

1. Update the integration branch and create a focused branch:

   ```bash
   git switch dh/dev
   git pull --ff-only origin dh/dev
   git switch -c dh/short-description
   ```

2. Make the change and commit in small, logical chunks.
3. Before opening the pull request, synchronize with the latest integration branch and resolve conflicts on the working branch:

   ```bash
   git fetch origin
   git merge origin/dh/dev
   npm run lint
   npm run build
   ```

4. Push the branch and open a pull request targeting `dh/dev`:

   ```bash
   git push -u origin dh/short-description
   ```

5. Review the diff and checks, merge the pull request, then delete the working branch.

A pull request is useful even for a solo project: it provides a final diff review, preserves the reason for the change, and gives automated checks a natural place to run.

### Hotfix flow

An urgent production issue starts from `main`, because `dh/dev` may contain changes that are not ready to deploy.

1. Create the hotfix from the current production branch:

   ```bash
   git switch main
   git pull --ff-only origin main
   git switch -c dh/hotfix-short-description
   ```

2. Fix and test the issue, then open a pull request to `main`.
3. Release it as a patch version and deploy it.
4. Immediately merge the updated `main` back into `dh/dev` (preferably with a second pull request) so the fix is not lost in the next normal release.

---

## 2. Commit and Pull Request Conventions

Use a short imperative subject, optionally prefixed with a conventional type:

```text
feat: add appointment availability view
fix: preserve the selected date across calendar navigation
security: clear client session after an authorization failure
refactor: extract shared form-field component
test: cover registration validation states
docs: document the static-site release process
chore: update Vite dependencies
```

Keep a branch and pull request focused on one coherent change. In the pull request description, record:

- what changed and why;
- how it was tested;
- visible UI, routing, accessibility, or browser-behavior changes;
- API contract assumptions (routes, request/response shapes, status codes, or authorization);
- new or changed `VITE_*` environment variables;
- the related backend pull request or minimum backend version, when applicable;
- security or deployment considerations.

Do not commit `.env`, credentials, access tokens, production data, or local mock-data files containing sensitive data.

---

## 3. Frontend Change Checklist

Before merging frontend work into `dh/dev`:

- Run `npm run lint` and `npm run build`.
- This repository does not currently define an automated test script. Until one is added, manually exercise the affected workflows and record those checks in the pull request.
- Check affected pages at relevant viewport sizes and verify loading, empty, error, and success states.
- Check keyboard navigation, focus behavior, form labels, and useful text alternatives when the change affects interactive UI.
- Exercise authentication, authorization, client-side validation, and expired-session behavior when applicable.
- If `package.json` changed, commit the corresponding `package-lock.json` change.
- If configuration changed, document the required `VITE_*` variables with safe example values. Remember that Vite embeds these values into the client bundle, so they must never contain secrets.
- If API usage changed, coordinate the backend update and handle expected error responses without exposing sensitive details.
- Review changes to authentication storage, protected routes, external links, rendered user content, and the Content Security Policy in `render.yaml` for security impact.

### API compatibility and mock data

The frontend and backend may deploy separately, so avoid assuming a new API contract is already live.

- Confirm new fields and endpoints against the backend contract and note the minimum compatible backend version in the pull request and changelog.
- Prefer UI changes that tolerate an overlap between old and new backend versions when practical.
- Keep JSON Server fixtures free of real personal or production data. Update mock data only when it remains useful for the workflow being developed.
- Verify requests against the real backend before release; JSON Server cannot reproduce authentication, authorization, validation, or every response shape.

---

## 4. Version Numbering

Use Semantic Versioning: `MAJOR.MINOR.PATCH`, with release tags prefixed by `v` (for example, `v1.4.2`).

| Bump | Use when | Example |
|---|---|---|
| **MAJOR** | An intentionally incompatible user workflow, browser-support policy, deployment contract, or required backend contract change | `1.4.2` → `2.0.0` |
| **MINOR** | Backward-compatible user-facing functionality is added | `1.4.2` → `1.5.0` |
| **PATCH** | A backward-compatible UI, accessibility, security, or integration fix is released | `1.4.2` → `1.4.3` |

While the portal is still in initial development, `0.y.z` versions may be used. Treat user workflows and backend compatibility deliberately even if the package is still below `1.0.0`.

Keep the released version consistent in `package.json`, `package-lock.json`, the changelog heading, and the Git tag. Do not change the version for every development commit; change it as part of preparing a release.

---

## 5. Changelog Practice

Keep `CHANGELOG.md` at the repository root. Add user-, integrator-, or operator-visible changes to `[Unreleased]` as the work is merged into `dh/dev`. Useful headings are `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, and `Security`.

Avoid copying commit messages verbatim. Changelog entries should explain the effect of a change. Internal refactors generally do not need an entry unless they affect operation, performance, security, or future compatibility.

At release time, rename the accumulated `[Unreleased]` content to `[x.y.z] - YYYY-MM-DD` and create a fresh empty `[Unreleased]` section above it. Dates use ISO format.

---

## 6. Release Flow (`dh/dev` to `main`)

1. Confirm every intended change is merged into `dh/dev`; defer incomplete work rather than releasing it accidentally.
2. Choose the Semantic Versioning bump and update `package.json` plus `package-lock.json`. A convenient command is:

   ```bash
   npm version 1.4.0 --no-git-tag-version
   ```

3. Finalize `CHANGELOG.md` with the same version and the release date.
4. From a clean checkout of `dh/dev`, run the release checks:

   ```bash
   npm ci
   npm run lint
   npm run build
   npm run preview
   ```

   Use the preview server to smoke-test routing, authentication, the changed workflows, and a direct visit or refresh on a nested route.

5. Review required `VITE_*` production environment changes, `render.yaml` changes, and any coordinated backend release. Confirm the production API URL is correct before building because Vite embeds it at build time.
6. Open and merge a pull request from `dh/dev` into `main`.
7. Tag the exact merge commit on `main` and push the tag:

   ```bash
   git switch main
   git pull --ff-only origin main
   git tag -a v1.4.0 -m "Release v1.4.0"
   git push origin v1.4.0
   ```

8. Deploy the static site from `main`. Verify the deployed asset load, direct navigation and refresh on a nested route, login/logout, one representative authenticated workflow, and browser console/network errors.
9. Record any deployment-only operational notes. If deployment fails, preserve the evidence and redeploy the last known-good frontend version or make a new corrective release.

Never move or reuse a published version tag. If a released defect needs correction, make a new patch release.

---

## 7. Coordinating the Frontend and Backend Repositories

The repositories release independently:

- Each has its own `main`, integration branch, working branches, changelog, version number, and tags.
- Their version numbers do not need to match.
- A cross-repository feature should link the paired pull request in both descriptions and mention the required counterpart in both changelogs.
- State compatibility explicitly, for example: “Requires backend `v1.5.0` or later” or “Compatible with backend `v1.4.x`.”
- For coordinated contract changes, deploy in an order that keeps the system usable. Usually the backend first adds a backward-compatible contract, the frontend adopts it, and a later backend release removes the old contract.

---

## 8. Optional Release Branches

If `dh/dev` needs to keep accepting features while a release candidate is being tested, create `release/x.y.z` from `dh/dev`. Only stabilization fixes and release documentation go into that branch. Merge the finished release branch into `main`, tag it, and merge its fixes back into `dh/dev`.

At the current project scale, this is optional overhead. Add it only when release testing regularly overlaps development of the next version.
