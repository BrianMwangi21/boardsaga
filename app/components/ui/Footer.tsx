import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BoardSaga. Turning moves into myths.</p>
        <div className="mt-2">
          <Link
            href="https://github.com/BrianMwangi21/boardsaga"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View on GitHub
          </Link>
        </div>
      </div>
    </footer>
  )
}
