import { BasePropertyProps } from 'adminjs';
import React, { useState } from 'react';

const UploadMultiplePhotos: React.FC<BasePropertyProps> = (props) => {
  const { onChange, property, record } = props;

  const existingPhotos: string[] = [];
  Object.entries(record.params).forEach(([key, value]) => {
    if (key.startsWith(`${property.name}.`) && typeof value === 'string') {
      existingPhotos.push(value);
    }
  });

  const [photos, setPhotos] = useState<string[]>(existingPhotos);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalPhotos = photos.length + files.length;

    if (totalPhotos > 3) {
      alert('Можно загрузить максимум 3 фотографии.');
      return;
    }

    const newPhotoPaths: string[] = [];

    for (const file of files) {
      const isValid = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
      if (!isValid) {
        alert('Можно загружать только изображения: png, jpg, jpeg');
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.filePath) {
        newPhotoPaths.push(data.filePath);
      }
    }

    const updatedPhotos = [...photos, ...newPhotoPaths].slice(0, 3);
    setPhotos(updatedPhotos);

    // Обновляем параметры для AdminJS (по ключам photo.0, photo.1...)
    updatedPhotos.forEach((path, index) => {
      onChange(`${property.name}.${index}`, path);
    });

    // Удаляем неиспользуемые значения
    for (let i = updatedPhotos.length; i < 10; i++) {
      onChange(`${property.name}.${i}`, null);
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = photos.filter((_, index) => index !== indexToRemove);
    setPhotos(updated);
    updated.forEach((path, index) => {
      onChange(`${property.name}.${index}`, path);
    });
    for (let i = updated.length; i < 10; i++) {
      onChange(`${property.name}.${i}`, null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1em', marginTop: '1em' }}>
      <label
        style={{
          marginBottom: '8px',
          display: 'block',
          fontSize: '12px',
          lineHeight: '16px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Изображения
      </label>
      <label
        style={{
          display: 'block',
          padding: '16px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          marginBottom: '16px',
          background: 'white',
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        Загрузить фотографии (макс. 3)
        <input
          type='file'
          accept='image/png,image/jpeg,image/jpg'
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </label>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {photos.map((photo, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={photo}
              alt={`Фото ${index + 1}`}
              style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <button
              type='button'
              onClick={() => handleRemove(index)}
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadMultiplePhotos;
