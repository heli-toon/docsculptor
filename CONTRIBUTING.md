# Contributing to DocSculptor 🤝

We love your input! We want to make contributing to DocSculptor as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A modern code editor (VS Code recommended)

### First-time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/docsculptor.git
   cd docsculptor
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/heli-toon/docsculptor.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🛠️ Development Setup

### Project Structure

```
docsculptor/
├── src/
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation files
├── tests/                  # Test files (when added)
└── package.json           # Project dependencies
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Recommended VS Code Extensions

- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **ESLint**
- **Auto Rename Tag**

## 🎯 How to Contribute

### Types of Contributions

We welcome several types of contributions:

1. **🐛 Bug Reports** - Found something broken? Let us know!
2. **💡 Feature Requests** - Have an idea? We'd love to hear it!
3. **🔧 Code Contributions** - Ready to write some code?
4. **📚 Documentation** - Help make our docs better
5. **🎨 Design** - Improve the user interface and experience
6. **🧪 Testing** - Help us test new features and find bugs

### Areas That Need Help

Check our [ideas.txt](ideas.txt) file for planned features, or look for issues labeled:

- `good first issue` - Perfect for newcomers
- `help wanted` - We need community help
- `enhancement` - New features to implement
- `bug` - Issues that need fixing
- `documentation` - Docs that need improvement

## 📝 Pull Request Process

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Create an issue** if one doesn't exist for your contribution
3. **Comment on the issue** to let others know you're working on it
4. **Keep your fork updated** with the latest upstream changes

### Making Changes

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add math equation support with KaTeX
   
   - Add KaTeX integration for math rendering
   - Support both inline and block math expressions
   - Update preview component to handle math
   - Add math equation examples to documentation"
   ```

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or correcting tests
- `chore:` - Changes to build process or auxiliary tools

### Submitting Your Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - **Clear title** describing the change
   - **Detailed description** of what you changed and why
   - **Screenshots** if the change affects the UI
   - **References to related issues** using `#issue-number`

3. **Address review feedback** promptly and respectfully

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Related Issues
Fixes #(issue number)
```

## 🐛 Issue Guidelines

### Reporting Bugs

When reporting bugs, please include:

1. **Clear, descriptive title**
2. **Steps to reproduce** the bug
3. **Expected behavior**
4. **Actual behavior**
5. **Environment details** (browser, OS, file type)
6. **Screenshots or screen recordings** if applicable
7. **Console errors** if any

### Feature Requests

For feature requests, please include:

1. **Clear description** of the proposed feature
2. **Use case** - why would this be useful?
3. **Proposed solution** - how should it work?
4. **Alternatives considered** - other approaches you've thought of
5. **Additional context** - mockups, examples, etc.

## 💻 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define proper types** - avoid `any` when possible
- **Use interfaces** for object shapes
- **Export types** from `src/types/index.ts`
- **Add JSDoc comments** for complex functions

### React Guidelines

- **Use functional components** with hooks
- **Use TypeScript interfaces** for component props
- **Keep components focused** - single responsibility
- **Use meaningful names** for components and variables
- **Implement proper error boundaries** where needed

### Code Style

- **Use Prettier** for code formatting
- **Follow ESLint rules** - run `npm run lint`
- **Use 2-space indentation**
- **Use single quotes** for strings
- **Add trailing commas** in multiline structures
- **Keep lines under 100 characters** when practical

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `FileUpload.tsx`)
- **Hooks**: `camelCase.ts` starting with `use` (e.g., `useMarkdown.ts`)
- **Types**: `camelCase.ts` (e.g., `index.ts`)
- **Utilities**: `camelCase.ts` (e.g., `pdfUtils.ts`)

### CSS/Styling Guidelines

- **Use Tailwind CSS** classes primarily
- **Follow mobile-first** responsive design
- **Use semantic class names** when custom CSS is needed
- **Maintain dark mode support** for all new components
- **Test accessibility** with screen readers

## 🧪 Testing

### Current Testing Status

We're currently working on implementing a comprehensive testing strategy. For now:

1. **Manual testing** is required for all changes
2. **Test in multiple browsers** (Chrome, Firefox, Safari, Edge)
3. **Test responsive behavior** on different screen sizes
4. **Test dark/light mode** functionality
5. **Test with various file types** (.md, .html)

### Future Testing Plans

- Unit tests with Jest and React Testing Library
- Integration tests for critical user flows
- E2E tests with Playwright or Cypress
- Visual regression testing
- Performance testing

## 📚 Documentation

### What Needs Documentation

- **New features** - How to use them
- **API changes** - Breaking changes and migrations
- **Configuration options** - New settings and their effects
- **Troubleshooting guides** - Common issues and solutions
- **Examples** - Sample use cases and tutorials

### Documentation Standards

- **Write clear, concise** explanations
- **Include code examples** where relevant
- **Add screenshots** for UI changes
- **Update README.md** for significant changes
- **Keep docs up-to-date** with code changes

## 🌟 Recognition

Contributors will be recognized in several ways:

- **Contributors section** in README.md
- **Changelog entries** for significant contributions
- **Social media shoutouts** for major features
- **Maintainer status** for consistent, high-quality contributions

## 💬 Community

### Getting Help

- **GitHub Discussions** - Ask questions, share ideas
- **GitHub Issues** - Report bugs, request features
- **Code Reviews** - Learn from feedback on PRs

### Communication Guidelines

- **Be respectful** and constructive in all interactions
- **Ask questions** if you're unsure about anything
- **Share knowledge** - help other contributors
- **Celebrate successes** - acknowledge good work from others

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for backwards compatible bug fixes

### Release Schedule

- **Patch releases** - As needed for critical bugs
- **Minor releases** - Monthly or when significant features are ready
- **Major releases** - Rarely, only for breaking changes

## 📞 Questions?

If you have questions about contributing, feel free to:

- **Open a GitHub Discussion**
- **Comment on relevant issues**
- **Reach out to maintainers**

Thank you for contributing to DocSculptor! 🎉

---

**Remember**: Every contribution, no matter how small, makes DocSculptor better for everyone. We appreciate your time and effort! ❤️
