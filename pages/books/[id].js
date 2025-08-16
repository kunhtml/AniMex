import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ReaderModal from '../../components/ReaderModal';
import AnimatedButton from '../../components/AnimatedButton';
import Carousel from '../../components/Carousel';
import { fetchBookById, fetchBooks } from '../../lib/api';
import Head from 'next/head';

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [openReader, setOpenReader] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    
    // Fetch current book
    fetchBookById(id).then(data => {
      if (mounted) setBook(data);
    });
    
    // Fetch all books for recommendations
    fetchBooks().then(data => {
      if (mounted && data) {
        // Filter out current book and get random recommendations
        const otherBooks = data.filter(b => b.id !== id);
        const shuffled = otherBooks.sort(() => 0.5 - Math.random());
        setRecommendedBooks(shuffled.slice(0, 10)); // Get 10 random books
      }
    });
    
    return () => (mounted = false);
  }, [id]);

  if (!book) {
    return (
      <>
        <Header />
        <main className="container"><p>Đang tải...</p></main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{book.title} — Ổ Truyện</title>
      </Head>
      <Header />
      <main className="container">
        <div className="book-detail-card">
          <div className="book-cover-container">
            {book.image ? (
              <img src={book.image} alt={`${book.title} cover`} />
            ) : (
              <div className="cover" style={{height:320}}>
                <div className="cover-placeholder">
                  <span className="genre-tag">{book.genre}</span>
                  <div className="title-overlay">{book.title}</div>
                </div>
              </div>
            )}
          </div>
          <div className="book-info">
            <h2>{book.title}</h2>
            <div className="book-meta">
              <span><em>{book.author}</em></span>
              <span>·</span>
              <span>{book.genre}</span>
              <span>·</span>
              <span>{book.grade}</span>
              {book.chapter && (
                <>
                  <span>·</span>
                  <span className="chapter-info">📖 {book.chapter}</span>
                </>
              )}
            </div>
            <p className="book-excerpt">{book.description}</p>
            <div className="stats">
              <span className="views">👁️ {book.views?.toLocaleString() || 0} lượt xem</span>
              <span className="likes">❤️ {book.likes?.toLocaleString() || 0} lượt thích</span>
              <span className="status">📊 {book.status === 'ongoing' ? 'Đang cập nhật' : 'Hoàn thành'}</span>
            </div>
            <div className="book-actions">
              <AnimatedButton onClick={() => setOpenReader(true)} size="medium" variant="primary">
                Đọc truyện
              </AnimatedButton>
              <AnimatedButton href="/books" size="medium" variant="secondary">
                Quay lại
              </AnimatedButton>
            </div>
          </div>
        </div>



        {recommendedBooks.length > 0 && (
          <section className="recommended-section">
            <Carousel 
              title="📚 Truyện gợi ý khác"
              books={recommendedBooks}
              showViewMore={true}
              viewMoreHref="/books"
            />
          </section>
        )}
      </main>

      <ReaderModal
        isOpen={openReader}
        onClose={() => setOpenReader(false)}
        book={book}
      />
    </>
  );
}