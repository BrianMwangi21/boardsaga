# BoardSaga Agent Guidelines

## Development Principles

### Component Design
- **Single Responsibility**: Each component should solve one specific problem
- **Loose Coupling**: Avoid tight coupling between components - use props and callbacks for communication
- **High Cohesion**: Group related functionality together
- **Reusability**: Create reusable UI components (buttons, inputs, cards) in app/components/ui/

### Function Design
- **Pure Functions**: Where possible, write pure functions (no side effects)
- **Small Functions**: Keep functions focused and concise - if a function does more than one thing, split it
- **Clear Names**: Use descriptive names that explain what the function does
- **Type Safety**: Leverage TypeScript properly - define clear interfaces and types

### File Organization
```
app/components/
  ui/           # Reusable UI components (Header, Footer, Button, Card)
  pgn/          # PGN-specific components (PGNUploader, PGNDisplay)
  story/        # Story-specific components (StoryViewer, StoryEditor)
  chess/        # Chess-related components (ChessBoard, Piece)

lib/
  pgn-parser.ts     # PGN parsing logic
  prompts/          # LLM prompt templates
  db.ts             # Database connection
  utils/            # Helper utilities
```

### Code Style
- Follow existing patterns in the codebase
- Check package.json for linting/formatting tools before creating new rules
- Run lint/typecheck after completing tasks
- Avoid over-engineering - keep it simple (vibe-coded)

### API Design
- RESTful API routes in app/api/
- Clear error messages and proper HTTP status codes
- Input validation on all endpoints
- Structured responses (success/error objects)

### Testing Strategy
- Check if tests exist in the project before writing new test code
- If test framework is not set up, ask the user for the test command
- Run tests before committing

### Phase Workflow
1. Read the current phase requirements in ROADMAP.md
2. Implement deliverables listed in the phase
3. Verify Definition of Done is met
4. Run linting/typechecking if available
5. Update sessions.md with completed work

### Important Notes
- Always check existing code structure before creating new files
- Use Next.js conventions (App Router, Server Components where appropriate)
- Leverage TypeScript for type safety
- Keep UI responsive and accessible
- Don't add comments unless explicitly asked
