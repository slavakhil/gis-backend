import { BasePropertyProps } from 'adminjs';
import React from 'react';

const ImagesPreview: React.FC<BasePropertyProps> = (props) => {
  const { record, property } = props;

  // Вытаскиваем все ключи типа photo.0, photo.1 и т.д.
  const photos: string[] = [];

  Object.entries(record.params).forEach(([key, value]) => {
    if (key.startsWith(`${property.name}.`) && typeof value === 'string') {
      photos.push(value);
    }
  });

  // Рендерим превью
  return (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
      {photos.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`photo-${index}`}
          style={{ width: 120, height: 120, objectFit: 'cover', border: '1px solid #ccc' }}
        />
      ))}
    </div>
  );
};

export default ImagesPreview;
