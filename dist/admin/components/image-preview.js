import React from 'react';
const ImagePreview = ({ record, property }) => {
    const filePath = record.params[property.path];
    console.log(filePath);
    if (!filePath) {
        return React.createElement("span", null, "\u041D\u0435\u0442 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F");
    }
    const url = filePath.replace('/tmp', '');
    return (React.createElement("img", { src: url, alt: 'asdfasdf', style: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: 8 } }));
};
export default ImagePreview;
