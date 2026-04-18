import { useState, useRef } from 'react'

export default function PhotoUploader({ photos = [], onChange }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (files) => {
    const newPhotos = Array.from(files).slice(0, 8 - photos.length).map(f => ({
      id: Math.random().toString(36).slice(2),
      url: URL.createObjectURL(f),
      name: f.name,
    }))
    onChange([...photos, ...newPhotos].slice(0, 8))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removePhoto = (id) => {
    onChange(photos.filter(p => p.id !== id))
  }

  return (
    <div>
      <div
        className={`photo-uploader ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
      >
        <div className="photo-uploader-icon">
          <svg viewBox="0 0 48 48" fill="none">
            <rect x="4" y="10" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2.5"/>
            <circle cx="16" cy="22" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 32L14 24L22 30L32 20L44 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 4V14M28 4L22 10M28 4L34 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--dark)', marginBottom: '4px' }}>
          {dragging ? 'Drop photos here' : 'Add photos of the project'}
        </p>
        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
          Drag &amp; drop or click · Up to 8 photos
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {photos.length > 0 && (
        <div className="photo-grid" style={{ marginTop: '12px' }}>
          {photos.map(photo => (
            <div key={photo.id} className="photo-thumb">
              <img src={photo.url} alt={photo.name} />
              <button
                className="photo-thumb-remove"
                onClick={() => removePhoto(photo.id)}
                type="button"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>
          {photos.length}/8 photos added
        </p>
      )}
    </div>
  )
}
