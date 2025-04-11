import { BasePropertyProps } from 'adminjs';
import React from 'react';

const UploadPhoto: React.FC<BasePropertyProps> = (props) => {
  const { onChange, property, record } = props;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/admin/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    const filePath = data.filePath;

    onChange(property.name, filePath);
  };

  return (
    <div>
      <input type='file' onChange={handleChange} />
    </div>
  );
};

export default UploadPhoto;
