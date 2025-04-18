import React from 'react';
import { BasePropertyProps } from 'adminjs';

const UploadPhoto: React.FC<BasePropertyProps> = ({ onChange, property, record }) => {
  const photoPath = record.params[property.name] as string;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только файлы PNG, JPG или JPEG');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/file', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.filePath) {
      onChange(property.name, data.filePath);
    }
  };

  const handleRemove = () => {
    onChange(property.name, '');
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
      {/* Input */}
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
        Нажмите, чтобы загрузить фото (PNG, JPG, JPEG)
        <input
          id='file-upload'
          type='file'
          accept='.png,.jpg,.jpeg'
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </label>

      {/* Preview */}
      {photoPath && (
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
          <div
            style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              border: '2px solid #0078C1',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            }}
          >
            <img src={photoPath} alt='uploaded' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              onClick={handleRemove}
              type='button'
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              title='Удалить фото'
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPhoto;
