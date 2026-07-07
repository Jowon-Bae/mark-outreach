'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import './gallery.css';

export default function Gallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('community_gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPhotos(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>마가 사진첩 📸</h2>
      </div>

      <div className="gallery-grid">
        {isLoading ? (
          <div className="loading-gallery">사진을 불러오는 중입니다...</div>
        ) : photos.length === 0 ? (
          <div className="empty-gallery">아직 올라온 사진이 없습니다.</div>
        ) : (
          photos.map(photo => (
            <div 
              key={photo.id} 
              className="gallery-item"
              onClick={() => setFullscreenImage(photo.image_url)}
            >
              <img 
                src={photo.image_url} 
                alt="Gallery content" 
                className="gallery-img"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <button className="close-fullscreen" onClick={(e) => {
            e.stopPropagation();
            setFullscreenImage(null);
          }}>✕</button>
          <img src={fullscreenImage} alt="Fullscreen" className="fullscreen-img" />
        </div>
      )}
    </div>
  );
}
