'use client';

import { Home, Calendar, MessageSquare, Image as ImageIcon, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/onboarding' || pathname === '/login') return null;

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '일정', path: '/schedule', icon: Calendar },
    { name: '게시판', path: '/community', icon: MessageSquare },
    { name: '사진첩', path: '/gallery', icon: ImageIcon },
    { name: '마이페이지', path: '/mypage', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        return (
          <Link href={item.path} key={item.name} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={24} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
