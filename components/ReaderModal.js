import { useEffect, useRef, useState } from 'react';
import { fetchChapterContent, extractUidsFromStreamUrl, fetchBookById, testApiResponse } from '../lib/api';

/**
 * ReaderModal - Manga Chapter Reader
 * Props:
 * - isOpen (bool)
 * - onClose (fn)
 * - book: { id, title, author, chapters, totalChapters }
 *
 * Features:
 * - Display chapter list for manga
 * - Chapter selection and reading
 * - Real manga page display from API
 * - Reading progress tracking
 */

export default function ReaderModal({ isOpen, onClose, book }) {
  const modalRef = useRef(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [viewMode, setViewMode] = useState('chapters'); // 'chapters' or 'reading'
  const [chapterContent, setChapterContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate chapter list from book data
  const chapters = book?.chapters || generateChapterList(book?.totalChapters || 10);

  useEffect(() => {
    if (isOpen) {
      console.log('🎯 ReaderModal opened with book:', book);
      console.log('🎯 Book ID:', book?.id);
      console.log('🎯 Book chapters:', book?.chapters);
      console.log('🎯 Generated chapters:', chapters);
      
      // Reset to chapter list when modal opens
      setViewMode('chapters');
      setSelectedChapter(null);
      setTimeout(() => modalRef.current?.focus(), 50);
    }
  }, [isOpen, book, chapters]);

  function generateChapterList(totalChapters) {
    const chapterList = [];
    for (let i = 1; i <= totalChapters; i++) {
      chapterList.push({
        id: `chapter-${i}`,
        name: `Tập ${i}`,
        index: i,
        url: null
      });
    }
    return chapterList;
  }

  async function selectChapter(chapter) {
    setSelectedChapter(chapter);
    setViewMode('reading');
    setLoading(true);
    setError(null);
    setChapterContent(null);

    try {
      let chapterUid = null;
      let comicUid = null;

      // If chapter has URL, extract UIDs directly
      if (chapter.url) {
        const uids = extractUidsFromStreamUrl(chapter.url);
        chapterUid = uids.chapterUid;
        comicUid = uids.comicUid;
      } 
      // If chapter needs detail fetch, get full book data first
      else if (chapter.needsDetailFetch && book?.id) {
        console.log('Fetching detailed book data for:', book.id);
        
        // Test API response first
        console.log('🧪 Testing raw API response...');
        await testApiResponse(book.id);
        
        const detailedBook = await fetchBookById(book.id);
        console.log('Detailed book:', detailedBook);
        
        if (detailedBook && detailedBook.chapters) {
          console.log('Available chapters:', detailedBook.chapters);
          console.log('First few chapters sample:', detailedBook.chapters.slice(0, 3));
          console.log('Chapter structure analysis:');
          detailedBook.chapters.slice(0, 3).forEach((ch, i) => {
            console.log(`Chapter ${i}:`, {
              id: ch.id,
              name: ch.name,
              url: ch.url,
              hasUrl: !!ch.url,
              hasId: !!ch.id,
              idStartsWithChapter: ch.id?.startsWith('chapter-')
            });
          });
          console.log('Looking for chapter:', chapter);
          
          // Filter out fallback chapters and get only real API chapters
          const realChapters = detailedBook.chapters.filter(c => 
            c.url && c.id && !c.id.startsWith('chapter-')
          );
          
          console.log('Real chapters from API:', realChapters);
          
          let detailedChapter = null;
          
          // Strategy 1: Match by index with real chapters
          detailedChapter = realChapters.find(c => c.index === chapter.index);
          
          // Strategy 2: Match by chapter number (extract number from name)
          if (!detailedChapter) {
            const chapterNum = parseInt(chapter.name.match(/\d+/)?.[0]);
            if (chapterNum) {
              detailedChapter = realChapters.find(c => {
                const detailedNum = parseInt(c.name.match(/\d+/)?.[0]);
                return detailedNum === chapterNum;
              });
            }
          }
          
          // Strategy 3: Get the first available real chapter
          if (!detailedChapter && realChapters.length > 0) {
            // Sort chapters by index to get the earliest available chapter
            const sortedChapters = realChapters.sort((a, b) => a.index - b.index);
            detailedChapter = sortedChapters[0];
            console.log('Using first available real chapter:', detailedChapter);
          }
          
          console.log('Found detailed chapter:', detailedChapter);
          
          if (detailedChapter) {
            // Use the chapterUid and comicUid directly from the detailed chapter
            chapterUid = detailedChapter.chapterUid || detailedChapter.id;
            comicUid = detailedChapter.comicUid || book.id;
            
            // Fallback: extract from URL if direct UIDs not available
            if (!chapterUid && detailedChapter.url) {
              const uids = extractUidsFromStreamUrl(detailedChapter.url);
              chapterUid = uids.chapterUid;
              comicUid = uids.comicUid;
            }
            
            console.log('Using UIDs:', { chapterUid, comicUid, detailedChapter });
          }
        }
      }

      // Fetch chapter content if we have valid UIDs
      if (chapterUid && comicUid) {
        console.log('Fetching chapter content with UIDs:', { chapterUid, comicUid });
        const result = await fetchChapterContent(chapterUid, comicUid);
        console.log('Chapter content result:', result);
        
        if (result.success) {
          setChapterContent(result.pages);
          console.log('Successfully loaded', result.pages.length, 'pages');
        } else {
          setError(result.error || 'Không thể tải nội dung chapter');
        }
      } else {
        console.log('Missing UIDs:', { chapterUid, comicUid, chapter, book });
        setError(`Không thể tìm thấy UID cho chapter này. ChapterUid: ${chapterUid}, ComicUid: ${comicUid}`);
      }
    } catch (err) {
      console.error('Error loading chapter:', err);
      setError('Lỗi khi tải nội dung: ' + err.message);
    }
    
    setLoading(false);
  }

  function backToChapterList() {
    setViewMode('chapters');
    setSelectedChapter(null);
    setChapterContent(null);
    setError(null);
  }

  if (!isOpen || !book) return null;

  return (
    <div className="modal" aria-hidden="false">
      <div className="modal-panel" role="document" ref={modalRef} tabIndex={-1}>
        <header className="modal-header">
          <h3>{book.title}</h3>
          {viewMode === 'reading' && (
            <button className="btn" onClick={backToChapterList} aria-label="Quay lại danh sách">
              ← Danh sách
            </button>
          )}
          <button className="btn-icon" onClick={onClose} aria-label="Đóng trình đọc">
            &times;
          </button>
        </header>
        
        <div className="modal-body">
          {viewMode === 'chapters' ? (
            <div className="chapter-list-container">
              <div className="chapter-list-header">
                <h4>📚 Danh sách chương</h4>
                <p className="chapter-count">Tổng cộng: {chapters.length} chương</p>
              </div>
              
              <div className="chapter-grid">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id || index}
                    className="chapter-item"
                    onClick={() => selectChapter(chapter)}
                  >
                    <div className="chapter-number">{chapter.index || index + 1}</div>
                    <div className="chapter-info">
                      <div className="chapter-name">{chapter.name}</div>
                      <div className={`chapter-status ${chapter.url ? 'available' : chapter.needsDetailFetch ? 'loading' : 'unavailable'}`}>
                        {chapter.url ? 'Có sẵn' : chapter.needsDetailFetch ? 'Cần tải thêm' : 'Chưa có nội dung'}
                      </div>
                    </div>
                    <div className="chapter-arrow">→</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="chapter-reader">
              <div className="reader-header">
                <h4>{selectedChapter?.name}</h4>
                <div className="chapter-navigation">
                  <button 
                    className="btn"
                    onClick={() => {
                      const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
                      if (currentIndex > 0) {
                        selectChapter(chapters[currentIndex - 1]);
                      }
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter?.id) === 0}
                  >
                    ← Chương trước
                  </button>
                  <button 
                    className="btn"
                    onClick={() => {
                      const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
                      if (currentIndex < chapters.length - 1) {
                        selectChapter(chapters[currentIndex + 1]);
                      }
                    }}
                    disabled={chapters.findIndex(c => c.id === selectedChapter?.id) === chapters.length - 1}
                  >
                    Chương sau →
                  </button>
                </div>
              </div>
              
              <div className="chapter-content">
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải nội dung {selectedChapter?.name}...</p>
                    <small>Vui lòng đợi trong giây lát</small>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <div className="error-details">
                      <small>Chapter: {selectedChapter?.name}</small>
                      <br />
                      <small>Book ID: {book?.id}</small>
                      <br />
                      <small>Kiểm tra Console để xem chi tiết lỗi</small>
                    </div>
                    <button className="btn" onClick={() => selectChapter(selectedChapter)}>
                      Thử lại
                    </button>
                  </div>
                ) : chapterContent && chapterContent.length > 0 ? (
                  <div className="manga-reader">
                    <div className="page-counter">
                      {chapterContent.length} trang
                    </div>
                    <div className="manga-pages">
                      {chapterContent.map((page, index) => (
                        <img 
                          key={page.id}
                          src={page.url} 
                          alt={`Trang ${page.pageNumber}`}
                          className="manga-page-image"
                          loading="lazy"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="chapter-placeholder">
                    <div className="manga-page">
                      <div className="page-number">Không có nội dung</div>
                      <div className="page-content">
                        <p>Chapter này chưa có nội dung hoặc đang được cập nhật.</p>
                        <p>Vui lòng thử lại sau hoặc chọn chapter khác.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}