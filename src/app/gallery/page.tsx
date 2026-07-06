import './gallery.css';

export default function Gallery() {
  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>사진첩</h2>
      </div>

      <div className="gallery-grid">
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className="gallery-item">
            <div className="placeholder-img">
              <span>Photo {item}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
