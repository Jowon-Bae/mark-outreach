'use client';
import { useState } from 'react';
import './schedule.css';

export default function Schedule() {
  // 이미지 줌 상태
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });

  const getCoordinates = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    let clientX, clientY;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    // 확대된 상태에서는 getBoundingClientRect의 크기가 다를 수 있으므로 원래 비율 계산 필요
    // 하지만 이미 transformOrigin 기반 확장이므로 직관적인 패닝을 위해 단순 계산 유지
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  };

  const handleStart = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    const { x, y } = getCoordinates(e);
    setZoomState({ isZoomed: true, x, y });
  };

  const handleMove = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (!zoomState.isZoomed) return;
    const { x, y } = getCoordinates(e);
    setZoomState(prev => ({ ...prev, x, y }));
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
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleEnd}
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            transform: zoomState.isZoomed ? 'scale(2.5)' : 'scale(1)',
            transformOrigin: `${zoomState.x}% ${zoomState.y}%`,
            transition: 'transform 0.2s ease-out',
            cursor: zoomState.isZoomed ? 'zoom-out' : 'zoom-in',
            touchAction: 'none', /* 모바일 스크롤 방지하여 부드러운 드래그 허용 */
            WebkitTouchCallout: 'none', /* 모바일 사파리 꾹 누를 때 메뉴 뜨는 것 방지 */
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }} 
        />
      </div>
    </div>
  );
}
