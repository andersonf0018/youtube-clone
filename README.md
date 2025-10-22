# VideoTube - YouTube Clone

A modern YouTube-style video discovery and playback platform built with Next.js 15, React Query, and Zustand. This application provides a professional foundation for video browsing and playback, with seamless YouTube Data API v3 integration.

## Features

- 🔐 **Google OAuth2 Authentication** - Secure sign-in with Google Identity Services
- 🎥 **Video Discovery** - Browse popular videos with real-time data from YouTube API
- 🔍 **Smart Search** - Search videos with persistent history (LocalStorage)
- 👤 **User Profiles** - Display user avatar and name when authenticated
- 📱 **Responsive Design** - Mobile-first UI that works on all screen sizes
- ⚡ **Optimized Performance** - Server components, smart caching, and lazy loading
- 🎨 **Modern UI** - Clean, accessible interface with Tailwind CSS
- 🧪 **Well Tested** - Comprehensive unit tests with Vitest and React Testing Library
- 📊 **State Management** - React Query for server state, Zustand for UI state
- ♿ **Accessible** - WCAG 2.2 AA compliant with proper ARIA labels
- 🔒 **Secure Sessions** - HTTP-only cookies with JWT strategy

## Tech Stack

### Core
- **Next.js 15** - React framework with App Router and Server Components
- **React 19** - UI library
- **TypeScript** - Type safety throughout the application

### State Management
- **@tanstack/react-query** - Server state, caching, and data synchronization
- **Zustand** - Lightweight client-side state management

### Authentication
- **NextAuth.js v5** - Authentication framework
- **Google OAuth2** - Secure sign-in provider
- **JWT** - Session management with HTTP-only cookies

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
- Google Cloud account (for OAuth2)
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

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Required for authentication
NEXTAUTH_SECRET=your_secret_here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional - uses mock data without it
YOUTUBE_API_KEY=your_youtube_api_key
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

This project follows a comprehensive testing strategy using **Vitest**, **React Testing Library**, and **MSW** for reliable, maintainable tests.

### Testing Stack

- **Vitest** - Fast unit test runner with native ESM support
- **React Testing Library** - Component testing focused on user behavior
- **MSW (Mock Service Worker)** - API mocking without modifying components
- **@testing-library/jest-dom** - Enhanced DOM matchers
- **@testing-library/user-event** - Realistic user interaction simulation

### Test Organization

```
src/
├── test/
│   ├── setup.ts              # Global test setup (MSW, cleanup)
│   ├── test-utils.tsx        # Custom render with providers
│   └── msw/
│       └── server.ts         # MSW server configuration
├── components/
│   └── ComponentName/
│       ├── ComponentName.tsx
│       └── ComponentName.test.tsx
└── store/
    ├── store-name.ts
    └── store-name.test.ts
```

### Writing Tests

Use the custom `render` function from `test-utils.tsx` to automatically wrap components with required providers:

```tsx
import { render, screen } from '@/test/test-utils';
import { createMockSession } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('renders authenticated user', () => {
    const session = createMockSession();
    render(<MyComponent />, { session });

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);

    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

### API Mocking with MSW

Mock API requests in individual tests using MSW handlers:

```tsx
import { server } from '@/test/msw/server';
import { http, HttpResponse } from 'msw';

it('fetches and displays videos', async () => {
  server.use(
    http.get('/api/youtube/popular', () => {
      return HttpResponse.json({ items: [...mockVideos] });
    })
  );

  render(<VideoList />);
  expect(await screen.findByText('Video Title')).toBeInTheDocument();
});
```

### Coverage Thresholds

The project enforces strict coverage requirements:

- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 80%
- **Statements**: 90%

Excluded from coverage:
- `node_modules/`
- `src/test/`
- `*.config.ts`
- Test files (`**/*.test.{ts,tsx}`)
- Type definitions (`**/types/**`)

### Running Tests

```bash
# Run tests once (CI mode)
npm test

# Run all tests in watch mode
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Best Practices

1. **Test behavior, not implementation** - Focus on what users see and do
2. **Use accessible queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock external dependencies** - Use MSW for API calls, mock Next.js router
4. **Avoid implementation details** - Don't test state or internal methods directly
5. **Keep tests isolated** - Each test should be independent and repeatable
6. **Test accessibility** - Verify ARIA attributes, keyboard navigation, screen reader support

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
3. Add environment variables:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `YOUTUBE_API_KEY` (optional)
4. Update Google OAuth redirect URIs with production URL
5. Deploy

### Other Platforms

```bash
npm run build
npm run start
```

Set all required environment variables in your hosting platform.

## License

This project is private and for educational purposes.
