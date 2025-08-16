import Link from 'next/link';
import { useState } from 'react';
import LoginModal from './LoginModal';

export default function Header({ q = '', onSearch = () => {} }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <header className="site-header" role="banner">
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Trang chủ Ổ Truyện">
          <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="24" height="24" rx="4" fill="#2b6cb0"></rect>
            <path d="M6 7h12v2H6zM6 11h12v2H6zM6 15h8v2H6z" fill="#fff"></path>
          </svg>
          <span className="site-title">Ổ Truyện</span>
        </Link>

        <form className="search" role="search" onSubmit={(e)=>e.preventDefault()}>
          <input
            type="search"
            placeholder="Tìm theo tên truyện, tác giả, thể loại..."
            aria-label="Tìm truyện"
            defaultValue={q}
            onChange={e => onSearch(e.target.value)}
          />
          <button type="submit" aria-label="Tìm" className="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <nav className="main-nav" role="navigation" aria-label="Chính">
          <Link href="/" className="nav-link">Trang chủ</Link>
          <Link href="/books" className="nav-link">Giới Thiệu</Link>

          <button 
            className="nav-link btn-login" 
            onClick={() => setIsLoginModalOpen(true)}
          >
            <span>Đăng nhập</span>
          </button>
        </nav>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
}