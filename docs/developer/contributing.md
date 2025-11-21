---
id: contributing-to-mehmiro
title: Contributing to Mehmiro
sidebar_label: Contributing Guidelines
description: Complete guide for developers to contribute to the Mehmiro project
---

# Contributing to Mehmiro

Thank you for your interest in contributing to Mehmiro! This guide will help you get started with contributing to our open-source educational technology platform.

## Getting Started

### Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

### Ways to Contribute

#### 🐛 **Bug Reports**
- Search existing issues before creating new ones
- Use the bug report template
- Include steps to reproduce and expected behavior

#### ✨ **Feature Requests**
- Check if the feature already exists
- Use the feature request template
- Explain the educational benefit and use case

#### 📖 **Documentation**
- Improve existing documentation
- Add tutorials and guides
- Translate content to other languages

#### 💻 **Code Contributions**
- Bug fixes and feature implementations
- Performance improvements
- UI/UX enhancements

## Development Setup

### Prerequisites
- Node.js 18+ and npm 9+
- Git and GitHub account
- Docker and Docker Compose
- PostgreSQL 14+ (or Docker container)

### Environment Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mehmiro.git
   cd mehmiro
   git remote add upstream https://github.com/gentilmente/mehmiro.git
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   docker-compose up -d postgres
   npm run db:migrate
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Development Workflow

#### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Critical production fixes
- `docs/documentation-update` - Documentation changes

#### Commit Message Format
```
type(scope): description

Longer description if needed

Fixes #issue-number
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## Code Standards

### JavaScript/TypeScript Standards
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Maximum function length: 50 lines
- Maximum file length: 300 lines
- Use meaningful variable and function names

### Testing Requirements
- Minimum 90% code coverage
- All new features must include tests
- Use Jest for unit tests
- Use Cypress for end-to-end tests
- Run tests before submitting PR

### Security Guidelines
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow OWASP security guidelines
- Implement proper input validation
- Use parameterized queries to prevent SQL injection

### Accessibility Standards
- WCAG 2.1 AA compliance required
- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide alt text for images
- Use proper ARIA labels

## Pull Request Process

### Before Submitting
1. **Update Documentation**: Keep docs up to date
2. **Run Tests**: Ensure all tests pass locally
3. **Code Review**: Have someone else review your code
4. **Update Changelog**: Add entry to CHANGELOG.md

### PR Requirements
- **Descriptive Title**: Clear and concise
- **Detailed Description**: Explain what and why
- **Screenshots/Videos**: For UI changes
- **Test Coverage**: Include test results
- **Breaking Changes**: Clearly document any breaking changes

### Review Process
1. **Automated Checks**: All CI/CD checks must pass
2. **Code Review**: At least 2 approvals required
3. **Testing**: QA team testing for major features
4. **Security Review**: For security-sensitive changes

## Architecture Guidelines

### Project Structure
```
mehmiro/
├── apps/                  # Applications
│   ├── web/              # Frontend React app
│   ├── api/              # Backend API
│   └── mobile/           # React Native app
├── packages/             # Shared packages
│   ├── ui/               # UI component library
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript definitions
├── docs/                 # Documentation
└── tools/                # Development tools
```

### Design Principles
1. **Privacy-First**: Student data protection is paramount
2. **Scalability**: Design for millions of users
3. **Accessibility**: Inclusive by design
4. **Performance**: Sub-second response times
5. **Maintainability**: Clean, well-documented code

### API Guidelines
- RESTful API design principles
- GraphQL for complex data queries
- Proper HTTP status codes
- Comprehensive error handling
- API versioning strategy

## Issue Guidelines

### Bug Reports
Use the bug report template and include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages
- Environment details

### Feature Requests
Use the feature request template and include:
- Clear description of the feature
- Educational use case
- Proposed implementation approach
- Alternative solutions considered

## Communication

### Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time development chat
- **Email**: Official announcements

### Response Times
- **Bug Reports**: Initial response within 48 hours
- **Feature Requests**: Initial response within 1 week
- **Security Issues**: Immediate response (24/7)

## Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Schedule
- **Patch Releases**: As needed for critical bugs
- **Minor Releases**: Monthly
- **Major Releases**: Quarterly

## Recognition

### Contributors
- All contributors listed in README.md
- Contributor wall of fame
- Annual contributor appreciation event

### Contribution Levels
- **🥉 Bronze**: 5+ contributions
- **🥈 Silver**: 20+ contributions  
- **🥇 Gold**: 50+ contributions
- **💎 Diamond**: 100+ contributions

## Getting Help

### New Contributors
- Start with "good first issue" labels
- Join our Discord for questions
- Attend weekly development sync meetings
- Read through existing documentation

### Experienced Contributors
- Mentor new contributors
- Review pull requests
- Propose new features
- Help with documentation

---

## Thank You!

Every contribution, no matter how small, helps make Mehmiro better for educators and students worldwide. We appreciate your time and effort in helping improve educational technology.

**Questions?** Join our [Discord server](https://discord.gg/mehmiro) or open a GitHub Discussion.

**Ready to contribute?** Browse our [Good First Issues](https://github.com/gentilmente/mehmiro/labels/good%20first%20issue) to get started!