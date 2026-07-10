'use client';

import { Home, Calendar, MessageSquare, Image as ImageIcon, Users, BookOpen, Heart, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './layout.css';

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/onboarding' || pathname === '/login') return null;

  const navItems = [
    { name: '홈', path: '/', icon: Home },
    { name: '조직도', path: '/teams', icon: Users },
    { name: '일정', path: '/schedule', icon: Calendar },
    { name: 'QT', path: '/qt', icon: BookOpen },
    { name: '기도', path: '/prayer', icon: Heart },
    { name: '게시판', path: '/community?v=new', icon: MessageSquare },
    { name: '사진첩', path: '/gallery', icon: ImageIcon },
    { name: '안전', path: '/safety', icon: ShieldAlert },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const basePath = item.path.split('?')[0];
        const isActive = pathname === basePath || (basePath !== '/' && pathname.startsWith(basePath));
        return (
          <Link href={item.path} key={item.name} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={20} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
