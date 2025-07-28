# SaaS Admin Panel

A modern, responsive admin panel built with React + Vite + TailwindCSS for managing clients, branches, and subscription-based access control.

![Admin Panel](https://img.shields.io/badge/React-18+-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-green)
![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

### 🔐 Authentication

- **Mock Login System**: Demo credentials for testing
- **Protected Routes**: Automatic redirect to login for unauthorized access
- **Session Management**: Persistent login state with localStorage

### 🏢 Client Management

- **Complete CRUD Operations**: Create, Read, Update, Delete clients
- **Bilingual Support**: Arabic and English names/descriptions
- **Contact Information**: Email, phone, and company details
- **Search & Filter**: Real-time search and status filtering

### 🏪 Branch Management

- **Multi-branch Support**: Each client can have multiple branches
- **Location Tracking**: Arabic and English location information
- **Manager Assignment**: Assign dedicated managers to each branch
- **Visual Cards**: Clean, card-based UI for easy management

### 👥 Manager System

- **Branch Managers**: Assign managers to specific branches
- **Contact Details**: Email and phone information
- **Bilingual Names**: Support for Arabic and English names
- **Easy Assignment**: Simple modal-based manager assignment

### 📅 Subscription Management

- **Date-based Subscriptions**: Start and end date tracking
- **Automatic Expiry Detection**: Real-time status checking
- **Visual Status Indicators**: Color-coded subscription status
- **Expiry Warnings**: Alerts for soon-to-expire subscriptions
- **Access Control**: Frontend-based access restriction for expired clients

### 🌍 Internationalization

- **RTL Support**: Complete right-to-left layout for Arabic
- **Language Toggle**: Switch between Arabic and English instantly
- **Localized Content**: All UI elements translated
- **Cultural Adaptations**: Date formats and number systems

### 🎨 Modern UI/UX

- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean Design**: Modern, minimal interface
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Toast Notifications**: User-friendly feedback system

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd admin-panal
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔑 Demo Credentials

Use these credentials to access the admin panel:

- **Email**: `admin@example.com`
- **Password**: `admin123`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Forms/          # Form components (Client, Branch, Manager)
│   ├── Layout/         # Layout components (Sidebar, MainLayout)
│   └── UI/             # UI primitives (Modal, Toast, DatePicker, etc.)
├── contexts/           # React contexts
│   ├── ThemeContext.jsx    # Dark/Light mode management
│   └── LanguageContext.jsx # Arabic/English language management
├── constants/          # Static data
│   └── translations.js     # Bilingual translations
├── pages/              # Page components
│   ├── Dashboard.jsx       # Main dashboard with statistics
│   ├── Login.jsx          # Authentication page
│   ├── Clients.jsx        # Client listing and management
│   ├── ClientDetails.jsx  # Individual client details
│   └── SubscriptionExpired.jsx # Subscription expiry page
├── store/              # State management
│   └── useStore.js        # Zustand store with all app state
└── index.css           # Global styles with TailwindCSS
```

## 🛠️ Tech Stack

### Core Technologies

- **React 18+**: Modern React with hooks and functional components
- **Vite**: Lightning-fast build tool and dev server
- **TailwindCSS 3.4.1**: Utility-first CSS framework with custom design system

### State Management & Routing

- **Zustand**: Lightweight state management with persistence
- **React Router Dom**: Client-side routing with protected routes
- **React Context**: Theme and language management

### Form Handling & Validation

- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation
- **Date-fns**: Modern date utility library

### UI & Icons

- **Lucide React**: Beautiful, customizable icons
- **Custom Components**: Reusable UI primitives
- **Responsive Design**: Mobile-first approach

## 🎯 Key Features Breakdown

### Subscription Logic

```javascript
const isExpired = new Date() > new Date(client.subscriptionEnd);
```

Frontend-only subscription checking with automatic status updates.

### Theme System

- CSS custom properties for consistent theming
- Automatic dark mode preference detection
- Smooth transitions between themes

### Language System

- Complete RTL support for Arabic
- Dynamic font loading (Inter for English, Tajawal for Arabic)
- Contextual text direction handling

### Responsive Design

- Mobile-first CSS approach
- Collapsible sidebar for mobile
- Adaptive grid layouts
- Touch-friendly interactions

## 📱 Pages & Routes

| Route                   | Description         | Features                              |
| ----------------------- | ------------------- | ------------------------------------- |
| `/login`                | Authentication page | Mock login, theme/language toggles    |
| `/dashboard`            | Main overview       | Statistics, alerts, quick actions     |
| `/clients`              | Client management   | CRUD operations, search, filters      |
| `/clients/:id`          | Client details      | Branch management, subscription info  |
| `/subscription-expired` | Expiry notice       | Contact information, renewal guidance |

## 🎨 Design System

### Colors

- **Primary**: Blue palette for main actions and branding
- **Success**: Green for positive actions and active states
- **Warning**: Yellow/Orange for alerts and warnings
- **Error**: Red for destructive actions and errors
- **Neutral**: Gray scale for text and backgrounds

### Typography

- **Arabic**: Tajawal font family
- **English**: Inter font family
- **Responsive**: Scales appropriately across devices

### Spacing

- **Consistent**: 4px grid system
- **Logical**: Semantic spacing variables
- **Responsive**: Adaptive spacing for different screen sizes

## 🔧 Configuration

### TailwindCSS Configuration

The project uses a custom TailwindCSS configuration with:

- Custom color palette
- Extended spacing system
- Custom animations
- Dark mode support
- Arabic font integration

### Environment Variables

No environment variables required - everything runs in the browser with mock data.

## 🧪 Sample Data

The application comes with pre-populated sample data including:

- 2 demo clients with different subscription states
- Multiple branches per client
- Assigned managers with contact information
- Subscription scenarios (active and expired)

## 🔄 State Management

The app uses Zustand for state management with:

- **Persistent Storage**: Client data saved to localStorage
- **Reactive Updates**: Automatic UI updates on data changes
- **Type Safety**: Well-defined state structure
- **Optimistic Updates**: Immediate UI feedback

## 🌐 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation for older browsers

## 📈 Performance

- **Fast Initial Load**: Vite's optimized bundling
- **Code Splitting**: Lazy loading for better performance
- **Optimized Images**: Efficient asset loading
- **Minimal Dependencies**: Lightweight bundle size

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TailwindCSS**: For the amazing utility-first CSS framework
- **Lucide**: For the beautiful icon set
- **React Team**: For the fantastic React ecosystem
- **Vite Team**: For the blazing-fast build tool

---

**Built with ❤️ using React + Vite + TailwindCSS**

For support or questions, please open an issue in the repository.
