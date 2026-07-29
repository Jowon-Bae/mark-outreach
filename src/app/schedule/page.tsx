'use client';
import { useState } from 'react';
import { Calendar, MapPin, Coffee, Info, BookOpen, Car, Key, ClipboardList, Utensils, Smile, Sun, Sparkles, Flame } from 'lucide-react';
import './schedule.css';

export const dynamic = 'force-dynamic';

export default function Schedule() {
  // 이미지 줌 상태
  const [zoomState, setZoomState] = useState({ isZoomed: false, x: 50, y: 50 });
  const [activeDetailTab, setActiveDetailTab] = useState<'day1' | 'day2'>('day1');

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
      {/* 상단 이미지 표 */}
      <div style={{ marginBottom: '20px', margin: '0 -20px', overflow: 'hidden', borderBottom: '1px solid #f1f3f5' }}>
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
            touchAction: 'none',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }} 
        />
      </div>

          </div>
  );
}
