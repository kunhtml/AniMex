import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import Carousel from '../components/Carousel';
import BlobChip from '../components/BlobChip';
import { fetchBooks } from '../lib/api';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    fetchBooks().then(data => {
      if (mounted) setBooks(data || []);
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
      'co-dai': 'Cổ Đại'
    };
    return labels[filter] || filter;
  }

  return (
    <>
      <Header q={q} onSearch={setQ} />
      <main className="container">
        <section className="hero" aria-labelledby="hero-title">
          <h1 id="hero-title">🌟 Ổ Truyện - Đọc Truyện Online</h1>
          <p className="hero-sub">Nền tảng đọc truyện trực tuyến miễn phí hàng đầu với kho truyện phong phú đủ thể loại, luôn cập nhật nhanh chóng</p>
        </section>

        <Carousel books={books} title="💯 Top thịnh hành" />

        <section className="controls" aria-label="Bộ lọc sách">
          <div className="chips" role="list">
            {['all','action','adventure','comedy','drama','fantasy','horror','romance','mystery','martial-arts','supernatural','xuyen-khong'].map((c, index) => (
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

        <section className="books-section" aria-label="Danh sách truyện">
          <h2 className="visually-hidden">Truyện nổi bật</h2>
          <div className="books-grid" role="list">
            {filtered.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
            {filtered.length === 0 && <p>Không tìm thấy truyện.</p>}
          </div>
        </section>
      </main>
    </>
  );
}