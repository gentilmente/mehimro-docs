# Mehmiro Documentation Hub

A comprehensive Docusaurus-based documentation portal for Mehmiro, the AI-powered educational assessment platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.0 or higher
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📚 Documentation

This portal contains:

- **Foundations**: Core principles, vocabulary, and project context
- **Architecture**: System blueprints, data modeling, and non-functional requirements
- **Standards**: Engineering guidelines for consistent delivery
- **Processes**: Operational playbooks and feature lifecycle definitions
- **Features**: Detailed feature specifications with BDD scenarios

## 🌐 GitHub Pages Deployment

### Automatic Deployment

This repository is configured for automatic deployment to GitHub Pages using GitHub Actions.

**Deployment Steps:**

1. **Enable GitHub Pages:**
   - Go to your repository settings: `https://github.com/gentilmente/mehimro-docs/settings/pages`
   - Under "Source", select "GitHub Actions"
   - Save the settings

2. **Trigger Deployment:**
   - The workflow runs automatically on pushes to the `main` branch
   - You can also trigger manually from the Actions tab
   - Visit the workflow: `https://github.com/gentilmente/mehimro-docs/actions/workflows/deploy.yml`

3. **Access Your Site:**
   - Your documentation will be available at: `https://gentilmente.github.io/mehimro-docs/`
   - Build process takes 2-5 minutes
   - Check the Actions tab for deployment status

### Manual Deployment

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Workflow Configuration

The deployment workflow (`.github/workflows/deploy.yml`):
- Automatically builds and deploys on push to `main`
- Uses Node.js 20
- Configures GitHub Pages with latest Actions
- Uploads build artifacts and deploys to Pages

## 🔧 Configuration

### Repository Settings

Update `docusaurus.config.ts` for:
- Organization name
- Project name  
- Base URL
- GitHub repository links

### Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `static/` directory
2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings in repository settings

## 📁 Project Structure

```
mehimro-docs/
├── .github/workflows/     # GitHub Actions
├── blog/                  # Blog posts
├── docs/                  # Documentation
│   ├── architecture/      # System architecture
│   ├── features/          # Feature specifications
│   ├── foundations/       # Core principles
│   ├── processes/         # Operational procedures
│   └── standards/         # Engineering standards
├── src/pages/            # React pages
├── static/               # Static assets
├── docusaurus.config.ts  # Docusaurus configuration
└── sidebars.ts          # Navigation sidebar
```

## 🤝 Contributing

1. Update documentation alongside code changes
2. Use provided templates for new content
3. Validate links before submitting pull requests
4. Run `npm run build` to test locally

## 📝 License

Built with ❤️ for educators using Docusaurus 3.9.

---

**Repository**: https://github.com/gentilmente/mehimro-docs
**Live Site**: https://docs.mehmiro.com (custom domain)
