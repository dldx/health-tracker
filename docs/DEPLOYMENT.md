# Deployment Guide

This guide covers deploying the Health Tracker app to GitHub Pages.

## GitHub Pages Deployment

### Prerequisites

- A GitHub repository with the project code
- GitHub Actions enabled in your repository
- Proper permissions to configure GitHub Pages

### Initial Setup

#### 1. Configure Repository Settings

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - **Branch**: The workflow will deploy from the `main` branch

#### 2. Configure Base Path (if needed)

The app is configured to work for both scenarios:

**Option A: User/Organization site** (e.g., `username.github.io`)
- No configuration needed
- The app will be deployed at the root domain

**Option B: Project site** (e.g., `username.github.io/health-tracker`)
- Open `svelte.config.js`
- Uncomment and configure the `paths.base` setting:

```javascript
kit: {
  adapter: adapter({
    pages: 'build',
    assets: 'build',
    fallback: '404.html',
    precompress: false,
    strict: true
  }),
  paths: {
    base: process.env.NODE_ENV === 'production' ? '/health-tracker' : '',
  }
}
```

Replace `/health-tracker` with your repository name.

### Deployment Process

#### Automatic Deployment

The app will automatically deploy when you push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Actions workflow will:
1. Install dependencies using Bun
2. Build the static site
3. Deploy to GitHub Pages

#### Manual Deployment

You can also trigger a deployment manually:

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Select the "Deploy to GitHub Pages" workflow
4. Click **Run workflow**
5. Select the branch and click **Run workflow**

### Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) includes:

- **Build Job**: Installs dependencies, builds the app, and uploads artifacts
- **Deploy Job**: Deploys the built artifacts to GitHub Pages

The workflow uses:
- `bun` for fast dependency installation and building
- GitHub Pages Actions for deployment

### Verification

After deployment completes:

1. Check the Actions tab for the workflow status
2. Visit your GitHub Pages URL:
   - User site: `https://username.github.io`
   - Project site: `https://username.github.io/repository-name`

### Troubleshooting

#### Build Failures

If the build fails:

1. Check the Actions log for error messages
2. Ensure all dependencies are properly listed in `package.json`
3. Test the build locally:
   ```bash
   bun run build
   ```

#### 404 Errors

If you get 404 errors:

1. Verify the `paths.base` configuration in `svelte.config.js` matches your repository name
2. Ensure GitHub Pages is configured to use GitHub Actions as the source
3. Check that the `.nojekyll` file exists in the `static` folder

#### Asset Loading Issues

If CSS/JS files don't load:

1. Check browser console for CORS or path errors
2. Verify the `paths.base` setting is correct
3. Clear browser cache and try again

### Environment Variables

If your app requires environment variables:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add your secrets
3. Update `.github/workflows/deploy.yml` to pass them to the build:

```yaml
- name: Build
  env:
    PUBLIC_API_URL: ${{ secrets.PUBLIC_API_URL }}
  run: bun run build
```

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `static` folder with your domain:
   ```
   yourdomain.com
   ```
2. Configure DNS with your domain provider:
   - Add an A record pointing to GitHub's IPs
   - Or add a CNAME record pointing to `username.github.io`
3. In GitHub repository settings:
   - Go to **Settings** → **Pages**
   - Enter your custom domain
   - Enable "Enforce HTTPS"

### Local Testing

To test the production build locally:

```bash
# Build the app
bun run build

# Preview the build
bun run preview
```

This helps catch any issues before deploying.

### PWA Considerations

The app includes PWA features (service worker, manifest):

- The service worker is automatically included in the static build
- Users can install the app on their devices
- The app works offline after the first visit
- Updates are managed by the service worker

### Continuous Deployment

The workflow is configured for continuous deployment:

- Every push to `main` triggers a deployment
- The deployment is atomic (all files update together)
- Previous deployments are preserved in GitHub's history

### Security

The workflow uses:
- Minimal permissions (contents: read, pages: write, id-token: write)
- Locked dependencies (`--frozen-lockfile`)
- Official GitHub Actions

### Monitoring

Monitor your deployments:

1. **Actions Tab**: View build and deployment logs
2. **Deployments Section**: See deployment history
3. **Pages Settings**: Check deployment status

### Rollback

To rollback to a previous version:

1. Find the commit you want to rollback to
2. Either:
   - Revert the commit: `git revert <commit-hash>`
   - Or reset to the commit: `git reset --hard <commit-hash>`
3. Push to trigger a new deployment:
   ```bash
   git push origin main
   # or if you used reset:
   git push --force origin main
   ```

## Other Deployment Options

While this guide focuses on GitHub Pages, the app can also be deployed to:

- **Vercel**: Import the repository directly
- **Netlify**: Connect the repository and build
- **Cloudflare Pages**: Connect repository with GitHub integration
- **Firebase Hosting**: Build locally and deploy with Firebase CLI

For these platforms, the static adapter configuration will work as-is.

## Build Configuration

The app is built with:

- **Adapter**: `@sveltejs/adapter-static` for static site generation
- **Fallback**: `404.html` for client-side routing
- **Assets**: All assets are bundled in the `build` folder
- **Precompress**: Disabled (let the hosting provider handle compression)

## Performance

After deployment:

- Use Lighthouse to check performance scores
- Enable HTTPS (automatic with GitHub Pages)
- Consider enabling Cloudflare for additional caching

## Support

For issues with:
- **Build process**: Check SvelteKit documentation
- **GitHub Actions**: Check workflow logs
- **GitHub Pages**: Check GitHub Pages documentation

