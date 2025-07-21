# Banana Pricing Calculator

A sophisticated Next.js application for calculating banana pricing with dynamic rate management, analysis tools, and an intuitive user interface.

## 🚀 Features

- **Dynamic Pricing Calculator**: Real-time banana pricing calculations with customizable parameters
- **Rate Management System**: Configure and manage pricing rates with an intuitive interface
- **Analysis Dashboard**: Comprehensive pricing analysis and insights
- **Responsive Design**: Built with Tailwind CSS and Radix UI components
- **Static Export Ready**: Configured for GitHub Pages deployment
- **TypeScript Support**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Deployment**: GitHub Pages (static export)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mackaysmarketing/pricingcalculator.git
cd pricingcalculator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

## 🚀 Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

For faster development with Turbopack:
```bash
npm run dev -- --turbo
```

## 🏗️ Build & Deployment

### Local Build
```bash
npm run build
npm run start
```

### GitHub Pages Deployment
The project is configured for automatic deployment to GitHub Pages:

```bash
npm run deploy
```

This will:
1. Build the application with static export
2. Deploy to the `gh-pages` branch
3. Make it available at: https://mackaysmarketing.github.io/pricingcalculator

## 📁 Project Structure

```
├── app/
│   ├── banana-calculator/     # Calculator components
│   ├── fonts/                 # Custom fonts (Geist)
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # Reusable UI components
├── lib/                     # Utility functions
├── public/                  # Static assets
├── next.config.mjs          # Next.js configuration
└── tailwind.config.ts       # Tailwind configuration
```

## ⚙️ Configuration

### Next.js Configuration
The project uses static export for GitHub Pages compatibility:

```javascript
// next.config.mjs
const nextConfig = {
    output: 'export',
};
```

### Tailwind CSS
Custom configuration with shadcn/ui integration and CSS variables for theming.

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to GitHub Pages |

## 🔧 Development Tools

- **ESLint**: Code linting with Next.js recommended rules
- **TypeScript**: Static type checking
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing

## 📱 Browser Support

- Modern browsers with ES2017+ support
- Node.js 18.17+ required for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Live Demo](https://mackaysmarketing.github.io/pricingcalculator)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

