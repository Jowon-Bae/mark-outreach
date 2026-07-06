'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Heart, Map } from 'lucide-react';
import './onboarding.css';

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  
  const slides = [
    {
      title: "마가공동체 국내 아웃리치",
      description: "서울드림교회 마가공동체와 함께하는\n은혜로운 아웃리치 여정에 오신 것을 환영합니다.",
      icon: <Map size={72} color="var(--primary)" strokeWidth={1.5} />
    },
    {
      title: "함께 기도하며 나아갑니다",
      description: "너희는 온 천하에 다니며\n만민에게 복음을 전파하라\n(마가복음 16:15)",
      icon: <Heart size={72} color="var(--primary)" strokeWidth={1.5} />
    },
    {
      title: "일정과 소식을 한눈에",
      description: "팀별 일정, 실시간 공지사항,\n지체들의 기도제목을 앱에서 바로 확인하세요.",
      icon: <ChevronRight size={72} color="var(--primary)" strokeWidth={1.5} />
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="onboarding-container">
      <div 
        className="slides-wrapper" 
        style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <div className="slide-image-placeholder">
              {slide.icon}
            </div>
            <h2>{slide.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{slide.description}</p>
          </div>
        ))}
      </div>

      <div className="slide-indicators">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="onboarding-footer">
        <button className="btn btn-primary" onClick={handleNext}>
          {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
        </button>
        {currentSlide < slides.length - 1 && (
          <button className="btn btn-secondary" onClick={() => router.push('/login')}>
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
}
