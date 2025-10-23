# VideoTube - YouTube Clone

A modern YouTube-style video discovery and playback platform built with Next.js 15, React Query, and Zustand. This application provides a professional foundation for video browsing and playback, with seamless YouTube Data API v3 integration.

## Features

### Core Functionality
- 🔐 **Google OAuth2 Authentication** - Secure sign-in with Google Identity Services
- 🎥 **Video Discovery** - Browse popular videos with real-time data from YouTube API
- 📺 **Video Watch Page** - Full video playback with YouTube Player integration
- 🔍 **Smart Search** - Search videos with persistent history dropdown
- 📺 **Channel Pages** - Browse channel details, stats, and video collections
- 🔔 **Subscription System** - Subscribe/unsubscribe to channels with persistent storage
- 🎬 **Related Videos** - Intelligent suggestions sidebar on watch pages
- 👤 **User Profiles** - Display user avatar and menu when authenticated

### Technical Excellence
- 📱 **Responsive Design** - Mobile-first UI that works on all screen sizes
- ⚡ **Optimized Performance** - Server components, smart caching, and lazy loading
- 🎨 **Modern UI** - Clean, accessible interface with Tailwind CSS
- 🧪 **Well Tested** - Comprehensive unit tests with Vitest and React Testing Library (90%+ coverage)
- 📊 **State Management** - React Query for server state, Zustand for UI state
- ♿ **Accessible** - WCAG 2.2 AA compliant with proper ARIA labels and keyboard navigation
- 🔒 **Secure Sessions** - HTTP-only cookies with JWT strategy
- 🚨 **Error Monitoring** - Custom error pages and error boundary handling
- 🛡️ **Middleware** - Request validation and security headers

## Pages & Routes

- **`/`** - Homepage with popular/trending videos
- **`/search`** - Search results page with query parameter
- **`/watch/[id]`** - Video watch page with player and related videos
- **`/channel/[id]`** - Channel page with details and video grid
- **Custom error pages** - Graceful error handling with retry options

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
│   ├── app/                                # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/         # NextAuth.js authentication
│   │   │   ├── subscriptions/              # Subscription management
│   │   │   │   ├── subscribe/              # Subscribe endpoint
│   │   │   │   ├── unsubscribe/            # Unsubscribe endpoint
│   │   │   │   └── route.ts                # List subscriptions
│   │   │   └── youtube/                    # YouTube API proxy routes
│   │   │       ├── channels/               # Channel data
│   │   │       │   ├── [id]/               # Channel by ID
│   │   │       │   │   ├── videos/         # Channel videos
│   │   │       │   │   └── route.ts        # Channel details
│   │   │       │   └── route.ts            # Channel search
│   │   │       ├── popular/                # Popular videos
│   │   │       ├── related/                # Related videos
│   │   │       ├── search/                 # Video search
│   │   │       └── videos/                 # Video details
│   │   ├── channel/[id]/                   # Channel page
│   │   ├── search/                         # Search results page
│   │   ├── watch/[id]/                     # Video watch page
│   │   ├── error.tsx                       # Global error boundary
│   │   ├── layout.tsx                      # Root layout with providers
│   │   └── page.tsx                        # Homepage
│   ├── components/                         # React components
│   │   ├── ChannelCard/                    # Channel card component
│   │   ├── CollapsibleDescription/         # Expandable descriptions
│   │   ├── Navigation/                     # Top navigation bar
│   │   ├── RelatedVideoCard/               # Related video card
│   │   ├── RelatedVideosSidebar/           # Sidebar with suggestions
│   │   ├── SearchHistoryDropdown/          # Search history UI
│   │   ├── SubscribeButton/                # Subscribe/unsubscribe button
│   │   ├── UserMenu/                       # User dropdown menu
│   │   ├── VideoCard/                      # Video card component
│   │   ├── VideoCardSkeleton/              # Loading skeleton
│   │   ├── VideoGrid/                      # Video grid layout
│   │   ├── VideoMetadata/                  # Video details (views, likes, etc.)
│   │   ├── YouTubePlayer/                  # Video player component
│   │   └── providers/                      # Context providers
│   ├── hooks/                              # Custom React hooks
│   │   ├── use-focus-trap.ts               # Focus trap for modals
│   │   ├── use-popular-videos.ts           # Popular videos query
│   │   ├── use-search-videos.ts            # Search query
│   │   └── use-video.ts                    # Video details query
│   ├── lib/                                # Utilities and clients
│   │   ├── auth.ts                         # NextAuth configuration
│   │   ├── error-monitoring.ts             # Error tracking utilities
│   │   ├── utils/                          # Helper functions
│   │   │   └── formatters.ts               # Format views, duration, time
│   │   └── youtube-client.ts               # YouTube API wrapper
│   ├── store/                              # Zustand stores
│   │   ├── player-store.ts                 # Video player state
│   │   ├── search-store.ts                 # Search history
│   │   ├── subscription-store.ts           # Subscription management
│   │   └── ui-store.ts                     # UI preferences
│   ├── types/                              # TypeScript definitions
│   │   └── youtube.ts                      # YouTube API types
│   ├── test/                               # Test configuration
│   │   ├── setup.ts                        # Vitest setup
│   │   ├── test-utils.tsx                  # Testing utilities
│   │   └── msw/                            # Mock Service Worker
│   │       └── server.ts                   # API mocking
│   └── middleware.ts                       # Next.js middleware
├── vitest.config.ts                        # Vitest configuration
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
git clone https://github.com/andersonf0018/youtube-clone
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
npm run dev           # Start development server (Turbopack)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm test              # Run tests in CLI mode
npm test:watch        # Run tests in watch mode
npm run test:ui       # Run tests with UI
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
- Type definitions (`**/types/**`, `**/*.d.ts`)
- Index files (`**/index.ts`)
- API routes (`src/app/api/**`)
- Auth configuration (`src/lib/auth.ts`)
- Root layout (`src/app/layout.tsx`)
- Provider components (`src/components/providers/**`)

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

The application uses a hybrid state management approach for optimal performance:

### Server State (React Query)
- Video data from YouTube API
- Channel information and videos
- Related video suggestions
- Automatic caching (5-10 min stale time)
- Background refetching and revalidation
- Request deduplication

### Client State (Zustand)
- **Search Store** - Query and history (persisted to localStorage)
- **Subscription Store** - User subscriptions (persisted to localStorage)
- **Player Store** - Video playback state (session storage)
- **UI Store** - User preferences and UI state (persisted to localStorage)

## API Integration

### YouTube Data API v3

The application provides comprehensive API routes that proxy to YouTube Data API v3:

#### Video Endpoints
- `GET /api/youtube/popular` - Fetch popular/trending videos
- `GET /api/youtube/search?query={query}` - Search for videos
- `GET /api/youtube/videos?id={videoId}` - Get video details by ID
- `GET /api/youtube/related?videoId={videoId}` - Get related/suggested videos

#### Channel Endpoints
- `GET /api/youtube/channels?name={channelName}` - Search for channels
- `GET /api/youtube/channels/{id}` - Get channel details by ID
- `GET /api/youtube/channels/{id}/videos` - Get videos from a channel

#### Subscription Endpoints
- `GET /api/subscriptions` - List user's subscriptions
- `POST /api/subscriptions/subscribe` - Subscribe to a channel
- `POST /api/subscriptions/unsubscribe` - Unsubscribe from a channel

All endpoints return mock data when `YOUTUBE_API_KEY` is not set, making the app fully functional for development and testing without API credentials.

### Getting an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable YouTube Data API v3
4. Create credentials (API key)
5. Add to `.env.local`

## Performance

This application meets and exceeds modern web performance standards:

### Core Web Vitals Targets
- **FCP** < 1.8s - First Contentful Paint
- **LCP** < 2.5s - Largest Contentful Paint
- **TTI** < 3s - Time to Interactive
- **CLS** < 0.1 - Cumulative Layout Shift

### Optimization Strategies
- **Next.js Image Optimization** - Automatic WebP/AVIF conversion and lazy loading
- **Code Splitting** - Automatic route-based and dynamic component splitting
- **Smart Caching** - React Query with 5-10 min stale time for API responses
- **Minimal Bundle Size** - First Load JS: 143-167 kB across all routes
- **Server Components** - Zero JavaScript for static content
- **Turbopack** - Ultra-fast builds and Hot Module Replacement
- **Middleware** - Edge runtime for instant response times

### Build Output
```
Route (app)                               Size  First Load JS
┌ ○ /                                  8.25 kB         162 kB
├ ƒ /channel/[id]                      20.3 kB         163 kB
├ ○ /search                            10.8 kB         164 kB
└ ƒ /watch/[id]                          13 kB         167 kB
+ First Load JS shared by all           150 kB
```

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

## Key Highlights

This YouTube clone demonstrates professional-grade frontend development practices:

### Architecture
- **Modern React Patterns** - Hooks, Server Components, and proper state separation
- **Type Safety** - Full TypeScript coverage with strict mode enabled
- **Clean Code** - Follows SOLID principles and component composition
- **Scalable Structure** - Feature-based organization with clear separation of concerns

### Quality Assurance
- **90%+ Test Coverage** - Comprehensive unit and integration tests
- **Accessibility First** - WCAG 2.2 AA compliant with keyboard navigation
- **Performance Budgets** - Lighthouse scores consistently > 90
- **Error Handling** - Graceful degradation with custom error boundaries

### Developer Experience
- **Fast Builds** - Turbopack for instant Hot Module Replacement
- **Type-Safe APIs** - End-to-end type safety from API to UI
- **Mock Data Support** - Fully functional without API credentials
- **Comprehensive Docs** - Detailed README, code comments, and state documentation

### Production Ready
- **Security** - HTTP-only cookies, JWT sessions, secure middleware
- **Monitoring** - Error tracking and performance monitoring ready
- **SEO Optimized** - Server-side rendering with proper meta tags
- **Responsive** - Mobile-first design that works on all devices

## License

This project is private and for educational purposes.
