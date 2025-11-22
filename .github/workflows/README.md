# GitHub Actions Workflows

This directory contains GitHub Actions workflows for CI/CD.

## Workflows

### `ci.yml` - Main CI Pipeline
Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
1. **Test & Lint** - Runs on Node.js 20.x and 22.x
   - Installs dependencies
   - Runs ESLint
   - Type checks TypeScript
   - Runs Jest tests with coverage
   - Uploads coverage to Codecov (on Node 20.x only)

2. **Build** - Runs after tests pass
   - Builds the Next.js application
   - Verifies build artifacts

### `codeql.yml` - Security Analysis
Runs CodeQL security analysis on:
- Every push to `main` and `develop`
- Every pull request
- Weekly schedule (Sundays)

## Required Secrets

For the build job to work properly, you may want to add these secrets in GitHub Settings > Secrets and variables > Actions:

- `MONGODB_URI` - MongoDB connection string (optional, uses test default if not set)
- `NEXTAUTH_SECRET` - NextAuth secret (optional, uses test default if not set)
- `NEXTAUTH_URL` - NextAuth URL (optional, uses test default if not set)

**Note:** These are only needed if your build process requires them. The workflow uses test defaults if secrets are not set.

## Coverage Reports

Coverage reports are uploaded to Codecov. To enable this:
1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. The workflow will automatically upload coverage reports

## Status Badges

Add these badges to your README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CodeQL%20Analysis/badge.svg)
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name.

