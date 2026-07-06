'use client';

import { BookOpen, CheckSquare, Coffee, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './home.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      {/* 그래피티 배경 이미지만 온전히 보이도록 다른 요소들은 임시로 비워둡니다 */}

    </div>
  );
}
