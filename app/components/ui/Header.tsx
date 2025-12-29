import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex flex-col">
          <Link href="/" className="text-2xl font-bold">
            BoardSaga
          </Link>
          <span className="text-sm text-muted-foreground">Turning moves into myths</span>
        </div>
        <nav className="flex gap-6 items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/lore" className="hover:underline">
            Lore
          </Link>
          <Link href="/stories" className="hover:underline">
            Stories
          </Link>
          <a
            href="https://github.com/BrianMwangi21/boardsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
