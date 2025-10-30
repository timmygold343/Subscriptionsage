# SubscriptionSage Frontend

Frontend for SubscriptionSage - Premium UI Components Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Backend API running (see backend README)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── ui/          # UI components (shadcn/ui)
│   │   ├── Hero.tsx     # Hero section
│   │   ├── Navigation.tsx # Navigation bar
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.tsx     # Home page
│   │   ├── Gallery.tsx  # Template gallery
│   │   ├── Login.tsx    # Login page
│   │   └── ...
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeProvider.tsx
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utility functions
│   └── main.tsx         # App entry point
├── index.html           # HTML template
├── tailwind.config.ts   # Tailwind configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

## 🎨 Features

- **Modern React App** with TypeScript
- **Monaco Code Editor** for live code editing
- **Glassmorphic Design** with Tailwind CSS
- **Dark/Light Theme** support
- **Responsive Layout** for all devices
- **Template Gallery** with search and filtering
- **User Authentication** with JWT
- **Payment Integration** (PayPal & Paystack)
- **Admin Dashboard** for content management

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_DESCRIPTION` | Application description | No |

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Wouter** for routing
- **TanStack Query** for state management
- **Radix UI** for accessible components
- **Lucide React** for icons

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy automatically

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy automatically

### Railway
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Add environment variables
4. Deploy automatically

### Docker
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - TypeScript type checking

## 🎯 Development

### Adding New Components
```bash
# Using shadcn/ui CLI
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

### Styling
- Use Tailwind CSS classes
- Follow the design system in `tailwind.config.ts`
- Use CSS variables for theming

### State Management
- Use TanStack Query for server state
- Use React Context for global client state
- Use local state for component-specific state
