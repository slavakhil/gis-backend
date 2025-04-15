import React, { useEffect, useRef, useState } from 'react';
import { BasePropertyProps } from 'adminjs';
import { marked } from 'marked';

const MarkdownEditor: React.FC<BasePropertyProps> = ({ record, property, onChange }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const value = record.params[property.path] || '';

  const insertSyntax = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    let newValue = '';

    switch (syntax) {
      case 'bold':
        newValue = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        break;
      case 'italic':
        newValue = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        break;
    }

    onChange(property.path, newValue);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.length + 2, end + syntax.length + 2);
    }, 0);
  };

  useEffect(() => {
    if (!previewRef.current) return;

    const elements = previewRef.current.querySelectorAll('*');
    elements.forEach((el) => {
      const element = el as HTMLElement;
      const tag = element.tagName.toLowerCase();

      switch (tag) {
        case 'h1':
        case 'h2':
        case 'h3':
          Object.assign(element.style, {
            fontWeight: 'bold',
            fontSize: '16px',
            marginTop: '12px',
            marginBottom: '8px',
          });
          break;
        case 'p':
          element.style.margin = '8px 0';
          break;
        case 'strong':
          element.style.fontWeight = 'bold';
          break;
        case 'em':
          element.style.fontStyle = 'italic';
          break;
        case 'code':
          Object.assign(element.style, {
            backgroundColor: '#eee',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
          });
          break;
        case 'ul':
        case 'ol':
          element.style.marginLeft = '20px';
          element.style.marginBottom = '8px';
          break;
        case 'li':
          element.style.marginBottom = '4px';
          break;
        case 'blockquote':
          Object.assign(element.style, {
            borderLeft: '4px solid #ccc',
            paddingLeft: '10px',
            color: '#666',
            fontStyle: 'italic',
            margin: '8px 0',
          });
          break;
      }
    });
  }, [value, showPreview]); // добавили showPreview

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type='button'
            onClick={() => insertSyntax('bold', 'жирный')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #0078C1',
              background: '#0078C1',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <b>B</b>
          </button>
          <button
            type='button'
            onClick={() => insertSyntax('italic', 'курсив')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #0078C1',
              background: '#0078C1',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <i>I</i>
          </button>
          <button
            type='button'
            onClick={() => setShowPreview((prev) => !prev)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #0078C1',
              background: '#fff',
              color: '#0078C1',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {showPreview ? 'Скрыть превью' : 'Показать превью'}
          </button>

          <div
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            style={{
              marginLeft: 'auto',
              position: 'relative',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#0078C1',
            }}
          >
            ?
            {showHelp && (
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: 0,
                  background: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '14px',
                  width: '280px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                }}
              >
                <p>
                  <strong>Markdown:</strong>
                </p>
                <ul style={{ paddingLeft: '16px', margin: 0 }}>
                  <li>
                    <code>**жирный**</code> → <strong>жирный</strong>
                  </li>
                  <li>
                    <code>*курсив*</code> → <em>курсив</em>
                  </li>
                  <li>
                    <code># Заголовок</code> → <b>Заголовок</b>
                  </li>
                  <li>
                    <code>- Список</code> → • элемент
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <textarea
          id='markdown-textarea'
          value={value}
          onChange={(e) => onChange(property.path, e.target.value)}
          rows={12}
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '14px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            boxSizing: 'border-box',
            resize: 'none',
          }}
        />
      </div>

      {showPreview && (
        <div
          ref={previewRef}
          style={{
            flex: 1,
            border: '1px solid #ccc',
            padding: '12px',
            backgroundColor: '#fafafa',
            borderRadius: '6px',
            overflowY: 'auto',
            maxHeight: '300px',
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          dangerouslySetInnerHTML={{ __html: marked.parse(value || '') }}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
