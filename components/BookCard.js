import Link from 'next/link';

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`} className="book-card-link">
      <article className="card" role="listitem" aria-label={book.title}>
        <div className="cover">
          {book.image ? (
            <img src={book.image} alt={`${book.title} cover`} />
          ) : (
            <div className="cover-placeholder" style={{ background: `linear-gradient(135deg, ${coverColor(book.id)} 0%, #ffffff 100%)` }}>
              <span className="genre-tag">{book.genre}</span>
              <div className="title-overlay">{book.title}</div>
            </div>
          )}
        </div>
        <div className="meta">
          <div className="title">{book.title}</div>
          <small>{book.author} · {book.grade}</small>
          <div className="stats">
            <span className="views">👁️ {book.views?.toLocaleString() || 0}</span>
            <span className="likes">❤️ {book.likes?.toLocaleString() || 0}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function coverColor(id) {
  const palette = ['#60a5fa', '#86efac', '#fca5a5', '#fdba74', '#c7b4ff'];
  return palette[Number(id) % palette.length] || palette[0];
}