# 📄 DocSculptor

> A modern, powerful Markdown and HTML to PDF converter built with React and TypeScript.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)

## ✨ Features

### 🎯 Core Functionality
- **Dual Input Support**: Process both Markdown (.md) and HTML (.html) files
- **Dual Export Modes**: 
  - **Image PDF**: Pixel-perfect visual match to preview (larger file size)
  - **Text PDF**: Selectable text, smaller file size, faster export
- **Live Preview**: Real-time rendering with syntax highlighting
- **Dark/Light Theme**: Automatic theme switching with system preference

### 🛠️ Customization Options
- **Page Formats**: A4, Letter, Legal
- **Orientations**: Portrait and Landscape
- **Flexible Margins**: Customizable margins in millimeters
- **Typography Control**: 
  - Adjustable font sizes for body, headings, and code
  - Multiple font family options
- **Advanced Markdown**: GitHub Flavored Markdown with emoji support

### 🎨 User Experience
- **Drag & Drop Upload**: Intuitive file upload interface
- **Settings Panel**: Comprehensive export configuration
- **Progress Tracking**: Real-time export progress indication
- **Responsive Design**: Works on desktop and mobile devices
- **Keyboard Accessible**: Full keyboard navigation support
- **Draft Saving**: Automatic local storage persistence
- **Advanced Export Features**: Table of Contents, Page Numbering styles
- **Rich Typography**: Custom fonts and premium table aesthetics

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heli-toon/docsculptor.git
   cd docsculptor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```


### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + E` | Export to PDF |
| `Ctrl + O` | Open File Dialog |
| `Ctrl + S` | Save Draft to Local Storage |
| `Ctrl + ,` | Toggle Settings Panel |

## 📖 Usage

### Basic Workflow

1. **Upload Document**: Drag and drop or click to select a Markdown or HTML file
2. **Preview**: Review the rendered content in the live preview panel
3. **Configure**: Adjust PDF settings in the settings panel (optional)
4. **Export**: Click "Export PDF" to generate your document

### Supported File Formats

#### Input Formats
- `.md` - Markdown files
- `.markdown` - Markdown files
- `.html` - HTML files
- `.htm` - HTML files

#### Output Formats
- `.pdf` - Portable Document Format

### Export Modes

#### Image PDF
- **Pros**: Exact visual match to preview, preserves all styling
- **Cons**: Larger file size, text not selectable
- **Best for**: Documents with complex layouts, presentations

#### Text PDF
- **Pros**: Selectable text, smaller file size, faster generation
- **Cons**: Simplified styling, emojis removed
- **Best for**: Text-heavy documents, accessibility

## 🔧 Configuration

### PDF Settings

| Setting | Options | Description |
|---------|---------|-------------|
| Export Mode | Image, Text | Choose between visual accuracy or text selectability |
| Page Format | A4, Letter, Legal | Standard paper sizes |
| Orientation | Portrait, Landscape | Page orientation |
| Margins | 0-50mm | Customizable page margins |
| Font Sizes | Adjustable | Separate controls for body, headings, and code |
| Font Families | Multiple options | Choose fonts for different text types |
| Table of Contents | Toggle | Auto-generate TOC from headings |
| Page Numbers | Style & Position | Customizable numbering (Simple, Total, Accent) |

### Markdown Features

DocSculptor supports GitHub Flavored Markdown including:

- **Headers** (H1-H6)
- **Emphasis** (bold, italic)
- **Lists** (ordered, unordered)
- **Code blocks** with syntax highlighting
- **Inline code**
- **Links and images**
- **Tables**
- **Blockquotes**
- **Horizontal rules**
- **Emojis** 😊 (in Image PDF mode)
- **Strikethrough**
- **Task lists**
- **Math equations** (LaTeX/KaTeX syntax)
  - Inline math: `$E = mc^2$`
  - Block math: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

#### Math Equation Examples

**Inline equations**: Use single dollar signs for inline math: `$x^2 + y^2 = z^2$`

**Display equations**: Use double dollar signs for block equations:
```markdown
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

**Complex expressions**:
```markdown
$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$
```

## 🏗️ Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with Tailwind Typography
- **Markdown Processing**: Unified.js ecosystem
  - remark-parse, remark-gfm, remark-emoji
  - rehype-highlight for syntax highlighting
- **PDF Generation**: 
  - html2pdf.js (Image PDF)
  - jsPDF (Text PDF)
- **Theme Management**: CSS variables with system preference detection

### Project Structure
```
src/
├── components/          # React components
│   ├── FileUpload.tsx   # File upload interface
│   ├── Preview.tsx      # Document preview
│   ├── Settings.tsx     # Configuration panel
│   ├── Toolbar.tsx      # Main toolbar
│   └── ThemeToggle.tsx  # Theme switcher
├── hooks/               # Custom React hooks
│   ├── useMarkdown.ts   # Markdown processing
│   ├── usePdfExport.ts  # PDF generation
│   ├── useTextPdfExport.ts # Text PDF generation
│   └── useTheme.ts      # Theme management
├── types/               # TypeScript definitions
└── App.tsx             # Main application component
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Ensure accessibility compliance

## 🐛 Bug Reports

Found a bug? Please create an issue with:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, file type
- **Screenshots**: If applicable

## 💡 Feature Requests

Have an idea? Check our [ideas.txt](ideas.txt) file for planned features, or create an issue with:

- **Feature Description**: Clear description of the proposed feature
- **Use Case**: Why this feature would be useful
- **Proposed Solution**: How you envision it working
- **Alternatives**: Other solutions you've considered

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Unified.js](https://unifiedjs.com/) for excellent Markdown processing
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [React](https://reactjs.org/) for the component framework
- [Vite](https://vitejs.dev/) for lightning-fast development
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) for PDF generation
- All contributors and users of DocSculptor

## 🌟 Show Your Support

If you find DocSculptor useful, please:

- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest new features
- 🤝 Contribute code
- 📢 Share with others

## 📞 Contact

- **Project Link**: [https://github.com/heli-toon/docsculptor](https://github.com/heli-toon/docsculptor)
- **Issues**: [https://github.com/heli-toon/docsculptor/issues](https://github.com/heli-toon/docsculptor/issues)

---

**Made with ❤️ by the Salay Abdul Muhaimin Kanton**

*Transform your documents, sculpt your PDFs.*

