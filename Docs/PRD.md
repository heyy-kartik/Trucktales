TruckTales - Product Requirements Document (PRD)
Version: 1.0
Team: Iconix
Hackathon: HackNova 2026
Last Updated: January 10, 2026

📋 Executive Summary
Vision
Transform India's 10 million unorganized truckers from invisible data points into real-time storytellers through voice-first AI logistics, eliminating 45-day payment delays and massive fuel waste.
Mission Statement
"Turning drivers into storytellers, not data points—because India's logistics revolution speaks Hindi, not spreadsheets."
Key Metrics

Target Users: 10M unorganized truck drivers
Problem Solved: 45-day payment delays → 60-second settlements
Fuel Savings: 18-22% reduction through AI routing
Market Impact: ₹50,000+ Cr logistics inefficiency reduction


🎯 Problem Statement
The Ground Reality - India's "Shadow Fleet"
1. Zero Visibility Crisis

Pain Point: Dispatchers constantly calling "Kahan ho?" (Where are you?)
Impact: No real-time tracking, complete operational blindness
Cost: Lost productivity, missed delivery windows
User Quote: "I call drivers 20 times a day, still don't know where trucks are" - Logistics Manager

2. Payment Nightmare

Pain Point: Paper PODs get lost, causing endless disputes
Impact: 45-day payment delays, driver cash flow crisis
Cost: ₹15,000 average per delayed payment × 10M drivers
User Quote: "I delivered 3 weeks ago, still waiting for payment" - Truck Driver

3. Route Intelligence Gap

Pain Point: Drivers hit unexpected jams/floods with no warnings
Impact: 6-hour delays, ₹3,000 fuel waste per incident
Cost: 18-22% operational inefficiency
User Quote: "Same route daily, still get stuck in same jam" - Fleet Owner


💡 Solution Overview
Three Core Innovations
1. Live Tale Map (Voice-First Tracking)
What: Drivers speak updates in Hindi → AI converts to live map markers
How It Works:
Driver speaks: "NH44 pe flood hai, KM-42 pe ruk gaya"
    ↓ VAPI captures audio
    ↓ Whisper converts to text (hi-IN)
    ↓ Gemini extracts: location=NH44-KM42, issue=flood
    ↓ Mapbox updates map in real-time
Result: Shipper sees red pin with "Flood reported by Ram Singh"
User Value:

Driver: Hands-free, safe while driving
Shipper: Instant visibility, no more phone calls
Fleet: Real-time dashboard for all trucks

2. POD → UPI in 60 Seconds (Blockchain Payments)
What: Photo proof of delivery triggers instant UPI payment
How It Works:
Driver delivers → Takes POD photo
    ↓ Gemini Vision verifies signature
    ↓ Photo hash stored on Polygon blockchain
    ↓ Smart contract triggers payment
    ↓ n8n workflow sends UPI via Razorpay
Result: ₹15,000 hits driver's account in 60 seconds
User Value:

Driver: Immediate payment, no disputes
Shipper: Automated reconciliation, audit trail
System: Immutable proof, zero paperwork

3. AI Jam Prediction Engine
What: Machine learning predicts congestion from voice tales
How It Works:
3 drivers report "NH44 flood"
    ↓ Inngest analyzes patterns
    ↓ Gemini calculates risk score (0.85)
    ↓ Mapbox identifies 5 trucks within 50km
    ↓ AI generates alternate routes
Result: SMS alerts sent, trucks rerouted, 6 hours saved
User Value:

Driver: Avoid delays, save fuel
Fleet: Predictive intelligence, cost savings
Industry: Network-wide optimization


👥 User Personas
Persona 1: Ramesh Kumar - Truck Driver
Demographics:

Age: 35
Education: 10th pass
Language: Hindi primary, limited English
Tech Savvy: Low (basic smartphone user)

Goals:

Get paid quickly and reliably
Know best routes to avoid delays
Communicate updates without stopping truck

Pain Points:

Payment delays cause cash flow issues
No one believes his delivery proof
Typing while driving is dangerous
Doesn't know alternate routes during jams

How TruckTales Helps:

Voice updates while driving (safe)
Instant payment on delivery
AI suggests best routes
Blockchain proof ends disputes

Persona 2: Priya Sharma - Logistics Manager
Demographics:

Age: 32
Education: MBA
Location: Mumbai office
Manages: 50 trucks

Goals:

Real-time visibility of entire fleet
Reduce operational costs
Improve on-time delivery rates
Automate payment reconciliation

Pain Points:

Spends hours calling drivers
Manual tracking in Excel sheets
Payment disputes waste time
No predictive intelligence

How TruckTales Helps:

Live map shows all trucks
Automated payment system
AI predicts delays before they happen
Analytics dashboard for insights

Persona 3: Rajesh Gupta - Fleet Owner
Demographics:

Age: 45
Owns: 200 trucks
Revenue: ₹10 Cr annually
Focus: Profit margins

Goals:

Maximize fleet utilization
Reduce fuel costs
Increase customer satisfaction
Scale operations efficiently

Pain Points:

18-22% fuel waste from bad routing
Drivers disappear without updates
Payment delays hurt relationships
No data for optimization

How TruckTales Helps:

18-22% fuel savings from AI routing
Complete fleet visibility
Automated payments build trust
Rich analytics for decision-making


🎨 User Stories & Acceptance Criteria
Epic 1: Voice-First Tracking
US-1.1: As a driver, I want to record voice updates in Hindi so I can update my status without stopping.

AC1: Mic button visible on home screen
AC2: Records audio in Hindi/Hinglish
AC3: Shows real-time transcription
AC4: Submits to server on stop
AC5: Confirms submission with feedback

US-1.2: As a shipper, I want to see live truck locations so I know shipment status.

AC1: Map shows all active trucks
AC2: Updates every 5 seconds
AC3: Markers color-coded by status
AC4: Click marker to see details
AC5: Filter by route/status

US-1.3: As a system, I want to extract location from voice so I can update the map.

AC1: Converts Hindi speech to text (95% accuracy)
AC2: Extracts highway names (NH44, SH17, etc.)
AC3: Extracts kilometer markers (KM-42)
AC4: Geocodes to GPS coordinates
AC5: Updates database in <2 seconds

Epic 2: Instant Payments
US-2.1: As a driver, I want to submit POD with my phone so I get paid immediately.

AC1: Camera opens quickly (<1 second)
AC2: Takes clear photo
AC3: Shows AI verification status
AC4: Confirms blockchain storage
AC5: Shows payment confirmation

US-2.2: As a shipper, I want automated payments so I don't manually process invoices.

AC1: Payment triggers on POD verification
AC2: Amount calculated automatically
AC3: UPI transfer completes in <60 seconds
AC4: SMS confirmation sent to driver
AC5: Blockchain receipt available

US-2.3: As a driver, I want to verify my POD on blockchain so I can prove delivery.

AC1: Access blockchain link from app
AC2: See photo hash and timestamp
AC3: View on Polygonscan explorer
AC4: Share link with shipper
AC5: Immutable proof available forever

Epic 3: AI Jam Prediction
US-3.1: As a driver, I want route alerts so I avoid traffic jams.

AC1: Receive SMS when jam predicted
AC2: See alternate route on map
AC3: Estimate time/fuel saved
AC4: One-tap to accept new route
AC5: Route updates in navigation

US-3.2: As a fleet manager, I want to see predicted congestion so I can plan routes.

AC1: Heatmap shows high-risk zones
AC2: Predictions update every 5 minutes
AC3: See affected truck count
AC4: Historical accuracy metrics
AC5: Export reports

US-3.3: As a system, I want to learn from tales so predictions improve over time.

AC1: Store all tales with timestamps
AC2: Analyze patterns with Gemini
AC3: Calculate risk scores (0-1)
AC4: Track prediction accuracy
AC5: Retrain model weekly


🏗️ Technical Architecture
System Components
Frontend Layer
┌─────────────────────────────────────────┐
│  WEB (Next.js 15)                       │
│  - Shipper Dashboard                    │
│  - Fleet Management                     │
│  - Analytics & Reports                  │
│  - Admin Panel                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MOBILE (Expo)                          │
│  - Driver App                           │
│  - Voice Recording                      │
│  - POD Capture                          │
│  - Trip Management                      │
└─────────────────────────────────────────┘
Backend Layer
┌─────────────────────────────────────────┐
│  API (Next.js API Routes + tRPC)        │
│  - /api/process-tale                    │
│  - /api/process-pod                     │
│  - /api/payments                        │
│  - /api/trucks                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  AUTOMATION (n8n Workflows)             │
│  - Payment Processing                   │
│  - SMS Notifications                    │
│  - Webhook Handling                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BACKGROUND JOBS (Inngest)              │
│  - Jam Prediction                       │
│  - Route Optimization                   │
│  - Analytics Calculation                │
└─────────────────────────────────────────┘
AI/ML Layer
┌─────────────────────────────────────────┐
│  Gemini 1.5 Flash                       │
│  - NLP Processing                       │
│  - Intent Classification                │
│  - Entity Extraction                    │
│  - Vision Verification                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Whisper (OpenAI)                       │
│  - Hindi Speech-to-Text                 │
│  - 99+ Language Support                 │
│  - Noise Filtering                      │
└─────────────────────────────────────────┘
Data Layer
┌─────────────────────────────────────────┐
│  Convex (Real-time Database)            │
│  - Live truck locations                 │
│  - Voice tales                          │
│  - Real-time subscriptions              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Prisma + Neon (PostgreSQL)             │
│  - Shipments                            │
│  - Drivers                              │
│  - Payment history                      │
│  - Analytics data                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Polygon Blockchain                     │
│  - POD Registry Smart Contract          │
│  - Immutable delivery proofs            │
│  - Payment records                      │
└─────────────────────────────────────────┘
Tech Stack Matrix
LayerTechnologyPurposeJustificationFrontend WebNext.js 15React frameworkLatest features, App Router, SSRTailwind CSS v4StylingRapid UI development, modernShadcn/uiComponentsAccessible, customizableMobileExpoReact Native frameworkCross-platform, easy deploymentVAPIVoice interfaceHindi support, easy integrationBackendtRPCType-safe APIEnd-to-end type safetyn8nWorkflow automationVisual workflows, integrationsDatabaseConvexReal-time DBLive sync, reactive queriesPrisma + NeonPostgreSQL ORMScalable, serverlessAI/MLGemini 1.5LLM processingHindi NLP, vision, reasoningWhisperSpeech-to-TextBest Hindi accuracyMapsMapbox GLMappingReal-time, customizableBlockchainPolygonSmart contractsLow cost, Ethereum-compatiblePaymentsRazorpayUPI integrationIndia-focused, reliableAuthClerkAuthenticationPhone OTP, webhooksJobsInngestBackground tasksReliable, observableMonitoringSentryError trackingReal-time alerts

📊 Success Metrics & KPIs
North Star Metric
Payment Speed: Average time from delivery to driver receiving payment

Baseline: 45 days (industry average)
Target: 60 seconds
Measurement: Track timestamp from POD submission to UPI confirmation

Key Performance Indicators
User Adoption
MetricTargetMeasurementDriver Signups1,000 in Month 1Registration countDaily Active Drivers60% retentionDAU/MAU ratioVoice Tales per Day5,000+Tale submission countApp Rating4.5+ starsPlay Store/App Store
Operational Efficiency
MetricTargetMeasurementLocation Accuracy95%+GPS validationNLP Extraction Accuracy92%+Manual verification samplePayment Success Rate99%+Successful UPI transfersAverage Processing Time<500msAPI response time
Business Impact
MetricTargetMeasurementFuel Cost Reduction18-22%Before/after comparisonOn-Time Delivery Rate+30% improvementDelivery timestampsPayment Dispute Reduction90% fewerSupport ticket countFleet Visibility100% real-timeActive GPS signals
Technical Performance
MetricTargetMeasurementAPI Uptime99.9%Status monitoringMap Update Latency<5 secondsReal-time sync measurementMobile App Crash Rate<1%Sentry error trackingBlockchain TX Success99%+Smart contract events

🚀 MVP Scope (HackNova Demo)
Must Have (P0)
✅ Voice Recording: Driver can record Hindi voice update
✅ Live Map: Shipper sees truck location update in real-time
✅ POD Capture: Driver takes photo, system verifies
✅ Instant Payment: UPI payment triggered on POD verification
✅ Jam Prediction: Basic pattern detection from 3+ similar reports
Should Have (P1)
🔄 Sentiment Analysis: Detect driver urgency
🔄 Route Suggestions: Show alternate routes
🔄 SMS Alerts: Notify nearby drivers
🔄 Analytics Dashboard: Basic metrics display
🔄 Blockchain Verification: View POD on Polygonscan
Nice to Have (P2)
⭕ Multi-language Support: Add Tamil, Telugu
⭕ Voice Assistant: Two-way conversation
⭕ Gamification: Driver leaderboard
⭕ 3D Visualization: Three.js truck models
⭕ Offline Mode: Queue updates when offline
Won't Have (Out of Scope)
❌ Fleet management tools (route planning)
❌ Customer booking portal
❌ Driver payroll system
❌ Vehicle maintenance tracking
❌ Insurance integration

🎯 User Flows
Flow 1: Driver Records Voice Update
1. Driver opens app → Sees active trip
2. Taps large mic button → Recording starts
3. Speaks: "NH44 pe traffic hai boss"
4. Taps stop → Sees transcription
5. System extracts location → Updates map
6. Driver sees confirmation → "Tale recorded"
7. Shipper dashboard updates → Shows delay alert
Flow 2: POD Submission & Payment
1. Driver arrives at destination
2. Opens app → Taps "Capture POD"
3. Takes photo of signed document
4. AI verifies signature → "Valid POD"
5. Photo hash stored on blockchain → TX hash shown
6. Payment workflow triggers → Loading indicator
7. UPI payment sent → "₹15,000 received"
8. SMS confirmation → Driver happy
9. Shipper sees blockchain link → Can verify anytime
Flow 3: Jam Prediction & Rerouting
1. Driver A reports "NH44 flood at KM-42"
2. Driver B reports same 10 mins later
3. Driver C reports same 5 mins after that
4. System detects pattern → Calculates risk: 0.85
5. Finds 5 trucks within 50km → Generates routes
6. Sends SMS to all 5 → "Avoid NH44-KM42, use SH17"
7. Drivers accept → Navigation updates
8. System tracks → Saves 6 hours + ₹3,000 each
9. Learning improves → Better predictions next time

🔒 Security & Privacy
Data Protection

Encryption: All API calls use HTTPS/TLS 1.3
Voice Data: Deleted after transcription (GDPR compliant)
Location: Only current location stored, history purged after 30 days
Payment: PCI-DSS compliant via Razorpay
Blockchain: Only photo hash stored, not actual image

Authentication

Driver Auth: Clerk phone OTP (2FA)
Shipper Auth: Email + password with MFA
API Keys: Stored in environment variables, rotated monthly
Wallet Keys: Encrypted at rest, never exposed to frontend

Privacy Considerations

Minimal Data: Only collect what's necessary
User Consent: Explicit permission for location/voice
Right to Delete: Users can request data deletion
Anonymization: Analytics use anonymized IDs
Transparency: Privacy policy in Hindi + English


📱 Platform Support
Mobile (Expo App)

iOS: 13.0+
Android: 8.0+ (API level 26)
Platforms: Phone only (no tablet optimization in MVP)

Web (Next.js Dashboard)

Browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
Responsive: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

Smart Contracts

Network: Polygon Mumbai (testnet for demo), Polygon Mainnet (production)
Solidity: 0.8.0+


🌍 Localization
Languages (MVP)

Primary: Hindi (Devanagari script)
Secondary: English
Voice Support: Hindi, Hinglish (code-switching)

Future Languages

Tamil, Telugu, Marathi, Bengali, Punjabi (post-MVP)

Cultural Considerations

Terminology: Use local truck driver lingo ("tale", "boss", "bhai")
Units: Kilometers (not miles), Rupees (₹)
Date/Time: DD/MM/YYYY, 24-hour format


💰 Business Model (Future)
Revenue Streams

SaaS Subscription: ₹500/truck/month for fleet owners
Transaction Fee: 1% on instant payments (₹150 per ₹15,000)
Premium Features: Advanced analytics, API access
Enterprise: Custom deployments for large logistics companies

Pricing Tiers

Free: 5 trucks, basic features
Pro: ₹5,000/month for 20 trucks, all features
Enterprise: Custom pricing, dedicated support


📈 Roadmap
Phase 1: MVP (HackNova - 48 hours)

✅ Voice recording + NLP
✅ Live map tracking
✅ POD capture + blockchain
✅ Instant payments
✅ Basic jam prediction

Phase 2: Beta (Month 1-2)

🔄 Onboard 100 real drivers
🔄 Multi-language support
🔄 Advanced analytics
🔄 Mobile app optimization
🔄 Production blockchain deployment

Phase 3: Scale (Month 3-6)

🔄 1,000 active drivers
🔄 Integration with major logistics companies
🔄 ML model improvement
🔄 Voice assistant
🔄 Driver mobile web app

Phase 4: Expansion (Month 6-12)

🔄 10,000 active drivers
🔄 Pan-India coverage
🔄 International expansion (Bangladesh, Nepal)
🔄 Additional services (insurance, fuel cards)


🎪 Demo Script (For Judges)
3-Minute Live Demo
[0:00-0:30] - The Problem

Show dispatcher frustrated, making 20 calls
Show driver frustrated, waiting 45 days for payment
Show Excel sheet mess of manual tracking

[0:30-1:15] - Voice Tracking

Driver opens app → Records "NH44 pe traffic hai, KM-42 pe stuck"
Live map updates instantly → Red pin appears
Shipper dashboard shows alert → "Ram Singh delayed"

[1:15-2:00] - Instant Payment

Driver arrives → Takes POD photo
AI verifies → "Valid signature detected"
Blockchain records → Show Polygonscan TX
Payment sent → "₹15,000 received in 60 seconds"

[2:00-2:45] - AI Prediction

Show 3 driver reports on same route
System detects pattern → Risk score: 0.85
5 nearby trucks identified → Reroute SMS sent
Map shows alternate routes → Savings: 6 hours, ₹3,000

[2:45-3:00] - Impact

Show metrics dashboard
"45 days → 60 seconds. 64,800x faster."
"18-22% fuel savings. ₹50,000 Cr market impact."
Call to action: "Join the revolution!"


📝 Open Questions & Risks
Technical Risks

Whisper API Rate Limits: Mitigation: Self-host Whisper for scale
Mapbox Costs: Mitigation: Negotiate volume pricing
Blockchain Gas Fees: Mitigation: Use Polygon (low cost), batch transactions
Real-time Sync Scale: Mitigation: Convex can handle 100K+ concurrent

Business Risks

Driver Adoption: Mitigation: Incentivize early adopters
Internet Connectivity: Mitigation: Offline mode with queue sync
Payment Partner Reliability: Mitigation: Multi-gateway support
Competition: Mitigation: Voice-first moat, Hindi-first approach

Regulatory Risks

Data Privacy (GDPR): Mitigation: Minimize data collection, encryption
Payment Regulations: Mitigation: Partner with licensed providers
Blockchain Compliance: Mitigation: Only store hashes, not personal data


🤝 Stakeholder Communication
For Drivers

Language: Hindi/Hinglish, simple terms
Channel: WhatsApp, SMS, voice calls
Frequency: Weekly tips, instant alerts

For Fleet Owners

Language: English, business terminology
Channel: Email, dashboard notifications
Frequency: Daily reports, monthly analytics

For Investors

Language: Technical + business metrics
Channel: Pitch decks, demo videos
Frequency: Quarterly updates


📚 Appendix
Glossary

Tale: Voice update from driver
POD: Proof of Delivery
NLP: Natural Language Processing
STT: Speech-to-Text
TTS: Text-to-Speech
KM: Kilometer marker on highway

References

NITI Aayog - India Logistics Report 2023
World Bank - Logistics Performance Index 2023
SaveLIFE Foundation - Truck Drivers in India 2023
MIT FreightLab - AI in Logistics 2022