'use client';
import { useState } from 'react';
import './schedule.css';

export default function Schedule() {
  // 이미지 줌 상태
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });

  const handleStart = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setZoomState({ isZoomed: true, x, y });
  };

  const handleEnd = () => {
    setZoomState(prev => ({ ...prev, isZoomed: false }));
  };

  return (
    <div className="schedule-container">
      <div style={{ marginBottom: '20px', margin: '0 -20px', overflow: 'hidden' }}>
        <img 
          src="/assets/scadule.png" 
          alt="전체 일정 표" 
          role="button"
          tabIndex={0}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            transform: zoomState.isZoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
            transition: 'transform 0.2s ease-out',
            cursor: 'pointer',
            WebkitTouchCallout: 'none', /* 모바일 사파리 꾹 누를 때 메뉴 뜨는 것 방지 */
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }} 
        />
      </div>
    </div>
  );
}
