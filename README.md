# BoardSaga

Transform chess PGN files into captivating stories powered by AI.

## What It Does

Upload your chess games (PGN files) and get a generated story that brings your matches to life. BoardSaga analyzes your games and creates narratives that capture the drama, strategy, and memorable moments of each match.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React with TypeScript
- **Styling**: CSS (classic wood chess theme)
- **Database**: MongoDB Atlas (Vercel-compatible)
- **AI**: Vercel AI SDK with open-source LLMs
- **Deployment**: Vercel

## Getting Started

1. Clone the repo:
```bash
git clone <your-repo-url>
cd boardsaga
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your MongoDB URI and LLM API keys
```

4. Run the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
boardsaga/
├── app/              # Next.js app router pages and API routes
├── components/       # React components
├── lib/             # Utilities and helpers
├── public/          # Static assets
└── ROADMAP.md       # Development roadmap
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed development phases.

## Contributing

This is a hobby project built with love for chess. Feel free to open issues or PRs!

## License

MIT
