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
- [x] Install and configure Vercel AI SDK
- [x] Set up API route for PGN analysis
- [x] Design prompts for:
  - Game overview (opening, middle game, endgame)
  - Key moments (turning points, blunders, brilliancies)
  - Player strategies and styles
- [x] Implement streaming response handling
- [x] Add error handling and retry logic
- [x] Rate limiting for API calls

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
- [x] Design story structure:
  - Title generation
  - Chapter breakdown (Opening, Middle Game, Endgame)
  - Highlight sections (Key moments)
- [x] Build story generation API route
- [x] Implement narrative flow logic
- [x] Add creative loading experience with flash cards
- [x] Support multiple story formats (short, detailed, epic)

### Deliverables
- Story generation API at `app/api/generate-story/route.ts`
- Story display component in `app/components/story/StoryViewer.tsx`
- Chess board visualization component in `app/components/chess/ChessBoard.tsx`
- Creative loading experience component in `app/components/ui/StoryLoading.tsx`
- Story type definitions in `lib/story-types.ts`
- Story generation prompts in `lib/prompts/story-prompts.ts`
- Tests for story generation prompts and API

### Definition of Done
- Stories generate successfully from analyzed games
- Stories are readable and engaging
- Users can review and edit stories

---

## Phase 4: Storage & Persistence

### Goal
Save generated stories and provide history management.

### Tasks
- [x] Set up MongoDB Atlas database
- [x] Design database schema:
  - Stories collection (PGN data, analysis, story metadata)
- [x] Implement MongoDB connection helper
- [x] Create API routes for CRUD operations:
  - Save story
  - Get story by ID
  - List user's stories
  - Delete story
  - Check for existing PGN
- [x] Add story history page

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
- [x] Design color palette:
  - Wood tones (light oak, walnut, mahogany)
  - Board colors (cream, brown)
  - Piece colors (ivory, ebony)
- [x] Create typography system:
  - Elegant serif for stories (Merriweather or Playfair Display)
  - Clean sans for UI (Inter or Lato)
- [x] Design layout components:
  - Navigation bar with chess motifs
  - Story display with paper texture
  - Chess board visualization
- [x] Add animations:
  - Smooth page transitions
  - Piece movement animations
  - Hover effects
- [x] Responsive design for mobile and desktop

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

## Phase 6: Stockfish Integration

### Goal
Integrate Stockfish chess engine to provide accurate, factual game analysis and eliminate LLM hallucinations.

### Architecture Notes
- **Engine Choice**: Stockfish.js (WebAssembly) for client-side OR server-side Stockfish via REST API
- **Integration Point**: Replace LLM-based move analysis with engine-based analysis in `/api/analyze-game`
- **Combined Flow**: PGN → Stockfish Analysis → Factual Data → LLM Story Generation

### Tasks
- [x] Choose Stockfish integration approach:
  - Option A: stockfish.js (WebAssembly) for client/server-side execution
  - Option B: REST API service (chess.com/lichess-style engine API)
  - Option C: Local Stockfish binary with Node.js wrapper
- [x] Install Stockfish dependencies
- [x] Create chess engine wrapper utility in `lib/stockfish-client.ts`:
  - Initialize engine
  - Analyze position by position
  - Extract evaluation scores
  - Identify move classifications (blunders, mistakes, best moves)
- [x] Implement tactical pattern detection:
  - Pins, forks, skewers
  - Sacrifices and combinations
  - Checkmate sequences
- [x] Update game analysis types in `lib/prompts/prompts.ts`:
  - Add `engineAnalysis` field with position evaluations
  - Add `moveClassifications` array (blunder, mistake, inaccuracy, good move, brilliancy)
  - Add `evaluations` array with centipawn scores for each move
- [x] Refactor `/api/analyze-game/route.ts`:
  - Use Stockfish for move-by-move analysis instead of LLM
  - Keep LLM for high-level narrative context (themes, strategies)
  - Merge engine data with existing analysis structure
- [x] Update story generation prompts in `lib/prompts/story-prompts.ts`:
  - Pass actual move evaluations to LLM
  - Instruct LLM to use factual engine data only
  - Remove move number guessing - use engine-provided data
- [x] Add move validation in `/api/generate-story/route.ts`:
  - Cross-reference story move references with actual game moves
  - Auto-correct or flag hallucinated moves
  - Ensure FEN and SAN notation match
- [x] Add engine analysis tests in `lib/__tests__/stockfish-client.test.ts`

### Tech Notes
- **Stockfish.js**: https://github.com/nmrugg/stockfish.js - WebAssembly build of Stockfish
- **Stockfish Node**: Use `stockfish` npm package for server-side execution
- **Evaluation Format**: Centipawn score (e.g., +150 = 1.5 pawn advantage, mate in 3 = #3)
- **Move Classifications**:
  - Blunder: >200 centipawn loss
  - Mistake: 100-200 centipawn loss
  - Inaccuracy: 50-99 centipawn loss
  - Good move: 0-49 centipawn loss
  - Brilliancy: Gains >200 centipawn or finds tactical shot
- **Engine Depth**: 15-20 plies for good balance of speed/accuracy

### Deliverables
- Stockfish wrapper in `lib/stockfish-client.ts`
- Updated analysis types with engine data in `lib/prompts/prompts.ts`
- Refactored `/api/analyze-game/route.ts` using Stockfish
- Updated story prompts in `lib/prompts/story-prompts.ts`
- Move validation in `/api/generate-story/route.ts`
- Tests for engine analysis in `lib/__tests__/stockfish.test.ts`

### Definition of Done
- Stockfish successfully analyzes PGN games
- All moves have accurate evaluation scores
- No hallucinated moves in generated stories
- Move references in stories match actual PGN moves
- LLM uses factual engine data for narrative

---

## Phase 7: Story Enhancement

### Goal
Elevate storytelling quality with pure 3rd-person narration, enhanced piece lore, and more emotional, animated narratives.

### Architecture Notes
- **Model Migration**: Switch from Meta Llama to TNG-R1T-Chimera (Nov 2025 model) for superior storytelling capabilities
- **Narrative Shift**: Remove all first-person piece perspectives, switch to pure 3rd-person omniscient narrator
- **Lore Integration**: Increase piece lore usage from ~70% to 85-90% for richer character development
- **Emotional Depth**: Add vivid descriptions, dramatic tension, and heart-felt language throughout stories

### Tasks
- [x] Switch LLM model to `tngtech/tng-r1t-chimera:free` in `/api/generate-story/route.ts`
- [x] Rewrite story generation prompts in `lib/prompts/story-prompts.ts`:
  - Remove all first-person narration (no "I, Queen, watched...")
  - Implement pure 3rd-person omniscient narrator style
  - Add instructions for vivid, animated storytelling (piece movements as dance, battle)
  - Enhance emotional tension and dramatic moments
  - Boost lore usage requirement to 85-90%
  - Add evocative, heart-felt language guidelines
- [x] Expand `lib/prompts/LORE.md`:
  - Add richer piece backstories and personalities
  - More catchphrases, quirks, motivations
  - Piece rivalries, friendships, fears, dreams
  - Emotional themes and dramatic elements
- [x] Update `app/lore/page.tsx` with enhanced piece data and expanded themes
- [x] Test story generation with new model and prompts
  - Verify pure 3rd-person narration
  - Confirm enhanced lore integration
  - Validate emotional storytelling quality

### Tech Notes
- **TNG-R1T-Chimera Model**: Nov 2025 free model optimized for creative storytelling and character interaction
- **Narrative Style**: Traditional author-style 3rd-person omniscient narrator (George R.R. Martin, Tom Clancy, Stephen King, Bernard Cornwell, Ernest Hemingway inspired)
- **Lore Expansion**: Each piece gets deeper backstory, inner motivations, and emotional range
- **Story Guidelines**:
  - Describe pieces' movements with animated language ("The knight danced across the board")
  - Build dramatic tension at key moments (brilliancies, blunders, checkmate)
  - Focus on emotional weight of sacrifices, promotions, and captures
  - Use piece personalities to drive narrative, not just add quotes
  - Action-oriented war chronicle style with varied pacing

### Deliverables
- Updated model configuration in `app/api/generate-story/route.ts`
- Rewritten story prompts in `lib/prompts/story-prompts.ts` with 3rd-person only
- Enhanced lore documentation in `lib/prompts/LORE.md`
- Updated lore page with enhanced piece data and expanded themes
- Test stories demonstrating improved quality (10 chapters, 2,973 words, pure 3rd-person)

### Definition of Done
- [x] Stories use pure 3rd-person narration (no first-person "I" from pieces)
- [x] TNG-R1T-Chimera model successfully generates stories
- [x] Piece lore appears in 85-90% of story content
- [x] Stories feel more animated, emotional, and heart-felt
- [x] At least 2 test stories generated showing improvement

---

## Future Enhancements (Post-MVP)

- [ ] User authentication and accounts
- [ ] Social features (share stories, comments)
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

### Stockfish Setup
1. Install stockfish npm package: `npm install stockfish`
2. Or use stockfish.js for WebAssembly: `npm install stockfish.js`
3. Configure engine depth in `.env.local` (STOCKFISH_DEPTH=18)
4. Adjust engine threads based on server capacity (STOCKFISH_THREADS=2)

### Deployment
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

---

*Last updated: December 30, 2025*
