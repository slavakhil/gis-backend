import React from 'react';
import { Box } from '@adminjs/design-system';

const PhotoThumbnail = (props) => {
  const { record } = props;
  const src = record.params.photo ? `/uploads/${record.params.photo}` : null;

  return src ? (
    <Box>
      <img src={src} style={{ maxWidth: '100px', maxHeight: '100px' }} />
    </Box>
  ) : (
    'Нет фото'
  );
};

export default PhotoThumbnail;
