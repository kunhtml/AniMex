import { useEffect, useRef, useState } from 'react';

/**
 * ReaderModal
 * Props:
 * - isOpen (bool)
 * - onClose (fn)
 * - book: { id, title, author, content (array or string), audioUrl, cues (optional) }
 *
 * Features:
 * - render content split into paragraphs
 * - highlight current paragraph on scroll
 * - play audio (if audioUrl) and sync highlight using cues or estimated mapping
 * - text-to-speech fallback
 */

export default function ReaderModal({ isOpen, onClose, book }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const audioRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [dark, setDark] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Derived paragraphs
  const paragraphs = Array.isArray(book?.content)
    ? book.content
    : (typeof book?.content === 'string' ? book.content.split(/\n{2,}/g) : []);

  useEffect(() => {
    if (isOpen) {
      // focus trap basic: focus modal
      setTimeout(() => modalRef.current?.focus(), 50);
    } else {
      // stop audio and speech
      stopAll();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const el = contentRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const idx = Number(e.target.getAttribute('data-idx'));
          setCurrentIdx(idx);
        }
      }
    }, { root: el, rootMargin: '0px', threshold: 0.6 });

    const items = el.querySelectorAll('.reader-paragraph');
    items.forEach(i => observer.observe(i));

    return () => observer.disconnect();
  }, [isOpen, paragraphs.length]);

  // Audio sync: if cues provided use them, else estimate mapping
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTimeUpdate() {
      const t = audio.currentTime;
      let idx = 0;
      if (Array.isArray(book?.cues) && book.cues.length > 0) {
        // find cue where start <= t < end
        const cue = book.cues.find(c => t >= c.start && t < c.end);
        if (cue) idx = cue.paragraph;
      } else {
        // estimate: map total duration to paragraphs
        const n = paragraphs.length;
        if (n > 0 && audio.duration > 0) {
          idx = Math.floor((t / audio.duration) * n);
          idx = Math.min(idx, n - 1);
        }
      }
      setCurrentIdx(idx);
      // scroll to paragraph
      const p = contentRef.current?.querySelector(`[data-idx="${idx}"]`);
      if (p) p.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => audio.removeEventListener('timeupdate', onTimeUpdate);
  }, [book?.cues, paragraphs.length]);

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }

  function playAudio() {
    if (!book?.audioUrl) return;
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  function speakText() {
    if (!window.speechSynthesis) {
      alert('Trình duyệt không hỗ trợ text-to-speech');
      return;
    }
    
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const text = paragraphs.join(' ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.onend = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!isOpen || !book) return null;

  return (
    <div className="modal" aria-hidden="false">
      <div className="modal-panel" role="document" ref={modalRef} tabIndex={-1}>
        <header className="modal-header">
          <h3>{book.title}</h3>
          <button className="btn-icon" onClick={onClose} aria-label="Đóng trình đọc">
            &times;
          </button>
        </header>
        <div className="modal-body">
          <div className="reader-toolbar">
            <label>
              Cỡ chữ
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
              />
            </label>
            <button className="btn" onClick={() => setDark(!dark)}>
              {dark ? 'Sáng' : 'Tối'}
            </button>
            {book.audioUrl && (
              <button className="btn" onClick={playAudio}>
                Phát audio
              </button>
            )}
            <button className="btn" onClick={speakText}>
              {speaking ? 'Dừng TTS' : 'Nghe TTS'}
            </button>
          </div>
          
          <div
            ref={contentRef}
            className={`reader-content ${dark ? 'dark' : ''}`}
            style={{ fontSize: `${fontSize}px` }}
          >
            <h4>{book.title}</h4>
            <p><em>{book.author}</em></p>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-idx={i}
                className={`reader-paragraph ${i === currentIdx ? 'highlight' : ''}`}
              >
                {p}
              </p>
            ))}
          </div>

          {book.audioUrl && (
            <audio ref={audioRef} src={book.audioUrl} preload="metadata" />
          )}
        </div>
      </div>
    </div>
  );
}