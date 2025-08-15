import { useEffect, useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import AnimatedButton from '../components/AnimatedButton';
import BlobChip from '../components/BlobChip';
import { fetchBooks } from '../lib/api';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchBooks().then(data => {
      if (mounted) {
        setBooks(data || []);
        setLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const filtered = books.filter(b => {
    const matchesFilter =
      filter === 'all' ? true : (b.grade === filter || (b.tags || []).includes(filter));
    const matchesQ = q.trim() === '' ? true : (
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.author.toLowerCase().includes(q.toLowerCase())
    );
    return matchesFilter && matchesQ;
  });

  function getFilterLabel(filter) {
    const labels = {
      'all': 'Tất cả',
      'action': 'Action',
      'romance': 'Romance',
      'comedy': 'Comedy',
      'fantasy': 'Fantasy',
      'drama': 'Drama',
      'mystery': 'Mystery',
      'adventure': 'Adventure',
      'shounen': 'Shounen',
      'shoujo': 'Shoujo',
      'seinen': 'Seinen',
      'martial-arts': 'Võ thuật'
    };
    return labels[filter] || filter;
  }

  return (
    <>
      <Header q={q} onSearch={setQ} />
      <main className="container">
        <div className="page-header">
          <h1>Hang Truyện</h1>
          <p className="page-subtitle">Khám phá thế giới truyện tranh manga, manhwa, manhua</p>
        </div>

        <section className="library-description">
          <div className="description-content">
            <div className="description-text">
              <h2>🌟 Truyện gợi ý</h2>
              <p>
                Chào mừng bạn đến với Hang Truyện - nơi hội tụ những bộ truyện tranh 
                manga, manhwa, manhua chất lượng cao. Chúng tôi cung cấp kho tàng truyện tranh phong phú 
                từ các thể loại hành động, lãng mạn đến phiêu lưu, phù hợp với mọi lứa tuổi độc giả.
              </p>
              <div className="features-grid">
                <div className="feature-item">
                  <span className="feature-icon">📚</span>
                  <div>
                    <h3>Đa dạng thể loại</h3>
                    <p>Action, Romance, Comedy, Fantasy, Drama, Mystery và nhiều thể loại khác</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <div>
                    <h3>Phân loại theo thể loại</h3>
                    <p>Truyện được tổ chức theo thể loại, dễ dàng tìm kiếm và đọc</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💡</span>
                  <div>
                    <h3>Nội dung chất lượng</h3>
                    <p>Được dịch thuật và biên tập bởi các nhóm dịch chuyên nghiệp</p>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔍</span>
                  <div>
                    <h3>Tìm kiếm thông minh</h3>
                    <p>Dễ dàng tìm truyện theo tên, tác giả hoặc thể loại</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="stats-section">
              <div className="stat-item">
                <span className="stat-number">{books.length}</span>
                <span className="stat-label">Bộ truyện</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Thể loại</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Nguồn gốc</span>
              </div>
            </div>
          </div>
        </section>

        <section className="controls" aria-label="Bộ lọc sách">
          <div className="chips" role="list">
            {['all','action','romance','comedy','fantasy','drama','mystery','adventure','shounen','shoujo','seinen','martial-arts'].map(c => (
              <BlobChip
                key={c}
                active={filter === c}
                onClick={() => setFilter(c)}
              >
                {getFilterLabel(c)}
              </BlobChip>
            ))}
          </div>
        </section>

        <section className="books-section" aria-label="Danh sách sách">
          <div className="section-header">
            <h2>Tất cả truyện ({filtered.length})</h2>
            <AnimatedButton href="/" size="small" variant="secondary">
              Về trang chủ
            </AnimatedButton>
          </div>
          
          {loading ? (
            <div className="loading">
              <p>Đang tải truyện...</p>
            </div>
          ) : (
            <div className="books-grid" role="list">
              {filtered.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
              {filtered.length === 0 && (
                <div className="no-results">
                  <p>Không tìm thấy truyện phù hợp.</p>
                  <AnimatedButton onClick={() => {setFilter('all'); setQ('')}} size="small">
                    Xem tất cả
                  </AnimatedButton>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}