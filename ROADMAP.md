# BoardSaga Roadmap

## Overview

This roadmap breaks down BoardSaga into modular, achievable phases. Each phase builds on the previous one, allowing for iterative development and testing.

---

## Phase 1: PGN Upload & Parsing

### Goal
Allow users to upload PGN files and validate/parse them correctly.

### Architecture Notes
- **PGN Upload**: This is the main index page (app/page.tsx) - the entry point of the application
- **Reusable Components**: Header and footer components should be created in components/ui/ for consistent styling and reusability
- **Next.js Layout**: Use app/layout.tsx to wrap pages with header/footer for consistent layout across the app

### Tasks
- [x] Create PGN upload UI component with drag-and-drop support
- [x] Implement PGN validation (check file format, content structure)
- [x] Build PGN parser to extract:
  - Game metadata (players, date, event, result)
  - Move list (standard algebraic notation)
  - Comments and annotations (if present)
- [x] Display parsed PGN data for user confirmation
- [x] Add error handling for invalid PGNs

### Deliverables
- Upload component in `app/components/PGNUploader.tsx`
- PGN parser in `lib/pgn-parser.ts`
- API route at `app/api/parse-pgn/route.ts`

### Definition of Done
- Users can upload PGN files
- Invalid PGNs show helpful error messages
- Parsed data displays correctly before proceeding

---

## Phase 2: LLM Integration

### Goal
Set up LLM analysis for chess games using Vercel AI SDK.

### Tasks
- [ ] Install and configure Vercel AI SDK
- [ ] Set up API route for PGN analysis
- [ ] Design prompts for:
  - Game overview (opening, middle game, endgame)
  - Key moments (turning points, blunders, brilliancies)
  - Player strategies and styles
- [ ] Implement streaming response handling
- [ ] Add error handling and retry logic
- [ ] Rate limiting for API calls

### Tech Notes
- Use open-source LLMs via Vercel AI SDK (Qwen, DeepSeek, Kimi, or GPT-OSS)
- Configure provider in `.env.local`
- Implement cost-conscious prompts

### Deliverables
- Analysis API route at `app/api/analyze-game/route.ts`
- Prompt templates in `lib/prompts/`
- Configuration file for LLM settings

### Definition of Done
- API successfully analyzes PGN data
- Returns structured game insights
- Error handling works for edge cases

---

## Phase 3: Story Generation

### Goal
Generate engaging stories from analyzed chess games.

### Tasks
- [ ] Design story structure:
  - Title generation
  - Chapter breakdown (Opening, Middle Game, Endgame)
  - Highlight sections (Key moments)
- [ ] Build story generation API route
- [ ] Implement narrative flow logic
- [ ] Add story review/edit UI
- [ ] Support multiple story formats (short, detailed, epic)

### Deliverables
- Story generation API at `app/api/generate-story/route.ts`
- Story display component in `app/components/StoryViewer.tsx`
- Story editor component in `app/components/StoryEditor.tsx`

### Definition of Done
- Stories generate successfully from analyzed games
- Stories are readable and engaging
- Users can review and edit stories

---

## Phase 4: Storage & Persistence

### Goal
Save generated stories and provide history management.

### Tasks
- [ ] Set up MongoDB Atlas database
- [ ] Design database schema:
  - Games collection (PGN data, parsed moves)
  - Stories collection (generated stories, metadata)
  - Users collection (if authentication added later)
- [ ] Implement MongoDB connection helper
- [ ] Create API routes for CRUD operations:
  - Save story
  - Get story by ID
  - List user's stories
  - Delete story
- [ ] Add story history page
- [ ] Implement search/filter functionality

### Database Choice
**MongoDB Atlas** - Perfect for Vercel deployment with free tier, flexible schema, and great developer experience.

### Deliverables
- Database connection in `lib/db.ts`
- Models/schemas in `lib/models/`
- Story CRUD API routes in `app/api/stories/`
- History page at `app/history/page.tsx`

### Definition of Done
- Stories save to database
- Users can view and manage their story history
- Search and filter work correctly

---

## Phase 5: Chess-Themed UI

### Goal
Apply classic wood chess theme throughout the application.

### Tasks
- [ ] Design color palette:
  - Wood tones (light oak, walnut, mahogany)
  - Board colors (cream, brown)
  - Piece colors (ivory, ebony)
- [ ] Create typography system:
  - Elegant serif for stories (Merriweather or Playfair Display)
  - Clean sans for UI (Inter or Lato)
- [ ] Design layout components:
  - Navigation bar with chess motifs
  - Story display with paper texture
  - Chess board visualization
- [ ] Add animations:
  - Smooth page transitions
  - Piece movement animations
  - Hover effects
- [ ] Responsive design for mobile and desktop

### Theme Guidelines
- Primary colors: #D4A373 (light wood), #8B4513 (dark wood)
- Background: #F5F0E6 (cream/paper)
- Text: #2C1810 (dark brown)
- Accents: #C19A6B (golden wood)

### Deliverables
- Updated `app/globals.css` with theme
- Reusable UI components in `components/ui/`
- Board visualization component in `components/chess/ChessBoard.tsx`

### Definition of Done
- App has cohesive classic wood theme
- Responsive design works on all devices
- Animations enhance user experience

---

## Future Enhancements (Post-MVP)

- [ ] User authentication and accounts
- [ ] Social features (share stories, comments)
- [ ] Chess engine integration for deeper analysis
- [ ] Interactive board replay alongside story
- [ ] Multi-language support
- [ ] Export stories (PDF, EPUB)
- [ ] Community story gallery

---

## Development Notes

### MongoDB Atlas Setup
1. Create free account at mongodb.com
2. Create cluster (M0 free tier)
3. Create database user and whitelist IP (0.0.0.0 for Vercel)
4. Add connection string to `.env.local`

### LLM Provider Setup
1. Choose provider (OpenRouter, Groq, or similar for open-source models)
2. Get API key
3. Configure in Vercel AI SDK
4. Update prompts as needed

### Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

---

*Last updated: December 2025*
