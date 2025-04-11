import React from 'react';
import { BasePropertyProps } from 'adminjs';

const ImagePreview: React.FC<BasePropertyProps> = ({ record, property }) => {
  const filePath = record.params[property.path] as string;
  console.log(filePath);
  if (!filePath) {
    return <span>Нет изображения</span>;
  }

  const url = filePath.replace('/tmp', '');

  return (
    <img src={url} alt='asdfasdf' style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 8 }} />
  );
};

export default ImagePreview;
