# VideoTube - YouTube Clone

A modern YouTube-style video discovery and playback platform built with Next.js 15, React Query, and Zustand. This application provides a professional foundation for video browsing and playback, with seamless YouTube Data API v3 integration.

## Features

- 🎥 **Video Discovery** - Browse popular videos with real-time data from YouTube API
- 🔍 **Smart Search** - Search videos with persistent history (LocalStorage)
- 📱 **Responsive Design** - Mobile-first UI that works on all screen sizes
- ⚡ **Optimized Performance** - Server components, smart caching, and lazy loading
- 🎨 **Modern UI** - Clean, accessible interface with Tailwind CSS
- 🧪 **Well Tested** - Comprehensive unit tests with Vitest and React Testing Library
- 📊 **State Management** - React Query for server state, Zustand for UI state
- ♿ **Accessible** - WCAG 2.2 AA compliant with proper ARIA labels

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - UI library
- **TypeScript** - Type safety throughout the application

### State Management
- **@tanstack/react-query** - Server state, caching, and data synchronization
- **Zustand** - Lightweight client-side state management

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Testing
- **Vitest** - Fast unit test framework
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation

## Project Structure

```
youtube-clone/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/youtube/          # API routes (proxy to YouTube API)
│   │   │   ├── popular/          # Popular videos endpoint
│   │   │   ├── search/           # Search endpoint
│   │   │   └── videos/           # Video details endpoint
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── page.tsx              # Homepage
│   ├── components/               # React components
│   │   ├── Navigation/           # Top navigation bar
│   │   ├── VideoCard/            # Video card component
│   │   └── providers/            # Context providers
│   ├── hooks/                    # Custom React Query hooks
│   │   ├── use-popular-videos.ts
│   │   ├── use-search-videos.ts
│   │   └── use-video.ts
│   ├── lib/                      # Utilities and clients
│   │   ├── utils/                # Helper functions
│   │   │   └── formatters.ts     # Format views, duration, time
│   │   └── youtube-client.ts     # YouTube API wrapper
│   ├── store/                    # Zustand stores
│   │   ├── player-store.ts       # Video player state
│   │   ├── search-store.ts       # Search history
│   │   └── ui-store.ts           # UI preferences
│   ├── types/                    # TypeScript definitions
│   │   └── youtube.ts            # YouTube API types
│   └── test/                     # Test configuration
│       └── setup.ts              # Vitest setup
├── docs/
│   └── state.md                  # State management documentation
├── CLAUDE.md                     # Development guidelines
├── vitest.config.ts              # Vitest configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- YouTube Data API v3 key (optional - uses mock data without it)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd youtube-clone
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up YouTube API key:
```bash
echo "YOUTUBE_API_KEY=your_api_key_here" > .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Without API Key

The app works perfectly without a YouTube API key by returning mock data from the API routes. This is ideal for:
- Local development
- Testing
- Learning the codebase

## Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests in watch mode
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## Testing

The project includes comprehensive tests:

- **Unit Tests** - Components, utilities, and stores
- **47 Test Cases** - All passing
- **Coverage** - Available with `npm run test:coverage`

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## State Management

The application uses a hybrid state management approach:

### Server State (React Query)
- Video data from YouTube API
- Automatic caching (5-10 min stale time)
- Background refetching
- Deduplication

### Client State (Zustand)
- **Search Store** - Query and history (persisted)
- **Player Store** - Playback state (session)
- **UI Store** - Preferences (persisted)

## API Integration

### YouTube Data API v3

The app uses three main endpoints:

1. **Popular Videos** - `GET /api/youtube/popular`
2. **Search Videos** - `GET /api/youtube/search?query={query}`
3. **Video Details** - `GET /api/youtube/videos?id={videoId}`

All endpoints return mock data when `YOUTUBE_API_KEY` is not set.

### Getting an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Add to `.env.local`

## Performance

- **FCP** < 1.8s - First Contentful Paint
- **LCP** < 2.5s - Largest Contentful Paint
- **TTI** < 3s - Time to Interactive

Optimizations:
- Next.js image optimization
- Code splitting
- Smart caching with React Query
- Minimal bundle size

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add `YOUTUBE_API_KEY` environment variable
4. Deploy

### Other Platforms

```bash
npm run build
npm run start
```

Set `YOUTUBE_API_KEY` environment variable in your hosting platform.

## License

This project is private and for educational purposes.
