# Deployment Guide

## GitHub Actions CI/CD Setup

### What's Included

1. **Main CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push/PR to `main` and `develop` branches
   - Tests on Node.js 20.x and 22.x
   - Runs linting, type checking, tests, and build verification

2. **Security Analysis** (`.github/workflows/codeql.yml`)
   - Automated security scanning
   - Runs on push/PR and weekly schedule

### Quick Start

1. **Push to GitHub** - The workflows will run automatically
2. **Check Status** - View results in the "Actions" tab on GitHub
3. **Fix Issues** - Any failures will block merging (if branch protection is enabled)

### Workflow Steps

#### Test & Lint Job
- ✅ Checkout code
- ✅ Setup Node.js (20.x, 22.x)
- ✅ Install dependencies (cached)
- ✅ Run ESLint
- ✅ Type check TypeScript
- ✅ Run Jest tests with coverage
- ✅ Upload coverage to Codecov

#### Build Job
- ✅ Build Next.js application
- ✅ Verify build artifacts

### Environment Variables

The build job uses these environment variables (with test defaults):
- `MONGODB_URI` - Optional, defaults to test value
- `NEXTAUTH_SECRET` - Optional, defaults to test value
- `NEXTAUTH_URL` - Optional, defaults to test value

To use real values, add them as GitHub Secrets:
1. Go to Repository Settings > Secrets and variables > Actions
2. Add New repository secret
3. Add the secret values

### Coverage Reports

Coverage is uploaded to Codecov. To enable:
1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Reports will upload automatically

### Branch Protection (Recommended)

Enable branch protection to require CI checks:
1. Go to Settings > Branches
2. Add rule for `main` branch
3. Enable "Require status checks to pass before merging"
4. Select "Test & Lint" and "Build" jobs

### Troubleshooting

**TypeScript Errors:**
- Fix any TypeScript errors before merging
- Run `yarn type-check` locally to catch issues

**Build Failures:**
- Check build logs in Actions tab
- Ensure all environment variables are set if needed
- Verify Next.js build works locally with `yarn build`

**Test Failures:**
- Run `yarn test` locally to reproduce
- Check coverage thresholds if tests are failing

### Next Steps

1. **Fix TypeScript Errors** - There are some pre-existing TS errors in test files
2. **Enable Codecov** - Sign up and connect your repo
3. **Set Up Branch Protection** - Require CI checks before merging
4. **Add Status Badges** - Add CI badges to your README

### Status Badges

Add to your README.md:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/codeql.yml/badge.svg)
```

