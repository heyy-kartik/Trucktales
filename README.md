# XYS - Highway Monitoring System

A full-stack Next.js 15 application for real-time highway monitoring, incident reporting, and truck tracking.

## Features

### Backend (Next.js API)
- **Audio Processing**: `/api/process-tale` endpoint that:
  - Uses OpenAI Whisper for Speech-to-Text (STT)
  - Processes text with Google Gemini 1.5 for NLP extraction
  - Extracts highway name, kilometer marker, issue description, ETA, and severity
  - Geocodes locations using Mapbox API
  - Stores data in Convex with real-time synchronization

- **Inngest Jobs**: Background job processing for:
  - High-severity incident detection
  - Finding nearby trucks within affected areas
  - Sending SMS reroute notifications via Twilio

### Frontend (Next.js Web Dashboard)
- **Interactive Mapbox Dashboard**: Live visualization with:
  - Real-time truck location pins
  - Incident markers color-coded by severity
  - Interactive popups with detailed information
  
- **Real-time Updates**: Powered by Convex subscriptions for instant data synchronization

- **Filtering & Analytics**:
  - Filter incidents by severity (low, medium, high)
  - Filter by status (open, in-progress, resolved)
  - Real-time statistics dashboard
  - Recent incidents list view

- **Modern UI**: Built with Tailwind v4 and Shadcn components

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Database & Real-time**: Convex
- **AI/ML**: 
  - OpenAI Whisper (Speech-to-Text)
  - Google Gemini 1.5 (NLP & Information Extraction)
- **Maps & Geocoding**: Mapbox
- **Background Jobs**: Inngest
- **SMS Notifications**: Twilio
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Accounts and API keys for:
  - Clerk (authentication)
  - Convex (database)
  - Mapbox (maps and geocoding)
  - OpenAI (Whisper STT)
  - Google AI (Gemini)
  - Twilio (SMS notifications)
  - Inngest (background jobs)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/heyy-kartik/xys.git
cd xys
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your API keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_convex_deployment

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_public_token
MAPBOX_SECRET_TOKEN=your_mapbox_secret_token

# OpenAI Whisper
OPENAI_API_KEY=your_openai_api_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Twilio SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Convex**
```bash
npx convex dev
```
This will initialize your Convex project and generate the necessary schema.

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Project Structure

```
xys/
├── app/
│   ├── api/
│   │   ├── process-tale/       # Audio processing endpoint
│   │   └── inngest/            # Inngest webhook handler
│   ├── dashboard/              # Main dashboard page
│   ├── layout.tsx              # Root layout with providers
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn UI components
│   ├── MapboxDashboard.tsx     # Interactive map component
│   ├── IncidentsList.tsx       # Incidents list view
│   ├── Analytics.tsx           # Statistics dashboard
│   └── ConvexClientProvider.tsx # Convex provider wrapper
├── convex/
│   ├── schema.ts               # Database schema
│   └── incidents.ts            # Convex queries and mutations
├── lib/
│   ├── inngest/
│   │   ├── client.ts           # Inngest client
│   │   └── functions.ts        # Background job functions
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
```

## API Endpoints

### POST /api/process-tale

Process audio reports or text transcripts to extract incident information.

**Request Body:**
```json
{
  "audioUrl": "https://example.com/audio.wav",  // optional
  "audioBase64": "base64_encoded_audio",        // optional
  "text": "Incident report text"                 // optional (if no audio)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "highway": "NH-48",
    "kilometer": 125.5,
    "issue": "Traffic congestion due to accident",
    "eta": "2 hours",
    "severity": "high",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "audioTranscript": "...",
    "timestamp": "2024-01-10T12:00:00Z"
  }
}
```

## Convex Schema

### Incidents Table
- `highway`: Highway name/number
- `kilometer`: Kilometer marker
- `issue`: Issue description
- `eta`: Estimated time to resolution
- `severity`: "low" | "medium" | "high"
- `latitude`, `longitude`: Geocoded coordinates
- `audioTranscript`: Original transcript
- `reportedAt`: Timestamp
- `status`: "open" | "in-progress" | "resolved"

### Trucks Table
- `truckId`: Unique truck identifier
- `driverName`: Driver's name
- `phoneNumber`: Contact number for SMS alerts
- `currentHighway`: Current highway location
- `currentKilometer`: Current kilometer position
- `latitude`, `longitude`: Real-time coordinates
- `status`: "active" | "idle" | "offline"
- `lastUpdated`: Last location update timestamp

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Convex Deployment
```bash
npx convex deploy
```

### Inngest Configuration
Configure your Inngest app to point to your deployed application's `/api/inngest` endpoint.

## Development

### Run Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For support, please open an issue in the GitHub repository.