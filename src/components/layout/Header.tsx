'use client';

import { PhoneCall } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import './layout.css';

export default function Header() {
  const pathname = usePathname();
  
  if (pathname === '/onboarding' || pathname === '/login') return null;

  const handleSosClick = () => {
    // 김민우 총무 연락처
    window.location.href = 'tel:010-7557-1090';
  };

  return (
    <header className="app-header">
      {/* 백그라운드 이미지는 CSS에서 처리됨 */}
      <Link href="/" className="header-logo-link">
        <img src="/assets/header_logo_center.png" alt="Seoul Dream Church Logo" className="header-logo-img" />
      </Link>
      <button className="sos-btn" aria-label="긴급 연락" onClick={handleSosClick}>
        <PhoneCall size={18} className="pulse-anim" />
        <span className="sos-text">SOS</span>
      </button>
    </header>
  );
}
