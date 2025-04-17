import React from 'react';
import { BasePropertyProps } from 'adminjs';

const ImagePreview: React.FC<BasePropertyProps> = ({ record, property }) => {
  const filePath = record.params[property.path] as string;
  if (!filePath) {
    return <span>Нет изображения</span>;
  }

  return (
    <img
      src={filePath}
      alt='asdfasdf'
      style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: 8 }}
    />
  );
};

export default ImagePreview;
