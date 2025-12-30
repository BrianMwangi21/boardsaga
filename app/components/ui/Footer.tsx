export default function Footer() {
  return (
    <footer
      className="border-t border-wood-dark mt-auto"
      style={{
        background: 'linear-gradient(135deg, #C19A6B 0%, #A0522D 100%)',
        boxShadow: '0 -2px 8px rgba(44, 24, 16, 0.1)',
      }}
    >
      <div className="container mx-auto px-4 py-6 text-center">
        <p
          className="text-white transition-all duration-200"
          style={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: 'var(--text-base)',
          }}
        >
          &copy; {new Date().getFullYear()} BoardSaga. Turning moves into myths.
        </p>
      </div>
    </footer>
  )
}
