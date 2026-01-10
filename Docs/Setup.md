TruckTales - Development Setup Guide
Version: 1.0
Last Updated: January 10, 2026
Estimated Setup Time: 45-60 minutes

📋 Table of Contents

Prerequisites
Quick Start
Detailed Setup
Environment Variables
Running the Project
Troubleshooting
Development Workflow


✅ Prerequisites
Required Software
SoftwareVersionDownloadVerificationNode.js18.x or 20.xnodejs.orgnode --versionnpm9.x+(comes with Node)npm --versionGit2.x+git-scm.comgit --versionVS CodeLatestcode.visualstudio.comRecommended IDE
For Mobile Development
SoftwarePurposeDownloadExpo CLIMobile app devnpm install -g expo-cliExpo GoMobile testingiOS / AndroidAndroid StudioAndroid emulatordeveloper.android.comXcodeiOS simulator (Mac only)Mac App Store
Required Accounts (Free Tier Available)

 GitHub Account - Code hosting
 Google Account - Gemini API
 OpenAI Account - Whisper API (optional, use VAPI)
 VAPI Account - Voice interface (vapi.ai)
 Mapbox Account - Maps API (mapbox.com)
 Convex Account - Real-time database (convex.dev)
 Clerk Account - Authentication (clerk.com)
 Razorpay Account - Payments (razorpay.com)
 Alchemy Account - Blockchain RPC (alchemy.com)


🚀 Quick Start (5 Minutes)
bash# 1. Clone repository
git clone https://github.com/your-team/trucktales.git
cd trucktales

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Start development server
npm run dev
Then open: http://localhost:3000

⚠️ Note: This won't work fully until you configure API keys (see below)


🔧 Detailed Setup
Step 1: Clone & Install
bash# Clone the repository
git clone https://github.com/your-team/trucktales.git
cd trucktales

# Install root dependencies
npm install

# Install mobile dependencies
cd mobile
npm install
cd ..

# Install smart contract dependencies (if applicable)
cd contracts
npm install
cd ..
Step 2: Project Structure
After cloning, your structure should look like:
trucktales/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── process-tale/
│   │   ├── process-pod/
│   │   └── payments/
│   ├── dashboard/         # Shipper dashboard
│   └── layout.tsx
├── mobile/                # Expo mobile app
│   ├── app/              # Expo Router
│   ├── components/       # Mobile components
│   └── package.json
├── components/           # Shared React components
│   ├── ui/              # Shadcn components
│   └── maps/
├── lib/                  # Utility functions
│   ├── nlp/             # NLP pipeline
│   ├── blockchain/      # Web3 utilities
│   └── utils.ts
├── prisma/              # Database schema
│   └── schema.prisma
├── contracts/           # Solidity smart contracts
│   └── PODRegistry.sol
├── convex/              # Convex backend
│   ├── schema.ts
│   └── functions/
├── public/              # Static assets
├── .env.example         # Environment template
├── package.json
└── README.md
Step 3: Get API Keys
3.1 Gemini API (AI Processing)

Go to Google AI Studio
Click "Get API Key" → "Create API key"
Copy the key (starts with AIza...)
Add to .env.local:

   GEMINI_API_KEY=AIzaSy...
3.2 VAPI (Voice Interface)

Sign up at vapi.ai
Go to Dashboard → API Keys
Create new key
Add to .env.local:

   NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_live_...
   VAPI_PRIVATE_KEY=sk_live_...
3.3 Mapbox (Maps)

Sign up at mapbox.com
Go to Account → Tokens
Create token with styles:read, fonts:read scopes
Add to .env.local:

   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...
3.4 Convex (Real-time Database)

Sign up at convex.dev
Create new project
Run: npx convex dev
Copy deployment URL
Add to .env.local:

   NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
3.5 Clerk (Authentication)

Sign up at clerk.com
Create application
Go to API Keys
Add to .env.local:

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
3.6 Razorpay (Payments)

Sign up at razorpay.com
Get test credentials from Dashboard
Add to .env.local:

   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
3.7 Alchemy (Blockchain RPC)

Sign up at alchemy.com
Create app → Select Polygon Mumbai
Copy API key
Add to .env.local:

   NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
3.8 Wallet Private Key (Blockchain)

Install MetaMask browser extension
Create new wallet (TEST ONLY - never use real funds)
Go to Settings → Security & Privacy → Reveal Secret Recovery Phrase
Add to .env.local:

   PRIVATE_KEY=0x... (your private key)

⚠️ CRITICAL: Never commit private keys to Git! Always use .env.local which is gitignored.


🔐 Environment Variables
Complete .env.local Template
Create .env.local in the root directory:
bash# ============================================
# TruckTales Environment Variables
# ============================================

# ------------------
# AI Services
# ------------------
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-... (optional, for Whisper if not using VAPI)

# ------------------
# Voice Interface
# ------------------
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_live_...
VAPI_PRIVATE_KEY=sk_live_...

# ------------------
# Maps & Geocoding
# ------------------
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# ------------------
# Real-time Database
# ------------------
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud

# ------------------
# Authentication
# ------------------
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ------------------
# Payments
# ------------------
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_ACCOUNT_NUMBER=... (for payouts)

# ------------------
# Blockchain
# ------------------
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
PRIVATE_KEY=0x... (DO NOT COMMIT THIS!)
POD_REGISTRY_CONTRACT_ADDRESS=0x... (after deployment)

# ------------------
# Database (Prisma + Neon)
# ------------------
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# ------------------
# Notifications
# ------------------
TWILIO_ACCOUNT_SID=AC... (optional, for SMS)
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

# ------------------
# Monitoring
# ------------------
SENTRY_DSN=https://...@sentry.io/... (optional)

# ------------------
# n8n Workflows
# ------------------
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/...

# ------------------
# Development
# ------------------
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
For Mobile App
Create mobile/.env:
bashEXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_CONVEX_URL=https://...convex.cloud
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

🏃 Running the Project
Option 1: Development Mode (Full Stack)
bash# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Next.js web app
npm run dev

# Terminal 3: Start mobile app
cd mobile
npm start
Option 2: Web Only
bash# Start Convex + Next.js together
npm run dev:all
Option 3: Mobile Only
bash# Start mobile with Expo
cd mobile
npm start

# Then scan QR code with Expo Go app
Access Points

Web Dashboard: http://localhost:3000
API Docs: http://localhost:3000/api
Convex Dashboard: https://dashboard.convex.dev
Mobile: Expo Go app (scan QR code)


🧪 Database Setup
Convex Schema
bash# Push schema to Convex
npx convex dev

# This will:
# - Create tables: trucks, tales, shipments, drivers
# - Set up indexes
# - Deploy functions
Prisma + Neon (Optional)
bash# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npm run db:seed

# Open Prisma Studio (visual DB editor)
npx prisma studio

📱 Mobile App Setup
iOS (Mac Required)
bashcd mobile

# Install iOS dependencies
npx pod-install

# Start iOS simulator
npm run ios
Android
bashcd mobile

# Start Android emulator
npm run android

# Or scan QR with physical device
npm start
Common Mobile Issues
Problem: Expo not connecting
Solution:
bash# Clear Metro cache
npm start -- --clear

# Reset everything
rm -rf node_modules
npm install
Problem: VAPI not recording
Solution: Check microphone permissions in app settings

🔗 Blockchain Setup
Deploy Smart Contract
bash# Install Hardhat
cd contracts
npm install

# Compile contracts
npx hardhat compile

# Deploy to Polygon Mumbai testnet
npx hardhat run scripts/deploy.js --network polygonMumbai

# Copy contract address to .env.local
# POD_REGISTRY_CONTRACT_ADDRESS=0x...

# Verify on Polygonscan
npx hardhat verify --network polygonMumbai DEPLOYED_ADDRESS
Get Test MATIC

Go to Mumbai Faucet
Enter your wallet address
Receive free test MATIC
Verify in MetaMask


🧪 Testing
Run Unit Tests
bash# Run all tests
npm test

# Run specific test
npm test src/nlp/TruckTalesNLP.test.ts

# Run with coverage
npm test -- --coverage
Run E2E Tests
bash# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui
Test API Endpoints
bash# Using curl
curl -X POST http://localhost:3000/api/process-tale \
  -H "Content-Type: application/json" \
  -d '{"text": "NH44 pe traffic hai"}'

# Using Postman
# Import collection from: docs/postman-collection.json

🔍 Troubleshooting
Common Issues
1. "Module not found" Error
bash# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
2. Convex Connection Failed
bash# Check Convex status
npx convex dev

# Redeploy functions
npx convex deploy
3. API Keys Not Working
bash# Check .env.local is in root directory
ls -la .env.local

# Restart dev server (env changes require restart)
# Ctrl+C then npm run dev
4. Blockchain TX Failing
bash# Check wallet has MATIC
# Visit: https://mumbaifaucet.com

# Check RPC URL is correct
echo $NEXT_PUBLIC_POLYGON_RPC_URL

# Verify contract address
# Check on: https://mumbai.polygonscan.com
5. Mobile App Won't Load
bash# Clear Expo cache
cd mobile
expo start -c

# Check API URL in mobile/.env
cat .env

# Ensure backend is running
curl http://localhost:3000/api/health
Getting Help

Check Documentation: README.md, PRD.md
Search Issues: GitHub Issues tab
Ask Team: Team Slack/Discord
Check Logs:

bash   # Next.js logs
   tail -f .next/trace
   
   # Convex logs
   # Check Convex Dashboard → Logs

👨‍💻 Development Workflow
Daily Workflow
bash# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/voice-recording

# 3. Start dev environment
npm run dev:all

# 4. Make changes, test locally

# 5. Commit changes
git add .
git commit -m "feat: add voice recording component"

# 6. Push to GitHub
git push origin feature/voice-recording

# 7. Create Pull Request
# Go to GitHub → Pull Requests → New PR
Code Quality Checks
bash# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all checks before commit
npm run pre-commit
Git Commit Convention
bash# Format: <type>(<scope>): <message>

feat(mobile): add voice recording button
fix(api): resolve geocoding timeout
docs(readme): update setup instructions
style(ui): improve dashboard layout
refactor(nlp): optimize entity extraction
test(api): add POD processing tests
chore(deps): update dependencies

📦 Building for Production
Web App (Next.js)
bash# Build for production
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod
Mobile App (Expo)
bashcd mobile

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
Environment Setup
bash# Production environment variables
# Add in Vercel dashboard → Settings → Environment Variables
# Or in .env.production

NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://trucktales.in
# ... (all other keys with production values)

🎯 Demo Preparation
Before Demo Day
bash# 1. Seed demo data
npm run demo:seed

# 2. Test full flow
npm run demo:test

# 3. Clear test data
npm run demo:clear

# 4. Set demo mode
echo "DEMO_MODE=true" >> .env.local

# 5. Prepare video recording
# Use OBS Studio or QuickTime
Demo Checklist

 All API keys working
 Database seeded with realistic data
 Mobile app tested on physical device
 Voice recording works perfectly
 Map updates in real-time
 Payment flow completes successfully
 Blockchain TX visible on Polygonscan
 Presentation slides ready
 Backup plan if internet fails
 Team knows their parts


📚 Additional Resources
Documentation

Next.js Docs
Expo Docs
Convex Docs
Mapbox Docs
Polygon Docs

Tutorials

Building with Gemini
VAPI Quickstart
Convex React Tutorial
Hardhat Tutorial

Tools

Postman - API testing
Polygonscan - Blockchain explorer
Vercel - Web hosting
EAS - Mobile builds


🤝 Team Collaboration
Development Environment Sync
bash# Share your setup with team
npm run env:export

# Import teammate's setup
npm run env:import teammate-env.json
Code Reviews
Before submitting PR:

Self-review changes
Run all tests
Update documentation
Add screenshots if UI changes
Tag relevant team members


📞 Support
Quick Help
bash# Health check
npm run health-check

# Debug info
npm run debug-info

# Reset everything
npm run reset-all
Contact

Team Lead: [Your Name] - team@trucktales.in
GitHub Issues: github.com/trucktales/issues
Slack: #trucktales-dev


✅ Setup Verification
Run this command to verify everything is set up correctly:
bashnpm run verify-setup
Expected output:
✅ Node.js: v20.10.0
✅ npm: v10.2.3
✅ Git: v2.42.0
✅ Convex: Connected
✅ Database: Connected
✅ API Keys: Valid (8/8)
✅ Smart Contract: Deployed
✅ Mobile: Ready
🎉 Setup complete! You're ready to build!
