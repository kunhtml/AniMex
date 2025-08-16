import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedButton from './AnimatedButton';

export default function Carousel({
  books = [],
  title = "Sách nổi bật",
  autoPlay = true,
  autoPlayInterval = 3000
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(Math.min(books.length, 5));
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      let maxItemsPerScreen;
      
      if (window.innerWidth < 768) {
        maxItemsPerScreen = 2;
      } else if (window.innerWidth < 1024) {
        maxItemsPerScreen = 3;
      } else if (window.innerWidth < 1200) {
        maxItemsPerScreen = 4;
      } else {
        maxItemsPerScreen = 5;
      }
      
      // Nếu số manga ít hơn số ô tối đa, chỉ hiển thị đúng số manga có
      const actualItemsToShow = Math.min(books.length, maxItemsPerScreen);
      setItemsPerView(actualItemsToShow);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [books.length]);

  const maxIndex = Math.max(0, books.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => {
      // Nếu đã ở slide cuối, quay về đầu
      if (prev >= maxIndex) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || isHovered || books.length <= itemsPerView) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isHovered, books.length, itemsPerView, currentIndex]);



  if (!books.length) return null;

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <AnimatedButton href="/books" size="small" variant="primary">
          Xem thêm
        </AnimatedButton>
      </div>

      <div
        className="carousel-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {books.length > itemsPerView && (
          <button
            className="carousel-nav prev"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Sách trước"
          >
            &#8249;
          </button>
        )}

        <div className="carousel-wrapper">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(books.length / itemsPerView) * 100}%`
            }}
          >
            {books.map((book, index) => (
              <div key={book.id} className="carousel-item">
                <Link href={`/books/${book.id}`} className="book-card-link">
                  <div className="book-card">
                    <div className="book-cover">
                      {book.image ? (
                        <img src={book.image} alt={book.title} />
                      ) : (
                        <div
                          className="book-cover-placeholder"
                          style={{ background: `linear-gradient(135deg, ${getCoverColor(book.id)}, #ffffff)` }}
                        >
                          <span className="book-subject">{getSubjectLabel(book.tags)}</span>
                          <h3 className="book-title-overlay">{book.title}</h3>
                        </div>
                      )}
                    </div>
                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {books.length > itemsPerView && (
          <button
            className="carousel-nav next"
            onClick={nextSlide}
            aria-label="Sách tiếp theo"
          >
            &#8250;
          </button>
        )}
      </div>

      {books.length > itemsPerView && (
        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Đi đến slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function getCoverColor(id) {
  const colors = [
    '#FF6B35', // Orange (Toán)
    '#E91E63', // Pink (Đạo đức)
    '#4CAF50', // Green (Tự nhiên & Xã hội)
    '#9C27B0', // Purple (Giáo dục thể chất)
    '#2196F3', // Blue
    '#FF9800', // Amber
  ];
  return colors[Number(id) % colors.length] || colors[0];
}

function getSubjectLabel(tags) {
  if (!tags || !tags.length) return '';
  const tagMap = {
    'math': 'TOÁN',
    'moral': 'ĐẠO ĐỨC',
    'science': 'TỰ NHIÊN VÀ XÃ HỘI',
    'physical': 'GIÁO DỤC THỂ CHẤT',
    'story': 'TRUYỆN'
  };
  return tagMap[tags[0]] || tags[0].toUpperCase();
}