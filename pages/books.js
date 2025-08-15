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
    const matchesFilter = filter === 'all' ? true : (
      b.genre?.toLowerCase().includes(filter.toLowerCase()) ||
      (b.tags || []).some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
      b.grade?.toLowerCase() === filter.toLowerCase()
    );
    const matchesQ = q.trim() === '' ? true : (
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.author.toLowerCase().includes(q.toLowerCase()) ||
      b.genre?.toLowerCase().includes(q.toLowerCase())
    );
    return matchesFilter && matchesQ;
  });

  function getFilterLabel(filter) {
    const labels = {
      'all': 'Tất cả',
      'action': 'Action',
      'adventure': 'Adventure',
      'comedy': 'Comedy',
      'drama': 'Drama',
      'fantasy': 'Fantasy',
      'horror': 'Horror',
      'romance': 'Romance',
      'mystery': 'Mystery',
      'martial-arts': 'Martial Arts',
      'supernatural': 'Supernatural',
      'school-life': 'School Life',
      'slice-of-life': 'Slice of Life',
      'shounen': 'Shounen',
      'shoujo': 'Shoujo',
      'seinen': 'Seinen',
      'josei': 'Josei',
      'xuyen-khong': 'Xuyên Không',
      'chuyen-sinh': 'Chuyển Sinh',
      'ngon-tinh': 'Ngôn Tình',
      'co-dai': 'Cổ Đại',
      'ecchi': 'Ecchi',
      'harem': 'Harem',
      'mecha': 'Mecha',
      'psychological': 'Psychological',
      'sci-fi': 'Sci-fi',
      'sports': 'Sports',
      'tragedy': 'Tragedy',
      'webtoon': 'Webtoon'
    };
    return labels[filter] || filter;
  }

  return (
    <>
      <Header q={q} onSearch={setQ} />
      <main className="container">
        <div className="page-header">
          <h1>Ổ Truyện</h1>
          <p className="page-subtitle">Nền tảng đọc truyện trực tuyến miễn phí hàng đầu</p>
        </div>

        <section className="library-description">
          <div className="description-content">
            <div className="description-text">
              <h2>🌟 Truyện gợi ý</h2>
              <p>
                Chào mừng bạn đến với Ổ Truyện - nền tảng đọc truyện trực tuyến miễn phí hàng đầu. 
                Chúng tôi cung cấp kho truyện phong phú với đủ thể loại, từ tiên hiệp, kiếm hiệp, ngôn tình 
                đến truyện đô thị hiện đại hay huyền huyễn kỳ ảo, luôn được cập nhật nhanh chóng và liên tục.
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
                <span className="stat-number">25+</span>
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
            {['all','action','adventure','comedy','drama','fantasy','horror','romance','mystery','martial-arts','supernatural','school-life','shounen','shoujo','seinen','xuyen-khong','chuyen-sinh','ngon-tinh','ecchi','harem','webtoon'].map(c => (
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