import React from 'react';
const UploadPhoto = (props) => {
    const { onChange, property, record } = props;
    const handleChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
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
    return (React.createElement("div", null,
        React.createElement("input", { type: 'file', onChange: handleChange })));
};
export default UploadPhoto;
