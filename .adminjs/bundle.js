(function (React) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    const Dashboard = () => {
      React.useEffect(() => {
        window.location.href = '/admin/resources/Новости';
      });
      return null;
    };

    const UploadPhoto = ({
      onChange,
      property,
      record
    }) => {
      const photoPath = record.params[property.name];
      const handleChange = async event => {
        const file = event.target.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          alert('Разрешены только файлы PNG, JPG или JPEG');
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/admin/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.filePath) {
          onChange(property.name, data.filePath);
        }
      };
      const handleRemove = () => {
        onChange(property.name, '');
      };
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          marginTop: '1em'
        }
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: {
          marginBottom: '8px',
          display: 'block',
          fontSize: '12px',
          lineHeight: '16px',
          fontFamily: 'Roboto, sans-serif'
        }
      }, "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F"), /*#__PURE__*/React__default.default.createElement("label", {
        style: {
          display: 'block',
          padding: '16px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          marginBottom: '16px',
          background: 'white',
          textAlign: 'center',
          cursor: 'pointer'
        }
      }, "\u041D\u0430\u0436\u043C\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u043E\u0442\u043E (PNG, JPG, JPEG)", /*#__PURE__*/React__default.default.createElement("input", {
        id: 'file-upload',
        type: 'file',
        accept: '.png,.jpg,.jpeg',
        onChange: handleChange,
        style: {
          display: 'none'
        }
      })), photoPath && (/*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          gap: '1em',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          position: 'relative',
          width: '140px',
          height: '140px',
          border: '2px solid #0078C1',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        }
      }, /*#__PURE__*/React__default.default.createElement("img", {
        src: photoPath,
        alt: 'uploaded',
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }
      }), /*#__PURE__*/React__default.default.createElement("button", {
        onClick: handleRemove,
        type: 'button',
        style: {
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
          fontWeight: 'bold'
        },
        title: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u043E\u0442\u043E'
      }, "\u00D7")))));
    };

    const ImagePreview = ({
      record,
      property
    }) => {
      const filePath = record.params[property.path];
      if (!filePath) {
        return /*#__PURE__*/React__default.default.createElement("span", null, "\u041D\u0435\u0442 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F");
      }
      return /*#__PURE__*/React__default.default.createElement("img", {
        src: filePath,
        alt: 'asdfasdf',
        style: {
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          borderRadius: 8
        }
      });
    };

    const UploadMultiplePhotos = props => {
      const {
        onChange,
        property,
        record
      } = props;
      const existingPhotos = [];
      Object.entries(record.params).forEach(([key, value]) => {
        if (key.startsWith(`${property.name}.`) && typeof value === 'string') {
          existingPhotos.push(value);
        }
      });
      const [photos, setPhotos] = React.useState(existingPhotos);
      const handleChange = async event => {
        const files = Array.from(event.target.files || []);
        const totalPhotos = photos.length + files.length;
        if (totalPhotos > 3) {
          alert('Можно загрузить максимум 3 фотографии.');
          return;
        }
        const newPhotoPaths = [];
        for (const file of files) {
          const isValid = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
          if (!isValid) {
            alert('Можно загружать только изображения: png, jpg, jpeg');
            continue;
          }
          const formData = new FormData();
          formData.append('file', file);
          const response = await fetch('/admin/upload', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          if (data.filePath) {
            newPhotoPaths.push(data.filePath);
          }
        }
        const updatedPhotos = [...photos, ...newPhotoPaths].slice(0, 3);
        setPhotos(updatedPhotos);
        updatedPhotos.forEach((path, index) => {
          onChange(`${property.name}.${index}`, path);
        });
        for (let i = updatedPhotos.length; i < 10; i++) {
          onChange(`${property.name}.${i}`, null);
        }
      };
      const handleRemove = indexToRemove => {
        const updated = photos.filter((_, index) => index !== indexToRemove);
        setPhotos(updated);
        updated.forEach((path, index) => {
          onChange(`${property.name}.${index}`, path);
        });
        for (let i = updated.length; i < 10; i++) {
          onChange(`${property.name}.${i}`, null);
        }
      };
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '1em',
          marginTop: '1em'
        }
      }, /*#__PURE__*/React__default.default.createElement("label", {
        style: {
          marginBottom: '8px',
          display: 'block',
          fontSize: '12px',
          lineHeight: '16px',
          fontFamily: 'Roboto, sans-serif'
        }
      }, "\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F"), /*#__PURE__*/React__default.default.createElement("label", {
        style: {
          display: 'block',
          padding: '16px',
          border: '2px dashed #ccc',
          borderRadius: '8px',
          marginBottom: '16px',
          background: 'white',
          textAlign: 'center',
          cursor: 'pointer'
        }
      }, "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438 (\u043C\u0430\u043A\u0441. 3)", /*#__PURE__*/React__default.default.createElement("input", {
        type: 'file',
        accept: 'image/png,image/jpeg,image/jpg',
        multiple: true,
        onChange: handleChange,
        style: {
          display: 'none'
        }
      })), /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }
      }, photos.map((photo, index) => (/*#__PURE__*/React__default.default.createElement("div", {
        key: index,
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React__default.default.createElement("img", {
        src: photo,
        alt: `Фото ${index + 1}`,
        style: {
          width: '120px',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '8px'
        }
      }), /*#__PURE__*/React__default.default.createElement("button", {
        type: 'button',
        onClick: () => handleRemove(index),
        style: {
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          background: 'red',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          cursor: 'pointer'
        }
      }, "\u00D7"))))));
    };

    const ImagesPreview = props => {
      const {
        record,
        property
      } = props;
      const photos = [];
      Object.entries(record.params).forEach(([key, value]) => {
        if (key.startsWith(`${property.name}.`) && typeof value === 'string') {
          photos.push(value);
        }
      });
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          gap: '5px',
          flexWrap: 'wrap'
        }
      }, photos.map((src, index) => (/*#__PURE__*/React__default.default.createElement("img", {
        key: index,
        src: src,
        alt: `photo-${index}`,
        style: {
          width: 120,
          height: 120,
          objectFit: 'cover',
          border: '1px solid #ccc'
        }
      }))));
    };

    /**
     * marked v15.0.8 - a markdown parser
     * Copyright (c) 2011-2025, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    /**
     * Gets the original marked default options.
     */
    function _getDefaults() {
        return {
            async: false,
            breaks: false,
            extensions: null,
            gfm: true,
            hooks: null,
            pedantic: false,
            renderer: null,
            silent: false,
            tokenizer: null,
            walkTokens: null,
        };
    }
    let _defaults = _getDefaults();
    function changeDefaults(newDefaults) {
        _defaults = newDefaults;
    }

    const noopTest = { exec: () => null };
    function edit(regex, opt = '') {
        let source = typeof regex === 'string' ? regex : regex.source;
        const obj = {
            replace: (name, val) => {
                let valSource = typeof val === 'string' ? val : val.source;
                valSource = valSource.replace(other.caret, '$1');
                source = source.replace(name, valSource);
                return obj;
            },
            getRegex: () => {
                return new RegExp(source, opt);
            },
        };
        return obj;
    }
    const other = {
        codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
        outputLinkReplace: /\\([\[\]])/g,
        indentCodeCompensation: /^(\s+)(?:```)/,
        beginningSpace: /^\s+/,
        endingHash: /#$/,
        startingSpaceChar: /^ /,
        endingSpaceChar: / $/,
        nonSpaceChar: /[^ ]/,
        newLineCharGlobal: /\n/g,
        tabCharGlobal: /\t/g,
        multipleSpaceGlobal: /\s+/g,
        blankLine: /^[ \t]*$/,
        doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
        blockquoteStart: /^ {0,3}>/,
        blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
        blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
        listReplaceTabs: /^\t+/,
        listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
        listIsTask: /^\[[ xX]\] /,
        listReplaceTask: /^\[[ xX]\] +/,
        anyLine: /\n.*\n/,
        hrefBrackets: /^<(.*)>$/,
        tableDelimiter: /[:|]/,
        tableAlignChars: /^\||\| *$/g,
        tableRowBlankLine: /\n[ \t]*$/,
        tableAlignRight: /^ *-+: *$/,
        tableAlignCenter: /^ *:-+: *$/,
        tableAlignLeft: /^ *:-+ *$/,
        startATag: /^<a /i,
        endATag: /^<\/a>/i,
        startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
        endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
        startAngleBracket: /^</,
        endAngleBracket: />$/,
        pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
        unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
        escapeTest: /[&<>"']/,
        escapeReplace: /[&<>"']/g,
        escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
        escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
        unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
        caret: /(^|[^\[])\^/g,
        percentDecode: /%25/g,
        findPipe: /\|/g,
        splitPipe: / \|/,
        slashPipe: /\\\|/g,
        carriageReturn: /\r\n|\r/g,
        spaceLine: /^ +$/gm,
        notSpaceStart: /^\S*/,
        endingNewline: /\n$/,
        listItemRegex: (bull) => new RegExp(`^( {0,3}${bull})((?:[\t ][^\\n]*)?(?:\\n|$))`),
        nextBulletRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),
        hrRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
        fencesBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`),
        headingBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`),
        htmlBeginRegex: (indent) => new RegExp(`^ {0,${Math.min(3, indent - 1)}}<(?:[a-z].*>|!--)`, 'i'),
    };
    /**
     * Block-Level Grammar
     */
    const newline = /^(?:[ \t]*(?:\n|$))+/;
    const blockCode = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/;
    const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
    const hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
    const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
    const bullet = /(?:[*+-]|\d{1,9}[.)])/;
    const lheadingCore = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/;
    const lheading = edit(lheadingCore)
        .replace(/bull/g, bullet) // lists can interrupt
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/) // indented code blocks can interrupt
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/) // fenced code blocks can interrupt
        .replace(/blockquote/g, / {0,3}>/) // blockquote can interrupt
        .replace(/heading/g, / {0,3}#{1,6}/) // ATX heading can interrupt
        .replace(/html/g, / {0,3}<[^\n>]+>\n/) // block html can interrupt
        .replace(/\|table/g, '') // table not in commonmark
        .getRegex();
    const lheadingGfm = edit(lheadingCore)
        .replace(/bull/g, bullet) // lists can interrupt
        .replace(/blockCode/g, /(?: {4}| {0,3}\t)/) // indented code blocks can interrupt
        .replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/) // fenced code blocks can interrupt
        .replace(/blockquote/g, / {0,3}>/) // blockquote can interrupt
        .replace(/heading/g, / {0,3}#{1,6}/) // ATX heading can interrupt
        .replace(/html/g, / {0,3}<[^\n>]+>\n/) // block html can interrupt
        .replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/) // table can interrupt
        .getRegex();
    const _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
    const blockText = /^[^\n]+/;
    const _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
    const def = edit(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/)
        .replace('label', _blockLabel)
        .replace('title', /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/)
        .getRegex();
    const list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/)
        .replace(/bull/g, bullet)
        .getRegex();
    const _tag = 'address|article|aside|base|basefont|blockquote|body|caption'
        + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
        + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
        + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
        + '|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title'
        + '|tr|track|ul';
    const _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
    const html = edit('^ {0,3}(?:' // optional indentation
        + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (6)
        + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (7) open tag
        + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ \t]*)+\\n|$)' // (7) closing tag
        + ')', 'i')
        .replace('comment', _comment)
        .replace('tag', _tag)
        .replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/)
        .getRegex();
    const paragraph = edit(_paragraph)
        .replace('hr', hr)
        .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
        .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
        .replace('|table', '')
        .replace('blockquote', ' {0,3}>')
        .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
        .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
        .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
        .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
        .getRegex();
    const blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/)
        .replace('paragraph', paragraph)
        .getRegex();
    /**
     * Normal Block Grammar
     */
    const blockNormal = {
        blockquote,
        code: blockCode,
        def,
        fences,
        heading,
        hr,
        html,
        lheading,
        list,
        newline,
        paragraph,
        table: noopTest,
        text: blockText,
    };
    /**
     * GFM Block Grammar
     */
    const gfmTable = edit('^ *([^\\n ].*)\\n' // Header
        + ' {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)' // Align
        + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)') // Cells
        .replace('hr', hr)
        .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
        .replace('blockquote', ' {0,3}>')
        .replace('code', '(?: {4}| {0,3}\t)[^\\n]')
        .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
        .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
        .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
        .replace('tag', _tag) // tables can be interrupted by type (6) html blocks
        .getRegex();
    const blockGfm = {
        ...blockNormal,
        lheading: lheadingGfm,
        table: gfmTable,
        paragraph: edit(_paragraph)
            .replace('hr', hr)
            .replace('heading', ' {0,3}#{1,6}(?:\\s|$)')
            .replace('|lheading', '') // setext headings don't interrupt commonmark paragraphs
            .replace('table', gfmTable) // interrupt paragraphs with table
            .replace('blockquote', ' {0,3}>')
            .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
            .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
            .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
            .replace('tag', _tag) // pars can be interrupted by type (6) html blocks
            .getRegex(),
    };
    /**
     * Pedantic grammar (original John Gruber's loose markdown specification)
     */
    const blockPedantic = {
        ...blockNormal,
        html: edit('^ *(?:comment *(?:\\n|\\s*$)'
            + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
            + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))')
            .replace('comment', _comment)
            .replace(/tag/g, '(?!(?:'
            + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
            + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
            + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b')
            .getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: noopTest, // fences not supported
        lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
        paragraph: edit(_paragraph)
            .replace('hr', hr)
            .replace('heading', ' *#{1,6} *[^\n]')
            .replace('lheading', lheading)
            .replace('|table', '')
            .replace('blockquote', ' {0,3}>')
            .replace('|fences', '')
            .replace('|list', '')
            .replace('|html', '')
            .replace('|tag', '')
            .getRegex(),
    };
    /**
     * Inline-Level Grammar
     */
    const escape$1 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
    const inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
    const br = /^( {2,}|\\)\n(?!\s*$)/;
    const inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
    // list of unicode punctuation marks, plus any missing characters from CommonMark spec
    const _punctuation = /[\p{P}\p{S}]/u;
    const _punctuationOrSpace = /[\s\p{P}\p{S}]/u;
    const _notPunctuationOrSpace = /[^\s\p{P}\p{S}]/u;
    const punctuation = edit(/^((?![*_])punctSpace)/, 'u')
        .replace(/punctSpace/g, _punctuationOrSpace).getRegex();
    // GFM allows ~ inside strong and em for strikethrough
    const _punctuationGfmStrongEm = /(?!~)[\p{P}\p{S}]/u;
    const _punctuationOrSpaceGfmStrongEm = /(?!~)[\s\p{P}\p{S}]/u;
    const _notPunctuationOrSpaceGfmStrongEm = /(?:[^\s\p{P}\p{S}]|~)/u;
    // sequences em should skip over [title](link), `code`, <html>
    const blockSkip = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g;
    const emStrongLDelimCore = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/;
    const emStrongLDelim = edit(emStrongLDelimCore, 'u')
        .replace(/punct/g, _punctuation)
        .getRegex();
    const emStrongLDelimGfm = edit(emStrongLDelimCore, 'u')
        .replace(/punct/g, _punctuationGfmStrongEm)
        .getRegex();
    const emStrongRDelimAstCore = '^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)' // Skip orphan inside strong
        + '|[^*]+(?=[^*])' // Consume to delim
        + '|(?!\\*)punct(\\*+)(?=[\\s]|$)' // (1) #*** can only be a Right Delimiter
        + '|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)' // (2) a***#, a*** can only be a Right Delimiter
        + '|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)' // (3) #***a, ***a can only be Left Delimiter
        + '|[\\s](\\*+)(?!\\*)(?=punct)' // (4) ***# can only be Left Delimiter
        + '|(?!\\*)punct(\\*+)(?!\\*)(?=punct)' // (5) #***# can be either Left or Right Delimiter
        + '|notPunctSpace(\\*+)(?=notPunctSpace)'; // (6) a***a can be either Left or Right Delimiter
    const emStrongRDelimAst = edit(emStrongRDelimAstCore, 'gu')
        .replace(/notPunctSpace/g, _notPunctuationOrSpace)
        .replace(/punctSpace/g, _punctuationOrSpace)
        .replace(/punct/g, _punctuation)
        .getRegex();
    const emStrongRDelimAstGfm = edit(emStrongRDelimAstCore, 'gu')
        .replace(/notPunctSpace/g, _notPunctuationOrSpaceGfmStrongEm)
        .replace(/punctSpace/g, _punctuationOrSpaceGfmStrongEm)
        .replace(/punct/g, _punctuationGfmStrongEm)
        .getRegex();
    // (6) Not allowed for _
    const emStrongRDelimUnd = edit('^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)' // Skip orphan inside strong
        + '|[^_]+(?=[^_])' // Consume to delim
        + '|(?!_)punct(_+)(?=[\\s]|$)' // (1) #___ can only be a Right Delimiter
        + '|notPunctSpace(_+)(?!_)(?=punctSpace|$)' // (2) a___#, a___ can only be a Right Delimiter
        + '|(?!_)punctSpace(_+)(?=notPunctSpace)' // (3) #___a, ___a can only be Left Delimiter
        + '|[\\s](_+)(?!_)(?=punct)' // (4) ___# can only be Left Delimiter
        + '|(?!_)punct(_+)(?!_)(?=punct)', 'gu') // (5) #___# can be either Left or Right Delimiter
        .replace(/notPunctSpace/g, _notPunctuationOrSpace)
        .replace(/punctSpace/g, _punctuationOrSpace)
        .replace(/punct/g, _punctuation)
        .getRegex();
    const anyPunctuation = edit(/\\(punct)/, 'gu')
        .replace(/punct/g, _punctuation)
        .getRegex();
    const autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/)
        .replace('scheme', /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/)
        .replace('email', /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/)
        .getRegex();
    const _inlineComment = edit(_comment).replace('(?:-->|$)', '-->').getRegex();
    const tag = edit('^comment'
        + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>') // CDATA section
        .replace('comment', _inlineComment)
        .replace('attribute', /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/)
        .getRegex();
    const _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    const link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/)
        .replace('label', _inlineLabel)
        .replace('href', /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/)
        .replace('title', /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/)
        .getRegex();
    const reflink = edit(/^!?\[(label)\]\[(ref)\]/)
        .replace('label', _inlineLabel)
        .replace('ref', _blockLabel)
        .getRegex();
    const nolink = edit(/^!?\[(ref)\](?:\[\])?/)
        .replace('ref', _blockLabel)
        .getRegex();
    const reflinkSearch = edit('reflink|nolink(?!\\()', 'g')
        .replace('reflink', reflink)
        .replace('nolink', nolink)
        .getRegex();
    /**
     * Normal Inline Grammar
     */
    const inlineNormal = {
        _backpedal: noopTest, // only used for GFM url
        anyPunctuation,
        autolink,
        blockSkip,
        br,
        code: inlineCode,
        del: noopTest,
        emStrongLDelim,
        emStrongRDelimAst,
        emStrongRDelimUnd,
        escape: escape$1,
        link,
        nolink,
        punctuation,
        reflink,
        reflinkSearch,
        tag,
        text: inlineText,
        url: noopTest,
    };
    /**
     * Pedantic Inline Grammar
     */
    const inlinePedantic = {
        ...inlineNormal,
        link: edit(/^!?\[(label)\]\((.*?)\)/)
            .replace('label', _inlineLabel)
            .getRegex(),
        reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
            .replace('label', _inlineLabel)
            .getRegex(),
    };
    /**
     * GFM Inline Grammar
     */
    const inlineGfm = {
        ...inlineNormal,
        emStrongRDelimAst: emStrongRDelimAstGfm,
        emStrongLDelim: emStrongLDelimGfm,
        url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, 'i')
            .replace('email', /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/)
            .getRegex(),
        _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
    };
    /**
     * GFM + Line Breaks Inline Grammar
     */
    const inlineBreaks = {
        ...inlineGfm,
        br: edit(br).replace('{2,}', '*').getRegex(),
        text: edit(inlineGfm.text)
            .replace('\\b_', '\\b_| {2,}\\n')
            .replace(/\{2,\}/g, '*')
            .getRegex(),
    };
    /**
     * exports
     */
    const block = {
        normal: blockNormal,
        gfm: blockGfm,
        pedantic: blockPedantic,
    };
    const inline = {
        normal: inlineNormal,
        gfm: inlineGfm,
        breaks: inlineBreaks,
        pedantic: inlinePedantic,
    };

    /**
     * Helpers
     */
    const escapeReplacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    const getEscapeReplacement = (ch) => escapeReplacements[ch];
    function escape(html, encode) {
        if (encode) {
            if (other.escapeTest.test(html)) {
                return html.replace(other.escapeReplace, getEscapeReplacement);
            }
        }
        else {
            if (other.escapeTestNoEncode.test(html)) {
                return html.replace(other.escapeReplaceNoEncode, getEscapeReplacement);
            }
        }
        return html;
    }
    function cleanUrl(href) {
        try {
            href = encodeURI(href).replace(other.percentDecode, '%');
        }
        catch {
            return null;
        }
        return href;
    }
    function splitCells(tableRow, count) {
        // ensure that every cell-delimiting pipe has a space
        // before it to distinguish it from an escaped pipe
        const row = tableRow.replace(other.findPipe, (match, offset, str) => {
            let escaped = false;
            let curr = offset;
            while (--curr >= 0 && str[curr] === '\\')
                escaped = !escaped;
            if (escaped) {
                // odd number of slashes means | is escaped
                // so we leave it alone
                return '|';
            }
            else {
                // add space before unescaped |
                return ' |';
            }
        }), cells = row.split(other.splitPipe);
        let i = 0;
        // First/last cell in a row cannot be empty if it has no leading/trailing pipe
        if (!cells[0].trim()) {
            cells.shift();
        }
        if (cells.length > 0 && !cells.at(-1)?.trim()) {
            cells.pop();
        }
        if (count) {
            if (cells.length > count) {
                cells.splice(count);
            }
            else {
                while (cells.length < count)
                    cells.push('');
            }
        }
        for (; i < cells.length; i++) {
            // leading or trailing whitespace is ignored per the gfm spec
            cells[i] = cells[i].trim().replace(other.slashPipe, '|');
        }
        return cells;
    }
    /**
     * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
     * /c*$/ is vulnerable to REDOS.
     *
     * @param str
     * @param c
     * @param invert Remove suffix of non-c chars instead. Default falsey.
     */
    function rtrim(str, c, invert) {
        const l = str.length;
        if (l === 0) {
            return '';
        }
        // Length of suffix matching the invert condition.
        let suffLen = 0;
        // Step left until we fail to match the invert condition.
        while (suffLen < l) {
            const currChar = str.charAt(l - suffLen - 1);
            if (currChar === c && true) {
                suffLen++;
            }
            else {
                break;
            }
        }
        return str.slice(0, l - suffLen);
    }
    function findClosingBracket(str, b) {
        if (str.indexOf(b[1]) === -1) {
            return -1;
        }
        let level = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '\\') {
                i++;
            }
            else if (str[i] === b[0]) {
                level++;
            }
            else if (str[i] === b[1]) {
                level--;
                if (level < 0) {
                    return i;
                }
            }
        }
        return -1;
    }

    function outputLink(cap, link, raw, lexer, rules) {
        const href = link.href;
        const title = link.title || null;
        const text = cap[1].replace(rules.other.outputLinkReplace, '$1');
        if (cap[0].charAt(0) !== '!') {
            lexer.state.inLink = true;
            const token = {
                type: 'link',
                raw,
                href,
                title,
                text,
                tokens: lexer.inlineTokens(text),
            };
            lexer.state.inLink = false;
            return token;
        }
        return {
            type: 'image',
            raw,
            href,
            title,
            text,
        };
    }
    function indentCodeCompensation(raw, text, rules) {
        const matchIndentToCode = raw.match(rules.other.indentCodeCompensation);
        if (matchIndentToCode === null) {
            return text;
        }
        const indentToCode = matchIndentToCode[1];
        return text
            .split('\n')
            .map(node => {
            const matchIndentInNode = node.match(rules.other.beginningSpace);
            if (matchIndentInNode === null) {
                return node;
            }
            const [indentInNode] = matchIndentInNode;
            if (indentInNode.length >= indentToCode.length) {
                return node.slice(indentToCode.length);
            }
            return node;
        })
            .join('\n');
    }
    /**
     * Tokenizer
     */
    class _Tokenizer {
        options;
        rules; // set by the lexer
        lexer; // set by the lexer
        constructor(options) {
            this.options = options || _defaults;
        }
        space(src) {
            const cap = this.rules.block.newline.exec(src);
            if (cap && cap[0].length > 0) {
                return {
                    type: 'space',
                    raw: cap[0],
                };
            }
        }
        code(src) {
            const cap = this.rules.block.code.exec(src);
            if (cap) {
                const text = cap[0].replace(this.rules.other.codeRemoveIndent, '');
                return {
                    type: 'code',
                    raw: cap[0],
                    codeBlockStyle: 'indented',
                    text: !this.options.pedantic
                        ? rtrim(text, '\n')
                        : text,
                };
            }
        }
        fences(src) {
            const cap = this.rules.block.fences.exec(src);
            if (cap) {
                const raw = cap[0];
                const text = indentCodeCompensation(raw, cap[3] || '', this.rules);
                return {
                    type: 'code',
                    raw,
                    lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, '$1') : cap[2],
                    text,
                };
            }
        }
        heading(src) {
            const cap = this.rules.block.heading.exec(src);
            if (cap) {
                let text = cap[2].trim();
                // remove trailing #s
                if (this.rules.other.endingHash.test(text)) {
                    const trimmed = rtrim(text, '#');
                    if (this.options.pedantic) {
                        text = trimmed.trim();
                    }
                    else if (!trimmed || this.rules.other.endingSpaceChar.test(trimmed)) {
                        // CommonMark requires space before trailing #s
                        text = trimmed.trim();
                    }
                }
                return {
                    type: 'heading',
                    raw: cap[0],
                    depth: cap[1].length,
                    text,
                    tokens: this.lexer.inline(text),
                };
            }
        }
        hr(src) {
            const cap = this.rules.block.hr.exec(src);
            if (cap) {
                return {
                    type: 'hr',
                    raw: rtrim(cap[0], '\n'),
                };
            }
        }
        blockquote(src) {
            const cap = this.rules.block.blockquote.exec(src);
            if (cap) {
                let lines = rtrim(cap[0], '\n').split('\n');
                let raw = '';
                let text = '';
                const tokens = [];
                while (lines.length > 0) {
                    let inBlockquote = false;
                    const currentLines = [];
                    let i;
                    for (i = 0; i < lines.length; i++) {
                        // get lines up to a continuation
                        if (this.rules.other.blockquoteStart.test(lines[i])) {
                            currentLines.push(lines[i]);
                            inBlockquote = true;
                        }
                        else if (!inBlockquote) {
                            currentLines.push(lines[i]);
                        }
                        else {
                            break;
                        }
                    }
                    lines = lines.slice(i);
                    const currentRaw = currentLines.join('\n');
                    const currentText = currentRaw
                        // precede setext continuation with 4 spaces so it isn't a setext
                        .replace(this.rules.other.blockquoteSetextReplace, '\n    $1')
                        .replace(this.rules.other.blockquoteSetextReplace2, '');
                    raw = raw ? `${raw}\n${currentRaw}` : currentRaw;
                    text = text ? `${text}\n${currentText}` : currentText;
                    // parse blockquote lines as top level tokens
                    // merge paragraphs if this is a continuation
                    const top = this.lexer.state.top;
                    this.lexer.state.top = true;
                    this.lexer.blockTokens(currentText, tokens, true);
                    this.lexer.state.top = top;
                    // if there is no continuation then we are done
                    if (lines.length === 0) {
                        break;
                    }
                    const lastToken = tokens.at(-1);
                    if (lastToken?.type === 'code') {
                        // blockquote continuation cannot be preceded by a code block
                        break;
                    }
                    else if (lastToken?.type === 'blockquote') {
                        // include continuation in nested blockquote
                        const oldToken = lastToken;
                        const newText = oldToken.raw + '\n' + lines.join('\n');
                        const newToken = this.blockquote(newText);
                        tokens[tokens.length - 1] = newToken;
                        raw = raw.substring(0, raw.length - oldToken.raw.length) + newToken.raw;
                        text = text.substring(0, text.length - oldToken.text.length) + newToken.text;
                        break;
                    }
                    else if (lastToken?.type === 'list') {
                        // include continuation in nested list
                        const oldToken = lastToken;
                        const newText = oldToken.raw + '\n' + lines.join('\n');
                        const newToken = this.list(newText);
                        tokens[tokens.length - 1] = newToken;
                        raw = raw.substring(0, raw.length - lastToken.raw.length) + newToken.raw;
                        text = text.substring(0, text.length - oldToken.raw.length) + newToken.raw;
                        lines = newText.substring(tokens.at(-1).raw.length).split('\n');
                        continue;
                    }
                }
                return {
                    type: 'blockquote',
                    raw,
                    tokens,
                    text,
                };
            }
        }
        list(src) {
            let cap = this.rules.block.list.exec(src);
            if (cap) {
                let bull = cap[1].trim();
                const isordered = bull.length > 1;
                const list = {
                    type: 'list',
                    raw: '',
                    ordered: isordered,
                    start: isordered ? +bull.slice(0, -1) : '',
                    loose: false,
                    items: [],
                };
                bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
                if (this.options.pedantic) {
                    bull = isordered ? bull : '[*+-]';
                }
                // Get next list item
                const itemRegex = this.rules.other.listItemRegex(bull);
                let endsWithBlankLine = false;
                // Check if current bullet point can start a new List Item
                while (src) {
                    let endEarly = false;
                    let raw = '';
                    let itemContents = '';
                    if (!(cap = itemRegex.exec(src))) {
                        break;
                    }
                    if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
                        break;
                    }
                    raw = cap[0];
                    src = src.substring(raw.length);
                    let line = cap[2].split('\n', 1)[0].replace(this.rules.other.listReplaceTabs, (t) => ' '.repeat(3 * t.length));
                    let nextLine = src.split('\n', 1)[0];
                    let blankLine = !line.trim();
                    let indent = 0;
                    if (this.options.pedantic) {
                        indent = 2;
                        itemContents = line.trimStart();
                    }
                    else if (blankLine) {
                        indent = cap[1].length + 1;
                    }
                    else {
                        indent = cap[2].search(this.rules.other.nonSpaceChar); // Find first non-space char
                        indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
                        itemContents = line.slice(indent);
                        indent += cap[1].length;
                    }
                    if (blankLine && this.rules.other.blankLine.test(nextLine)) { // Items begin with at most one blank line
                        raw += nextLine + '\n';
                        src = src.substring(nextLine.length + 1);
                        endEarly = true;
                    }
                    if (!endEarly) {
                        const nextBulletRegex = this.rules.other.nextBulletRegex(indent);
                        const hrRegex = this.rules.other.hrRegex(indent);
                        const fencesBeginRegex = this.rules.other.fencesBeginRegex(indent);
                        const headingBeginRegex = this.rules.other.headingBeginRegex(indent);
                        const htmlBeginRegex = this.rules.other.htmlBeginRegex(indent);
                        // Check if following lines should be included in List Item
                        while (src) {
                            const rawLine = src.split('\n', 1)[0];
                            let nextLineWithoutTabs;
                            nextLine = rawLine;
                            // Re-align to follow commonmark nesting rules
                            if (this.options.pedantic) {
                                nextLine = nextLine.replace(this.rules.other.listReplaceNesting, '  ');
                                nextLineWithoutTabs = nextLine;
                            }
                            else {
                                nextLineWithoutTabs = nextLine.replace(this.rules.other.tabCharGlobal, '    ');
                            }
                            // End list item if found code fences
                            if (fencesBeginRegex.test(nextLine)) {
                                break;
                            }
                            // End list item if found start of new heading
                            if (headingBeginRegex.test(nextLine)) {
                                break;
                            }
                            // End list item if found start of html block
                            if (htmlBeginRegex.test(nextLine)) {
                                break;
                            }
                            // End list item if found start of new bullet
                            if (nextBulletRegex.test(nextLine)) {
                                break;
                            }
                            // Horizontal rule found
                            if (hrRegex.test(nextLine)) {
                                break;
                            }
                            if (nextLineWithoutTabs.search(this.rules.other.nonSpaceChar) >= indent || !nextLine.trim()) { // Dedent if possible
                                itemContents += '\n' + nextLineWithoutTabs.slice(indent);
                            }
                            else {
                                // not enough indentation
                                if (blankLine) {
                                    break;
                                }
                                // paragraph continuation unless last line was a different block level element
                                if (line.replace(this.rules.other.tabCharGlobal, '    ').search(this.rules.other.nonSpaceChar) >= 4) { // indented code block
                                    break;
                                }
                                if (fencesBeginRegex.test(line)) {
                                    break;
                                }
                                if (headingBeginRegex.test(line)) {
                                    break;
                                }
                                if (hrRegex.test(line)) {
                                    break;
                                }
                                itemContents += '\n' + nextLine;
                            }
                            if (!blankLine && !nextLine.trim()) { // Check if current line is blank
                                blankLine = true;
                            }
                            raw += rawLine + '\n';
                            src = src.substring(rawLine.length + 1);
                            line = nextLineWithoutTabs.slice(indent);
                        }
                    }
                    if (!list.loose) {
                        // If the previous item ended with a blank line, the list is loose
                        if (endsWithBlankLine) {
                            list.loose = true;
                        }
                        else if (this.rules.other.doubleBlankLine.test(raw)) {
                            endsWithBlankLine = true;
                        }
                    }
                    let istask = null;
                    let ischecked;
                    // Check for task list items
                    if (this.options.gfm) {
                        istask = this.rules.other.listIsTask.exec(itemContents);
                        if (istask) {
                            ischecked = istask[0] !== '[ ] ';
                            itemContents = itemContents.replace(this.rules.other.listReplaceTask, '');
                        }
                    }
                    list.items.push({
                        type: 'list_item',
                        raw,
                        task: !!istask,
                        checked: ischecked,
                        loose: false,
                        text: itemContents,
                        tokens: [],
                    });
                    list.raw += raw;
                }
                // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
                const lastItem = list.items.at(-1);
                if (lastItem) {
                    lastItem.raw = lastItem.raw.trimEnd();
                    lastItem.text = lastItem.text.trimEnd();
                }
                else {
                    // not a list since there were no items
                    return;
                }
                list.raw = list.raw.trimEnd();
                // Item child tokens handled here at end because we needed to have the final item to trim it first
                for (let i = 0; i < list.items.length; i++) {
                    this.lexer.state.top = false;
                    list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);
                    if (!list.loose) {
                        // Check if list should be loose
                        const spacers = list.items[i].tokens.filter(t => t.type === 'space');
                        const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => this.rules.other.anyLine.test(t.raw));
                        list.loose = hasMultipleLineBreaks;
                    }
                }
                // Set all items to loose if list is loose
                if (list.loose) {
                    for (let i = 0; i < list.items.length; i++) {
                        list.items[i].loose = true;
                    }
                }
                return list;
            }
        }
        html(src) {
            const cap = this.rules.block.html.exec(src);
            if (cap) {
                const token = {
                    type: 'html',
                    block: true,
                    raw: cap[0],
                    pre: cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style',
                    text: cap[0],
                };
                return token;
            }
        }
        def(src) {
            const cap = this.rules.block.def.exec(src);
            if (cap) {
                const tag = cap[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, ' ');
                const href = cap[2] ? cap[2].replace(this.rules.other.hrefBrackets, '$1').replace(this.rules.inline.anyPunctuation, '$1') : '';
                const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, '$1') : cap[3];
                return {
                    type: 'def',
                    tag,
                    raw: cap[0],
                    href,
                    title,
                };
            }
        }
        table(src) {
            const cap = this.rules.block.table.exec(src);
            if (!cap) {
                return;
            }
            if (!this.rules.other.tableDelimiter.test(cap[2])) {
                // delimiter row must have a pipe (|) or colon (:) otherwise it is a setext heading
                return;
            }
            const headers = splitCells(cap[1]);
            const aligns = cap[2].replace(this.rules.other.tableAlignChars, '').split('|');
            const rows = cap[3]?.trim() ? cap[3].replace(this.rules.other.tableRowBlankLine, '').split('\n') : [];
            const item = {
                type: 'table',
                raw: cap[0],
                header: [],
                align: [],
                rows: [],
            };
            if (headers.length !== aligns.length) {
                // header and align columns must be equal, rows can be different.
                return;
            }
            for (const align of aligns) {
                if (this.rules.other.tableAlignRight.test(align)) {
                    item.align.push('right');
                }
                else if (this.rules.other.tableAlignCenter.test(align)) {
                    item.align.push('center');
                }
                else if (this.rules.other.tableAlignLeft.test(align)) {
                    item.align.push('left');
                }
                else {
                    item.align.push(null);
                }
            }
            for (let i = 0; i < headers.length; i++) {
                item.header.push({
                    text: headers[i],
                    tokens: this.lexer.inline(headers[i]),
                    header: true,
                    align: item.align[i],
                });
            }
            for (const row of rows) {
                item.rows.push(splitCells(row, item.header.length).map((cell, i) => {
                    return {
                        text: cell,
                        tokens: this.lexer.inline(cell),
                        header: false,
                        align: item.align[i],
                    };
                }));
            }
            return item;
        }
        lheading(src) {
            const cap = this.rules.block.lheading.exec(src);
            if (cap) {
                return {
                    type: 'heading',
                    raw: cap[0],
                    depth: cap[2].charAt(0) === '=' ? 1 : 2,
                    text: cap[1],
                    tokens: this.lexer.inline(cap[1]),
                };
            }
        }
        paragraph(src) {
            const cap = this.rules.block.paragraph.exec(src);
            if (cap) {
                const text = cap[1].charAt(cap[1].length - 1) === '\n'
                    ? cap[1].slice(0, -1)
                    : cap[1];
                return {
                    type: 'paragraph',
                    raw: cap[0],
                    text,
                    tokens: this.lexer.inline(text),
                };
            }
        }
        text(src) {
            const cap = this.rules.block.text.exec(src);
            if (cap) {
                return {
                    type: 'text',
                    raw: cap[0],
                    text: cap[0],
                    tokens: this.lexer.inline(cap[0]),
                };
            }
        }
        escape(src) {
            const cap = this.rules.inline.escape.exec(src);
            if (cap) {
                return {
                    type: 'escape',
                    raw: cap[0],
                    text: cap[1],
                };
            }
        }
        tag(src) {
            const cap = this.rules.inline.tag.exec(src);
            if (cap) {
                if (!this.lexer.state.inLink && this.rules.other.startATag.test(cap[0])) {
                    this.lexer.state.inLink = true;
                }
                else if (this.lexer.state.inLink && this.rules.other.endATag.test(cap[0])) {
                    this.lexer.state.inLink = false;
                }
                if (!this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(cap[0])) {
                    this.lexer.state.inRawBlock = true;
                }
                else if (this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(cap[0])) {
                    this.lexer.state.inRawBlock = false;
                }
                return {
                    type: 'html',
                    raw: cap[0],
                    inLink: this.lexer.state.inLink,
                    inRawBlock: this.lexer.state.inRawBlock,
                    block: false,
                    text: cap[0],
                };
            }
        }
        link(src) {
            const cap = this.rules.inline.link.exec(src);
            if (cap) {
                const trimmedUrl = cap[2].trim();
                if (!this.options.pedantic && this.rules.other.startAngleBracket.test(trimmedUrl)) {
                    // commonmark requires matching angle brackets
                    if (!(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                        return;
                    }
                    // ending angle bracket cannot be escaped
                    const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');
                    if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                        return;
                    }
                }
                else {
                    // find closing parenthesis
                    const lastParenIndex = findClosingBracket(cap[2], '()');
                    if (lastParenIndex > -1) {
                        const start = cap[0].indexOf('!') === 0 ? 5 : 4;
                        const linkLen = start + cap[1].length + lastParenIndex;
                        cap[2] = cap[2].substring(0, lastParenIndex);
                        cap[0] = cap[0].substring(0, linkLen).trim();
                        cap[3] = '';
                    }
                }
                let href = cap[2];
                let title = '';
                if (this.options.pedantic) {
                    // split pedantic href and title
                    const link = this.rules.other.pedanticHrefTitle.exec(href);
                    if (link) {
                        href = link[1];
                        title = link[3];
                    }
                }
                else {
                    title = cap[3] ? cap[3].slice(1, -1) : '';
                }
                href = href.trim();
                if (this.rules.other.startAngleBracket.test(href)) {
                    if (this.options.pedantic && !(this.rules.other.endAngleBracket.test(trimmedUrl))) {
                        // pedantic allows starting angle bracket without ending angle bracket
                        href = href.slice(1);
                    }
                    else {
                        href = href.slice(1, -1);
                    }
                }
                return outputLink(cap, {
                    href: href ? href.replace(this.rules.inline.anyPunctuation, '$1') : href,
                    title: title ? title.replace(this.rules.inline.anyPunctuation, '$1') : title,
                }, cap[0], this.lexer, this.rules);
            }
        }
        reflink(src, links) {
            let cap;
            if ((cap = this.rules.inline.reflink.exec(src))
                || (cap = this.rules.inline.nolink.exec(src))) {
                const linkString = (cap[2] || cap[1]).replace(this.rules.other.multipleSpaceGlobal, ' ');
                const link = links[linkString.toLowerCase()];
                if (!link) {
                    const text = cap[0].charAt(0);
                    return {
                        type: 'text',
                        raw: text,
                        text,
                    };
                }
                return outputLink(cap, link, cap[0], this.lexer, this.rules);
            }
        }
        emStrong(src, maskedSrc, prevChar = '') {
            let match = this.rules.inline.emStrongLDelim.exec(src);
            if (!match)
                return;
            // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well
            if (match[3] && prevChar.match(this.rules.other.unicodeAlphaNumeric))
                return;
            const nextChar = match[1] || match[2] || '';
            if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
                // unicode Regex counts emoji as 1 char; spread into array for proper count (used multiple times below)
                const lLength = [...match[0]].length - 1;
                let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
                const endReg = match[0][0] === '*' ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
                endReg.lastIndex = 0;
                // Clip maskedSrc to same section of string as src (move to lexer?)
                maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
                while ((match = endReg.exec(maskedSrc)) != null) {
                    rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
                    if (!rDelim)
                        continue; // skip single * in __abc*abc__
                    rLength = [...rDelim].length;
                    if (match[3] || match[4]) { // found another Left Delim
                        delimTotal += rLength;
                        continue;
                    }
                    else if (match[5] || match[6]) { // either Left or Right Delim
                        if (lLength % 3 && !((lLength + rLength) % 3)) {
                            midDelimTotal += rLength;
                            continue; // CommonMark Emphasis Rules 9-10
                        }
                    }
                    delimTotal -= rLength;
                    if (delimTotal > 0)
                        continue; // Haven't found enough closing delimiters
                    // Remove extra characters. *a*** -> *a*
                    rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
                    // char length can be >1 for unicode characters;
                    const lastCharLength = [...match[0]][0].length;
                    const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
                    // Create `em` if smallest delimiter has odd char count. *a***
                    if (Math.min(lLength, rLength) % 2) {
                        const text = raw.slice(1, -1);
                        return {
                            type: 'em',
                            raw,
                            text,
                            tokens: this.lexer.inlineTokens(text),
                        };
                    }
                    // Create 'strong' if smallest delimiter has even char count. **a***
                    const text = raw.slice(2, -2);
                    return {
                        type: 'strong',
                        raw,
                        text,
                        tokens: this.lexer.inlineTokens(text),
                    };
                }
            }
        }
        codespan(src) {
            const cap = this.rules.inline.code.exec(src);
            if (cap) {
                let text = cap[2].replace(this.rules.other.newLineCharGlobal, ' ');
                const hasNonSpaceChars = this.rules.other.nonSpaceChar.test(text);
                const hasSpaceCharsOnBothEnds = this.rules.other.startingSpaceChar.test(text) && this.rules.other.endingSpaceChar.test(text);
                if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
                    text = text.substring(1, text.length - 1);
                }
                return {
                    type: 'codespan',
                    raw: cap[0],
                    text,
                };
            }
        }
        br(src) {
            const cap = this.rules.inline.br.exec(src);
            if (cap) {
                return {
                    type: 'br',
                    raw: cap[0],
                };
            }
        }
        del(src) {
            const cap = this.rules.inline.del.exec(src);
            if (cap) {
                return {
                    type: 'del',
                    raw: cap[0],
                    text: cap[2],
                    tokens: this.lexer.inlineTokens(cap[2]),
                };
            }
        }
        autolink(src) {
            const cap = this.rules.inline.autolink.exec(src);
            if (cap) {
                let text, href;
                if (cap[2] === '@') {
                    text = cap[1];
                    href = 'mailto:' + text;
                }
                else {
                    text = cap[1];
                    href = text;
                }
                return {
                    type: 'link',
                    raw: cap[0],
                    text,
                    href,
                    tokens: [
                        {
                            type: 'text',
                            raw: text,
                            text,
                        },
                    ],
                };
            }
        }
        url(src) {
            let cap;
            if (cap = this.rules.inline.url.exec(src)) {
                let text, href;
                if (cap[2] === '@') {
                    text = cap[0];
                    href = 'mailto:' + text;
                }
                else {
                    // do extended autolink path validation
                    let prevCapZero;
                    do {
                        prevCapZero = cap[0];
                        cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? '';
                    } while (prevCapZero !== cap[0]);
                    text = cap[0];
                    if (cap[1] === 'www.') {
                        href = 'http://' + cap[0];
                    }
                    else {
                        href = cap[0];
                    }
                }
                return {
                    type: 'link',
                    raw: cap[0],
                    text,
                    href,
                    tokens: [
                        {
                            type: 'text',
                            raw: text,
                            text,
                        },
                    ],
                };
            }
        }
        inlineText(src) {
            const cap = this.rules.inline.text.exec(src);
            if (cap) {
                const escaped = this.lexer.state.inRawBlock;
                return {
                    type: 'text',
                    raw: cap[0],
                    text: cap[0],
                    escaped,
                };
            }
        }
    }

    /**
     * Block Lexer
     */
    class _Lexer {
        tokens;
        options;
        state;
        tokenizer;
        inlineQueue;
        constructor(options) {
            // TokenList cannot be created in one go
            this.tokens = [];
            this.tokens.links = Object.create(null);
            this.options = options || _defaults;
            this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
            this.tokenizer = this.options.tokenizer;
            this.tokenizer.options = this.options;
            this.tokenizer.lexer = this;
            this.inlineQueue = [];
            this.state = {
                inLink: false,
                inRawBlock: false,
                top: true,
            };
            const rules = {
                other,
                block: block.normal,
                inline: inline.normal,
            };
            if (this.options.pedantic) {
                rules.block = block.pedantic;
                rules.inline = inline.pedantic;
            }
            else if (this.options.gfm) {
                rules.block = block.gfm;
                if (this.options.breaks) {
                    rules.inline = inline.breaks;
                }
                else {
                    rules.inline = inline.gfm;
                }
            }
            this.tokenizer.rules = rules;
        }
        /**
         * Expose Rules
         */
        static get rules() {
            return {
                block,
                inline,
            };
        }
        /**
         * Static Lex Method
         */
        static lex(src, options) {
            const lexer = new _Lexer(options);
            return lexer.lex(src);
        }
        /**
         * Static Lex Inline Method
         */
        static lexInline(src, options) {
            const lexer = new _Lexer(options);
            return lexer.inlineTokens(src);
        }
        /**
         * Preprocessing
         */
        lex(src) {
            src = src.replace(other.carriageReturn, '\n');
            this.blockTokens(src, this.tokens);
            for (let i = 0; i < this.inlineQueue.length; i++) {
                const next = this.inlineQueue[i];
                this.inlineTokens(next.src, next.tokens);
            }
            this.inlineQueue = [];
            return this.tokens;
        }
        blockTokens(src, tokens = [], lastParagraphClipped = false) {
            if (this.options.pedantic) {
                src = src.replace(other.tabCharGlobal, '    ').replace(other.spaceLine, '');
            }
            while (src) {
                let token;
                if (this.options.extensions?.block?.some((extTokenizer) => {
                    if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                        src = src.substring(token.raw.length);
                        tokens.push(token);
                        return true;
                    }
                    return false;
                })) {
                    continue;
                }
                // newline
                if (token = this.tokenizer.space(src)) {
                    src = src.substring(token.raw.length);
                    const lastToken = tokens.at(-1);
                    if (token.raw.length === 1 && lastToken !== undefined) {
                        // if there's a single \n as a spacer, it's terminating the last line,
                        // so move it there so that we don't get unnecessary paragraph tags
                        lastToken.raw += '\n';
                    }
                    else {
                        tokens.push(token);
                    }
                    continue;
                }
                // code
                if (token = this.tokenizer.code(src)) {
                    src = src.substring(token.raw.length);
                    const lastToken = tokens.at(-1);
                    // An indented code block cannot interrupt a paragraph.
                    if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
                        lastToken.raw += '\n' + token.raw;
                        lastToken.text += '\n' + token.text;
                        this.inlineQueue.at(-1).src = lastToken.text;
                    }
                    else {
                        tokens.push(token);
                    }
                    continue;
                }
                // fences
                if (token = this.tokenizer.fences(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // heading
                if (token = this.tokenizer.heading(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // hr
                if (token = this.tokenizer.hr(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // blockquote
                if (token = this.tokenizer.blockquote(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // list
                if (token = this.tokenizer.list(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // html
                if (token = this.tokenizer.html(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // def
                if (token = this.tokenizer.def(src)) {
                    src = src.substring(token.raw.length);
                    const lastToken = tokens.at(-1);
                    if (lastToken?.type === 'paragraph' || lastToken?.type === 'text') {
                        lastToken.raw += '\n' + token.raw;
                        lastToken.text += '\n' + token.raw;
                        this.inlineQueue.at(-1).src = lastToken.text;
                    }
                    else if (!this.tokens.links[token.tag]) {
                        this.tokens.links[token.tag] = {
                            href: token.href,
                            title: token.title,
                        };
                    }
                    continue;
                }
                // table (gfm)
                if (token = this.tokenizer.table(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // lheading
                if (token = this.tokenizer.lheading(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // top-level paragraph
                // prevent paragraph consuming extensions by clipping 'src' to extension start
                let cutSrc = src;
                if (this.options.extensions?.startBlock) {
                    let startIndex = Infinity;
                    const tempSrc = src.slice(1);
                    let tempStart;
                    this.options.extensions.startBlock.forEach((getStartIndex) => {
                        tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                        if (typeof tempStart === 'number' && tempStart >= 0) {
                            startIndex = Math.min(startIndex, tempStart);
                        }
                    });
                    if (startIndex < Infinity && startIndex >= 0) {
                        cutSrc = src.substring(0, startIndex + 1);
                    }
                }
                if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
                    const lastToken = tokens.at(-1);
                    if (lastParagraphClipped && lastToken?.type === 'paragraph') {
                        lastToken.raw += '\n' + token.raw;
                        lastToken.text += '\n' + token.text;
                        this.inlineQueue.pop();
                        this.inlineQueue.at(-1).src = lastToken.text;
                    }
                    else {
                        tokens.push(token);
                    }
                    lastParagraphClipped = cutSrc.length !== src.length;
                    src = src.substring(token.raw.length);
                    continue;
                }
                // text
                if (token = this.tokenizer.text(src)) {
                    src = src.substring(token.raw.length);
                    const lastToken = tokens.at(-1);
                    if (lastToken?.type === 'text') {
                        lastToken.raw += '\n' + token.raw;
                        lastToken.text += '\n' + token.text;
                        this.inlineQueue.pop();
                        this.inlineQueue.at(-1).src = lastToken.text;
                    }
                    else {
                        tokens.push(token);
                    }
                    continue;
                }
                if (src) {
                    const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(errMsg);
                        break;
                    }
                    else {
                        throw new Error(errMsg);
                    }
                }
            }
            this.state.top = true;
            return tokens;
        }
        inline(src, tokens = []) {
            this.inlineQueue.push({ src, tokens });
            return tokens;
        }
        /**
         * Lexing/Compiling
         */
        inlineTokens(src, tokens = []) {
            // String with links masked to avoid interference with em and strong
            let maskedSrc = src;
            let match = null;
            // Mask out reflinks
            if (this.tokens.links) {
                const links = Object.keys(this.tokens.links);
                if (links.length > 0) {
                    while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                        if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                            maskedSrc = maskedSrc.slice(0, match.index)
                                + '[' + 'a'.repeat(match[0].length - 2) + ']'
                                + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                        }
                    }
                }
            }
            // Mask out escaped characters
            while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
                maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
            }
            // Mask out other blocks
            while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
                maskedSrc = maskedSrc.slice(0, match.index) + '[' + 'a'.repeat(match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
            }
            let keepPrevChar = false;
            let prevChar = '';
            while (src) {
                if (!keepPrevChar) {
                    prevChar = '';
                }
                keepPrevChar = false;
                let token;
                // extensions
                if (this.options.extensions?.inline?.some((extTokenizer) => {
                    if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
                        src = src.substring(token.raw.length);
                        tokens.push(token);
                        return true;
                    }
                    return false;
                })) {
                    continue;
                }
                // escape
                if (token = this.tokenizer.escape(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // tag
                if (token = this.tokenizer.tag(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // link
                if (token = this.tokenizer.link(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // reflink, nolink
                if (token = this.tokenizer.reflink(src, this.tokens.links)) {
                    src = src.substring(token.raw.length);
                    const lastToken = tokens.at(-1);
                    if (token.type === 'text' && lastToken?.type === 'text') {
                        lastToken.raw += token.raw;
                        lastToken.text += token.text;
                    }
                    else {
                        tokens.push(token);
                    }
                    continue;
                }
                // em & strong
                if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // code
                if (token = this.tokenizer.codespan(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // br
                if (token = this.tokenizer.br(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // del (gfm)
                if (token = this.tokenizer.del(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // autolink
                if (token = this.tokenizer.autolink(src)) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // url (gfm)
                if (!this.state.inLink && (token = this.tokenizer.url(src))) {
                    src = src.substring(token.raw.length);
                    tokens.push(token);
                    continue;
                }
                // text
                // prevent inlineText consuming extensions by clipping 'src' to extension start
                let cutSrc = src;
                if (this.options.extensions?.startInline) {
                    let startIndex = Infinity;
                    const tempSrc = src.slice(1);
                    let tempStart;
                    this.options.extensions.startInline.forEach((getStartIndex) => {
                        tempStart = getStartIndex.call({ lexer: this }, tempSrc);
                        if (typeof tempStart === 'number' && tempStart >= 0) {
                            startIndex = Math.min(startIndex, tempStart);
                        }
                    });
                    if (startIndex < Infinity && startIndex >= 0) {
                        cutSrc = src.substring(0, startIndex + 1);
                    }
                }
                if (token = this.tokenizer.inlineText(cutSrc)) {
                    src = src.substring(token.raw.length);
                    if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
                        prevChar = token.raw.slice(-1);
                    }
                    keepPrevChar = true;
                    const lastToken = tokens.at(-1);
                    if (lastToken?.type === 'text') {
                        lastToken.raw += token.raw;
                        lastToken.text += token.text;
                    }
                    else {
                        tokens.push(token);
                    }
                    continue;
                }
                if (src) {
                    const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
                    if (this.options.silent) {
                        console.error(errMsg);
                        break;
                    }
                    else {
                        throw new Error(errMsg);
                    }
                }
            }
            return tokens;
        }
    }

    /**
     * Renderer
     */
    class _Renderer {
        options;
        parser; // set by the parser
        constructor(options) {
            this.options = options || _defaults;
        }
        space(token) {
            return '';
        }
        code({ text, lang, escaped }) {
            const langString = (lang || '').match(other.notSpaceStart)?.[0];
            const code = text.replace(other.endingNewline, '') + '\n';
            if (!langString) {
                return '<pre><code>'
                    + (escaped ? code : escape(code, true))
                    + '</code></pre>\n';
            }
            return '<pre><code class="language-'
                + escape(langString)
                + '">'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }
        blockquote({ tokens }) {
            const body = this.parser.parse(tokens);
            return `<blockquote>\n${body}</blockquote>\n`;
        }
        html({ text }) {
            return text;
        }
        heading({ tokens, depth }) {
            return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
        }
        hr(token) {
            return '<hr>\n';
        }
        list(token) {
            const ordered = token.ordered;
            const start = token.start;
            let body = '';
            for (let j = 0; j < token.items.length; j++) {
                const item = token.items[j];
                body += this.listitem(item);
            }
            const type = ordered ? 'ol' : 'ul';
            const startAttr = (ordered && start !== 1) ? (' start="' + start + '"') : '';
            return '<' + type + startAttr + '>\n' + body + '</' + type + '>\n';
        }
        listitem(item) {
            let itemBody = '';
            if (item.task) {
                const checkbox = this.checkbox({ checked: !!item.checked });
                if (item.loose) {
                    if (item.tokens[0]?.type === 'paragraph') {
                        item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                        if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                            item.tokens[0].tokens[0].text = checkbox + ' ' + escape(item.tokens[0].tokens[0].text);
                            item.tokens[0].tokens[0].escaped = true;
                        }
                    }
                    else {
                        item.tokens.unshift({
                            type: 'text',
                            raw: checkbox + ' ',
                            text: checkbox + ' ',
                            escaped: true,
                        });
                    }
                }
                else {
                    itemBody += checkbox + ' ';
                }
            }
            itemBody += this.parser.parse(item.tokens, !!item.loose);
            return `<li>${itemBody}</li>\n`;
        }
        checkbox({ checked }) {
            return '<input '
                + (checked ? 'checked="" ' : '')
                + 'disabled="" type="checkbox">';
        }
        paragraph({ tokens }) {
            return `<p>${this.parser.parseInline(tokens)}</p>\n`;
        }
        table(token) {
            let header = '';
            // header
            let cell = '';
            for (let j = 0; j < token.header.length; j++) {
                cell += this.tablecell(token.header[j]);
            }
            header += this.tablerow({ text: cell });
            let body = '';
            for (let j = 0; j < token.rows.length; j++) {
                const row = token.rows[j];
                cell = '';
                for (let k = 0; k < row.length; k++) {
                    cell += this.tablecell(row[k]);
                }
                body += this.tablerow({ text: cell });
            }
            if (body)
                body = `<tbody>${body}</tbody>`;
            return '<table>\n'
                + '<thead>\n'
                + header
                + '</thead>\n'
                + body
                + '</table>\n';
        }
        tablerow({ text }) {
            return `<tr>\n${text}</tr>\n`;
        }
        tablecell(token) {
            const content = this.parser.parseInline(token.tokens);
            const type = token.header ? 'th' : 'td';
            const tag = token.align
                ? `<${type} align="${token.align}">`
                : `<${type}>`;
            return tag + content + `</${type}>\n`;
        }
        /**
         * span level renderer
         */
        strong({ tokens }) {
            return `<strong>${this.parser.parseInline(tokens)}</strong>`;
        }
        em({ tokens }) {
            return `<em>${this.parser.parseInline(tokens)}</em>`;
        }
        codespan({ text }) {
            return `<code>${escape(text, true)}</code>`;
        }
        br(token) {
            return '<br>';
        }
        del({ tokens }) {
            return `<del>${this.parser.parseInline(tokens)}</del>`;
        }
        link({ href, title, tokens }) {
            const text = this.parser.parseInline(tokens);
            const cleanHref = cleanUrl(href);
            if (cleanHref === null) {
                return text;
            }
            href = cleanHref;
            let out = '<a href="' + href + '"';
            if (title) {
                out += ' title="' + (escape(title)) + '"';
            }
            out += '>' + text + '</a>';
            return out;
        }
        image({ href, title, text }) {
            const cleanHref = cleanUrl(href);
            if (cleanHref === null) {
                return escape(text);
            }
            href = cleanHref;
            let out = `<img src="${href}" alt="${text}"`;
            if (title) {
                out += ` title="${escape(title)}"`;
            }
            out += '>';
            return out;
        }
        text(token) {
            return 'tokens' in token && token.tokens
                ? this.parser.parseInline(token.tokens)
                : ('escaped' in token && token.escaped ? token.text : escape(token.text));
        }
    }

    /**
     * TextRenderer
     * returns only the textual part of the token
     */
    class _TextRenderer {
        // no need for block level renderers
        strong({ text }) {
            return text;
        }
        em({ text }) {
            return text;
        }
        codespan({ text }) {
            return text;
        }
        del({ text }) {
            return text;
        }
        html({ text }) {
            return text;
        }
        text({ text }) {
            return text;
        }
        link({ text }) {
            return '' + text;
        }
        image({ text }) {
            return '' + text;
        }
        br() {
            return '';
        }
    }

    /**
     * Parsing & Compiling
     */
    class _Parser {
        options;
        renderer;
        textRenderer;
        constructor(options) {
            this.options = options || _defaults;
            this.options.renderer = this.options.renderer || new _Renderer();
            this.renderer = this.options.renderer;
            this.renderer.options = this.options;
            this.renderer.parser = this;
            this.textRenderer = new _TextRenderer();
        }
        /**
         * Static Parse Method
         */
        static parse(tokens, options) {
            const parser = new _Parser(options);
            return parser.parse(tokens);
        }
        /**
         * Static Parse Inline Method
         */
        static parseInline(tokens, options) {
            const parser = new _Parser(options);
            return parser.parseInline(tokens);
        }
        /**
         * Parse Loop
         */
        parse(tokens, top = true) {
            let out = '';
            for (let i = 0; i < tokens.length; i++) {
                const anyToken = tokens[i];
                // Run any renderer extensions
                if (this.options.extensions?.renderers?.[anyToken.type]) {
                    const genericToken = anyToken;
                    const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
                    if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(genericToken.type)) {
                        out += ret || '';
                        continue;
                    }
                }
                const token = anyToken;
                switch (token.type) {
                    case 'space': {
                        out += this.renderer.space(token);
                        continue;
                    }
                    case 'hr': {
                        out += this.renderer.hr(token);
                        continue;
                    }
                    case 'heading': {
                        out += this.renderer.heading(token);
                        continue;
                    }
                    case 'code': {
                        out += this.renderer.code(token);
                        continue;
                    }
                    case 'table': {
                        out += this.renderer.table(token);
                        continue;
                    }
                    case 'blockquote': {
                        out += this.renderer.blockquote(token);
                        continue;
                    }
                    case 'list': {
                        out += this.renderer.list(token);
                        continue;
                    }
                    case 'html': {
                        out += this.renderer.html(token);
                        continue;
                    }
                    case 'paragraph': {
                        out += this.renderer.paragraph(token);
                        continue;
                    }
                    case 'text': {
                        let textToken = token;
                        let body = this.renderer.text(textToken);
                        while (i + 1 < tokens.length && tokens[i + 1].type === 'text') {
                            textToken = tokens[++i];
                            body += '\n' + this.renderer.text(textToken);
                        }
                        if (top) {
                            out += this.renderer.paragraph({
                                type: 'paragraph',
                                raw: body,
                                text: body,
                                tokens: [{ type: 'text', raw: body, text: body, escaped: true }],
                            });
                        }
                        else {
                            out += body;
                        }
                        continue;
                    }
                    default: {
                        const errMsg = 'Token with "' + token.type + '" type was not found.';
                        if (this.options.silent) {
                            console.error(errMsg);
                            return '';
                        }
                        else {
                            throw new Error(errMsg);
                        }
                    }
                }
            }
            return out;
        }
        /**
         * Parse Inline Tokens
         */
        parseInline(tokens, renderer = this.renderer) {
            let out = '';
            for (let i = 0; i < tokens.length; i++) {
                const anyToken = tokens[i];
                // Run any renderer extensions
                if (this.options.extensions?.renderers?.[anyToken.type]) {
                    const ret = this.options.extensions.renderers[anyToken.type].call({ parser: this }, anyToken);
                    if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(anyToken.type)) {
                        out += ret || '';
                        continue;
                    }
                }
                const token = anyToken;
                switch (token.type) {
                    case 'escape': {
                        out += renderer.text(token);
                        break;
                    }
                    case 'html': {
                        out += renderer.html(token);
                        break;
                    }
                    case 'link': {
                        out += renderer.link(token);
                        break;
                    }
                    case 'image': {
                        out += renderer.image(token);
                        break;
                    }
                    case 'strong': {
                        out += renderer.strong(token);
                        break;
                    }
                    case 'em': {
                        out += renderer.em(token);
                        break;
                    }
                    case 'codespan': {
                        out += renderer.codespan(token);
                        break;
                    }
                    case 'br': {
                        out += renderer.br(token);
                        break;
                    }
                    case 'del': {
                        out += renderer.del(token);
                        break;
                    }
                    case 'text': {
                        out += renderer.text(token);
                        break;
                    }
                    default: {
                        const errMsg = 'Token with "' + token.type + '" type was not found.';
                        if (this.options.silent) {
                            console.error(errMsg);
                            return '';
                        }
                        else {
                            throw new Error(errMsg);
                        }
                    }
                }
            }
            return out;
        }
    }

    class _Hooks {
        options;
        block;
        constructor(options) {
            this.options = options || _defaults;
        }
        static passThroughHooks = new Set([
            'preprocess',
            'postprocess',
            'processAllTokens',
        ]);
        /**
         * Process markdown before marked
         */
        preprocess(markdown) {
            return markdown;
        }
        /**
         * Process HTML after marked is finished
         */
        postprocess(html) {
            return html;
        }
        /**
         * Process all tokens before walk tokens
         */
        processAllTokens(tokens) {
            return tokens;
        }
        /**
         * Provide function to tokenize markdown
         */
        provideLexer() {
            return this.block ? _Lexer.lex : _Lexer.lexInline;
        }
        /**
         * Provide function to parse tokens
         */
        provideParser() {
            return this.block ? _Parser.parse : _Parser.parseInline;
        }
    }

    class Marked {
        defaults = _getDefaults();
        options = this.setOptions;
        parse = this.parseMarkdown(true);
        parseInline = this.parseMarkdown(false);
        Parser = _Parser;
        Renderer = _Renderer;
        TextRenderer = _TextRenderer;
        Lexer = _Lexer;
        Tokenizer = _Tokenizer;
        Hooks = _Hooks;
        constructor(...args) {
            this.use(...args);
        }
        /**
         * Run callback for every token
         */
        walkTokens(tokens, callback) {
            let values = [];
            for (const token of tokens) {
                values = values.concat(callback.call(this, token));
                switch (token.type) {
                    case 'table': {
                        const tableToken = token;
                        for (const cell of tableToken.header) {
                            values = values.concat(this.walkTokens(cell.tokens, callback));
                        }
                        for (const row of tableToken.rows) {
                            for (const cell of row) {
                                values = values.concat(this.walkTokens(cell.tokens, callback));
                            }
                        }
                        break;
                    }
                    case 'list': {
                        const listToken = token;
                        values = values.concat(this.walkTokens(listToken.items, callback));
                        break;
                    }
                    default: {
                        const genericToken = token;
                        if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
                            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
                                const tokens = genericToken[childTokens].flat(Infinity);
                                values = values.concat(this.walkTokens(tokens, callback));
                            });
                        }
                        else if (genericToken.tokens) {
                            values = values.concat(this.walkTokens(genericToken.tokens, callback));
                        }
                    }
                }
            }
            return values;
        }
        use(...args) {
            const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
            args.forEach((pack) => {
                // copy options to new object
                const opts = { ...pack };
                // set async to true if it was set to true before
                opts.async = this.defaults.async || opts.async || false;
                // ==-- Parse "addon" extensions --== //
                if (pack.extensions) {
                    pack.extensions.forEach((ext) => {
                        if (!ext.name) {
                            throw new Error('extension name required');
                        }
                        if ('renderer' in ext) { // Renderer extensions
                            const prevRenderer = extensions.renderers[ext.name];
                            if (prevRenderer) {
                                // Replace extension with func to run new extension but fall back if false
                                extensions.renderers[ext.name] = function (...args) {
                                    let ret = ext.renderer.apply(this, args);
                                    if (ret === false) {
                                        ret = prevRenderer.apply(this, args);
                                    }
                                    return ret;
                                };
                            }
                            else {
                                extensions.renderers[ext.name] = ext.renderer;
                            }
                        }
                        if ('tokenizer' in ext) { // Tokenizer Extensions
                            if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
                                throw new Error("extension level must be 'block' or 'inline'");
                            }
                            const extLevel = extensions[ext.level];
                            if (extLevel) {
                                extLevel.unshift(ext.tokenizer);
                            }
                            else {
                                extensions[ext.level] = [ext.tokenizer];
                            }
                            if (ext.start) { // Function to check for start of token
                                if (ext.level === 'block') {
                                    if (extensions.startBlock) {
                                        extensions.startBlock.push(ext.start);
                                    }
                                    else {
                                        extensions.startBlock = [ext.start];
                                    }
                                }
                                else if (ext.level === 'inline') {
                                    if (extensions.startInline) {
                                        extensions.startInline.push(ext.start);
                                    }
                                    else {
                                        extensions.startInline = [ext.start];
                                    }
                                }
                            }
                        }
                        if ('childTokens' in ext && ext.childTokens) { // Child tokens to be visited by walkTokens
                            extensions.childTokens[ext.name] = ext.childTokens;
                        }
                    });
                    opts.extensions = extensions;
                }
                // ==-- Parse "overwrite" extensions --== //
                if (pack.renderer) {
                    const renderer = this.defaults.renderer || new _Renderer(this.defaults);
                    for (const prop in pack.renderer) {
                        if (!(prop in renderer)) {
                            throw new Error(`renderer '${prop}' does not exist`);
                        }
                        if (['options', 'parser'].includes(prop)) {
                            // ignore options property
                            continue;
                        }
                        const rendererProp = prop;
                        const rendererFunc = pack.renderer[rendererProp];
                        const prevRenderer = renderer[rendererProp];
                        // Replace renderer with func to run extension, but fall back if false
                        renderer[rendererProp] = (...args) => {
                            let ret = rendererFunc.apply(renderer, args);
                            if (ret === false) {
                                ret = prevRenderer.apply(renderer, args);
                            }
                            return ret || '';
                        };
                    }
                    opts.renderer = renderer;
                }
                if (pack.tokenizer) {
                    const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
                    for (const prop in pack.tokenizer) {
                        if (!(prop in tokenizer)) {
                            throw new Error(`tokenizer '${prop}' does not exist`);
                        }
                        if (['options', 'rules', 'lexer'].includes(prop)) {
                            // ignore options, rules, and lexer properties
                            continue;
                        }
                        const tokenizerProp = prop;
                        const tokenizerFunc = pack.tokenizer[tokenizerProp];
                        const prevTokenizer = tokenizer[tokenizerProp];
                        // Replace tokenizer with func to run extension, but fall back if false
                        // @ts-expect-error cannot type tokenizer function dynamically
                        tokenizer[tokenizerProp] = (...args) => {
                            let ret = tokenizerFunc.apply(tokenizer, args);
                            if (ret === false) {
                                ret = prevTokenizer.apply(tokenizer, args);
                            }
                            return ret;
                        };
                    }
                    opts.tokenizer = tokenizer;
                }
                // ==-- Parse Hooks extensions --== //
                if (pack.hooks) {
                    const hooks = this.defaults.hooks || new _Hooks();
                    for (const prop in pack.hooks) {
                        if (!(prop in hooks)) {
                            throw new Error(`hook '${prop}' does not exist`);
                        }
                        if (['options', 'block'].includes(prop)) {
                            // ignore options and block properties
                            continue;
                        }
                        const hooksProp = prop;
                        const hooksFunc = pack.hooks[hooksProp];
                        const prevHook = hooks[hooksProp];
                        if (_Hooks.passThroughHooks.has(prop)) {
                            // @ts-expect-error cannot type hook function dynamically
                            hooks[hooksProp] = (arg) => {
                                if (this.defaults.async) {
                                    return Promise.resolve(hooksFunc.call(hooks, arg)).then(ret => {
                                        return prevHook.call(hooks, ret);
                                    });
                                }
                                const ret = hooksFunc.call(hooks, arg);
                                return prevHook.call(hooks, ret);
                            };
                        }
                        else {
                            // @ts-expect-error cannot type hook function dynamically
                            hooks[hooksProp] = (...args) => {
                                let ret = hooksFunc.apply(hooks, args);
                                if (ret === false) {
                                    ret = prevHook.apply(hooks, args);
                                }
                                return ret;
                            };
                        }
                    }
                    opts.hooks = hooks;
                }
                // ==-- Parse WalkTokens extensions --== //
                if (pack.walkTokens) {
                    const walkTokens = this.defaults.walkTokens;
                    const packWalktokens = pack.walkTokens;
                    opts.walkTokens = function (token) {
                        let values = [];
                        values.push(packWalktokens.call(this, token));
                        if (walkTokens) {
                            values = values.concat(walkTokens.call(this, token));
                        }
                        return values;
                    };
                }
                this.defaults = { ...this.defaults, ...opts };
            });
            return this;
        }
        setOptions(opt) {
            this.defaults = { ...this.defaults, ...opt };
            return this;
        }
        lexer(src, options) {
            return _Lexer.lex(src, options ?? this.defaults);
        }
        parser(tokens, options) {
            return _Parser.parse(tokens, options ?? this.defaults);
        }
        parseMarkdown(blockType) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const parse = (src, options) => {
                const origOpt = { ...options };
                const opt = { ...this.defaults, ...origOpt };
                const throwError = this.onError(!!opt.silent, !!opt.async);
                // throw error if an extension set async to true but parse was called with async: false
                if (this.defaults.async === true && origOpt.async === false) {
                    return throwError(new Error('marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise.'));
                }
                // throw error in case of non string input
                if (typeof src === 'undefined' || src === null) {
                    return throwError(new Error('marked(): input parameter is undefined or null'));
                }
                if (typeof src !== 'string') {
                    return throwError(new Error('marked(): input parameter is of type '
                        + Object.prototype.toString.call(src) + ', string expected'));
                }
                if (opt.hooks) {
                    opt.hooks.options = opt;
                    opt.hooks.block = blockType;
                }
                const lexer = opt.hooks ? opt.hooks.provideLexer() : (blockType ? _Lexer.lex : _Lexer.lexInline);
                const parser = opt.hooks ? opt.hooks.provideParser() : (blockType ? _Parser.parse : _Parser.parseInline);
                if (opt.async) {
                    return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src)
                        .then(src => lexer(src, opt))
                        .then(tokens => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens)
                        .then(tokens => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens)
                        .then(tokens => parser(tokens, opt))
                        .then(html => opt.hooks ? opt.hooks.postprocess(html) : html)
                        .catch(throwError);
                }
                try {
                    if (opt.hooks) {
                        src = opt.hooks.preprocess(src);
                    }
                    let tokens = lexer(src, opt);
                    if (opt.hooks) {
                        tokens = opt.hooks.processAllTokens(tokens);
                    }
                    if (opt.walkTokens) {
                        this.walkTokens(tokens, opt.walkTokens);
                    }
                    let html = parser(tokens, opt);
                    if (opt.hooks) {
                        html = opt.hooks.postprocess(html);
                    }
                    return html;
                }
                catch (e) {
                    return throwError(e);
                }
            };
            return parse;
        }
        onError(silent, async) {
            return (e) => {
                e.message += '\nPlease report this to https://github.com/markedjs/marked.';
                if (silent) {
                    const msg = '<p>An error occurred:</p><pre>'
                        + escape(e.message + '', true)
                        + '</pre>';
                    if (async) {
                        return Promise.resolve(msg);
                    }
                    return msg;
                }
                if (async) {
                    return Promise.reject(e);
                }
                throw e;
            };
        }
    }

    const markedInstance = new Marked();
    function marked(src, opt) {
        return markedInstance.parse(src, opt);
    }
    /**
     * Sets the default options.
     *
     * @param options Hash of options
     */
    marked.options =
        marked.setOptions = function (options) {
            markedInstance.setOptions(options);
            marked.defaults = markedInstance.defaults;
            changeDefaults(marked.defaults);
            return marked;
        };
    /**
     * Gets the original marked default options.
     */
    marked.getDefaults = _getDefaults;
    marked.defaults = _defaults;
    /**
     * Use Extension
     */
    marked.use = function (...args) {
        markedInstance.use(...args);
        marked.defaults = markedInstance.defaults;
        changeDefaults(marked.defaults);
        return marked;
    };
    /**
     * Run callback for every token
     */
    marked.walkTokens = function (tokens, callback) {
        return markedInstance.walkTokens(tokens, callback);
    };
    /**
     * Compiles markdown to HTML without enclosing `p` tag.
     *
     * @param src String of markdown source to be compiled
     * @param options Hash of options
     * @return String of compiled HTML
     */
    marked.parseInline = markedInstance.parseInline;
    /**
     * Expose
     */
    marked.Parser = _Parser;
    marked.parser = _Parser.parse;
    marked.Renderer = _Renderer;
    marked.TextRenderer = _TextRenderer;
    marked.Lexer = _Lexer;
    marked.lexer = _Lexer.lex;
    marked.Tokenizer = _Tokenizer;
    marked.Hooks = _Hooks;
    marked.parse = marked;
    marked.options;
    marked.setOptions;
    marked.use;
    marked.walkTokens;
    marked.parseInline;
    _Parser.parse;
    _Lexer.lex;

    const MarkdownEditor = ({
      record,
      property,
      onChange
    }) => {
      const [showPreview, setShowPreview] = React.useState(true);
      const [showHelp, setShowHelp] = React.useState(false);
      const previewRef = React.useRef(null);
      const value = record.params[property.path] || '';
      const insertSyntax = (syntax, placeholder = '') => {
        const textarea = document.getElementById('markdown-textarea');
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
      React.useEffect(() => {
        if (!previewRef.current) return;
        const elements = previewRef.current.querySelectorAll('*');
        elements.forEach(el => {
          const element = el;
          const tag = element.tagName.toLowerCase();
          switch (tag) {
            case 'h1':
            case 'h2':
            case 'h3':
              Object.assign(element.style, {
                fontWeight: 'bold',
                fontSize: '16px',
                marginTop: '12px',
                marginBottom: '8px'
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
                fontFamily: 'monospace'
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
                margin: '8px 0'
              });
              break;
          }
        });
      }, [value, showPreview]);
      return /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          display: 'flex',
          gap: '24px'
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React__default.default.createElement("div", {
        style: {
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React__default.default.createElement("button", {
        type: 'button',
        onClick: () => insertSyntax('bold', 'жирный'),
        style: {
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid #0078C1',
          background: '#0078C1',
          color: '#fff',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React__default.default.createElement("b", null, "B")), /*#__PURE__*/React__default.default.createElement("button", {
        type: 'button',
        onClick: () => insertSyntax('italic', 'курсив'),
        style: {
          padding: '6px 10px',
          borderRadius: '6px',
          border: '1px solid #0078C1',
          background: '#0078C1',
          color: '#fff',
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React__default.default.createElement("i", null, "I")), /*#__PURE__*/React__default.default.createElement("button", {
        type: 'button',
        onClick: () => setShowPreview(prev => !prev),
        style: {
          padding: '6px 12px',
          borderRadius: '6px',
          border: '1px solid #0078C1',
          background: '#fff',
          color: '#0078C1',
          cursor: 'pointer',
          fontWeight: 'bold'
        }
      }, showPreview ? 'Скрыть превью' : 'Показать превью'), /*#__PURE__*/React__default.default.createElement("div", {
        onMouseEnter: () => setShowHelp(true),
        onMouseLeave: () => setShowHelp(false),
        style: {
          marginLeft: 'auto',
          position: 'relative',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#0078C1'
        }
      }, "?", showHelp && (/*#__PURE__*/React__default.default.createElement("div", {
        style: {
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
          zIndex: 1000
        }
      }, /*#__PURE__*/React__default.default.createElement("p", null, /*#__PURE__*/React__default.default.createElement("strong", null, "Markdown:")), /*#__PURE__*/React__default.default.createElement("ul", {
        style: {
          paddingLeft: '16px',
          margin: 0
        }
      }, /*#__PURE__*/React__default.default.createElement("li", null, /*#__PURE__*/React__default.default.createElement("code", null, "**\u0436\u0438\u0440\u043D\u044B\u0439**"), " \u2192 ", /*#__PURE__*/React__default.default.createElement("strong", null, "\u0436\u0438\u0440\u043D\u044B\u0439")), /*#__PURE__*/React__default.default.createElement("li", null, /*#__PURE__*/React__default.default.createElement("code", null, "*\u043A\u0443\u0440\u0441\u0438\u0432*"), " \u2192 ", /*#__PURE__*/React__default.default.createElement("em", null, "\u043A\u0443\u0440\u0441\u0438\u0432")), /*#__PURE__*/React__default.default.createElement("li", null, /*#__PURE__*/React__default.default.createElement("code", null, "# \u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A"), " \u2192 ", /*#__PURE__*/React__default.default.createElement("b", null, "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A")), /*#__PURE__*/React__default.default.createElement("li", null, /*#__PURE__*/React__default.default.createElement("code", null, "- \u0421\u043F\u0438\u0441\u043E\u043A"), " \u2192 \u2022 \u044D\u043B\u0435\u043C\u0435\u043D\u0442")))))), /*#__PURE__*/React__default.default.createElement("textarea", {
        id: 'markdown-textarea',
        value: value,
        onChange: e => onChange(property.path, e.target.value),
        rows: 12,
        style: {
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxSizing: 'border-box',
          resize: 'none'
        }
      })), showPreview && (/*#__PURE__*/React__default.default.createElement("div", {
        ref: previewRef,
        style: {
          flex: 1,
          border: '1px solid #ccc',
          padding: '12px',
          backgroundColor: '#fafafa',
          borderRadius: '6px',
          overflowY: 'auto',
          maxHeight: '300px',
          fontSize: '14px',
          lineHeight: '1.5'
        },
        dangerouslySetInnerHTML: {
          __html: marked.parse(value || '')
        }
      })));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.DashboardRoute = Dashboard;
    AdminJS.UserComponents.UploadPhoto = UploadPhoto;
    AdminJS.UserComponents.ImagePreview = ImagePreview;
    AdminJS.UserComponents.UploadMultiplePhotos = UploadMultiplePhotos;
    AdminJS.UserComponents.ImagesPreview = ImagesPreview;
    AdminJS.UserComponents.MarkdownEditor = MarkdownEditor;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvZGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL3VwbG9hZC1waG90by5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9pbWFnZS1wcmV2aWV3LmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL3VwbG9hZC1tdWx0aXBsZS1waG90b3MuanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvaW1hZ2VzLXByZXZpZXcuanMiLCIuLi9ub2RlX21vZHVsZXMvbWFya2VkL2xpYi9tYXJrZWQuZXNtLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL21hcmtkb3duLWVkaXRvci5qcyIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWRtaW4vcmVzb3VyY2VzL9Cd0L7QstC+0YHRgtC4JztcbiAgICB9KTtcbiAgICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnQgeyBEYXNoYm9hcmQgfTtcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5jb25zdCBVcGxvYWRQaG90byA9ICh7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkIH0pID0+IHtcbiAgICBjb25zdCBwaG90b1BhdGggPSByZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdO1xuICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XG4gICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgYWxsb3dlZFR5cGVzID0gWydpbWFnZS9wbmcnLCAnaW1hZ2UvanBlZycsICdpbWFnZS9qcGcnXTtcbiAgICAgICAgaWYgKCFhbGxvd2VkVHlwZXMuaW5jbHVkZXMoZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgYWxlcnQoJ9Cg0LDQt9GA0LXRiNC10L3RiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyBQTkcsIEpQRyDQuNC70LggSlBFRycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWRtaW4vdXBsb2FkJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBib2R5OiBmb3JtRGF0YSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGlmIChkYXRhLmZpbGVQYXRoKSB7XG4gICAgICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBkYXRhLmZpbGVQYXRoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCAnJyk7XG4gICAgfTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBnYXA6ICcxZW0nLCBtYXJnaW5Ub3A6ICcxZW0nIH0gfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMTZweCcsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1JvYm90bywgc2Fucy1zZXJpZicsXG4gICAgICAgICAgICB9IH0sIFwiXFx1MDQxOFxcdTA0MzdcXHUwNDNFXFx1MDQzMVxcdTA0NDBcXHUwNDMwXFx1MDQzNlxcdTA0MzVcXHUwNDNEXFx1MDQzOFxcdTA0NEZcIiksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTZweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMnB4IGRhc2hlZCAjY2NjJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICd3aGl0ZScsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgIFwiXFx1MDQxRFxcdTA0MzBcXHUwNDM2XFx1MDQzQ1xcdTA0MzhcXHUwNDQyXFx1MDQzNSwgXFx1MDQ0N1xcdTA0NDJcXHUwNDNFXFx1MDQzMVxcdTA0NEIgXFx1MDQzN1xcdTA0MzBcXHUwNDMzXFx1MDQ0MFxcdTA0NDNcXHUwNDM3XFx1MDQzOFxcdTA0NDJcXHUwNDRDIFxcdTA0NDRcXHUwNDNFXFx1MDQ0MlxcdTA0M0UgKFBORywgSlBHLCBKUEVHKVwiLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgaWQ6ICdmaWxlLXVwbG9hZCcsIHR5cGU6ICdmaWxlJywgYWNjZXB0OiAnLnBuZywuanBnLC5qcGVnJywgb25DaGFuZ2U6IGhhbmRsZUNoYW5nZSwgc3R5bGU6IHsgZGlzcGxheTogJ25vbmUnIH0gfSkpLFxuICAgICAgICBwaG90b1BhdGggJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzFlbScsIGFsaWduSXRlbXM6ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxNDBweCcsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzE0MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMnB4IHNvbGlkICMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCA4cHggcmdiYSgwLDAsMCwwLjE1KScsXG4gICAgICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IHBob3RvUGF0aCwgYWx0OiAndXBsb2FkZWQnLCBzdHlsZTogeyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcxMDAlJywgb2JqZWN0Rml0OiAnY292ZXInIH0gfSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IG9uQ2xpY2s6IGhhbmRsZVJlbW92ZSwgdHlwZTogJ2J1dHRvbicsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByaWdodDogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmNGQ0ZicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMjRweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICB9LCB0aXRsZTogJ1xcdTA0MjNcXHUwNDM0XFx1MDQzMFxcdTA0M0JcXHUwNDM4XFx1MDQ0MlxcdTA0NEMgXFx1MDQ0NFxcdTA0M0VcXHUwNDQyXFx1MDQzRScgfSwgXCJcXHUwMEQ3XCIpKSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgVXBsb2FkUGhvdG87XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuY29uc3QgSW1hZ2VQcmV2aWV3ID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgZmlsZVBhdGggPSByZWNvcmQucGFyYW1zW3Byb3BlcnR5LnBhdGhdO1xuICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiXFx1MDQxRFxcdTA0MzVcXHUwNDQyIFxcdTA0MzhcXHUwNDM3XFx1MDQzRVxcdTA0MzFcXHUwNDQwXFx1MDQzMFxcdTA0MzZcXHUwNDM1XFx1MDQzRFxcdTA0MzhcXHUwNDRGXCIpO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IGZpbGVQYXRoLCBhbHQ6ICdhc2RmYXNkZicsIHN0eWxlOiB7IHdpZHRoOiAnMTUwcHgnLCBoZWlnaHQ6ICcxNTBweCcsIG9iamVjdEZpdDogJ2NvdmVyJywgYm9yZGVyUmFkaXVzOiA4IH0gfSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEltYWdlUHJldmlldztcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IFVwbG9hZE11bHRpcGxlUGhvdG9zID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBvbkNoYW5nZSwgcHJvcGVydHksIHJlY29yZCB9ID0gcHJvcHM7XG4gICAgY29uc3QgZXhpc3RpbmdQaG90b3MgPSBbXTtcbiAgICBPYmplY3QuZW50cmllcyhyZWNvcmQucGFyYW1zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKGAke3Byb3BlcnR5Lm5hbWV9LmApICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGV4aXN0aW5nUGhvdG9zLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgW3Bob3Rvcywgc2V0UGhvdG9zXSA9IHVzZVN0YXRlKGV4aXN0aW5nUGhvdG9zKTtcbiAgICBjb25zdCBoYW5kbGVDaGFuZ2UgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBBcnJheS5mcm9tKGV2ZW50LnRhcmdldC5maWxlcyB8fCBbXSk7XG4gICAgICAgIGNvbnN0IHRvdGFsUGhvdG9zID0gcGhvdG9zLmxlbmd0aCArIGZpbGVzLmxlbmd0aDtcbiAgICAgICAgaWYgKHRvdGFsUGhvdG9zID4gMykge1xuICAgICAgICAgICAgYWxlcnQoJ9Cc0L7QttC90L4g0LfQsNCz0YDRg9C30LjRgtGMINC80LDQutGB0LjQvNGD0LwgMyDRhNC+0YLQvtCz0YDQsNGE0LjQuC4nKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuZXdQaG90b1BhdGhzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IFsnaW1hZ2UvcG5nJywgJ2ltYWdlL2pwZWcnLCAnaW1hZ2UvanBnJ10uaW5jbHVkZXMoZmlsZS50eXBlKTtcbiAgICAgICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KCfQnNC+0LbQvdC+INC30LDQs9GA0YPQttCw0YLRjCDRgtC+0LvRjNC60L4g0LjQt9C+0LHRgNCw0LbQtdC90LjRjzogcG5nLCBqcGcsIGpwZWcnKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJy9hZG1pbi91cGxvYWQnLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBpZiAoZGF0YS5maWxlUGF0aCkge1xuICAgICAgICAgICAgICAgIG5ld1Bob3RvUGF0aHMucHVzaChkYXRhLmZpbGVQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCB1cGRhdGVkUGhvdG9zID0gWy4uLnBob3RvcywgLi4ubmV3UGhvdG9QYXRoc10uc2xpY2UoMCwgMyk7XG4gICAgICAgIHNldFBob3Rvcyh1cGRhdGVkUGhvdG9zKTtcbiAgICAgICAgdXBkYXRlZFBob3Rvcy5mb3JFYWNoKChwYXRoLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgb25DaGFuZ2UoYCR7cHJvcGVydHkubmFtZX0uJHtpbmRleH1gLCBwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAobGV0IGkgPSB1cGRhdGVkUGhvdG9zLmxlbmd0aDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIG9uQ2hhbmdlKGAke3Byb3BlcnR5Lm5hbWV9LiR7aX1gLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKGluZGV4VG9SZW1vdmUpID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlZCA9IHBob3Rvcy5maWx0ZXIoKF8sIGluZGV4KSA9PiBpbmRleCAhPT0gaW5kZXhUb1JlbW92ZSk7XG4gICAgICAgIHNldFBob3Rvcyh1cGRhdGVkKTtcbiAgICAgICAgdXBkYXRlZC5mb3JFYWNoKChwYXRoLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgb25DaGFuZ2UoYCR7cHJvcGVydHkubmFtZX0uJHtpbmRleH1gLCBwYXRoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGZvciAobGV0IGkgPSB1cGRhdGVkLmxlbmd0aDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgIG9uQ2hhbmdlKGAke3Byb3BlcnR5Lm5hbWV9LiR7aX1gLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAnMWVtJywgbWFyZ2luVG9wOiAnMWVtJyB9IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogJzE2cHgnLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdSb2JvdG8sIHNhbnMtc2VyaWYnLFxuICAgICAgICAgICAgfSB9LCBcIlxcdTA0MThcXHUwNDM3XFx1MDQzRVxcdTA0MzFcXHUwNDQwXFx1MDQzMFxcdTA0MzZcXHUwNDM1XFx1MDQzRFxcdTA0MzhcXHUwNDRGXCIpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzE2cHgnLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzJweCBkYXNoZWQgI2NjYycsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxNnB4JyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICBcIlxcdTA0MTdcXHUwNDMwXFx1MDQzM1xcdTA0NDBcXHUwNDQzXFx1MDQzN1xcdTA0MzhcXHUwNDQyXFx1MDQ0QyBcXHUwNDQ0XFx1MDQzRVxcdTA0NDJcXHUwNDNFXFx1MDQzM1xcdTA0NDBcXHUwNDMwXFx1MDQ0NFxcdTA0MzhcXHUwNDM4IChcXHUwNDNDXFx1MDQzMFxcdTA0M0FcXHUwNDQxLiAzKVwiLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHsgdHlwZTogJ2ZpbGUnLCBhY2NlcHQ6ICdpbWFnZS9wbmcsaW1hZ2UvanBlZyxpbWFnZS9qcGcnLCBtdWx0aXBsZTogdHJ1ZSwgb25DaGFuZ2U6IGhhbmRsZUNoYW5nZSwgc3R5bGU6IHsgZGlzcGxheTogJ25vbmUnIH0gfSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcxMnB4JywgZmxleFdyYXA6ICd3cmFwJyB9IH0sIHBob3Rvcy5tYXAoKHBob3RvLCBpbmRleCkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBrZXk6IGluZGV4LCBzdHlsZTogeyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBwaG90bywgYWx0OiBg0KTQvtGC0L4gJHtpbmRleCArIDF9YCwgc3R5bGU6IHsgd2lkdGg6ICcxMjBweCcsIGhlaWdodDogJzEyMHB4Jywgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXJSYWRpdXM6ICc4cHgnIH0gfSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgdHlwZTogJ2J1dHRvbicsIG9uQ2xpY2s6ICgpID0+IGhhbmRsZVJlbW92ZShpbmRleCksIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICB0b3A6ICctNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6ICctNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3JlZCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcyMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjBweCcsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgIH0gfSwgXCJcXHUwMEQ3XCIpKSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFVwbG9hZE11bHRpcGxlUGhvdG9zO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmNvbnN0IEltYWdlc1ByZXZpZXcgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHBob3RvcyA9IFtdO1xuICAgIE9iamVjdC5lbnRyaWVzKHJlY29yZC5wYXJhbXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoYCR7cHJvcGVydHkubmFtZX0uYCkgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGhvdG9zLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICc1cHgnLCBmbGV4V3JhcDogJ3dyYXAnIH0gfSwgcGhvdG9zLm1hcCgoc3JjLCBpbmRleCkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBrZXk6IGluZGV4LCBzcmM6IHNyYywgYWx0OiBgcGhvdG8tJHtpbmRleH1gLCBzdHlsZTogeyB3aWR0aDogMTIwLCBoZWlnaHQ6IDEyMCwgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXI6ICcxcHggc29saWQgI2NjYycgfSB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgSW1hZ2VzUHJldmlldztcbiIsIi8qKlxuICogbWFya2VkIHYxNS4wLjggLSBhIG1hcmtkb3duIHBhcnNlclxuICogQ29weXJpZ2h0IChjKSAyMDExLTIwMjUsIENocmlzdG9waGVyIEplZmZyZXkuIChNSVQgTGljZW5zZWQpXG4gKiBodHRwczovL2dpdGh1Yi5jb20vbWFya2VkanMvbWFya2VkXG4gKi9cblxuLyoqXG4gKiBETyBOT1QgRURJVCBUSElTIEZJTEVcbiAqIFRoZSBjb2RlIGluIHRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgZnJvbSBmaWxlcyBpbiAuL3NyYy9cbiAqL1xuXG4vKipcbiAqIEdldHMgdGhlIG9yaWdpbmFsIG1hcmtlZCBkZWZhdWx0IG9wdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIF9nZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3luYzogZmFsc2UsXG4gICAgICAgIGJyZWFrczogZmFsc2UsXG4gICAgICAgIGV4dGVuc2lvbnM6IG51bGwsXG4gICAgICAgIGdmbTogdHJ1ZSxcbiAgICAgICAgaG9va3M6IG51bGwsXG4gICAgICAgIHBlZGFudGljOiBmYWxzZSxcbiAgICAgICAgcmVuZGVyZXI6IG51bGwsXG4gICAgICAgIHNpbGVudDogZmFsc2UsXG4gICAgICAgIHRva2VuaXplcjogbnVsbCxcbiAgICAgICAgd2Fsa1Rva2VuczogbnVsbCxcbiAgICB9O1xufVxubGV0IF9kZWZhdWx0cyA9IF9nZXREZWZhdWx0cygpO1xuZnVuY3Rpb24gY2hhbmdlRGVmYXVsdHMobmV3RGVmYXVsdHMpIHtcbiAgICBfZGVmYXVsdHMgPSBuZXdEZWZhdWx0cztcbn1cblxuY29uc3Qgbm9vcFRlc3QgPSB7IGV4ZWM6ICgpID0+IG51bGwgfTtcbmZ1bmN0aW9uIGVkaXQocmVnZXgsIG9wdCA9ICcnKSB7XG4gICAgbGV0IHNvdXJjZSA9IHR5cGVvZiByZWdleCA9PT0gJ3N0cmluZycgPyByZWdleCA6IHJlZ2V4LnNvdXJjZTtcbiAgICBjb25zdCBvYmogPSB7XG4gICAgICAgIHJlcGxhY2U6IChuYW1lLCB2YWwpID0+IHtcbiAgICAgICAgICAgIGxldCB2YWxTb3VyY2UgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IHZhbCA6IHZhbC5zb3VyY2U7XG4gICAgICAgICAgICB2YWxTb3VyY2UgPSB2YWxTb3VyY2UucmVwbGFjZShvdGhlci5jYXJldCwgJyQxJyk7XG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZShuYW1lLCB2YWxTb3VyY2UpO1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0UmVnZXg6ICgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKHNvdXJjZSwgb3B0KTtcbiAgICAgICAgfSxcbiAgICB9O1xuICAgIHJldHVybiBvYmo7XG59XG5jb25zdCBvdGhlciA9IHtcbiAgICBjb2RlUmVtb3ZlSW5kZW50OiAvXig/OiB7MSw0fXwgezAsM31cXHQpL2dtLFxuICAgIG91dHB1dExpbmtSZXBsYWNlOiAvXFxcXChbXFxbXFxdXSkvZyxcbiAgICBpbmRlbnRDb2RlQ29tcGVuc2F0aW9uOiAvXihcXHMrKSg/OmBgYCkvLFxuICAgIGJlZ2lubmluZ1NwYWNlOiAvXlxccysvLFxuICAgIGVuZGluZ0hhc2g6IC8jJC8sXG4gICAgc3RhcnRpbmdTcGFjZUNoYXI6IC9eIC8sXG4gICAgZW5kaW5nU3BhY2VDaGFyOiAvICQvLFxuICAgIG5vblNwYWNlQ2hhcjogL1teIF0vLFxuICAgIG5ld0xpbmVDaGFyR2xvYmFsOiAvXFxuL2csXG4gICAgdGFiQ2hhckdsb2JhbDogL1xcdC9nLFxuICAgIG11bHRpcGxlU3BhY2VHbG9iYWw6IC9cXHMrL2csXG4gICAgYmxhbmtMaW5lOiAvXlsgXFx0XSokLyxcbiAgICBkb3VibGVCbGFua0xpbmU6IC9cXG5bIFxcdF0qXFxuWyBcXHRdKiQvLFxuICAgIGJsb2NrcXVvdGVTdGFydDogL14gezAsM30+LyxcbiAgICBibG9ja3F1b3RlU2V0ZXh0UmVwbGFjZTogL1xcbiB7MCwzfSgoPzo9K3wtKykgKikoPz1cXG58JCkvZyxcbiAgICBibG9ja3F1b3RlU2V0ZXh0UmVwbGFjZTI6IC9eIHswLDN9PlsgXFx0XT8vZ20sXG4gICAgbGlzdFJlcGxhY2VUYWJzOiAvXlxcdCsvLFxuICAgIGxpc3RSZXBsYWNlTmVzdGluZzogL14gezEsNH0oPz0oIHs0fSkqW14gXSkvZyxcbiAgICBsaXN0SXNUYXNrOiAvXlxcW1sgeFhdXFxdIC8sXG4gICAgbGlzdFJlcGxhY2VUYXNrOiAvXlxcW1sgeFhdXFxdICsvLFxuICAgIGFueUxpbmU6IC9cXG4uKlxcbi8sXG4gICAgaHJlZkJyYWNrZXRzOiAvXjwoLiopPiQvLFxuICAgIHRhYmxlRGVsaW1pdGVyOiAvWzp8XS8sXG4gICAgdGFibGVBbGlnbkNoYXJzOiAvXlxcfHxcXHwgKiQvZyxcbiAgICB0YWJsZVJvd0JsYW5rTGluZTogL1xcblsgXFx0XSokLyxcbiAgICB0YWJsZUFsaWduUmlnaHQ6IC9eICotKzogKiQvLFxuICAgIHRhYmxlQWxpZ25DZW50ZXI6IC9eICo6LSs6ICokLyxcbiAgICB0YWJsZUFsaWduTGVmdDogL14gKjotKyAqJC8sXG4gICAgc3RhcnRBVGFnOiAvXjxhIC9pLFxuICAgIGVuZEFUYWc6IC9ePFxcL2E+L2ksXG4gICAgc3RhcnRQcmVTY3JpcHRUYWc6IC9ePChwcmV8Y29kZXxrYmR8c2NyaXB0KShcXHN8PikvaSxcbiAgICBlbmRQcmVTY3JpcHRUYWc6IC9ePFxcLyhwcmV8Y29kZXxrYmR8c2NyaXB0KShcXHN8PikvaSxcbiAgICBzdGFydEFuZ2xlQnJhY2tldDogL148LyxcbiAgICBlbmRBbmdsZUJyYWNrZXQ6IC8+JC8sXG4gICAgcGVkYW50aWNIcmVmVGl0bGU6IC9eKFteJ1wiXSpbXlxcc10pXFxzKyhbJ1wiXSkoLiopXFwyLyxcbiAgICB1bmljb2RlQWxwaGFOdW1lcmljOiAvW1xccHtMfVxccHtOfV0vdSxcbiAgICBlc2NhcGVUZXN0OiAvWyY8PlwiJ10vLFxuICAgIGVzY2FwZVJlcGxhY2U6IC9bJjw+XCInXS9nLFxuICAgIGVzY2FwZVRlc3ROb0VuY29kZTogL1s8PlwiJ118Jig/ISgjXFxkezEsN318I1tYeF1bYS1mQS1GMC05XXsxLDZ9fFxcdyspOykvLFxuICAgIGVzY2FwZVJlcGxhY2VOb0VuY29kZTogL1s8PlwiJ118Jig/ISgjXFxkezEsN318I1tYeF1bYS1mQS1GMC05XXsxLDZ9fFxcdyspOykvZyxcbiAgICB1bmVzY2FwZVRlc3Q6IC8mKCMoPzpcXGQrKXwoPzojeFswLTlBLUZhLWZdKyl8KD86XFx3KykpOz8vaWcsXG4gICAgY2FyZXQ6IC8oXnxbXlxcW10pXFxeL2csXG4gICAgcGVyY2VudERlY29kZTogLyUyNS9nLFxuICAgIGZpbmRQaXBlOiAvXFx8L2csXG4gICAgc3BsaXRQaXBlOiAvIFxcfC8sXG4gICAgc2xhc2hQaXBlOiAvXFxcXFxcfC9nLFxuICAgIGNhcnJpYWdlUmV0dXJuOiAvXFxyXFxufFxcci9nLFxuICAgIHNwYWNlTGluZTogL14gKyQvZ20sXG4gICAgbm90U3BhY2VTdGFydDogL15cXFMqLyxcbiAgICBlbmRpbmdOZXdsaW5lOiAvXFxuJC8sXG4gICAgbGlzdEl0ZW1SZWdleDogKGJ1bGwpID0+IG5ldyBSZWdFeHAoYF4oIHswLDN9JHtidWxsfSkoKD86W1xcdCBdW15cXFxcbl0qKT8oPzpcXFxcbnwkKSlgKSxcbiAgICBuZXh0QnVsbGV0UmVnZXg6IChpbmRlbnQpID0+IG5ldyBSZWdFeHAoYF4gezAsJHtNYXRoLm1pbigzLCBpbmRlbnQgLSAxKX19KD86WyorLV18XFxcXGR7MSw5fVsuKV0pKCg/OlsgXFx0XVteXFxcXG5dKik/KD86XFxcXG58JCkpYCksXG4gICAgaHJSZWdleDogKGluZGVudCkgPT4gbmV3IFJlZ0V4cChgXiB7MCwke01hdGgubWluKDMsIGluZGVudCAtIDEpfX0oKD86LSAqKXszLH18KD86XyAqKXszLH18KD86XFxcXCogKil7Myx9KSg/OlxcXFxuK3wkKWApLFxuICAgIGZlbmNlc0JlZ2luUmVnZXg6IChpbmRlbnQpID0+IG5ldyBSZWdFeHAoYF4gezAsJHtNYXRoLm1pbigzLCBpbmRlbnQgLSAxKX19KD86XFxgXFxgXFxgfH5+filgKSxcbiAgICBoZWFkaW5nQmVnaW5SZWdleDogKGluZGVudCkgPT4gbmV3IFJlZ0V4cChgXiB7MCwke01hdGgubWluKDMsIGluZGVudCAtIDEpfX0jYCksXG4gICAgaHRtbEJlZ2luUmVnZXg6IChpbmRlbnQpID0+IG5ldyBSZWdFeHAoYF4gezAsJHtNYXRoLm1pbigzLCBpbmRlbnQgLSAxKX19PCg/OlthLXpdLio+fCEtLSlgLCAnaScpLFxufTtcbi8qKlxuICogQmxvY2stTGV2ZWwgR3JhbW1hclxuICovXG5jb25zdCBuZXdsaW5lID0gL14oPzpbIFxcdF0qKD86XFxufCQpKSsvO1xuY29uc3QgYmxvY2tDb2RlID0gL14oKD86IHs0fXwgezAsM31cXHQpW15cXG5dKyg/Olxcbig/OlsgXFx0XSooPzpcXG58JCkpKik/KSsvO1xuY29uc3QgZmVuY2VzID0gL14gezAsM30oYHszLH0oPz1bXmBcXG5dKig/OlxcbnwkKSl8fnszLH0pKFteXFxuXSopKD86XFxufCQpKD86fChbXFxzXFxTXSo/KSg/OlxcbnwkKSkoPzogezAsM31cXDFbfmBdKiAqKD89XFxufCQpfCQpLztcbmNvbnN0IGhyID0gL14gezAsM30oKD86LVtcXHQgXSopezMsfXwoPzpfWyBcXHRdKil7Myx9fCg/OlxcKlsgXFx0XSopezMsfSkoPzpcXG4rfCQpLztcbmNvbnN0IGhlYWRpbmcgPSAvXiB7MCwzfSgjezEsNn0pKD89XFxzfCQpKC4qKSg/Olxcbit8JCkvO1xuY29uc3QgYnVsbGV0ID0gLyg/OlsqKy1dfFxcZHsxLDl9Wy4pXSkvO1xuY29uc3QgbGhlYWRpbmdDb3JlID0gL14oPyFidWxsIHxibG9ja0NvZGV8ZmVuY2VzfGJsb2NrcXVvdGV8aGVhZGluZ3xodG1sfHRhYmxlKSgoPzoufFxcbig/IVxccyo/XFxufGJ1bGwgfGJsb2NrQ29kZXxmZW5jZXN8YmxvY2txdW90ZXxoZWFkaW5nfGh0bWx8dGFibGUpKSs/KVxcbiB7MCwzfSg9K3wtKykgKig/Olxcbit8JCkvO1xuY29uc3QgbGhlYWRpbmcgPSBlZGl0KGxoZWFkaW5nQ29yZSlcbiAgICAucmVwbGFjZSgvYnVsbC9nLCBidWxsZXQpIC8vIGxpc3RzIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvYmxvY2tDb2RlL2csIC8oPzogezR9fCB7MCwzfVxcdCkvKSAvLyBpbmRlbnRlZCBjb2RlIGJsb2NrcyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2ZlbmNlcy9nLCAvIHswLDN9KD86YHszLH18fnszLH0pLykgLy8gZmVuY2VkIGNvZGUgYmxvY2tzIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvYmxvY2txdW90ZS9nLCAvIHswLDN9Pi8pIC8vIGJsb2NrcXVvdGUgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9oZWFkaW5nL2csIC8gezAsM30jezEsNn0vKSAvLyBBVFggaGVhZGluZyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2h0bWwvZywgLyB7MCwzfTxbXlxcbj5dKz5cXG4vKSAvLyBibG9jayBodG1sIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvXFx8dGFibGUvZywgJycpIC8vIHRhYmxlIG5vdCBpbiBjb21tb25tYXJrXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBsaGVhZGluZ0dmbSA9IGVkaXQobGhlYWRpbmdDb3JlKVxuICAgIC5yZXBsYWNlKC9idWxsL2csIGJ1bGxldCkgLy8gbGlzdHMgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9ibG9ja0NvZGUvZywgLyg/OiB7NH18IHswLDN9XFx0KS8pIC8vIGluZGVudGVkIGNvZGUgYmxvY2tzIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvZmVuY2VzL2csIC8gezAsM30oPzpgezMsfXx+ezMsfSkvKSAvLyBmZW5jZWQgY29kZSBibG9ja3MgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9ibG9ja3F1b3RlL2csIC8gezAsM30+LykgLy8gYmxvY2txdW90ZSBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2hlYWRpbmcvZywgLyB7MCwzfSN7MSw2fS8pIC8vIEFUWCBoZWFkaW5nIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvaHRtbC9nLCAvIHswLDN9PFteXFxuPl0rPlxcbi8pIC8vIGJsb2NrIGh0bWwgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC90YWJsZS9nLCAvIHswLDN9XFx8Pyg/Ols6XFwtIF0qXFx8KStbXFw6XFwtIF0qXFxuLykgLy8gdGFibGUgY2FuIGludGVycnVwdFxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgX3BhcmFncmFwaCA9IC9eKFteXFxuXSsoPzpcXG4oPyFocnxoZWFkaW5nfGxoZWFkaW5nfGJsb2NrcXVvdGV8ZmVuY2VzfGxpc3R8aHRtbHx0YWJsZXwgK1xcbilbXlxcbl0rKSopLztcbmNvbnN0IGJsb2NrVGV4dCA9IC9eW15cXG5dKy87XG5jb25zdCBfYmxvY2tMYWJlbCA9IC8oPyFcXHMqXFxdKSg/OlxcXFwufFteXFxbXFxdXFxcXF0pKy87XG5jb25zdCBkZWYgPSBlZGl0KC9eIHswLDN9XFxbKGxhYmVsKVxcXTogKig/OlxcblsgXFx0XSopPyhbXjxcXHNdW15cXHNdKnw8Lio/PikoPzooPzogKyg/OlxcblsgXFx0XSopP3wgKlxcblsgXFx0XSopKHRpdGxlKSk/ICooPzpcXG4rfCQpLylcbiAgICAucmVwbGFjZSgnbGFiZWwnLCBfYmxvY2tMYWJlbClcbiAgICAucmVwbGFjZSgndGl0bGUnLCAvKD86XCIoPzpcXFxcXCI/fFteXCJcXFxcXSkqXCJ8J1teJ1xcbl0qKD86XFxuW14nXFxuXSspKlxcbj8nfFxcKFteKCldKlxcKSkvKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgbGlzdCA9IGVkaXQoL14oIHswLDN9YnVsbCkoWyBcXHRdW15cXG5dKz8pPyg/OlxcbnwkKS8pXG4gICAgLnJlcGxhY2UoL2J1bGwvZywgYnVsbGV0KVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgX3RhZyA9ICdhZGRyZXNzfGFydGljbGV8YXNpZGV8YmFzZXxiYXNlZm9udHxibG9ja3F1b3RlfGJvZHl8Y2FwdGlvbidcbiAgICArICd8Y2VudGVyfGNvbHxjb2xncm91cHxkZHxkZXRhaWxzfGRpYWxvZ3xkaXJ8ZGl2fGRsfGR0fGZpZWxkc2V0fGZpZ2NhcHRpb24nXG4gICAgKyAnfGZpZ3VyZXxmb290ZXJ8Zm9ybXxmcmFtZXxmcmFtZXNldHxoWzEtNl18aGVhZHxoZWFkZXJ8aHJ8aHRtbHxpZnJhbWUnXG4gICAgKyAnfGxlZ2VuZHxsaXxsaW5rfG1haW58bWVudXxtZW51aXRlbXxtZXRhfG5hdnxub2ZyYW1lc3xvbHxvcHRncm91cHxvcHRpb24nXG4gICAgKyAnfHB8cGFyYW18c2VhcmNofHNlY3Rpb258c3VtbWFyeXx0YWJsZXx0Ym9keXx0ZHx0Zm9vdHx0aHx0aGVhZHx0aXRsZSdcbiAgICArICd8dHJ8dHJhY2t8dWwnO1xuY29uc3QgX2NvbW1lbnQgPSAvPCEtLSg/Oi0/PnxbXFxzXFxTXSo/KD86LS0+fCQpKS87XG5jb25zdCBodG1sID0gZWRpdCgnXiB7MCwzfSg/OicgLy8gb3B0aW9uYWwgaW5kZW50YXRpb25cbiAgICArICc8KHNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWEpW1xcXFxzPl1bXFxcXHNcXFxcU10qPyg/OjwvXFxcXDE+W15cXFxcbl0qXFxcXG4rfCQpJyAvLyAoMSlcbiAgICArICd8Y29tbWVudFteXFxcXG5dKihcXFxcbit8JCknIC8vICgyKVxuICAgICsgJ3w8XFxcXD9bXFxcXHNcXFxcU10qPyg/OlxcXFw/PlxcXFxuKnwkKScgLy8gKDMpXG4gICAgKyAnfDwhW0EtWl1bXFxcXHNcXFxcU10qPyg/Oj5cXFxcbip8JCknIC8vICg0KVxuICAgICsgJ3w8IVxcXFxbQ0RBVEFcXFxcW1tcXFxcc1xcXFxTXSo/KD86XFxcXF1cXFxcXT5cXFxcbip8JCknIC8vICg1KVxuICAgICsgJ3w8Lz8odGFnKSg/OiArfFxcXFxufC8/PilbXFxcXHNcXFxcU10qPyg/Oig/OlxcXFxuWyBcXHRdKikrXFxcXG58JCknIC8vICg2KVxuICAgICsgJ3w8KD8hc2NyaXB0fHByZXxzdHlsZXx0ZXh0YXJlYSkoW2Etel1bXFxcXHctXSopKD86YXR0cmlidXRlKSo/ICovPz4oPz1bIFxcXFx0XSooPzpcXFxcbnwkKSlbXFxcXHNcXFxcU10qPyg/Oig/OlxcXFxuWyBcXHRdKikrXFxcXG58JCknIC8vICg3KSBvcGVuIHRhZ1xuICAgICsgJ3w8Lyg/IXNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWEpW2Etel1bXFxcXHctXSpcXFxccyo+KD89WyBcXFxcdF0qKD86XFxcXG58JCkpW1xcXFxzXFxcXFNdKj8oPzooPzpcXFxcblsgXFx0XSopK1xcXFxufCQpJyAvLyAoNykgY2xvc2luZyB0YWdcbiAgICArICcpJywgJ2knKVxuICAgIC5yZXBsYWNlKCdjb21tZW50JywgX2NvbW1lbnQpXG4gICAgLnJlcGxhY2UoJ3RhZycsIF90YWcpXG4gICAgLnJlcGxhY2UoJ2F0dHJpYnV0ZScsIC8gK1thLXpBLVo6X11bXFx3LjotXSooPzogKj0gKlwiW15cIlxcbl0qXCJ8ICo9IConW14nXFxuXSonfCAqPSAqW15cXHNcIic9PD5gXSspPy8pXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBwYXJhZ3JhcGggPSBlZGl0KF9wYXJhZ3JhcGgpXG4gICAgLnJlcGxhY2UoJ2hyJywgaHIpXG4gICAgLnJlcGxhY2UoJ2hlYWRpbmcnLCAnIHswLDN9I3sxLDZ9KD86XFxcXHN8JCknKVxuICAgIC5yZXBsYWNlKCd8bGhlYWRpbmcnLCAnJykgLy8gc2V0ZXh0IGhlYWRpbmdzIGRvbid0IGludGVycnVwdCBjb21tb25tYXJrIHBhcmFncmFwaHNcbiAgICAucmVwbGFjZSgnfHRhYmxlJywgJycpXG4gICAgLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpXG4gICAgLnJlcGxhY2UoJ2ZlbmNlcycsICcgezAsM30oPzpgezMsfSg/PVteYFxcXFxuXSpcXFxcbil8fnszLH0pW15cXFxcbl0qXFxcXG4nKVxuICAgIC5yZXBsYWNlKCdsaXN0JywgJyB7MCwzfSg/OlsqKy1dfDFbLildKSAnKSAvLyBvbmx5IGxpc3RzIHN0YXJ0aW5nIGZyb20gMSBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoJ2h0bWwnLCAnPC8/KD86dGFnKSg/OiArfFxcXFxufC8/Pil8PCg/OnNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWF8IS0tKScpXG4gICAgLnJlcGxhY2UoJ3RhZycsIF90YWcpIC8vIHBhcnMgY2FuIGJlIGludGVycnVwdGVkIGJ5IHR5cGUgKDYpIGh0bWwgYmxvY2tzXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBibG9ja3F1b3RlID0gZWRpdCgvXiggezAsM30+ID8ocGFyYWdyYXBofFteXFxuXSopKD86XFxufCQpKSsvKVxuICAgIC5yZXBsYWNlKCdwYXJhZ3JhcGgnLCBwYXJhZ3JhcGgpXG4gICAgLmdldFJlZ2V4KCk7XG4vKipcbiAqIE5vcm1hbCBCbG9jayBHcmFtbWFyXG4gKi9cbmNvbnN0IGJsb2NrTm9ybWFsID0ge1xuICAgIGJsb2NrcXVvdGUsXG4gICAgY29kZTogYmxvY2tDb2RlLFxuICAgIGRlZixcbiAgICBmZW5jZXMsXG4gICAgaGVhZGluZyxcbiAgICBocixcbiAgICBodG1sLFxuICAgIGxoZWFkaW5nLFxuICAgIGxpc3QsXG4gICAgbmV3bGluZSxcbiAgICBwYXJhZ3JhcGgsXG4gICAgdGFibGU6IG5vb3BUZXN0LFxuICAgIHRleHQ6IGJsb2NrVGV4dCxcbn07XG4vKipcbiAqIEdGTSBCbG9jayBHcmFtbWFyXG4gKi9cbmNvbnN0IGdmbVRhYmxlID0gZWRpdCgnXiAqKFteXFxcXG4gXS4qKVxcXFxuJyAvLyBIZWFkZXJcbiAgICArICcgezAsM30oKD86XFxcXHwgKik/Oj8tKzo/ICooPzpcXFxcfCAqOj8tKzo/ICopKig/OlxcXFx8ICopPyknIC8vIEFsaWduXG4gICAgKyAnKD86XFxcXG4oKD86KD8hICpcXFxcbnxocnxoZWFkaW5nfGJsb2NrcXVvdGV8Y29kZXxmZW5jZXN8bGlzdHxodG1sKS4qKD86XFxcXG58JCkpKilcXFxcbip8JCknKSAvLyBDZWxsc1xuICAgIC5yZXBsYWNlKCdocicsIGhyKVxuICAgIC5yZXBsYWNlKCdoZWFkaW5nJywgJyB7MCwzfSN7MSw2fSg/OlxcXFxzfCQpJylcbiAgICAucmVwbGFjZSgnYmxvY2txdW90ZScsICcgezAsM30+JylcbiAgICAucmVwbGFjZSgnY29kZScsICcoPzogezR9fCB7MCwzfVxcdClbXlxcXFxuXScpXG4gICAgLnJlcGxhY2UoJ2ZlbmNlcycsICcgezAsM30oPzpgezMsfSg/PVteYFxcXFxuXSpcXFxcbil8fnszLH0pW15cXFxcbl0qXFxcXG4nKVxuICAgIC5yZXBsYWNlKCdsaXN0JywgJyB7MCwzfSg/OlsqKy1dfDFbLildKSAnKSAvLyBvbmx5IGxpc3RzIHN0YXJ0aW5nIGZyb20gMSBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoJ2h0bWwnLCAnPC8/KD86dGFnKSg/OiArfFxcXFxufC8/Pil8PCg/OnNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWF8IS0tKScpXG4gICAgLnJlcGxhY2UoJ3RhZycsIF90YWcpIC8vIHRhYmxlcyBjYW4gYmUgaW50ZXJydXB0ZWQgYnkgdHlwZSAoNikgaHRtbCBibG9ja3NcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IGJsb2NrR2ZtID0ge1xuICAgIC4uLmJsb2NrTm9ybWFsLFxuICAgIGxoZWFkaW5nOiBsaGVhZGluZ0dmbSxcbiAgICB0YWJsZTogZ2ZtVGFibGUsXG4gICAgcGFyYWdyYXBoOiBlZGl0KF9wYXJhZ3JhcGgpXG4gICAgICAgIC5yZXBsYWNlKCdocicsIGhyKVxuICAgICAgICAucmVwbGFjZSgnaGVhZGluZycsICcgezAsM30jezEsNn0oPzpcXFxcc3wkKScpXG4gICAgICAgIC5yZXBsYWNlKCd8bGhlYWRpbmcnLCAnJykgLy8gc2V0ZXh0IGhlYWRpbmdzIGRvbid0IGludGVycnVwdCBjb21tb25tYXJrIHBhcmFncmFwaHNcbiAgICAgICAgLnJlcGxhY2UoJ3RhYmxlJywgZ2ZtVGFibGUpIC8vIGludGVycnVwdCBwYXJhZ3JhcGhzIHdpdGggdGFibGVcbiAgICAgICAgLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpXG4gICAgICAgIC5yZXBsYWNlKCdmZW5jZXMnLCAnIHswLDN9KD86YHszLH0oPz1bXmBcXFxcbl0qXFxcXG4pfH57Myx9KVteXFxcXG5dKlxcXFxuJylcbiAgICAgICAgLnJlcGxhY2UoJ2xpc3QnLCAnIHswLDN9KD86WyorLV18MVsuKV0pICcpIC8vIG9ubHkgbGlzdHMgc3RhcnRpbmcgZnJvbSAxIGNhbiBpbnRlcnJ1cHRcbiAgICAgICAgLnJlcGxhY2UoJ2h0bWwnLCAnPC8/KD86dGFnKSg/OiArfFxcXFxufC8/Pil8PCg/OnNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWF8IS0tKScpXG4gICAgICAgIC5yZXBsYWNlKCd0YWcnLCBfdGFnKSAvLyBwYXJzIGNhbiBiZSBpbnRlcnJ1cHRlZCBieSB0eXBlICg2KSBodG1sIGJsb2Nrc1xuICAgICAgICAuZ2V0UmVnZXgoKSxcbn07XG4vKipcbiAqIFBlZGFudGljIGdyYW1tYXIgKG9yaWdpbmFsIEpvaG4gR3J1YmVyJ3MgbG9vc2UgbWFya2Rvd24gc3BlY2lmaWNhdGlvbilcbiAqL1xuY29uc3QgYmxvY2tQZWRhbnRpYyA9IHtcbiAgICAuLi5ibG9ja05vcm1hbCxcbiAgICBodG1sOiBlZGl0KCdeICooPzpjb21tZW50ICooPzpcXFxcbnxcXFxccyokKSdcbiAgICAgICAgKyAnfDwodGFnKVtcXFxcc1xcXFxTXSs/PC9cXFxcMT4gKig/OlxcXFxuezIsfXxcXFxccyokKScgLy8gY2xvc2VkIHRhZ1xuICAgICAgICArICd8PHRhZyg/OlwiW15cIl0qXCJ8XFwnW15cXCddKlxcJ3xcXFxcc1teXFwnXCIvPlxcXFxzXSopKj8vPz4gKig/OlxcXFxuezIsfXxcXFxccyokKSknKVxuICAgICAgICAucmVwbGFjZSgnY29tbWVudCcsIF9jb21tZW50KVxuICAgICAgICAucmVwbGFjZSgvdGFnL2csICcoPyEoPzonXG4gICAgICAgICsgJ2F8ZW18c3Ryb25nfHNtYWxsfHN8Y2l0ZXxxfGRmbnxhYmJyfGRhdGF8dGltZXxjb2RlfHZhcnxzYW1wfGtiZHxzdWInXG4gICAgICAgICsgJ3xzdXB8aXxifHV8bWFya3xydWJ5fHJ0fHJwfGJkaXxiZG98c3Bhbnxicnx3YnJ8aW5zfGRlbHxpbWcpJ1xuICAgICAgICArICdcXFxcYilcXFxcdysoPyE6fFteXFxcXHdcXFxcc0BdKkApXFxcXGInKVxuICAgICAgICAuZ2V0UmVnZXgoKSxcbiAgICBkZWY6IC9eICpcXFsoW15cXF1dKylcXF06ICo8PyhbXlxccz5dKyk+Pyg/OiArKFtcIihdW15cXG5dK1tcIildKSk/ICooPzpcXG4rfCQpLyxcbiAgICBoZWFkaW5nOiAvXigjezEsNn0pKC4qKSg/Olxcbit8JCkvLFxuICAgIGZlbmNlczogbm9vcFRlc3QsIC8vIGZlbmNlcyBub3Qgc3VwcG9ydGVkXG4gICAgbGhlYWRpbmc6IC9eKC4rPylcXG4gezAsM30oPSt8LSspICooPzpcXG4rfCQpLyxcbiAgICBwYXJhZ3JhcGg6IGVkaXQoX3BhcmFncmFwaClcbiAgICAgICAgLnJlcGxhY2UoJ2hyJywgaHIpXG4gICAgICAgIC5yZXBsYWNlKCdoZWFkaW5nJywgJyAqI3sxLDZ9ICpbXlxcbl0nKVxuICAgICAgICAucmVwbGFjZSgnbGhlYWRpbmcnLCBsaGVhZGluZylcbiAgICAgICAgLnJlcGxhY2UoJ3x0YWJsZScsICcnKVxuICAgICAgICAucmVwbGFjZSgnYmxvY2txdW90ZScsICcgezAsM30+JylcbiAgICAgICAgLnJlcGxhY2UoJ3xmZW5jZXMnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ3xsaXN0JywgJycpXG4gICAgICAgIC5yZXBsYWNlKCd8aHRtbCcsICcnKVxuICAgICAgICAucmVwbGFjZSgnfHRhZycsICcnKVxuICAgICAgICAuZ2V0UmVnZXgoKSxcbn07XG4vKipcbiAqIElubGluZS1MZXZlbCBHcmFtbWFyXG4gKi9cbmNvbnN0IGVzY2FwZSQxID0gL15cXFxcKFshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AXFxbXFxdXFxcXF5fYHt8fX5dKS87XG5jb25zdCBpbmxpbmVDb2RlID0gL14oYCspKFteYF18W15gXVtcXHNcXFNdKj9bXmBdKVxcMSg/IWApLztcbmNvbnN0IGJyID0gL14oIHsyLH18XFxcXClcXG4oPyFcXHMqJCkvO1xuY29uc3QgaW5saW5lVGV4dCA9IC9eKGArfFteYF0pKD86KD89IHsyLH1cXG4pfFtcXHNcXFNdKj8oPzooPz1bXFxcXDwhXFxbYCpfXXxcXGJffCQpfFteIF0oPz0gezIsfVxcbikpKS87XG4vLyBsaXN0IG9mIHVuaWNvZGUgcHVuY3R1YXRpb24gbWFya3MsIHBsdXMgYW55IG1pc3NpbmcgY2hhcmFjdGVycyBmcm9tIENvbW1vbk1hcmsgc3BlY1xuY29uc3QgX3B1bmN0dWF0aW9uID0gL1tcXHB7UH1cXHB7U31dL3U7XG5jb25zdCBfcHVuY3R1YXRpb25PclNwYWNlID0gL1tcXHNcXHB7UH1cXHB7U31dL3U7XG5jb25zdCBfbm90UHVuY3R1YXRpb25PclNwYWNlID0gL1teXFxzXFxwe1B9XFxwe1N9XS91O1xuY29uc3QgcHVuY3R1YXRpb24gPSBlZGl0KC9eKCg/IVsqX10pcHVuY3RTcGFjZSkvLCAndScpXG4gICAgLnJlcGxhY2UoL3B1bmN0U3BhY2UvZywgX3B1bmN0dWF0aW9uT3JTcGFjZSkuZ2V0UmVnZXgoKTtcbi8vIEdGTSBhbGxvd3MgfiBpbnNpZGUgc3Ryb25nIGFuZCBlbSBmb3Igc3RyaWtldGhyb3VnaFxuY29uc3QgX3B1bmN0dWF0aW9uR2ZtU3Ryb25nRW0gPSAvKD8hfilbXFxwe1B9XFxwe1N9XS91O1xuY29uc3QgX3B1bmN0dWF0aW9uT3JTcGFjZUdmbVN0cm9uZ0VtID0gLyg/IX4pW1xcc1xccHtQfVxccHtTfV0vdTtcbmNvbnN0IF9ub3RQdW5jdHVhdGlvbk9yU3BhY2VHZm1TdHJvbmdFbSA9IC8oPzpbXlxcc1xccHtQfVxccHtTfV18fikvdTtcbi8vIHNlcXVlbmNlcyBlbSBzaG91bGQgc2tpcCBvdmVyIFt0aXRsZV0obGluayksIGBjb2RlYCwgPGh0bWw+XG5jb25zdCBibG9ja1NraXAgPSAvXFxbW15bXFxdXSo/XFxdXFwoKD86XFxcXC58W15cXFxcXFwoXFwpXXxcXCgoPzpcXFxcLnxbXlxcXFxcXChcXCldKSpcXCkpKlxcKXxgW15gXSo/YHw8W148Pl0qPz4vZztcbmNvbnN0IGVtU3Ryb25nTERlbGltQ29yZSA9IC9eKD86XFwqKyg/OigoPyFcXCopcHVuY3QpfFteXFxzKl0pKXxeXysoPzooKD8hXylwdW5jdCl8KFteXFxzX10pKS87XG5jb25zdCBlbVN0cm9uZ0xEZWxpbSA9IGVkaXQoZW1TdHJvbmdMRGVsaW1Db3JlLCAndScpXG4gICAgLnJlcGxhY2UoL3B1bmN0L2csIF9wdW5jdHVhdGlvbilcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IGVtU3Ryb25nTERlbGltR2ZtID0gZWRpdChlbVN0cm9uZ0xEZWxpbUNvcmUsICd1JylcbiAgICAucmVwbGFjZSgvcHVuY3QvZywgX3B1bmN0dWF0aW9uR2ZtU3Ryb25nRW0pXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBlbVN0cm9uZ1JEZWxpbUFzdENvcmUgPSAnXlteXypdKj9fX1teXypdKj9cXFxcKlteXypdKj8oPz1fXyknIC8vIFNraXAgb3JwaGFuIGluc2lkZSBzdHJvbmdcbiAgICArICd8W14qXSsoPz1bXipdKScgLy8gQ29uc3VtZSB0byBkZWxpbVxuICAgICsgJ3woPyFcXFxcKilwdW5jdChcXFxcKispKD89W1xcXFxzXXwkKScgLy8gKDEpICMqKiogY2FuIG9ubHkgYmUgYSBSaWdodCBEZWxpbWl0ZXJcbiAgICArICd8bm90UHVuY3RTcGFjZShcXFxcKispKD8hXFxcXCopKD89cHVuY3RTcGFjZXwkKScgLy8gKDIpIGEqKiojLCBhKioqIGNhbiBvbmx5IGJlIGEgUmlnaHQgRGVsaW1pdGVyXG4gICAgKyAnfCg/IVxcXFwqKXB1bmN0U3BhY2UoXFxcXCorKSg/PW5vdFB1bmN0U3BhY2UpJyAvLyAoMykgIyoqKmEsICoqKmEgY2FuIG9ubHkgYmUgTGVmdCBEZWxpbWl0ZXJcbiAgICArICd8W1xcXFxzXShcXFxcKispKD8hXFxcXCopKD89cHVuY3QpJyAvLyAoNCkgKioqIyBjYW4gb25seSBiZSBMZWZ0IERlbGltaXRlclxuICAgICsgJ3woPyFcXFxcKilwdW5jdChcXFxcKispKD8hXFxcXCopKD89cHVuY3QpJyAvLyAoNSkgIyoqKiMgY2FuIGJlIGVpdGhlciBMZWZ0IG9yIFJpZ2h0IERlbGltaXRlclxuICAgICsgJ3xub3RQdW5jdFNwYWNlKFxcXFwqKykoPz1ub3RQdW5jdFNwYWNlKSc7IC8vICg2KSBhKioqYSBjYW4gYmUgZWl0aGVyIExlZnQgb3IgUmlnaHQgRGVsaW1pdGVyXG5jb25zdCBlbVN0cm9uZ1JEZWxpbUFzdCA9IGVkaXQoZW1TdHJvbmdSRGVsaW1Bc3RDb3JlLCAnZ3UnKVxuICAgIC5yZXBsYWNlKC9ub3RQdW5jdFNwYWNlL2csIF9ub3RQdW5jdHVhdGlvbk9yU3BhY2UpXG4gICAgLnJlcGxhY2UoL3B1bmN0U3BhY2UvZywgX3B1bmN0dWF0aW9uT3JTcGFjZSlcbiAgICAucmVwbGFjZSgvcHVuY3QvZywgX3B1bmN0dWF0aW9uKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgZW1TdHJvbmdSRGVsaW1Bc3RHZm0gPSBlZGl0KGVtU3Ryb25nUkRlbGltQXN0Q29yZSwgJ2d1JylcbiAgICAucmVwbGFjZSgvbm90UHVuY3RTcGFjZS9nLCBfbm90UHVuY3R1YXRpb25PclNwYWNlR2ZtU3Ryb25nRW0pXG4gICAgLnJlcGxhY2UoL3B1bmN0U3BhY2UvZywgX3B1bmN0dWF0aW9uT3JTcGFjZUdmbVN0cm9uZ0VtKVxuICAgIC5yZXBsYWNlKC9wdW5jdC9nLCBfcHVuY3R1YXRpb25HZm1TdHJvbmdFbSlcbiAgICAuZ2V0UmVnZXgoKTtcbi8vICg2KSBOb3QgYWxsb3dlZCBmb3IgX1xuY29uc3QgZW1TdHJvbmdSRGVsaW1VbmQgPSBlZGl0KCdeW15fKl0qP1xcXFwqXFxcXCpbXl8qXSo/X1teXypdKj8oPz1cXFxcKlxcXFwqKScgLy8gU2tpcCBvcnBoYW4gaW5zaWRlIHN0cm9uZ1xuICAgICsgJ3xbXl9dKyg/PVteX10pJyAvLyBDb25zdW1lIHRvIGRlbGltXG4gICAgKyAnfCg/IV8pcHVuY3QoXyspKD89W1xcXFxzXXwkKScgLy8gKDEpICNfX18gY2FuIG9ubHkgYmUgYSBSaWdodCBEZWxpbWl0ZXJcbiAgICArICd8bm90UHVuY3RTcGFjZShfKykoPyFfKSg/PXB1bmN0U3BhY2V8JCknIC8vICgyKSBhX19fIywgYV9fXyBjYW4gb25seSBiZSBhIFJpZ2h0IERlbGltaXRlclxuICAgICsgJ3woPyFfKXB1bmN0U3BhY2UoXyspKD89bm90UHVuY3RTcGFjZSknIC8vICgzKSAjX19fYSwgX19fYSBjYW4gb25seSBiZSBMZWZ0IERlbGltaXRlclxuICAgICsgJ3xbXFxcXHNdKF8rKSg/IV8pKD89cHVuY3QpJyAvLyAoNCkgX19fIyBjYW4gb25seSBiZSBMZWZ0IERlbGltaXRlclxuICAgICsgJ3woPyFfKXB1bmN0KF8rKSg/IV8pKD89cHVuY3QpJywgJ2d1JykgLy8gKDUpICNfX18jIGNhbiBiZSBlaXRoZXIgTGVmdCBvciBSaWdodCBEZWxpbWl0ZXJcbiAgICAucmVwbGFjZSgvbm90UHVuY3RTcGFjZS9nLCBfbm90UHVuY3R1YXRpb25PclNwYWNlKVxuICAgIC5yZXBsYWNlKC9wdW5jdFNwYWNlL2csIF9wdW5jdHVhdGlvbk9yU3BhY2UpXG4gICAgLnJlcGxhY2UoL3B1bmN0L2csIF9wdW5jdHVhdGlvbilcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IGFueVB1bmN0dWF0aW9uID0gZWRpdCgvXFxcXChwdW5jdCkvLCAnZ3UnKVxuICAgIC5yZXBsYWNlKC9wdW5jdC9nLCBfcHVuY3R1YXRpb24pXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBhdXRvbGluayA9IGVkaXQoL148KHNjaGVtZTpbXlxcc1xceDAwLVxceDFmPD5dKnxlbWFpbCk+LylcbiAgICAucmVwbGFjZSgnc2NoZW1lJywgL1thLXpBLVpdW2EtekEtWjAtOSsuLV17MSwzMX0vKVxuICAgIC5yZXBsYWNlKCdlbWFpbCcsIC9bYS16QS1aMC05LiEjJCUmJyorLz0/Xl9ge3x9fi1dKyhAKVthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPyg/OlxcLlthLXpBLVowLTldKD86W2EtekEtWjAtOS1dezAsNjF9W2EtekEtWjAtOV0pPykrKD8hWy1fXSkvKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgX2lubGluZUNvbW1lbnQgPSBlZGl0KF9jb21tZW50KS5yZXBsYWNlKCcoPzotLT58JCknLCAnLS0+JykuZ2V0UmVnZXgoKTtcbmNvbnN0IHRhZyA9IGVkaXQoJ15jb21tZW50J1xuICAgICsgJ3xePC9bYS16QS1aXVtcXFxcdzotXSpcXFxccyo+JyAvLyBzZWxmLWNsb3NpbmcgdGFnXG4gICAgKyAnfF48W2EtekEtWl1bXFxcXHctXSooPzphdHRyaWJ1dGUpKj9cXFxccyovPz4nIC8vIG9wZW4gdGFnXG4gICAgKyAnfF48XFxcXD9bXFxcXHNcXFxcU10qP1xcXFw/PicgLy8gcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiwgZS5nLiA8P3BocCA/PlxuICAgICsgJ3xePCFbYS16QS1aXStcXFxcc1tcXFxcc1xcXFxTXSo/PicgLy8gZGVjbGFyYXRpb24sIGUuZy4gPCFET0NUWVBFIGh0bWw+XG4gICAgKyAnfF48IVxcXFxbQ0RBVEFcXFxcW1tcXFxcc1xcXFxTXSo/XFxcXF1cXFxcXT4nKSAvLyBDREFUQSBzZWN0aW9uXG4gICAgLnJlcGxhY2UoJ2NvbW1lbnQnLCBfaW5saW5lQ29tbWVudClcbiAgICAucmVwbGFjZSgnYXR0cmlidXRlJywgL1xccytbYS16QS1aOl9dW1xcdy46LV0qKD86XFxzKj1cXHMqXCJbXlwiXSpcInxcXHMqPVxccyonW14nXSonfFxccyo9XFxzKlteXFxzXCInPTw+YF0rKT8vKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgX2lubGluZUxhYmVsID0gLyg/OlxcWyg/OlxcXFwufFteXFxbXFxdXFxcXF0pKlxcXXxcXFxcLnxgW15gXSpgfFteXFxbXFxdXFxcXGBdKSo/LztcbmNvbnN0IGxpbmsgPSBlZGl0KC9eIT9cXFsobGFiZWwpXFxdXFwoXFxzKihocmVmKSg/OlxccysodGl0bGUpKT9cXHMqXFwpLylcbiAgICAucmVwbGFjZSgnbGFiZWwnLCBfaW5saW5lTGFiZWwpXG4gICAgLnJlcGxhY2UoJ2hyZWYnLCAvPCg/OlxcXFwufFteXFxuPD5cXFxcXSkrPnxbXlxcc1xceDAwLVxceDFmXSovKVxuICAgIC5yZXBsYWNlKCd0aXRsZScsIC9cIig/OlxcXFxcIj98W15cIlxcXFxdKSpcInwnKD86XFxcXCc/fFteJ1xcXFxdKSonfFxcKCg/OlxcXFxcXCk/fFteKVxcXFxdKSpcXCkvKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgcmVmbGluayA9IGVkaXQoL14hP1xcWyhsYWJlbClcXF1cXFsocmVmKVxcXS8pXG4gICAgLnJlcGxhY2UoJ2xhYmVsJywgX2lubGluZUxhYmVsKVxuICAgIC5yZXBsYWNlKCdyZWYnLCBfYmxvY2tMYWJlbClcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IG5vbGluayA9IGVkaXQoL14hP1xcWyhyZWYpXFxdKD86XFxbXFxdKT8vKVxuICAgIC5yZXBsYWNlKCdyZWYnLCBfYmxvY2tMYWJlbClcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IHJlZmxpbmtTZWFyY2ggPSBlZGl0KCdyZWZsaW5rfG5vbGluayg/IVxcXFwoKScsICdnJylcbiAgICAucmVwbGFjZSgncmVmbGluaycsIHJlZmxpbmspXG4gICAgLnJlcGxhY2UoJ25vbGluaycsIG5vbGluaylcbiAgICAuZ2V0UmVnZXgoKTtcbi8qKlxuICogTm9ybWFsIElubGluZSBHcmFtbWFyXG4gKi9cbmNvbnN0IGlubGluZU5vcm1hbCA9IHtcbiAgICBfYmFja3BlZGFsOiBub29wVGVzdCwgLy8gb25seSB1c2VkIGZvciBHRk0gdXJsXG4gICAgYW55UHVuY3R1YXRpb24sXG4gICAgYXV0b2xpbmssXG4gICAgYmxvY2tTa2lwLFxuICAgIGJyLFxuICAgIGNvZGU6IGlubGluZUNvZGUsXG4gICAgZGVsOiBub29wVGVzdCxcbiAgICBlbVN0cm9uZ0xEZWxpbSxcbiAgICBlbVN0cm9uZ1JEZWxpbUFzdCxcbiAgICBlbVN0cm9uZ1JEZWxpbVVuZCxcbiAgICBlc2NhcGU6IGVzY2FwZSQxLFxuICAgIGxpbmssXG4gICAgbm9saW5rLFxuICAgIHB1bmN0dWF0aW9uLFxuICAgIHJlZmxpbmssXG4gICAgcmVmbGlua1NlYXJjaCxcbiAgICB0YWcsXG4gICAgdGV4dDogaW5saW5lVGV4dCxcbiAgICB1cmw6IG5vb3BUZXN0LFxufTtcbi8qKlxuICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXJcbiAqL1xuY29uc3QgaW5saW5lUGVkYW50aWMgPSB7XG4gICAgLi4uaW5saW5lTm9ybWFsLFxuICAgIGxpbms6IGVkaXQoL14hP1xcWyhsYWJlbClcXF1cXCgoLio/KVxcKS8pXG4gICAgICAgIC5yZXBsYWNlKCdsYWJlbCcsIF9pbmxpbmVMYWJlbClcbiAgICAgICAgLmdldFJlZ2V4KCksXG4gICAgcmVmbGluazogZWRpdCgvXiE/XFxbKGxhYmVsKVxcXVxccypcXFsoW15cXF1dKilcXF0vKVxuICAgICAgICAucmVwbGFjZSgnbGFiZWwnLCBfaW5saW5lTGFiZWwpXG4gICAgICAgIC5nZXRSZWdleCgpLFxufTtcbi8qKlxuICogR0ZNIElubGluZSBHcmFtbWFyXG4gKi9cbmNvbnN0IGlubGluZUdmbSA9IHtcbiAgICAuLi5pbmxpbmVOb3JtYWwsXG4gICAgZW1TdHJvbmdSRGVsaW1Bc3Q6IGVtU3Ryb25nUkRlbGltQXN0R2ZtLFxuICAgIGVtU3Ryb25nTERlbGltOiBlbVN0cm9uZ0xEZWxpbUdmbSxcbiAgICB1cmw6IGVkaXQoL14oKD86ZnRwfGh0dHBzPyk6XFwvXFwvfHd3d1xcLikoPzpbYS16QS1aMC05XFwtXStcXC4/KStbXlxcczxdKnxeZW1haWwvLCAnaScpXG4gICAgICAgIC5yZXBsYWNlKCdlbWFpbCcsIC9bQS1aYS16MC05Ll8rLV0rKEApW2EtekEtWjAtOS1fXSsoPzpcXC5bYS16QS1aMC05LV9dKlthLXpBLVowLTldKSsoPyFbLV9dKS8pXG4gICAgICAgIC5nZXRSZWdleCgpLFxuICAgIF9iYWNrcGVkYWw6IC8oPzpbXj8hLiw6OypfJ1wifigpJl0rfFxcKFteKV0qXFwpfCYoPyFbYS16QS1aMC05XSs7JCl8Wz8hLiw6OypfJ1wifildKyg/ISQpKSsvLFxuICAgIGRlbDogL14ofn4/KSg/PVteXFxzfl0pKCg/OlxcXFwufFteXFxcXF0pKj8oPzpcXFxcLnxbXlxcc35cXFxcXSkpXFwxKD89W15+XXwkKS8sXG4gICAgdGV4dDogL14oW2B+XSt8W15gfl0pKD86KD89IHsyLH1cXG4pfCg/PVthLXpBLVowLTkuISMkJSYnKitcXC89P19ge1xcfH1+LV0rQCl8W1xcc1xcU10qPyg/Oig/PVtcXFxcPCFcXFtgKn5fXXxcXGJffGh0dHBzPzpcXC9cXC98ZnRwOlxcL1xcL3x3d3dcXC58JCl8W14gXSg/PSB7Mix9XFxuKXxbXmEtekEtWjAtOS4hIyQlJicqK1xcLz0/X2B7XFx8fX4tXSg/PVthLXpBLVowLTkuISMkJSYnKitcXC89P19ge1xcfH1+LV0rQCkpKS8sXG59O1xuLyoqXG4gKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICovXG5jb25zdCBpbmxpbmVCcmVha3MgPSB7XG4gICAgLi4uaW5saW5lR2ZtLFxuICAgIGJyOiBlZGl0KGJyKS5yZXBsYWNlKCd7Mix9JywgJyonKS5nZXRSZWdleCgpLFxuICAgIHRleHQ6IGVkaXQoaW5saW5lR2ZtLnRleHQpXG4gICAgICAgIC5yZXBsYWNlKCdcXFxcYl8nLCAnXFxcXGJffCB7Mix9XFxcXG4nKVxuICAgICAgICAucmVwbGFjZSgvXFx7MixcXH0vZywgJyonKVxuICAgICAgICAuZ2V0UmVnZXgoKSxcbn07XG4vKipcbiAqIGV4cG9ydHNcbiAqL1xuY29uc3QgYmxvY2sgPSB7XG4gICAgbm9ybWFsOiBibG9ja05vcm1hbCxcbiAgICBnZm06IGJsb2NrR2ZtLFxuICAgIHBlZGFudGljOiBibG9ja1BlZGFudGljLFxufTtcbmNvbnN0IGlubGluZSA9IHtcbiAgICBub3JtYWw6IGlubGluZU5vcm1hbCxcbiAgICBnZm06IGlubGluZUdmbSxcbiAgICBicmVha3M6IGlubGluZUJyZWFrcyxcbiAgICBwZWRhbnRpYzogaW5saW5lUGVkYW50aWMsXG59O1xuXG4vKipcbiAqIEhlbHBlcnNcbiAqL1xuY29uc3QgZXNjYXBlUmVwbGFjZW1lbnRzID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7Jyxcbn07XG5jb25zdCBnZXRFc2NhcGVSZXBsYWNlbWVudCA9IChjaCkgPT4gZXNjYXBlUmVwbGFjZW1lbnRzW2NoXTtcbmZ1bmN0aW9uIGVzY2FwZShodG1sLCBlbmNvZGUpIHtcbiAgICBpZiAoZW5jb2RlKSB7XG4gICAgICAgIGlmIChvdGhlci5lc2NhcGVUZXN0LnRlc3QoaHRtbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBodG1sLnJlcGxhY2Uob3RoZXIuZXNjYXBlUmVwbGFjZSwgZ2V0RXNjYXBlUmVwbGFjZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAob3RoZXIuZXNjYXBlVGVzdE5vRW5jb2RlLnRlc3QoaHRtbCkpIHtcbiAgICAgICAgICAgIHJldHVybiBodG1sLnJlcGxhY2Uob3RoZXIuZXNjYXBlUmVwbGFjZU5vRW5jb2RlLCBnZXRFc2NhcGVSZXBsYWNlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGh0bWw7XG59XG5mdW5jdGlvbiBjbGVhblVybChocmVmKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaHJlZiA9IGVuY29kZVVSSShocmVmKS5yZXBsYWNlKG90aGVyLnBlcmNlbnREZWNvZGUsICclJyk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBocmVmO1xufVxuZnVuY3Rpb24gc3BsaXRDZWxscyh0YWJsZVJvdywgY291bnQpIHtcbiAgICAvLyBlbnN1cmUgdGhhdCBldmVyeSBjZWxsLWRlbGltaXRpbmcgcGlwZSBoYXMgYSBzcGFjZVxuICAgIC8vIGJlZm9yZSBpdCB0byBkaXN0aW5ndWlzaCBpdCBmcm9tIGFuIGVzY2FwZWQgcGlwZVxuICAgIGNvbnN0IHJvdyA9IHRhYmxlUm93LnJlcGxhY2Uob3RoZXIuZmluZFBpcGUsIChtYXRjaCwgb2Zmc2V0LCBzdHIpID0+IHtcbiAgICAgICAgbGV0IGVzY2FwZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGN1cnIgPSBvZmZzZXQ7XG4gICAgICAgIHdoaWxlICgtLWN1cnIgPj0gMCAmJiBzdHJbY3Vycl0gPT09ICdcXFxcJylcbiAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZDtcbiAgICAgICAgaWYgKGVzY2FwZWQpIHtcbiAgICAgICAgICAgIC8vIG9kZCBudW1iZXIgb2Ygc2xhc2hlcyBtZWFucyB8IGlzIGVzY2FwZWRcbiAgICAgICAgICAgIC8vIHNvIHdlIGxlYXZlIGl0IGFsb25lXG4gICAgICAgICAgICByZXR1cm4gJ3wnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYWRkIHNwYWNlIGJlZm9yZSB1bmVzY2FwZWQgfFxuICAgICAgICAgICAgcmV0dXJuICcgfCc7XG4gICAgICAgIH1cbiAgICB9KSwgY2VsbHMgPSByb3cuc3BsaXQob3RoZXIuc3BsaXRQaXBlKTtcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gRmlyc3QvbGFzdCBjZWxsIGluIGEgcm93IGNhbm5vdCBiZSBlbXB0eSBpZiBpdCBoYXMgbm8gbGVhZGluZy90cmFpbGluZyBwaXBlXG4gICAgaWYgKCFjZWxsc1swXS50cmltKCkpIHtcbiAgICAgICAgY2VsbHMuc2hpZnQoKTtcbiAgICB9XG4gICAgaWYgKGNlbGxzLmxlbmd0aCA+IDAgJiYgIWNlbGxzLmF0KC0xKT8udHJpbSgpKSB7XG4gICAgICAgIGNlbGxzLnBvcCgpO1xuICAgIH1cbiAgICBpZiAoY291bnQpIHtcbiAgICAgICAgaWYgKGNlbGxzLmxlbmd0aCA+IGNvdW50KSB7XG4gICAgICAgICAgICBjZWxscy5zcGxpY2UoY291bnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd2hpbGUgKGNlbGxzLmxlbmd0aCA8IGNvdW50KVxuICAgICAgICAgICAgICAgIGNlbGxzLnB1c2goJycpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAoOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gbGVhZGluZyBvciB0cmFpbGluZyB3aGl0ZXNwYWNlIGlzIGlnbm9yZWQgcGVyIHRoZSBnZm0gc3BlY1xuICAgICAgICBjZWxsc1tpXSA9IGNlbGxzW2ldLnRyaW0oKS5yZXBsYWNlKG90aGVyLnNsYXNoUGlwZSwgJ3wnKTtcbiAgICB9XG4gICAgcmV0dXJuIGNlbGxzO1xufVxuLyoqXG4gKiBSZW1vdmUgdHJhaWxpbmcgJ2Mncy4gRXF1aXZhbGVudCB0byBzdHIucmVwbGFjZSgvYyokLywgJycpLlxuICogL2MqJC8gaXMgdnVsbmVyYWJsZSB0byBSRURPUy5cbiAqXG4gKiBAcGFyYW0gc3RyXG4gKiBAcGFyYW0gY1xuICogQHBhcmFtIGludmVydCBSZW1vdmUgc3VmZml4IG9mIG5vbi1jIGNoYXJzIGluc3RlYWQuIERlZmF1bHQgZmFsc2V5LlxuICovXG5mdW5jdGlvbiBydHJpbShzdHIsIGMsIGludmVydCkge1xuICAgIGNvbnN0IGwgPSBzdHIubGVuZ3RoO1xuICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgLy8gTGVuZ3RoIG9mIHN1ZmZpeCBtYXRjaGluZyB0aGUgaW52ZXJ0IGNvbmRpdGlvbi5cbiAgICBsZXQgc3VmZkxlbiA9IDA7XG4gICAgLy8gU3RlcCBsZWZ0IHVudGlsIHdlIGZhaWwgdG8gbWF0Y2ggdGhlIGludmVydCBjb25kaXRpb24uXG4gICAgd2hpbGUgKHN1ZmZMZW4gPCBsKSB7XG4gICAgICAgIGNvbnN0IGN1cnJDaGFyID0gc3RyLmNoYXJBdChsIC0gc3VmZkxlbiAtIDEpO1xuICAgICAgICBpZiAoY3VyckNoYXIgPT09IGMgJiYgdHJ1ZSkge1xuICAgICAgICAgICAgc3VmZkxlbisrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0ci5zbGljZSgwLCBsIC0gc3VmZkxlbik7XG59XG5mdW5jdGlvbiBmaW5kQ2xvc2luZ0JyYWNrZXQoc3RyLCBiKSB7XG4gICAgaWYgKHN0ci5pbmRleE9mKGJbMV0pID09PSAtMSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIGxldCBsZXZlbCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHN0cltpXSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3RyW2ldID09PSBiWzBdKSB7XG4gICAgICAgICAgICBsZXZlbCsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0cltpXSA9PT0gYlsxXSkge1xuICAgICAgICAgICAgbGV2ZWwtLTtcbiAgICAgICAgICAgIGlmIChsZXZlbCA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5cbmZ1bmN0aW9uIG91dHB1dExpbmsoY2FwLCBsaW5rLCByYXcsIGxleGVyLCBydWxlcykge1xuICAgIGNvbnN0IGhyZWYgPSBsaW5rLmhyZWY7XG4gICAgY29uc3QgdGl0bGUgPSBsaW5rLnRpdGxlIHx8IG51bGw7XG4gICAgY29uc3QgdGV4dCA9IGNhcFsxXS5yZXBsYWNlKHJ1bGVzLm90aGVyLm91dHB1dExpbmtSZXBsYWNlLCAnJDEnKTtcbiAgICBpZiAoY2FwWzBdLmNoYXJBdCgwKSAhPT0gJyEnKSB7XG4gICAgICAgIGxleGVyLnN0YXRlLmluTGluayA9IHRydWU7XG4gICAgICAgIGNvbnN0IHRva2VuID0ge1xuICAgICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgICAgcmF3LFxuICAgICAgICAgICAgaHJlZixcbiAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgIHRva2VuczogbGV4ZXIuaW5saW5lVG9rZW5zKHRleHQpLFxuICAgICAgICB9O1xuICAgICAgICBsZXhlci5zdGF0ZS5pbkxpbmsgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICByYXcsXG4gICAgICAgIGhyZWYsXG4gICAgICAgIHRpdGxlLFxuICAgICAgICB0ZXh0LFxuICAgIH07XG59XG5mdW5jdGlvbiBpbmRlbnRDb2RlQ29tcGVuc2F0aW9uKHJhdywgdGV4dCwgcnVsZXMpIHtcbiAgICBjb25zdCBtYXRjaEluZGVudFRvQ29kZSA9IHJhdy5tYXRjaChydWxlcy5vdGhlci5pbmRlbnRDb2RlQ29tcGVuc2F0aW9uKTtcbiAgICBpZiAobWF0Y2hJbmRlbnRUb0NvZGUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGNvbnN0IGluZGVudFRvQ29kZSA9IG1hdGNoSW5kZW50VG9Db2RlWzFdO1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgLm1hcChub2RlID0+IHtcbiAgICAgICAgY29uc3QgbWF0Y2hJbmRlbnRJbk5vZGUgPSBub2RlLm1hdGNoKHJ1bGVzLm90aGVyLmJlZ2lubmluZ1NwYWNlKTtcbiAgICAgICAgaWYgKG1hdGNoSW5kZW50SW5Ob2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbaW5kZW50SW5Ob2RlXSA9IG1hdGNoSW5kZW50SW5Ob2RlO1xuICAgICAgICBpZiAoaW5kZW50SW5Ob2RlLmxlbmd0aCA+PSBpbmRlbnRUb0NvZGUubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5zbGljZShpbmRlbnRUb0NvZGUubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9KVxuICAgICAgICAuam9pbignXFxuJyk7XG59XG4vKipcbiAqIFRva2VuaXplclxuICovXG5jbGFzcyBfVG9rZW5pemVyIHtcbiAgICBvcHRpb25zO1xuICAgIHJ1bGVzOyAvLyBzZXQgYnkgdGhlIGxleGVyXG4gICAgbGV4ZXI7IC8vIHNldCBieSB0aGUgbGV4ZXJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgX2RlZmF1bHRzO1xuICAgIH1cbiAgICBzcGFjZShzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5uZXdsaW5lLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCAmJiBjYXBbMF0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3BhY2UnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb2RlKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmNvZGUuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY2FwWzBdLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5jb2RlUmVtb3ZlSW5kZW50LCAnJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICBjb2RlQmxvY2tTdHlsZTogJ2luZGVudGVkJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiAhdGhpcy5vcHRpb25zLnBlZGFudGljXG4gICAgICAgICAgICAgICAgICAgID8gcnRyaW0odGV4dCwgJ1xcbicpXG4gICAgICAgICAgICAgICAgICAgIDogdGV4dCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmVuY2VzKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmZlbmNlcy5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGNvbnN0IHJhdyA9IGNhcFswXTtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBpbmRlbnRDb2RlQ29tcGVuc2F0aW9uKHJhdywgY2FwWzNdIHx8ICcnLCB0aGlzLnJ1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2NvZGUnLFxuICAgICAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgICAgICBsYW5nOiBjYXBbMl0gPyBjYXBbMl0udHJpbSgpLnJlcGxhY2UodGhpcy5ydWxlcy5pbmxpbmUuYW55UHVuY3R1YXRpb24sICckMScpIDogY2FwWzJdLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGhlYWRpbmcoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2suaGVhZGluZy5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gY2FwWzJdLnRyaW0oKTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0cmFpbGluZyAjc1xuICAgICAgICAgICAgaWYgKHRoaXMucnVsZXMub3RoZXIuZW5kaW5nSGFzaC50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpbW1lZCA9IHJ0cmltKHRleHQsICcjJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdHJpbW1lZC50cmltKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCF0cmltbWVkIHx8IHRoaXMucnVsZXMub3RoZXIuZW5kaW5nU3BhY2VDaGFyLnRlc3QodHJpbW1lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29tbW9uTWFyayByZXF1aXJlcyBzcGFjZSBiZWZvcmUgdHJhaWxpbmcgI3NcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRyaW1tZWQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIGRlcHRoOiBjYXBbMV0ubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZSh0ZXh0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaHIoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2suaHIuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdocicsXG4gICAgICAgICAgICAgICAgcmF3OiBydHJpbShjYXBbMF0sICdcXG4nKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgYmxvY2txdW90ZShzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5ibG9ja3F1b3RlLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgbGV0IGxpbmVzID0gcnRyaW0oY2FwWzBdLCAnXFxuJykuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgbGV0IHJhdyA9ICcnO1xuICAgICAgICAgICAgbGV0IHRleHQgPSAnJztcbiAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGxpbmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgaW5CbG9ja3F1b3RlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudExpbmVzID0gW107XG4gICAgICAgICAgICAgICAgbGV0IGk7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCBsaW5lcyB1cCB0byBhIGNvbnRpbnVhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ydWxlcy5vdGhlci5ibG9ja3F1b3RlU3RhcnQudGVzdChsaW5lc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluQmxvY2txdW90ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWluQmxvY2txdW90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudExpbmVzLnB1c2gobGluZXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluZXMgPSBsaW5lcy5zbGljZShpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UmF3ID0gY3VycmVudExpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRUZXh0ID0gY3VycmVudFJhd1xuICAgICAgICAgICAgICAgICAgICAvLyBwcmVjZWRlIHNldGV4dCBjb250aW51YXRpb24gd2l0aCA0IHNwYWNlcyBzbyBpdCBpc24ndCBhIHNldGV4dFxuICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLmJsb2NrcXVvdGVTZXRleHRSZXBsYWNlLCAnXFxuICAgICQxJylcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5ibG9ja3F1b3RlU2V0ZXh0UmVwbGFjZTIsICcnKTtcbiAgICAgICAgICAgICAgICByYXcgPSByYXcgPyBgJHtyYXd9XFxuJHtjdXJyZW50UmF3fWAgOiBjdXJyZW50UmF3O1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0ID8gYCR7dGV4dH1cXG4ke2N1cnJlbnRUZXh0fWAgOiBjdXJyZW50VGV4dDtcbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBibG9ja3F1b3RlIGxpbmVzIGFzIHRvcCBsZXZlbCB0b2tlbnNcbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBwYXJhZ3JhcGhzIGlmIHRoaXMgaXMgYSBjb250aW51YXRpb25cbiAgICAgICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLmxleGVyLnN0YXRlLnRvcDtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLnRvcCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5ibG9ja1Rva2VucyhjdXJyZW50VGV4dCwgdG9rZW5zLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLnRvcCA9IHRvcDtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBjb250aW51YXRpb24gdGhlbiB3ZSBhcmUgZG9uZVxuICAgICAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUb2tlbj8udHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGJsb2NrcXVvdGUgY29udGludWF0aW9uIGNhbm5vdCBiZSBwcmVjZWRlZCBieSBhIGNvZGUgYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxhc3RUb2tlbj8udHlwZSA9PT0gJ2Jsb2NrcXVvdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGluY2x1ZGUgY29udGludWF0aW9uIGluIG5lc3RlZCBibG9ja3F1b3RlXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFRva2VuID0gbGFzdFRva2VuO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUZXh0ID0gb2xkVG9rZW4ucmF3ICsgJ1xcbicgKyBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VG9rZW4gPSB0aGlzLmJsb2NrcXVvdGUobmV3VGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0gPSBuZXdUb2tlbjtcbiAgICAgICAgICAgICAgICAgICAgcmF3ID0gcmF3LnN1YnN0cmluZygwLCByYXcubGVuZ3RoIC0gb2xkVG9rZW4ucmF3Lmxlbmd0aCkgKyBuZXdUb2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIG9sZFRva2VuLnRleHQubGVuZ3RoKSArIG5ld1Rva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIGNvbnRpbnVhdGlvbiBpbiBuZXN0ZWQgbGlzdFxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRUb2tlbiA9IGxhc3RUb2tlbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VGV4dCA9IG9sZFRva2VuLnJhdyArICdcXG4nICsgbGluZXMuam9pbignXFxuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gdGhpcy5saXN0KG5ld1RleHQpO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdID0gbmV3VG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHJhdyA9IHJhdy5zdWJzdHJpbmcoMCwgcmF3Lmxlbmd0aCAtIGxhc3RUb2tlbi5yYXcubGVuZ3RoKSArIG5ld1Rva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDAsIHRleHQubGVuZ3RoIC0gb2xkVG9rZW4ucmF3Lmxlbmd0aCkgKyBuZXdUb2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbmV3VGV4dC5zdWJzdHJpbmcodG9rZW5zLmF0KC0xKS5yYXcubGVuZ3RoKS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrcXVvdGUnLFxuICAgICAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgICAgICB0b2tlbnMsXG4gICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGlzdChzcmMpIHtcbiAgICAgICAgbGV0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2subGlzdC5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGxldCBidWxsID0gY2FwWzFdLnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IGlzb3JkZXJlZCA9IGJ1bGwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgICAgICAgIHJhdzogJycsXG4gICAgICAgICAgICAgICAgb3JkZXJlZDogaXNvcmRlcmVkLFxuICAgICAgICAgICAgICAgIHN0YXJ0OiBpc29yZGVyZWQgPyArYnVsbC5zbGljZSgwLCAtMSkgOiAnJyxcbiAgICAgICAgICAgICAgICBsb29zZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGJ1bGwgPSBpc29yZGVyZWQgPyBgXFxcXGR7MSw5fVxcXFwke2J1bGwuc2xpY2UoLTEpfWAgOiBgXFxcXCR7YnVsbH1gO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAgIGJ1bGwgPSBpc29yZGVyZWQgPyBidWxsIDogJ1sqKy1dJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCBuZXh0IGxpc3QgaXRlbVxuICAgICAgICAgICAgY29uc3QgaXRlbVJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5saXN0SXRlbVJlZ2V4KGJ1bGwpO1xuICAgICAgICAgICAgbGV0IGVuZHNXaXRoQmxhbmtMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBjdXJyZW50IGJ1bGxldCBwb2ludCBjYW4gc3RhcnQgYSBuZXcgTGlzdCBJdGVtXG4gICAgICAgICAgICB3aGlsZSAoc3JjKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVuZEVhcmx5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGV0IHJhdyA9ICcnO1xuICAgICAgICAgICAgICAgIGxldCBpdGVtQ29udGVudHMgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAoIShjYXAgPSBpdGVtUmVnZXguZXhlYyhzcmMpKSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucnVsZXMuYmxvY2suaHIudGVzdChzcmMpKSB7IC8vIEVuZCBsaXN0IGlmIGJ1bGxldCB3YXMgYWN0dWFsbHkgSFIgKHBvc3NpYmx5IG1vdmUgaW50byBpdGVtUmVnZXg/KVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmF3ID0gY2FwWzBdO1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcocmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgbGV0IGxpbmUgPSBjYXBbMl0uc3BsaXQoJ1xcbicsIDEpWzBdLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5saXN0UmVwbGFjZVRhYnMsICh0KSA9PiAnICcucmVwZWF0KDMgKiB0Lmxlbmd0aCkpO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0TGluZSA9IHNyYy5zcGxpdCgnXFxuJywgMSlbMF07XG4gICAgICAgICAgICAgICAgbGV0IGJsYW5rTGluZSA9ICFsaW5lLnRyaW0oKTtcbiAgICAgICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IDI7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50cyA9IGxpbmUudHJpbVN0YXJ0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJsYW5rTGluZSkge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBjYXBbMV0ubGVuZ3RoICsgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGNhcFsyXS5zZWFyY2godGhpcy5ydWxlcy5vdGhlci5ub25TcGFjZUNoYXIpOyAvLyBGaW5kIGZpcnN0IG5vbi1zcGFjZSBjaGFyXG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGluZGVudCA+IDQgPyAxIDogaW5kZW50OyAvLyBUcmVhdCBpbmRlbnRlZCBjb2RlIGJsb2NrcyAoPiA0IHNwYWNlcykgYXMgaGF2aW5nIG9ubHkgMSBpbmRlbnRcbiAgICAgICAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzID0gbGluZS5zbGljZShpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKz0gY2FwWzFdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJsYW5rTGluZSAmJiB0aGlzLnJ1bGVzLm90aGVyLmJsYW5rTGluZS50ZXN0KG5leHRMaW5lKSkgeyAvLyBJdGVtcyBiZWdpbiB3aXRoIGF0IG1vc3Qgb25lIGJsYW5rIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgcmF3ICs9IG5leHRMaW5lICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcobmV4dExpbmUubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGVuZEVhcmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFlbmRFYXJseSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0QnVsbGV0UmVnZXggPSB0aGlzLnJ1bGVzLm90aGVyLm5leHRCdWxsZXRSZWdleChpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBoclJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5oclJlZ2V4KGluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZlbmNlc0JlZ2luUmVnZXggPSB0aGlzLnJ1bGVzLm90aGVyLmZlbmNlc0JlZ2luUmVnZXgoaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGluZ0JlZ2luUmVnZXggPSB0aGlzLnJ1bGVzLm90aGVyLmhlYWRpbmdCZWdpblJlZ2V4KGluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGh0bWxCZWdpblJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5odG1sQmVnaW5SZWdleChpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBmb2xsb3dpbmcgbGluZXMgc2hvdWxkIGJlIGluY2x1ZGVkIGluIExpc3QgSXRlbVxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3JjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByYXdMaW5lID0gc3JjLnNwbGl0KCdcXG4nLCAxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXh0TGluZVdpdGhvdXRUYWJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dExpbmUgPSByYXdMaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmUtYWxpZ24gdG8gZm9sbG93IGNvbW1vbm1hcmsgbmVzdGluZyBydWxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRMaW5lID0gbmV4dExpbmUucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLmxpc3RSZXBsYWNlTmVzdGluZywgJyAgJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dExpbmVXaXRob3V0VGFicyA9IG5leHRMaW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV4dExpbmVXaXRob3V0VGFicyA9IG5leHRMaW5lLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci50YWJDaGFyR2xvYmFsLCAnICAgICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW5kIGxpc3QgaXRlbSBpZiBmb3VuZCBjb2RlIGZlbmNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZlbmNlc0JlZ2luUmVnZXgudGVzdChuZXh0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuZCBsaXN0IGl0ZW0gaWYgZm91bmQgc3RhcnQgb2YgbmV3IGhlYWRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkaW5nQmVnaW5SZWdleC50ZXN0KG5leHRMaW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRW5kIGxpc3QgaXRlbSBpZiBmb3VuZCBzdGFydCBvZiBodG1sIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHRtbEJlZ2luUmVnZXgudGVzdChuZXh0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuZCBsaXN0IGl0ZW0gaWYgZm91bmQgc3RhcnQgb2YgbmV3IGJ1bGxldFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRSZWdleC50ZXN0KG5leHRMaW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG9yaXpvbnRhbCBydWxlIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHJSZWdleC50ZXN0KG5leHRMaW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRMaW5lV2l0aG91dFRhYnMuc2VhcmNoKHRoaXMucnVsZXMub3RoZXIubm9uU3BhY2VDaGFyKSA+PSBpbmRlbnQgfHwgIW5leHRMaW5lLnRyaW0oKSkgeyAvLyBEZWRlbnQgaWYgcG9zc2libGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudHMgKz0gJ1xcbicgKyBuZXh0TGluZVdpdGhvdXRUYWJzLnNsaWNlKGluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBub3QgZW5vdWdoIGluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsYW5rTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGFyYWdyYXBoIGNvbnRpbnVhdGlvbiB1bmxlc3MgbGFzdCBsaW5lIHdhcyBhIGRpZmZlcmVudCBibG9jayBsZXZlbCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLnRhYkNoYXJHbG9iYWwsICcgICAgJykuc2VhcmNoKHRoaXMucnVsZXMub3RoZXIubm9uU3BhY2VDaGFyKSA+PSA0KSB7IC8vIGluZGVudGVkIGNvZGUgYmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZW5jZXNCZWdpblJlZ2V4LnRlc3QobGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkaW5nQmVnaW5SZWdleC50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaHJSZWdleC50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudHMgKz0gJ1xcbicgKyBuZXh0TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYmxhbmtMaW5lICYmICFuZXh0TGluZS50cmltKCkpIHsgLy8gQ2hlY2sgaWYgY3VycmVudCBsaW5lIGlzIGJsYW5rXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhbmtMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdyArPSByYXdMaW5lICsgJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHJhd0xpbmUubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lID0gbmV4dExpbmVXaXRob3V0VGFicy5zbGljZShpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghbGlzdC5sb29zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcHJldmlvdXMgaXRlbSBlbmRlZCB3aXRoIGEgYmxhbmsgbGluZSwgdGhlIGxpc3QgaXMgbG9vc2VcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVuZHNXaXRoQmxhbmtMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0Lmxvb3NlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLnJ1bGVzLm90aGVyLmRvdWJsZUJsYW5rTGluZS50ZXN0KHJhdykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZHNXaXRoQmxhbmtMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaXN0YXNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICBsZXQgaXNjaGVja2VkO1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciB0YXNrIGxpc3QgaXRlbXNcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgICAgICAgICAgICAgICBpc3Rhc2sgPSB0aGlzLnJ1bGVzLm90aGVyLmxpc3RJc1Rhc2suZXhlYyhpdGVtQ29udGVudHMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXN0YXNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc2NoZWNrZWQgPSBpc3Rhc2tbMF0gIT09ICdbIF0gJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50cyA9IGl0ZW1Db250ZW50cy5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIubGlzdFJlcGxhY2VUYXNrLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGlzdC5pdGVtcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpc3RfaXRlbScsXG4gICAgICAgICAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgICAgICAgICAgdGFzazogISFpc3Rhc2ssXG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQ6IGlzY2hlY2tlZCxcbiAgICAgICAgICAgICAgICAgICAgbG9vc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBpdGVtQ29udGVudHMsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuczogW10sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGlzdC5yYXcgKz0gcmF3O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRG8gbm90IGNvbnN1bWUgbmV3bGluZXMgYXQgZW5kIG9mIGZpbmFsIGl0ZW0uIEFsdGVybmF0aXZlbHksIG1ha2UgaXRlbVJlZ2V4ICpzdGFydCogd2l0aCBhbnkgbmV3bGluZXMgdG8gc2ltcGxpZnkvc3BlZWQgdXAgZW5kc1dpdGhCbGFua0xpbmUgbG9naWNcbiAgICAgICAgICAgIGNvbnN0IGxhc3RJdGVtID0gbGlzdC5pdGVtcy5hdCgtMSk7XG4gICAgICAgICAgICBpZiAobGFzdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBsYXN0SXRlbS5yYXcgPSBsYXN0SXRlbS5yYXcudHJpbUVuZCgpO1xuICAgICAgICAgICAgICAgIGxhc3RJdGVtLnRleHQgPSBsYXN0SXRlbS50ZXh0LnRyaW1FbmQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIG5vdCBhIGxpc3Qgc2luY2UgdGhlcmUgd2VyZSBubyBpdGVtc1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpc3QucmF3ID0gbGlzdC5yYXcudHJpbUVuZCgpO1xuICAgICAgICAgICAgLy8gSXRlbSBjaGlsZCB0b2tlbnMgaGFuZGxlZCBoZXJlIGF0IGVuZCBiZWNhdXNlIHdlIG5lZWRlZCB0byBoYXZlIHRoZSBmaW5hbCBpdGVtIHRvIHRyaW0gaXQgZmlyc3RcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUudG9wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbGlzdC5pdGVtc1tpXS50b2tlbnMgPSB0aGlzLmxleGVyLmJsb2NrVG9rZW5zKGxpc3QuaXRlbXNbaV0udGV4dCwgW10pO1xuICAgICAgICAgICAgICAgIGlmICghbGlzdC5sb29zZSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBsaXN0IHNob3VsZCBiZSBsb29zZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzcGFjZXJzID0gbGlzdC5pdGVtc1tpXS50b2tlbnMuZmlsdGVyKHQgPT4gdC50eXBlID09PSAnc3BhY2UnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzTXVsdGlwbGVMaW5lQnJlYWtzID0gc3BhY2Vycy5sZW5ndGggPiAwICYmIHNwYWNlcnMuc29tZSh0ID0+IHRoaXMucnVsZXMub3RoZXIuYW55TGluZS50ZXN0KHQucmF3KSk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QubG9vc2UgPSBoYXNNdWx0aXBsZUxpbmVCcmVha3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2V0IGFsbCBpdGVtcyB0byBsb29zZSBpZiBsaXN0IGlzIGxvb3NlXG4gICAgICAgICAgICBpZiAobGlzdC5sb29zZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5pdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0Lml0ZW1zW2ldLmxvb3NlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBodG1sKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmh0bWwuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICAgICAgYmxvY2s6IHRydWUsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgcHJlOiBjYXBbMV0gPT09ICdwcmUnIHx8IGNhcFsxXSA9PT0gJ3NjcmlwdCcgfHwgY2FwWzFdID09PSAnc3R5bGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNhcFswXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGVmKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmRlZi5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGNvbnN0IHRhZyA9IGNhcFsxXS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5tdWx0aXBsZVNwYWNlR2xvYmFsLCAnICcpO1xuICAgICAgICAgICAgY29uc3QgaHJlZiA9IGNhcFsyXSA/IGNhcFsyXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIuaHJlZkJyYWNrZXRzLCAnJDEnKS5yZXBsYWNlKHRoaXMucnVsZXMuaW5saW5lLmFueVB1bmN0dWF0aW9uLCAnJDEnKSA6ICcnO1xuICAgICAgICAgICAgY29uc3QgdGl0bGUgPSBjYXBbM10gPyBjYXBbM10uc3Vic3RyaW5nKDEsIGNhcFszXS5sZW5ndGggLSAxKS5yZXBsYWNlKHRoaXMucnVsZXMuaW5saW5lLmFueVB1bmN0dWF0aW9uLCAnJDEnKSA6IGNhcFszXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RlZicsXG4gICAgICAgICAgICAgICAgdGFnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIGhyZWYsXG4gICAgICAgICAgICAgICAgdGl0bGUsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRhYmxlKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnRhYmxlLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKCFjYXApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMucnVsZXMub3RoZXIudGFibGVEZWxpbWl0ZXIudGVzdChjYXBbMl0pKSB7XG4gICAgICAgICAgICAvLyBkZWxpbWl0ZXIgcm93IG11c3QgaGF2ZSBhIHBpcGUgKHwpIG9yIGNvbG9uICg6KSBvdGhlcndpc2UgaXQgaXMgYSBzZXRleHQgaGVhZGluZ1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSBzcGxpdENlbGxzKGNhcFsxXSk7XG4gICAgICAgIGNvbnN0IGFsaWducyA9IGNhcFsyXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIudGFibGVBbGlnbkNoYXJzLCAnJykuc3BsaXQoJ3wnKTtcbiAgICAgICAgY29uc3Qgcm93cyA9IGNhcFszXT8udHJpbSgpID8gY2FwWzNdLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci50YWJsZVJvd0JsYW5rTGluZSwgJycpLnNwbGl0KCdcXG4nKSA6IFtdO1xuICAgICAgICBjb25zdCBpdGVtID0ge1xuICAgICAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgaGVhZGVyOiBbXSxcbiAgICAgICAgICAgIGFsaWduOiBbXSxcbiAgICAgICAgICAgIHJvd3M6IFtdLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoaGVhZGVycy5sZW5ndGggIT09IGFsaWducy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGhlYWRlciBhbmQgYWxpZ24gY29sdW1ucyBtdXN0IGJlIGVxdWFsLCByb3dzIGNhbiBiZSBkaWZmZXJlbnQuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBhbGlnbiBvZiBhbGlnbnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bGVzLm90aGVyLnRhYmxlQWxpZ25SaWdodC50ZXN0KGFsaWduKSkge1xuICAgICAgICAgICAgICAgIGl0ZW0uYWxpZ24ucHVzaCgncmlnaHQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucnVsZXMub3RoZXIudGFibGVBbGlnbkNlbnRlci50ZXN0KGFsaWduKSkge1xuICAgICAgICAgICAgICAgIGl0ZW0uYWxpZ24ucHVzaCgnY2VudGVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnJ1bGVzLm90aGVyLnRhYmxlQWxpZ25MZWZ0LnRlc3QoYWxpZ24pKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5hbGlnbi5wdXNoKCdsZWZ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtLmFsaWduLnB1c2gobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBoZWFkZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpdGVtLmhlYWRlci5wdXNoKHtcbiAgICAgICAgICAgICAgICB0ZXh0OiBoZWFkZXJzW2ldLFxuICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmUoaGVhZGVyc1tpXSksXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGFsaWduOiBpdGVtLmFsaWduW2ldLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xuICAgICAgICAgICAgaXRlbS5yb3dzLnB1c2goc3BsaXRDZWxscyhyb3csIGl0ZW0uaGVhZGVyLmxlbmd0aCkubWFwKChjZWxsLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogY2VsbCxcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZShjZWxsKSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ246IGl0ZW0uYWxpZ25baV0sXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG4gICAgbGhlYWRpbmcoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2subGhlYWRpbmcuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICBkZXB0aDogY2FwWzJdLmNoYXJBdCgwKSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzFdLFxuICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmUoY2FwWzFdKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGFyYWdyYXBoKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnBhcmFncmFwaC5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGNvbnN0IHRleHQgPSBjYXBbMV0uY2hhckF0KGNhcFsxXS5sZW5ndGggLSAxKSA9PT0gJ1xcbidcbiAgICAgICAgICAgICAgICA/IGNhcFsxXS5zbGljZSgwLCAtMSlcbiAgICAgICAgICAgICAgICA6IGNhcFsxXTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lKHRleHQpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0ZXh0KHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnRleHQuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZShjYXBbMF0pLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlc2NhcGUoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmVzY2FwZS5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2VzY2FwZScsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzFdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YWcoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnRhZy5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5sZXhlci5zdGF0ZS5pbkxpbmsgJiYgdGhpcy5ydWxlcy5vdGhlci5zdGFydEFUYWcudGVzdChjYXBbMF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5zdGF0ZS5pbkxpbmsgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5sZXhlci5zdGF0ZS5pbkxpbmsgJiYgdGhpcy5ydWxlcy5vdGhlci5lbmRBVGFnLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayAmJiB0aGlzLnJ1bGVzLm90aGVyLnN0YXJ0UHJlU2NyaXB0VGFnLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgJiYgdGhpcy5ydWxlcy5vdGhlci5lbmRQcmVTY3JpcHRUYWcudGVzdChjYXBbMF0pKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdodG1sJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICBpbkxpbms6IHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rLFxuICAgICAgICAgICAgICAgIGluUmF3QmxvY2s6IHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayxcbiAgICAgICAgICAgICAgICBibG9jazogZmFsc2UsXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzBdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsaW5rKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5saW5rLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgY29uc3QgdHJpbW1lZFVybCA9IGNhcFsyXS50cmltKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wZWRhbnRpYyAmJiB0aGlzLnJ1bGVzLm90aGVyLnN0YXJ0QW5nbGVCcmFja2V0LnRlc3QodHJpbW1lZFVybCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21tb25tYXJrIHJlcXVpcmVzIG1hdGNoaW5nIGFuZ2xlIGJyYWNrZXRzXG4gICAgICAgICAgICAgICAgaWYgKCEodGhpcy5ydWxlcy5vdGhlci5lbmRBbmdsZUJyYWNrZXQudGVzdCh0cmltbWVkVXJsKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBlbmRpbmcgYW5nbGUgYnJhY2tldCBjYW5ub3QgYmUgZXNjYXBlZFxuICAgICAgICAgICAgICAgIGNvbnN0IHJ0cmltU2xhc2ggPSBydHJpbSh0cmltbWVkVXJsLnNsaWNlKDAsIC0xKSwgJ1xcXFwnKTtcbiAgICAgICAgICAgICAgICBpZiAoKHRyaW1tZWRVcmwubGVuZ3RoIC0gcnRyaW1TbGFzaC5sZW5ndGgpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZmluZCBjbG9zaW5nIHBhcmVudGhlc2lzXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFBhcmVuSW5kZXggPSBmaW5kQ2xvc2luZ0JyYWNrZXQoY2FwWzJdLCAnKCknKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFBhcmVuSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGNhcFswXS5pbmRleE9mKCchJykgPT09IDAgPyA1IDogNDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlua0xlbiA9IHN0YXJ0ICsgY2FwWzFdLmxlbmd0aCArIGxhc3RQYXJlbkluZGV4O1xuICAgICAgICAgICAgICAgICAgICBjYXBbMl0gPSBjYXBbMl0uc3Vic3RyaW5nKDAsIGxhc3RQYXJlbkluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgY2FwWzBdID0gY2FwWzBdLnN1YnN0cmluZygwLCBsaW5rTGVuKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIGNhcFszXSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBocmVmID0gY2FwWzJdO1xuICAgICAgICAgICAgbGV0IHRpdGxlID0gJyc7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BsaXQgcGVkYW50aWMgaHJlZiBhbmQgdGl0bGVcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gdGhpcy5ydWxlcy5vdGhlci5wZWRhbnRpY0hyZWZUaXRsZS5leGVjKGhyZWYpO1xuICAgICAgICAgICAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBsaW5rWzFdO1xuICAgICAgICAgICAgICAgICAgICB0aXRsZSA9IGxpbmtbM107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGl0bGUgPSBjYXBbM10gPyBjYXBbM10uc2xpY2UoMSwgLTEpIDogJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBocmVmID0gaHJlZi50cmltKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ydWxlcy5vdGhlci5zdGFydEFuZ2xlQnJhY2tldC50ZXN0KGhyZWYpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYyAmJiAhKHRoaXMucnVsZXMub3RoZXIuZW5kQW5nbGVCcmFja2V0LnRlc3QodHJpbW1lZFVybCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBlZGFudGljIGFsbG93cyBzdGFydGluZyBhbmdsZSBicmFja2V0IHdpdGhvdXQgZW5kaW5nIGFuZ2xlIGJyYWNrZXRcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dExpbmsoY2FwLCB7XG4gICAgICAgICAgICAgICAgaHJlZjogaHJlZiA/IGhyZWYucmVwbGFjZSh0aGlzLnJ1bGVzLmlubGluZS5hbnlQdW5jdHVhdGlvbiwgJyQxJykgOiBocmVmLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSA/IHRpdGxlLnJlcGxhY2UodGhpcy5ydWxlcy5pbmxpbmUuYW55UHVuY3R1YXRpb24sICckMScpIDogdGl0bGUsXG4gICAgICAgICAgICB9LCBjYXBbMF0sIHRoaXMubGV4ZXIsIHRoaXMucnVsZXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlZmxpbmsoc3JjLCBsaW5rcykge1xuICAgICAgICBsZXQgY2FwO1xuICAgICAgICBpZiAoKGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnJlZmxpbmsuZXhlYyhzcmMpKVxuICAgICAgICAgICAgfHwgKGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLm5vbGluay5leGVjKHNyYykpKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5rU3RyaW5nID0gKGNhcFsyXSB8fCBjYXBbMV0pLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5tdWx0aXBsZVNwYWNlR2xvYmFsLCAnICcpO1xuICAgICAgICAgICAgY29uc3QgbGluayA9IGxpbmtzW2xpbmtTdHJpbmcudG9Mb3dlckNhc2UoKV07XG4gICAgICAgICAgICBpZiAoIWxpbmspIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gY2FwWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgIHJhdzogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG91dHB1dExpbmsoY2FwLCBsaW5rLCBjYXBbMF0sIHRoaXMubGV4ZXIsIHRoaXMucnVsZXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVtU3Ryb25nKHNyYywgbWFza2VkU3JjLCBwcmV2Q2hhciA9ICcnKSB7XG4gICAgICAgIGxldCBtYXRjaCA9IHRoaXMucnVsZXMuaW5saW5lLmVtU3Ryb25nTERlbGltLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKCFtYXRjaClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gXyBjYW4ndCBiZSBiZXR3ZWVuIHR3byBhbHBoYW51bWVyaWNzLiBcXHB7TH1cXHB7Tn0gaW5jbHVkZXMgbm9uLWVuZ2xpc2ggYWxwaGFiZXQvbnVtYmVycyBhcyB3ZWxsXG4gICAgICAgIGlmIChtYXRjaFszXSAmJiBwcmV2Q2hhci5tYXRjaCh0aGlzLnJ1bGVzLm90aGVyLnVuaWNvZGVBbHBoYU51bWVyaWMpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBuZXh0Q2hhciA9IG1hdGNoWzFdIHx8IG1hdGNoWzJdIHx8ICcnO1xuICAgICAgICBpZiAoIW5leHRDaGFyIHx8ICFwcmV2Q2hhciB8fCB0aGlzLnJ1bGVzLmlubGluZS5wdW5jdHVhdGlvbi5leGVjKHByZXZDaGFyKSkge1xuICAgICAgICAgICAgLy8gdW5pY29kZSBSZWdleCBjb3VudHMgZW1vamkgYXMgMSBjaGFyOyBzcHJlYWQgaW50byBhcnJheSBmb3IgcHJvcGVyIGNvdW50ICh1c2VkIG11bHRpcGxlIHRpbWVzIGJlbG93KVxuICAgICAgICAgICAgY29uc3QgbExlbmd0aCA9IFsuLi5tYXRjaFswXV0ubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGxldCByRGVsaW0sIHJMZW5ndGgsIGRlbGltVG90YWwgPSBsTGVuZ3RoLCBtaWREZWxpbVRvdGFsID0gMDtcbiAgICAgICAgICAgIGNvbnN0IGVuZFJlZyA9IG1hdGNoWzBdWzBdID09PSAnKicgPyB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZ1JEZWxpbUFzdCA6IHRoaXMucnVsZXMuaW5saW5lLmVtU3Ryb25nUkRlbGltVW5kO1xuICAgICAgICAgICAgZW5kUmVnLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAvLyBDbGlwIG1hc2tlZFNyYyB0byBzYW1lIHNlY3Rpb24gb2Ygc3RyaW5nIGFzIHNyYyAobW92ZSB0byBsZXhlcj8pXG4gICAgICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoLTEgKiBzcmMubGVuZ3RoICsgbExlbmd0aCk7XG4gICAgICAgICAgICB3aGlsZSAoKG1hdGNoID0gZW5kUmVnLmV4ZWMobWFza2VkU3JjKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJEZWxpbSA9IG1hdGNoWzFdIHx8IG1hdGNoWzJdIHx8IG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdIHx8IG1hdGNoWzZdO1xuICAgICAgICAgICAgICAgIGlmICghckRlbGltKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gc2tpcCBzaW5nbGUgKiBpbiBfX2FiYyphYmNfX1xuICAgICAgICAgICAgICAgIHJMZW5ndGggPSBbLi4uckRlbGltXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzNdIHx8IG1hdGNoWzRdKSB7IC8vIGZvdW5kIGFub3RoZXIgTGVmdCBEZWxpbVxuICAgICAgICAgICAgICAgICAgICBkZWxpbVRvdGFsICs9IHJMZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChtYXRjaFs1XSB8fCBtYXRjaFs2XSkgeyAvLyBlaXRoZXIgTGVmdCBvciBSaWdodCBEZWxpbVxuICAgICAgICAgICAgICAgICAgICBpZiAobExlbmd0aCAlIDMgJiYgISgobExlbmd0aCArIHJMZW5ndGgpICUgMykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pZERlbGltVG90YWwgKz0gckxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBDb21tb25NYXJrIEVtcGhhc2lzIFJ1bGVzIDktMTBcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWxpbVRvdGFsIC09IHJMZW5ndGg7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGltVG90YWwgPiAwKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gSGF2ZW4ndCBmb3VuZCBlbm91Z2ggY2xvc2luZyBkZWxpbWl0ZXJzXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGV4dHJhIGNoYXJhY3RlcnMuICphKioqIC0+ICphKlxuICAgICAgICAgICAgICAgIHJMZW5ndGggPSBNYXRoLm1pbihyTGVuZ3RoLCByTGVuZ3RoICsgZGVsaW1Ub3RhbCArIG1pZERlbGltVG90YWwpO1xuICAgICAgICAgICAgICAgIC8vIGNoYXIgbGVuZ3RoIGNhbiBiZSA+MSBmb3IgdW5pY29kZSBjaGFyYWN0ZXJzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDaGFyTGVuZ3RoID0gWy4uLm1hdGNoWzBdXVswXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3ID0gc3JjLnNsaWNlKDAsIGxMZW5ndGggKyBtYXRjaC5pbmRleCArIGxhc3RDaGFyTGVuZ3RoICsgckxlbmd0aCk7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGBlbWAgaWYgc21hbGxlc3QgZGVsaW1pdGVyIGhhcyBvZGQgY2hhciBjb3VudC4gKmEqKipcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5taW4obExlbmd0aCwgckxlbmd0aCkgJSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSByYXcuc2xpY2UoMSwgLTEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VtJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lVG9rZW5zKHRleHQpLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgJ3N0cm9uZycgaWYgc21hbGxlc3QgZGVsaW1pdGVyIGhhcyBldmVuIGNoYXIgY291bnQuICoqYSoqKlxuICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSByYXcuc2xpY2UoMiwgLTIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJvbmcnLFxuICAgICAgICAgICAgICAgICAgICByYXcsXG4gICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmVUb2tlbnModGV4dCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb2Rlc3BhbihzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuY29kZS5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gY2FwWzJdLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5uZXdMaW5lQ2hhckdsb2JhbCwgJyAnKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc05vblNwYWNlQ2hhcnMgPSB0aGlzLnJ1bGVzLm90aGVyLm5vblNwYWNlQ2hhci50ZXN0KHRleHQpO1xuICAgICAgICAgICAgY29uc3QgaGFzU3BhY2VDaGFyc09uQm90aEVuZHMgPSB0aGlzLnJ1bGVzLm90aGVyLnN0YXJ0aW5nU3BhY2VDaGFyLnRlc3QodGV4dCkgJiYgdGhpcy5ydWxlcy5vdGhlci5lbmRpbmdTcGFjZUNoYXIudGVzdCh0ZXh0KTtcbiAgICAgICAgICAgIGlmIChoYXNOb25TcGFjZUNoYXJzICYmIGhhc1NwYWNlQ2hhcnNPbkJvdGhFbmRzKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDEsIHRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjb2Rlc3BhbicsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgYnIoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmJyLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYnInLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkZWwoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmRlbC5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RlbCcsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzJdLFxuICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmVUb2tlbnMoY2FwWzJdKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXV0b2xpbmsoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmF1dG9saW5rLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgbGV0IHRleHQsIGhyZWY7XG4gICAgICAgICAgICBpZiAoY2FwWzJdID09PSAnQCcpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gY2FwWzFdO1xuICAgICAgICAgICAgICAgIGhyZWYgPSAnbWFpbHRvOicgKyB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGNhcFsxXTtcbiAgICAgICAgICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgaHJlZixcbiAgICAgICAgICAgICAgICB0b2tlbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmF3OiB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB1cmwoc3JjKSB7XG4gICAgICAgIGxldCBjYXA7XG4gICAgICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS51cmwuZXhlYyhzcmMpKSB7XG4gICAgICAgICAgICBsZXQgdGV4dCwgaHJlZjtcbiAgICAgICAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICAgICAgICAgIHRleHQgPSBjYXBbMF07XG4gICAgICAgICAgICAgICAgaHJlZiA9ICdtYWlsdG86JyArIHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkbyBleHRlbmRlZCBhdXRvbGluayBwYXRoIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICBsZXQgcHJldkNhcFplcm87XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBwcmV2Q2FwWmVybyA9IGNhcFswXTtcbiAgICAgICAgICAgICAgICAgICAgY2FwWzBdID0gdGhpcy5ydWxlcy5pbmxpbmUuX2JhY2twZWRhbC5leGVjKGNhcFswXSk/LlswXSA/PyAnJztcbiAgICAgICAgICAgICAgICB9IHdoaWxlIChwcmV2Q2FwWmVybyAhPT0gY2FwWzBdKTtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gY2FwWzBdO1xuICAgICAgICAgICAgICAgIGlmIChjYXBbMV0gPT09ICd3d3cuJykge1xuICAgICAgICAgICAgICAgICAgICBocmVmID0gJ2h0dHA6Ly8nICsgY2FwWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGNhcFswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgIGhyZWYsXG4gICAgICAgICAgICAgICAgdG9rZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdzogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5saW5lVGV4dChzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUudGV4dC5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGNvbnN0IGVzY2FwZWQgPSB0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2s7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgZXNjYXBlZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogQmxvY2sgTGV4ZXJcbiAqL1xuY2xhc3MgX0xleGVyIHtcbiAgICB0b2tlbnM7XG4gICAgb3B0aW9ucztcbiAgICBzdGF0ZTtcbiAgICB0b2tlbml6ZXI7XG4gICAgaW5saW5lUXVldWU7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICAvLyBUb2tlbkxpc3QgY2Fubm90IGJlIGNyZWF0ZWQgaW4gb25lIGdvXG4gICAgICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgICAgIHRoaXMudG9rZW5zLmxpbmtzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBfZGVmYXVsdHM7XG4gICAgICAgIHRoaXMub3B0aW9ucy50b2tlbml6ZXIgPSB0aGlzLm9wdGlvbnMudG9rZW5pemVyIHx8IG5ldyBfVG9rZW5pemVyKCk7XG4gICAgICAgIHRoaXMudG9rZW5pemVyID0gdGhpcy5vcHRpb25zLnRva2VuaXplcjtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdGhpcy50b2tlbml6ZXIubGV4ZXIgPSB0aGlzO1xuICAgICAgICB0aGlzLmlubGluZVF1ZXVlID0gW107XG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAgICAgICBpbkxpbms6IGZhbHNlLFxuICAgICAgICAgICAgaW5SYXdCbG9jazogZmFsc2UsXG4gICAgICAgICAgICB0b3A6IHRydWUsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJ1bGVzID0ge1xuICAgICAgICAgICAgb3RoZXIsXG4gICAgICAgICAgICBibG9jazogYmxvY2subm9ybWFsLFxuICAgICAgICAgICAgaW5saW5lOiBpbmxpbmUubm9ybWFsLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICBydWxlcy5ibG9jayA9IGJsb2NrLnBlZGFudGljO1xuICAgICAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLnBlZGFudGljO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgICAgICAgIHJ1bGVzLmJsb2NrID0gYmxvY2suZ2ZtO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5icmVha3MpIHtcbiAgICAgICAgICAgICAgICBydWxlcy5pbmxpbmUgPSBpbmxpbmUuYnJlYWtzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLmdmbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRva2VuaXplci5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgUnVsZXNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IHJ1bGVzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYmxvY2ssXG4gICAgICAgICAgICBpbmxpbmUsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBMZXggTWV0aG9kXG4gICAgICovXG4gICAgc3RhdGljIGxleChzcmMsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgbGV4ZXIgPSBuZXcgX0xleGVyKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBMZXggSW5saW5lIE1ldGhvZFxuICAgICAqL1xuICAgIHN0YXRpYyBsZXhJbmxpbmUoc3JjLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGxleGVyID0gbmV3IF9MZXhlcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGxleGVyLmlubGluZVRva2VucyhzcmMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmVwcm9jZXNzaW5nXG4gICAgICovXG4gICAgbGV4KHNyYykge1xuICAgICAgICBzcmMgPSBzcmMucmVwbGFjZShvdGhlci5jYXJyaWFnZVJldHVybiwgJ1xcbicpO1xuICAgICAgICB0aGlzLmJsb2NrVG9rZW5zKHNyYywgdGhpcy50b2tlbnMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5saW5lUXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmlubGluZVF1ZXVlW2ldO1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVUb2tlbnMobmV4dC5zcmMsIG5leHQudG9rZW5zKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlubGluZVF1ZXVlID0gW107XG4gICAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICB9XG4gICAgYmxvY2tUb2tlbnMoc3JjLCB0b2tlbnMgPSBbXSwgbGFzdFBhcmFncmFwaENsaXBwZWQgPSBmYWxzZSkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICBzcmMgPSBzcmMucmVwbGFjZShvdGhlci50YWJDaGFyR2xvYmFsLCAnICAgICcpLnJlcGxhY2Uob3RoZXIuc3BhY2VMaW5lLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICAgICAgbGV0IHRva2VuO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zPy5ibG9jaz8uc29tZSgoZXh0VG9rZW5pemVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID0gZXh0VG9rZW5pemVyLmNhbGwoeyBsZXhlcjogdGhpcyB9LCBzcmMsIHRva2VucykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG5ld2xpbmVcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnNwYWNlKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnJhdy5sZW5ndGggPT09IDEgJiYgbGFzdFRva2VuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUncyBhIHNpbmdsZSBcXG4gYXMgYSBzcGFjZXIsIGl0J3MgdGVybWluYXRpbmcgdGhlIGxhc3QgbGluZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gc28gbW92ZSBpdCB0aGVyZSBzbyB0aGF0IHdlIGRvbid0IGdldCB1bm5lY2Vzc2FyeSBwYXJhZ3JhcGggdGFnc1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9ICdcXG4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvZGVcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmNvZGUoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFRva2VuID0gdG9rZW5zLmF0KC0xKTtcbiAgICAgICAgICAgICAgICAvLyBBbiBpbmRlbnRlZCBjb2RlIGJsb2NrIGNhbm5vdCBpbnRlcnJ1cHQgYSBwYXJhZ3JhcGguXG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUb2tlbj8udHlwZSA9PT0gJ3BhcmFncmFwaCcgfHwgbGFzdFRva2VuPy50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gJ1xcbicgKyB0b2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLmF0KC0xKS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmZW5jZXNcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmZlbmNlcyhzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoZWFkaW5nXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5oZWFkaW5nKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGhyXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5ocihzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBibG9ja3F1b3RlXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5ibG9ja3F1b3RlKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxpc3RcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmxpc3Qoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaHRtbFxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaHRtbChzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkZWZcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmRlZihzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VG9rZW4gPSB0b2tlbnMuYXQoLTEpO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICdwYXJhZ3JhcGgnIHx8IGxhc3RUb2tlbj8udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9ICdcXG4nICsgdG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLmF0KC0xKS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIXRoaXMudG9rZW5zLmxpbmtzW3Rva2VuLnRhZ10pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2tlbnMubGlua3NbdG9rZW4udGFnXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY6IHRva2VuLmhyZWYsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogdG9rZW4udGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGFibGUgKGdmbSlcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnRhYmxlKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxoZWFkaW5nXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5saGVhZGluZyhzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgICAgICAgICAvLyBwcmV2ZW50IHBhcmFncmFwaCBjb25zdW1pbmcgZXh0ZW5zaW9ucyBieSBjbGlwcGluZyAnc3JjJyB0byBleHRlbnNpb24gc3RhcnRcbiAgICAgICAgICAgIGxldCBjdXRTcmMgPSBzcmM7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnM/LnN0YXJ0QmxvY2spIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTcmMgPSBzcmMuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBTdGFydDtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5zdGFydEJsb2NrLmZvckVhY2goKGdldFN0YXJ0SW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFN0YXJ0ID0gZ2V0U3RhcnRJbmRleC5jYWxsKHsgbGV4ZXI6IHRoaXMgfSwgdGVtcFNyYyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcFN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0ZW1wU3RhcnQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IE1hdGgubWluKHN0YXJ0SW5kZXgsIHRlbXBTdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRJbmRleCA8IEluZmluaXR5ICYmIHN0YXJ0SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjdXRTcmMgPSBzcmMuc3Vic3RyaW5nKDAsIHN0YXJ0SW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS50b3AgJiYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIucGFyYWdyYXBoKGN1dFNyYykpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFRva2VuID0gdG9rZW5zLmF0KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFBhcmFncmFwaENsaXBwZWQgJiYgbGFzdFRva2VuPy50eXBlID09PSAncGFyYWdyYXBoJykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9ICdcXG4nICsgdG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWUucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWUuYXQoLTEpLnNyYyA9IGxhc3RUb2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsYXN0UGFyYWdyYXBoQ2xpcHBlZCA9IGN1dFNyYy5sZW5ndGggIT09IHNyYy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRleHRcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnRleHQoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFRva2VuID0gdG9rZW5zLmF0KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFRva2VuPy50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gJ1xcbicgKyB0b2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLmF0KC0xKS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3JjKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyTXNnID0gJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZS50b3AgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cbiAgICBpbmxpbmUoc3JjLCB0b2tlbnMgPSBbXSkge1xuICAgICAgICB0aGlzLmlubGluZVF1ZXVlLnB1c2goeyBzcmMsIHRva2VucyB9KTtcbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGV4aW5nL0NvbXBpbGluZ1xuICAgICAqL1xuICAgIGlubGluZVRva2VucyhzcmMsIHRva2VucyA9IFtdKSB7XG4gICAgICAgIC8vIFN0cmluZyB3aXRoIGxpbmtzIG1hc2tlZCB0byBhdm9pZCBpbnRlcmZlcmVuY2Ugd2l0aCBlbSBhbmQgc3Ryb25nXG4gICAgICAgIGxldCBtYXNrZWRTcmMgPSBzcmM7XG4gICAgICAgIGxldCBtYXRjaCA9IG51bGw7XG4gICAgICAgIC8vIE1hc2sgb3V0IHJlZmxpbmtzXG4gICAgICAgIGlmICh0aGlzLnRva2Vucy5saW5rcykge1xuICAgICAgICAgICAgY29uc3QgbGlua3MgPSBPYmplY3Qua2V5cyh0aGlzLnRva2Vucy5saW5rcyk7XG4gICAgICAgICAgICBpZiAobGlua3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUucmVmbGlua1NlYXJjaC5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtzLmluY2x1ZGVzKG1hdGNoWzBdLnNsaWNlKG1hdGNoWzBdLmxhc3RJbmRleE9mKCdbJykgKyAxLCAtMSkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoMCwgbWF0Y2guaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnWycgKyAnYScucmVwZWF0KG1hdGNoWzBdLmxlbmd0aCAtIDIpICsgJ10nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBtYXNrZWRTcmMuc2xpY2UodGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLnJlZmxpbmtTZWFyY2gubGFzdEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBNYXNrIG91dCBlc2NhcGVkIGNoYXJhY3RlcnNcbiAgICAgICAgd2hpbGUgKChtYXRjaCA9IHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5hbnlQdW5jdHVhdGlvbi5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hc2tlZFNyYyA9IG1hc2tlZFNyYy5zbGljZSgwLCBtYXRjaC5pbmRleCkgKyAnKysnICsgbWFza2VkU3JjLnNsaWNlKHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5hbnlQdW5jdHVhdGlvbi5sYXN0SW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1hc2sgb3V0IG90aGVyIGJsb2Nrc1xuICAgICAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLmJsb2NrU2tpcC5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgICAgIG1hc2tlZFNyYyA9IG1hc2tlZFNyYy5zbGljZSgwLCBtYXRjaC5pbmRleCkgKyAnWycgKyAnYScucmVwZWF0KG1hdGNoWzBdLmxlbmd0aCAtIDIpICsgJ10nICsgbWFza2VkU3JjLnNsaWNlKHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5ibG9ja1NraXAubGFzdEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQga2VlcFByZXZDaGFyID0gZmFsc2U7XG4gICAgICAgIGxldCBwcmV2Q2hhciA9ICcnO1xuICAgICAgICB3aGlsZSAoc3JjKSB7XG4gICAgICAgICAgICBpZiAoIWtlZXBQcmV2Q2hhcikge1xuICAgICAgICAgICAgICAgIHByZXZDaGFyID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZWVwUHJldkNoYXIgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgICAgIC8vIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucz8uaW5saW5lPy5zb21lKChleHRUb2tlbml6ZXIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4gPSBleHRUb2tlbml6ZXIuY2FsbCh7IGxleGVyOiB0aGlzIH0sIHNyYywgdG9rZW5zKSkge1xuICAgICAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KSkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXNjYXBlXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5lc2NhcGUoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGFnXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci50YWcoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGlua1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIubGluayhzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZWZsaW5rLCBub2xpbmtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnJlZmxpbmsoc3JjLCB0aGlzLnRva2Vucy5saW5rcykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4/LnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9IHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gdG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbSAmIHN0cm9uZ1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZW1TdHJvbmcoc3JjLCBtYXNrZWRTcmMsIHByZXZDaGFyKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29kZVxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuY29kZXNwYW4oc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnJcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmJyKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGRlbCAoZ2ZtKVxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZGVsKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGF1dG9saW5rXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5hdXRvbGluayhzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cmwgKGdmbSlcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5pbkxpbmsgJiYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIudXJsKHNyYykpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXh0XG4gICAgICAgICAgICAvLyBwcmV2ZW50IGlubGluZVRleHQgY29uc3VtaW5nIGV4dGVuc2lvbnMgYnkgY2xpcHBpbmcgJ3NyYycgdG8gZXh0ZW5zaW9uIHN0YXJ0XG4gICAgICAgICAgICBsZXQgY3V0U3JjID0gc3JjO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zPy5zdGFydElubGluZSkge1xuICAgICAgICAgICAgICAgIGxldCBzdGFydEluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcFNyYyA9IHNyYy5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBsZXQgdGVtcFN0YXJ0O1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnN0YXJ0SW5saW5lLmZvckVhY2goKGdldFN0YXJ0SW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcFN0YXJ0ID0gZ2V0U3RhcnRJbmRleC5jYWxsKHsgbGV4ZXI6IHRoaXMgfSwgdGVtcFNyYyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcFN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0ZW1wU3RhcnQgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRJbmRleCA9IE1hdGgubWluKHN0YXJ0SW5kZXgsIHRlbXBTdGFydCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoc3RhcnRJbmRleCA8IEluZmluaXR5ICYmIHN0YXJ0SW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjdXRTcmMgPSBzcmMuc3Vic3RyaW5nKDAsIHN0YXJ0SW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5pbmxpbmVUZXh0KGN1dFNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5yYXcuc2xpY2UoLTEpICE9PSAnXycpIHsgLy8gVHJhY2sgcHJldkNoYXIgYmVmb3JlIHN0cmluZyBvZiBfX19fIHN0YXJ0ZWRcbiAgICAgICAgICAgICAgICAgICAgcHJldkNoYXIgPSB0b2tlbi5yYXcuc2xpY2UoLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBrZWVwUHJldkNoYXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUb2tlbj8udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gdG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSB0b2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJNc2cgPSAnSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZW5kZXJlclxuICovXG5jbGFzcyBfUmVuZGVyZXIge1xuICAgIG9wdGlvbnM7XG4gICAgcGFyc2VyOyAvLyBzZXQgYnkgdGhlIHBhcnNlclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBfZGVmYXVsdHM7XG4gICAgfVxuICAgIHNwYWNlKHRva2VuKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29kZSh7IHRleHQsIGxhbmcsIGVzY2FwZWQgfSkge1xuICAgICAgICBjb25zdCBsYW5nU3RyaW5nID0gKGxhbmcgfHwgJycpLm1hdGNoKG90aGVyLm5vdFNwYWNlU3RhcnQpPy5bMF07XG4gICAgICAgIGNvbnN0IGNvZGUgPSB0ZXh0LnJlcGxhY2Uob3RoZXIuZW5kaW5nTmV3bGluZSwgJycpICsgJ1xcbic7XG4gICAgICAgIGlmICghbGFuZ1N0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuICc8cHJlPjxjb2RlPidcbiAgICAgICAgICAgICAgICArIChlc2NhcGVkID8gY29kZSA6IGVzY2FwZShjb2RlLCB0cnVlKSlcbiAgICAgICAgICAgICAgICArICc8L2NvZGU+PC9wcmU+XFxuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJzxwcmU+PGNvZGUgY2xhc3M9XCJsYW5ndWFnZS0nXG4gICAgICAgICAgICArIGVzY2FwZShsYW5nU3RyaW5nKVxuICAgICAgICAgICAgKyAnXCI+J1xuICAgICAgICAgICAgKyAoZXNjYXBlZCA/IGNvZGUgOiBlc2NhcGUoY29kZSwgdHJ1ZSkpXG4gICAgICAgICAgICArICc8L2NvZGU+PC9wcmU+XFxuJztcbiAgICB9XG4gICAgYmxvY2txdW90ZSh7IHRva2VucyB9KSB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLnBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgICAgICByZXR1cm4gYDxibG9ja3F1b3RlPlxcbiR7Ym9keX08L2Jsb2NrcXVvdGU+XFxuYDtcbiAgICB9XG4gICAgaHRtbCh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgaGVhZGluZyh7IHRva2VucywgZGVwdGggfSkge1xuICAgICAgICByZXR1cm4gYDxoJHtkZXB0aH0+JHt0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbnMpfTwvaCR7ZGVwdGh9PlxcbmA7XG4gICAgfVxuICAgIGhyKHRva2VuKSB7XG4gICAgICAgIHJldHVybiAnPGhyPlxcbic7XG4gICAgfVxuICAgIGxpc3QodG9rZW4pIHtcbiAgICAgICAgY29uc3Qgb3JkZXJlZCA9IHRva2VuLm9yZGVyZWQ7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdG9rZW4uc3RhcnQ7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9rZW4uaXRlbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0b2tlbi5pdGVtc1tqXTtcbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5saXN0aXRlbShpdGVtKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0eXBlID0gb3JkZXJlZCA/ICdvbCcgOiAndWwnO1xuICAgICAgICBjb25zdCBzdGFydEF0dHIgPSAob3JkZXJlZCAmJiBzdGFydCAhPT0gMSkgPyAoJyBzdGFydD1cIicgKyBzdGFydCArICdcIicpIDogJyc7XG4gICAgICAgIHJldHVybiAnPCcgKyB0eXBlICsgc3RhcnRBdHRyICsgJz5cXG4nICsgYm9keSArICc8LycgKyB0eXBlICsgJz5cXG4nO1xuICAgIH1cbiAgICBsaXN0aXRlbShpdGVtKSB7XG4gICAgICAgIGxldCBpdGVtQm9keSA9ICcnO1xuICAgICAgICBpZiAoaXRlbS50YXNrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGVja2JveCA9IHRoaXMuY2hlY2tib3goeyBjaGVja2VkOiAhIWl0ZW0uY2hlY2tlZCB9KTtcbiAgICAgICAgICAgIGlmIChpdGVtLmxvb3NlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udG9rZW5zWzBdPy50eXBlID09PSAncGFyYWdyYXBoJykge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnRva2Vuc1swXS50ZXh0ID0gY2hlY2tib3ggKyAnICcgKyBpdGVtLnRva2Vuc1swXS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50b2tlbnNbMF0udG9rZW5zICYmIGl0ZW0udG9rZW5zWzBdLnRva2Vucy5sZW5ndGggPiAwICYmIGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS50ZXh0ID0gY2hlY2tib3ggKyAnICcgKyBlc2NhcGUoaXRlbS50b2tlbnNbMF0udG9rZW5zWzBdLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS50b2tlbnNbMF0udG9rZW5zWzBdLmVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtLnRva2Vucy51bnNoaWZ0KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdzogY2hlY2tib3ggKyAnICcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjaGVja2JveCArICcgJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVzY2FwZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW1Cb2R5ICs9IGNoZWNrYm94ICsgJyAnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGl0ZW1Cb2R5ICs9IHRoaXMucGFyc2VyLnBhcnNlKGl0ZW0udG9rZW5zLCAhIWl0ZW0ubG9vc2UpO1xuICAgICAgICByZXR1cm4gYDxsaT4ke2l0ZW1Cb2R5fTwvbGk+XFxuYDtcbiAgICB9XG4gICAgY2hlY2tib3goeyBjaGVja2VkIH0pIHtcbiAgICAgICAgcmV0dXJuICc8aW5wdXQgJ1xuICAgICAgICAgICAgKyAoY2hlY2tlZCA/ICdjaGVja2VkPVwiXCIgJyA6ICcnKVxuICAgICAgICAgICAgKyAnZGlzYWJsZWQ9XCJcIiB0eXBlPVwiY2hlY2tib3hcIj4nO1xuICAgIH1cbiAgICBwYXJhZ3JhcGgoeyB0b2tlbnMgfSkge1xuICAgICAgICByZXR1cm4gYDxwPiR7dGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKX08L3A+XFxuYDtcbiAgICB9XG4gICAgdGFibGUodG9rZW4pIHtcbiAgICAgICAgbGV0IGhlYWRlciA9ICcnO1xuICAgICAgICAvLyBoZWFkZXJcbiAgICAgICAgbGV0IGNlbGwgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0b2tlbi5oZWFkZXIubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNlbGwgKz0gdGhpcy50YWJsZWNlbGwodG9rZW4uaGVhZGVyW2pdKTtcbiAgICAgICAgfVxuICAgICAgICBoZWFkZXIgKz0gdGhpcy50YWJsZXJvdyh7IHRleHQ6IGNlbGwgfSk7XG4gICAgICAgIGxldCBib2R5ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9rZW4ucm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3Qgcm93ID0gdG9rZW4ucm93c1tqXTtcbiAgICAgICAgICAgIGNlbGwgPSAnJztcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgcm93Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgY2VsbCArPSB0aGlzLnRhYmxlY2VsbChyb3dba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYm9keSArPSB0aGlzLnRhYmxlcm93KHsgdGV4dDogY2VsbCB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYm9keSlcbiAgICAgICAgICAgIGJvZHkgPSBgPHRib2R5PiR7Ym9keX08L3Rib2R5PmA7XG4gICAgICAgIHJldHVybiAnPHRhYmxlPlxcbidcbiAgICAgICAgICAgICsgJzx0aGVhZD5cXG4nXG4gICAgICAgICAgICArIGhlYWRlclxuICAgICAgICAgICAgKyAnPC90aGVhZD5cXG4nXG4gICAgICAgICAgICArIGJvZHlcbiAgICAgICAgICAgICsgJzwvdGFibGU+XFxuJztcbiAgICB9XG4gICAgdGFibGVyb3coeyB0ZXh0IH0pIHtcbiAgICAgICAgcmV0dXJuIGA8dHI+XFxuJHt0ZXh0fTwvdHI+XFxuYDtcbiAgICB9XG4gICAgdGFibGVjZWxsKHRva2VuKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbi50b2tlbnMpO1xuICAgICAgICBjb25zdCB0eXBlID0gdG9rZW4uaGVhZGVyID8gJ3RoJyA6ICd0ZCc7XG4gICAgICAgIGNvbnN0IHRhZyA9IHRva2VuLmFsaWduXG4gICAgICAgICAgICA/IGA8JHt0eXBlfSBhbGlnbj1cIiR7dG9rZW4uYWxpZ259XCI+YFxuICAgICAgICAgICAgOiBgPCR7dHlwZX0+YDtcbiAgICAgICAgcmV0dXJuIHRhZyArIGNvbnRlbnQgKyBgPC8ke3R5cGV9PlxcbmA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIHNwYW4gbGV2ZWwgcmVuZGVyZXJcbiAgICAgKi9cbiAgICBzdHJvbmcoeyB0b2tlbnMgfSkge1xuICAgICAgICByZXR1cm4gYDxzdHJvbmc+JHt0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbnMpfTwvc3Ryb25nPmA7XG4gICAgfVxuICAgIGVtKHsgdG9rZW5zIH0pIHtcbiAgICAgICAgcmV0dXJuIGA8ZW0+JHt0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbnMpfTwvZW0+YDtcbiAgICB9XG4gICAgY29kZXNwYW4oeyB0ZXh0IH0pIHtcbiAgICAgICAgcmV0dXJuIGA8Y29kZT4ke2VzY2FwZSh0ZXh0LCB0cnVlKX08L2NvZGU+YDtcbiAgICB9XG4gICAgYnIodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuICc8YnI+JztcbiAgICB9XG4gICAgZGVsKHsgdG9rZW5zIH0pIHtcbiAgICAgICAgcmV0dXJuIGA8ZGVsPiR7dGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKX08L2RlbD5gO1xuICAgIH1cbiAgICBsaW5rKHsgaHJlZiwgdGl0bGUsIHRva2VucyB9KSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbnMpO1xuICAgICAgICBjb25zdCBjbGVhbkhyZWYgPSBjbGVhblVybChocmVmKTtcbiAgICAgICAgaWYgKGNsZWFuSHJlZiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgaHJlZiA9IGNsZWFuSHJlZjtcbiAgICAgICAgbGV0IG91dCA9ICc8YSBocmVmPVwiJyArIGhyZWYgKyAnXCInO1xuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIChlc2NhcGUodGl0bGUpKSArICdcIic7XG4gICAgICAgIH1cbiAgICAgICAgb3V0ICs9ICc+JyArIHRleHQgKyAnPC9hPic7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIGltYWdlKHsgaHJlZiwgdGl0bGUsIHRleHQgfSkge1xuICAgICAgICBjb25zdCBjbGVhbkhyZWYgPSBjbGVhblVybChocmVmKTtcbiAgICAgICAgaWYgKGNsZWFuSHJlZiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIGVzY2FwZSh0ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICBocmVmID0gY2xlYW5IcmVmO1xuICAgICAgICBsZXQgb3V0ID0gYDxpbWcgc3JjPVwiJHtocmVmfVwiIGFsdD1cIiR7dGV4dH1cImA7XG4gICAgICAgIGlmICh0aXRsZSkge1xuICAgICAgICAgICAgb3V0ICs9IGAgdGl0bGU9XCIke2VzY2FwZSh0aXRsZSl9XCJgO1xuICAgICAgICB9XG4gICAgICAgIG91dCArPSAnPic7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIHRleHQodG9rZW4pIHtcbiAgICAgICAgcmV0dXJuICd0b2tlbnMnIGluIHRva2VuICYmIHRva2VuLnRva2Vuc1xuICAgICAgICAgICAgPyB0aGlzLnBhcnNlci5wYXJzZUlubGluZSh0b2tlbi50b2tlbnMpXG4gICAgICAgICAgICA6ICgnZXNjYXBlZCcgaW4gdG9rZW4gJiYgdG9rZW4uZXNjYXBlZCA/IHRva2VuLnRleHQgOiBlc2NhcGUodG9rZW4udGV4dCkpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUZXh0UmVuZGVyZXJcbiAqIHJldHVybnMgb25seSB0aGUgdGV4dHVhbCBwYXJ0IG9mIHRoZSB0b2tlblxuICovXG5jbGFzcyBfVGV4dFJlbmRlcmVyIHtcbiAgICAvLyBubyBuZWVkIGZvciBibG9jayBsZXZlbCByZW5kZXJlcnNcbiAgICBzdHJvbmcoeyB0ZXh0IH0pIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGVtKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb2Rlc3Bhbih7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgZGVsKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBodG1sKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICB0ZXh0KHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBsaW5rKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiAnJyArIHRleHQ7XG4gICAgfVxuICAgIGltYWdlKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiAnJyArIHRleHQ7XG4gICAgfVxuICAgIGJyKCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxufVxuXG4vKipcbiAqIFBhcnNpbmcgJiBDb21waWxpbmdcbiAqL1xuY2xhc3MgX1BhcnNlciB7XG4gICAgb3B0aW9ucztcbiAgICByZW5kZXJlcjtcbiAgICB0ZXh0UmVuZGVyZXI7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IF9kZWZhdWx0cztcbiAgICAgICAgdGhpcy5vcHRpb25zLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBfUmVuZGVyZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlcjtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnBhcnNlciA9IHRoaXM7XG4gICAgICAgIHRoaXMudGV4dFJlbmRlcmVyID0gbmV3IF9UZXh0UmVuZGVyZXIoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhdGljIFBhcnNlIE1ldGhvZFxuICAgICAqL1xuICAgIHN0YXRpYyBwYXJzZSh0b2tlbnMsIG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgcGFyc2VyID0gbmV3IF9QYXJzZXIob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBwYXJzZXIucGFyc2UodG9rZW5zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhdGljIFBhcnNlIElubGluZSBNZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2VJbmxpbmUodG9rZW5zLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBfUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlSW5saW5lKHRva2Vucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlIExvb3BcbiAgICAgKi9cbiAgICBwYXJzZSh0b2tlbnMsIHRvcCA9IHRydWUpIHtcbiAgICAgICAgbGV0IG91dCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW55VG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAvLyBSdW4gYW55IHJlbmRlcmVyIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucz8ucmVuZGVyZXJzPy5bYW55VG9rZW4udHlwZV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBnZW5lcmljVG9rZW4gPSBhbnlUb2tlbjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5yZW5kZXJlcnNbZ2VuZXJpY1Rva2VuLnR5cGVdLmNhbGwoeyBwYXJzZXI6IHRoaXMgfSwgZ2VuZXJpY1Rva2VuKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSBmYWxzZSB8fCAhWydzcGFjZScsICdocicsICdoZWFkaW5nJywgJ2NvZGUnLCAndGFibGUnLCAnYmxvY2txdW90ZScsICdsaXN0JywgJ2h0bWwnLCAncGFyYWdyYXBoJywgJ3RleHQnXS5pbmNsdWRlcyhnZW5lcmljVG9rZW4udHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJldCB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBhbnlUb2tlbjtcbiAgICAgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5zcGFjZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdocic6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuaHIodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnaGVhZGluZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuaGVhZGluZyh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdjb2RlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5jb2RlKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ3RhYmxlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci50YWJsZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdibG9ja3F1b3RlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5ibG9ja3F1b3RlKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2xpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpc3QodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnaHRtbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuaHRtbCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdwYXJhZ3JhcGgnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dFRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGxldCBib2R5ID0gdGhpcy5yZW5kZXJlci50ZXh0KHRleHRUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IHRva2Vucy5sZW5ndGggJiYgdG9rZW5zW2kgKyAxXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRUb2tlbiA9IHRva2Vuc1srK2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9keSArPSAnXFxuJyArIHRoaXMucmVuZGVyZXIudGV4dCh0ZXh0VG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmF3OiBib2R5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGJvZHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zOiBbeyB0eXBlOiAndGV4dCcsIHJhdzogYm9keSwgdGV4dDogYm9keSwgZXNjYXBlZDogdHJ1ZSB9XSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0ICs9IGJvZHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyTXNnID0gJ1Rva2VuIHdpdGggXCInICsgdG9rZW4udHlwZSArICdcIiB0eXBlIHdhcyBub3QgZm91bmQuJztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlIElubGluZSBUb2tlbnNcbiAgICAgKi9cbiAgICBwYXJzZUlubGluZSh0b2tlbnMsIHJlbmRlcmVyID0gdGhpcy5yZW5kZXJlcikge1xuICAgICAgICBsZXQgb3V0ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBhbnlUb2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIC8vIFJ1biBhbnkgcmVuZGVyZXIgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zPy5yZW5kZXJlcnM/LlthbnlUb2tlbi50eXBlXSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnJlbmRlcmVyc1thbnlUb2tlbi50eXBlXS5jYWxsKHsgcGFyc2VyOiB0aGlzIH0sIGFueVRva2VuKTtcbiAgICAgICAgICAgICAgICBpZiAocmV0ICE9PSBmYWxzZSB8fCAhWydlc2NhcGUnLCAnaHRtbCcsICdsaW5rJywgJ2ltYWdlJywgJ3N0cm9uZycsICdlbScsICdjb2Rlc3BhbicsICdicicsICdkZWwnLCAndGV4dCddLmluY2x1ZGVzKGFueVRva2VuLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZXQgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYW55VG9rZW47XG4gICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdlc2NhcGUnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci50ZXh0KHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5odG1sKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2xpbmsnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5saW5rKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2ltYWdlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuaW1hZ2UodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnc3Ryb25nJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuc3Ryb25nKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuZW0odG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnY29kZXNwYW4nOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5jb2Rlc3Bhbih0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdicic6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmJyKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2RlbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmRlbCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0Jzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIudGV4dCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1zZyA9ICdUb2tlbiB3aXRoIFwiJyArIHRva2VuLnR5cGUgKyAnXCIgdHlwZSB3YXMgbm90IGZvdW5kLic7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbn1cblxuY2xhc3MgX0hvb2tzIHtcbiAgICBvcHRpb25zO1xuICAgIGJsb2NrO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBfZGVmYXVsdHM7XG4gICAgfVxuICAgIHN0YXRpYyBwYXNzVGhyb3VnaEhvb2tzID0gbmV3IFNldChbXG4gICAgICAgICdwcmVwcm9jZXNzJyxcbiAgICAgICAgJ3Bvc3Rwcm9jZXNzJyxcbiAgICAgICAgJ3Byb2Nlc3NBbGxUb2tlbnMnLFxuICAgIF0pO1xuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgbWFya2Rvd24gYmVmb3JlIG1hcmtlZFxuICAgICAqL1xuICAgIHByZXByb2Nlc3MobWFya2Rvd24pIHtcbiAgICAgICAgcmV0dXJuIG1hcmtkb3duO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm9jZXNzIEhUTUwgYWZ0ZXIgbWFya2VkIGlzIGZpbmlzaGVkXG4gICAgICovXG4gICAgcG9zdHByb2Nlc3MoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvY2VzcyBhbGwgdG9rZW5zIGJlZm9yZSB3YWxrIHRva2Vuc1xuICAgICAqL1xuICAgIHByb2Nlc3NBbGxUb2tlbnModG9rZW5zKSB7XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb3ZpZGUgZnVuY3Rpb24gdG8gdG9rZW5pemUgbWFya2Rvd25cbiAgICAgKi9cbiAgICBwcm92aWRlTGV4ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrID8gX0xleGVyLmxleCA6IF9MZXhlci5sZXhJbmxpbmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb3ZpZGUgZnVuY3Rpb24gdG8gcGFyc2UgdG9rZW5zXG4gICAgICovXG4gICAgcHJvdmlkZVBhcnNlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYmxvY2sgPyBfUGFyc2VyLnBhcnNlIDogX1BhcnNlci5wYXJzZUlubGluZTtcbiAgICB9XG59XG5cbmNsYXNzIE1hcmtlZCB7XG4gICAgZGVmYXVsdHMgPSBfZ2V0RGVmYXVsdHMoKTtcbiAgICBvcHRpb25zID0gdGhpcy5zZXRPcHRpb25zO1xuICAgIHBhcnNlID0gdGhpcy5wYXJzZU1hcmtkb3duKHRydWUpO1xuICAgIHBhcnNlSW5saW5lID0gdGhpcy5wYXJzZU1hcmtkb3duKGZhbHNlKTtcbiAgICBQYXJzZXIgPSBfUGFyc2VyO1xuICAgIFJlbmRlcmVyID0gX1JlbmRlcmVyO1xuICAgIFRleHRSZW5kZXJlciA9IF9UZXh0UmVuZGVyZXI7XG4gICAgTGV4ZXIgPSBfTGV4ZXI7XG4gICAgVG9rZW5pemVyID0gX1Rva2VuaXplcjtcbiAgICBIb29rcyA9IF9Ib29rcztcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMudXNlKC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSdW4gY2FsbGJhY2sgZm9yIGV2ZXJ5IHRva2VuXG4gICAgICovXG4gICAgd2Fsa1Rva2Vucyh0b2tlbnMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQoY2FsbGJhY2suY2FsbCh0aGlzLCB0b2tlbikpO1xuICAgICAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndGFibGUnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlVG9rZW4gPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBjZWxsIG9mIHRhYmxlVG9rZW4uaGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHRoaXMud2Fsa1Rva2VucyhjZWxsLnRva2VucywgY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHJvdyBvZiB0YWJsZVRva2VuLnJvd3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiByb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHRoaXMud2Fsa1Rva2VucyhjZWxsLnRva2VucywgY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnbGlzdCc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdFRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQodGhpcy53YWxrVG9rZW5zKGxpc3RUb2tlbi5pdGVtcywgY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJpY1Rva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRzLmV4dGVuc2lvbnM/LmNoaWxkVG9rZW5zPy5bZ2VuZXJpY1Rva2VuLnR5cGVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRzLmV4dGVuc2lvbnMuY2hpbGRUb2tlbnNbZ2VuZXJpY1Rva2VuLnR5cGVdLmZvckVhY2goKGNoaWxkVG9rZW5zKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9rZW5zID0gZ2VuZXJpY1Rva2VuW2NoaWxkVG9rZW5zXS5mbGF0KEluZmluaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHRoaXMud2Fsa1Rva2Vucyh0b2tlbnMsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChnZW5lcmljVG9rZW4udG9rZW5zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHRoaXMud2Fsa1Rva2VucyhnZW5lcmljVG9rZW4udG9rZW5zLCBjYWxsYmFjaykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfVxuICAgIHVzZSguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IGV4dGVuc2lvbnMgPSB0aGlzLmRlZmF1bHRzLmV4dGVuc2lvbnMgfHwgeyByZW5kZXJlcnM6IHt9LCBjaGlsZFRva2Vuczoge30gfTtcbiAgICAgICAgYXJncy5mb3JFYWNoKChwYWNrKSA9PiB7XG4gICAgICAgICAgICAvLyBjb3B5IG9wdGlvbnMgdG8gbmV3IG9iamVjdFxuICAgICAgICAgICAgY29uc3Qgb3B0cyA9IHsgLi4ucGFjayB9O1xuICAgICAgICAgICAgLy8gc2V0IGFzeW5jIHRvIHRydWUgaWYgaXQgd2FzIHNldCB0byB0cnVlIGJlZm9yZVxuICAgICAgICAgICAgb3B0cy5hc3luYyA9IHRoaXMuZGVmYXVsdHMuYXN5bmMgfHwgb3B0cy5hc3luYyB8fCBmYWxzZTtcbiAgICAgICAgICAgIC8vID09LS0gUGFyc2UgXCJhZGRvblwiIGV4dGVuc2lvbnMgLS09PSAvL1xuICAgICAgICAgICAgaWYgKHBhY2suZXh0ZW5zaW9ucykge1xuICAgICAgICAgICAgICAgIHBhY2suZXh0ZW5zaW9ucy5mb3JFYWNoKChleHQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFleHQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHRlbnNpb24gbmFtZSByZXF1aXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgncmVuZGVyZXInIGluIGV4dCkgeyAvLyBSZW5kZXJlciBleHRlbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2UmVuZGVyZXIgPSBleHRlbnNpb25zLnJlbmRlcmVyc1tleHQubmFtZV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJldlJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSBleHRlbnNpb24gd2l0aCBmdW5jIHRvIHJ1biBuZXcgZXh0ZW5zaW9uIGJ1dCBmYWxsIGJhY2sgaWYgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnJlbmRlcmVyc1tleHQubmFtZV0gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmV0ID0gZXh0LnJlbmRlcmVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gcHJldlJlbmRlcmVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMucmVuZGVyZXJzW2V4dC5uYW1lXSA9IGV4dC5yZW5kZXJlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3Rva2VuaXplcicgaW4gZXh0KSB7IC8vIFRva2VuaXplciBFeHRlbnNpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV4dC5sZXZlbCB8fCAoZXh0LmxldmVsICE9PSAnYmxvY2snICYmIGV4dC5sZXZlbCAhPT0gJ2lubGluZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZXh0ZW5zaW9uIGxldmVsIG11c3QgYmUgJ2Jsb2NrJyBvciAnaW5saW5lJ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4dExldmVsID0gZXh0ZW5zaW9uc1tleHQubGV2ZWxdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dExldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0TGV2ZWwudW5zaGlmdChleHQudG9rZW5pemVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnNbZXh0LmxldmVsXSA9IFtleHQudG9rZW5pemVyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHQuc3RhcnQpIHsgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHN0YXJ0IG9mIHRva2VuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dC5sZXZlbCA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9ucy5zdGFydEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0QmxvY2sucHVzaChleHQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5zdGFydEJsb2NrID0gW2V4dC5zdGFydF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZXh0LmxldmVsID09PSAnaW5saW5lJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9ucy5zdGFydElubGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5zdGFydElubGluZS5wdXNoKGV4dC5zdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0SW5saW5lID0gW2V4dC5zdGFydF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCdjaGlsZFRva2VucycgaW4gZXh0ICYmIGV4dC5jaGlsZFRva2VucykgeyAvLyBDaGlsZCB0b2tlbnMgdG8gYmUgdmlzaXRlZCBieSB3YWxrVG9rZW5zXG4gICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zLmNoaWxkVG9rZW5zW2V4dC5uYW1lXSA9IGV4dC5jaGlsZFRva2VucztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIG9wdHMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyA9PS0tIFBhcnNlIFwib3ZlcndyaXRlXCIgZXh0ZW5zaW9ucyAtLT09IC8vXG4gICAgICAgICAgICBpZiAocGFjay5yZW5kZXJlcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbmRlcmVyID0gdGhpcy5kZWZhdWx0cy5yZW5kZXJlciB8fCBuZXcgX1JlbmRlcmVyKHRoaXMuZGVmYXVsdHMpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBwYWNrLnJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHByb3AgaW4gcmVuZGVyZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlbmRlcmVyICcke3Byb3B9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ29wdGlvbnMnLCAncGFyc2VyJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBvcHRpb25zIHByb3BlcnR5XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJlclByb3AgPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJlckZ1bmMgPSBwYWNrLnJlbmRlcmVyW3JlbmRlcmVyUHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZSZW5kZXJlciA9IHJlbmRlcmVyW3JlbmRlcmVyUHJvcF07XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgcmVuZGVyZXIgd2l0aCBmdW5jIHRvIHJ1biBleHRlbnNpb24sIGJ1dCBmYWxsIGJhY2sgaWYgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgcmVuZGVyZXJbcmVuZGVyZXJQcm9wXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmV0ID0gcmVuZGVyZXJGdW5jLmFwcGx5KHJlbmRlcmVyLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0ID0gcHJldlJlbmRlcmVyLmFwcGx5KHJlbmRlcmVyLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdHMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYWNrLnRva2VuaXplcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuaXplciA9IHRoaXMuZGVmYXVsdHMudG9rZW5pemVyIHx8IG5ldyBfVG9rZW5pemVyKHRoaXMuZGVmYXVsdHMpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBwYWNrLnRva2VuaXplcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShwcm9wIGluIHRva2VuaXplcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgdG9rZW5pemVyICcke3Byb3B9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ29wdGlvbnMnLCAncnVsZXMnLCAnbGV4ZXInXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIG9wdGlvbnMsIHJ1bGVzLCBhbmQgbGV4ZXIgcHJvcGVydGllc1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9rZW5pemVyUHJvcCA9IHByb3A7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuaXplckZ1bmMgPSBwYWNrLnRva2VuaXplclt0b2tlbml6ZXJQcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldlRva2VuaXplciA9IHRva2VuaXplclt0b2tlbml6ZXJQcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0b2tlbml6ZXIgd2l0aCBmdW5jIHRvIHJ1biBleHRlbnNpb24sIGJ1dCBmYWxsIGJhY2sgaWYgZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBjYW5ub3QgdHlwZSB0b2tlbml6ZXIgZnVuY3Rpb24gZHluYW1pY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5pemVyW3Rva2VuaXplclByb3BdID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXQgPSB0b2tlbml6ZXJGdW5jLmFwcGx5KHRva2VuaXplciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IHByZXZUb2tlbml6ZXIuYXBwbHkodG9rZW5pemVyLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdHMudG9rZW5pemVyID0gdG9rZW5pemVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gPT0tLSBQYXJzZSBIb29rcyBleHRlbnNpb25zIC0tPT0gLy9cbiAgICAgICAgICAgIGlmIChwYWNrLmhvb2tzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaG9va3MgPSB0aGlzLmRlZmF1bHRzLmhvb2tzIHx8IG5ldyBfSG9va3MoKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gcGFjay5ob29rcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShwcm9wIGluIGhvb2tzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBob29rICcke3Byb3B9JyBkb2VzIG5vdCBleGlzdGApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChbJ29wdGlvbnMnLCAnYmxvY2snXS5pbmNsdWRlcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWdub3JlIG9wdGlvbnMgYW5kIGJsb2NrIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhvb2tzUHJvcCA9IHByb3A7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhvb2tzRnVuYyA9IHBhY2suaG9va3NbaG9va3NQcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldkhvb2sgPSBob29rc1tob29rc1Byb3BdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX0hvb2tzLnBhc3NUaHJvdWdoSG9va3MuaGFzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGNhbm5vdCB0eXBlIGhvb2sgZnVuY3Rpb24gZHluYW1pY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tzW2hvb2tzUHJvcF0gPSAoYXJnKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdHMuYXN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShob29rc0Z1bmMuY2FsbChob29rcywgYXJnKSkudGhlbihyZXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZIb29rLmNhbGwoaG9va3MsIHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBob29rc0Z1bmMuY2FsbChob29rcywgYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldkhvb2suY2FsbChob29rcywgcmV0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIGNhbm5vdCB0eXBlIGhvb2sgZnVuY3Rpb24gZHluYW1pY2FsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tzW2hvb2tzUHJvcF0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXQgPSBob29rc0Z1bmMuYXBwbHkoaG9va3MsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IHByZXZIb29rLmFwcGx5KGhvb2tzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb3B0cy5ob29rcyA9IGhvb2tzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gPT0tLSBQYXJzZSBXYWxrVG9rZW5zIGV4dGVuc2lvbnMgLS09PSAvL1xuICAgICAgICAgICAgaWYgKHBhY2sud2Fsa1Rva2Vucykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHdhbGtUb2tlbnMgPSB0aGlzLmRlZmF1bHRzLndhbGtUb2tlbnM7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFja1dhbGt0b2tlbnMgPSBwYWNrLndhbGtUb2tlbnM7XG4gICAgICAgICAgICAgICAgb3B0cy53YWxrVG9rZW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzLnB1c2gocGFja1dhbGt0b2tlbnMuY2FsbCh0aGlzLCB0b2tlbikpO1xuICAgICAgICAgICAgICAgICAgICBpZiAod2Fsa1Rva2Vucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdCh3YWxrVG9rZW5zLmNhbGwodGhpcywgdG9rZW4pKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRzID0geyAuLi50aGlzLmRlZmF1bHRzLCAuLi5vcHRzIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc2V0T3B0aW9ucyhvcHQpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHsgLi4udGhpcy5kZWZhdWx0cywgLi4ub3B0IH07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBsZXhlcihzcmMsIG9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIF9MZXhlci5sZXgoc3JjLCBvcHRpb25zID8/IHRoaXMuZGVmYXVsdHMpO1xuICAgIH1cbiAgICBwYXJzZXIodG9rZW5zLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfUGFyc2VyLnBhcnNlKHRva2Vucywgb3B0aW9ucyA/PyB0aGlzLmRlZmF1bHRzKTtcbiAgICB9XG4gICAgcGFyc2VNYXJrZG93bihibG9ja1R5cGUpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICAgICAgY29uc3QgcGFyc2UgPSAoc3JjLCBvcHRpb25zKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnT3B0ID0geyAuLi5vcHRpb25zIH07XG4gICAgICAgICAgICBjb25zdCBvcHQgPSB7IC4uLnRoaXMuZGVmYXVsdHMsIC4uLm9yaWdPcHQgfTtcbiAgICAgICAgICAgIGNvbnN0IHRocm93RXJyb3IgPSB0aGlzLm9uRXJyb3IoISFvcHQuc2lsZW50LCAhIW9wdC5hc3luYyk7XG4gICAgICAgICAgICAvLyB0aHJvdyBlcnJvciBpZiBhbiBleHRlbnNpb24gc2V0IGFzeW5jIHRvIHRydWUgYnV0IHBhcnNlIHdhcyBjYWxsZWQgd2l0aCBhc3luYzogZmFsc2VcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRzLmFzeW5jID09PSB0cnVlICYmIG9yaWdPcHQuYXN5bmMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IobmV3IEVycm9yKCdtYXJrZWQoKTogVGhlIGFzeW5jIG9wdGlvbiB3YXMgc2V0IHRvIHRydWUgYnkgYW4gZXh0ZW5zaW9uLiBSZW1vdmUgYXN5bmM6IGZhbHNlIGZyb20gdGhlIHBhcnNlIG9wdGlvbnMgb2JqZWN0IHRvIHJldHVybiBhIFByb21pc2UuJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IgaW4gY2FzZSBvZiBub24gc3RyaW5nIGlucHV0XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNyYyA9PT0gJ3VuZGVmaW5lZCcgfHwgc3JjID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IobmV3IEVycm9yKCdtYXJrZWQoKTogaW5wdXQgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZCBvciBudWxsJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmMgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IobmV3IEVycm9yKCdtYXJrZWQoKTogaW5wdXQgcGFyYW1ldGVyIGlzIG9mIHR5cGUgJ1xuICAgICAgICAgICAgICAgICAgICArIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzcmMpICsgJywgc3RyaW5nIGV4cGVjdGVkJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdC5ob29rcykge1xuICAgICAgICAgICAgICAgIG9wdC5ob29rcy5vcHRpb25zID0gb3B0O1xuICAgICAgICAgICAgICAgIG9wdC5ob29rcy5ibG9jayA9IGJsb2NrVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGxleGVyID0gb3B0Lmhvb2tzID8gb3B0Lmhvb2tzLnByb3ZpZGVMZXhlcigpIDogKGJsb2NrVHlwZSA/IF9MZXhlci5sZXggOiBfTGV4ZXIubGV4SW5saW5lKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlciA9IG9wdC5ob29rcyA/IG9wdC5ob29rcy5wcm92aWRlUGFyc2VyKCkgOiAoYmxvY2tUeXBlID8gX1BhcnNlci5wYXJzZSA6IF9QYXJzZXIucGFyc2VJbmxpbmUpO1xuICAgICAgICAgICAgaWYgKG9wdC5hc3luYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUob3B0Lmhvb2tzID8gb3B0Lmhvb2tzLnByZXByb2Nlc3Moc3JjKSA6IHNyYylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc3JjID0+IGxleGVyKHNyYywgb3B0KSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odG9rZW5zID0+IG9wdC5ob29rcyA/IG9wdC5ob29rcy5wcm9jZXNzQWxsVG9rZW5zKHRva2VucykgOiB0b2tlbnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHRva2VucyA9PiBvcHQud2Fsa1Rva2VucyA/IFByb21pc2UuYWxsKHRoaXMud2Fsa1Rva2Vucyh0b2tlbnMsIG9wdC53YWxrVG9rZW5zKSkudGhlbigoKSA9PiB0b2tlbnMpIDogdG9rZW5zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbih0b2tlbnMgPT4gcGFyc2VyKHRva2Vucywgb3B0KSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oaHRtbCA9PiBvcHQuaG9va3MgPyBvcHQuaG9va3MucG9zdHByb2Nlc3MoaHRtbCkgOiBodG1sKVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2godGhyb3dFcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGlmIChvcHQuaG9va3MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3JjID0gb3B0Lmhvb2tzLnByZXByb2Nlc3Moc3JjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHRva2VucyA9IGxleGVyKHNyYywgb3B0KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0Lmhvb2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VucyA9IG9wdC5ob29rcy5wcm9jZXNzQWxsVG9rZW5zKHRva2Vucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChvcHQud2Fsa1Rva2Vucykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndhbGtUb2tlbnModG9rZW5zLCBvcHQud2Fsa1Rva2Vucyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBodG1sID0gcGFyc2VyKHRva2Vucywgb3B0KTtcbiAgICAgICAgICAgICAgICBpZiAob3B0Lmhvb2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIGh0bWwgPSBvcHQuaG9va3MucG9zdHByb2Nlc3MoaHRtbCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBodG1sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhyb3dFcnJvcihlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHBhcnNlO1xuICAgIH1cbiAgICBvbkVycm9yKHNpbGVudCwgYXN5bmMpIHtcbiAgICAgICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICAgICAgICBlLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWFya2VkanMvbWFya2VkLic7XG4gICAgICAgICAgICBpZiAoc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gJzxwPkFuIGVycm9yIG9jY3VycmVkOjwvcD48cHJlPidcbiAgICAgICAgICAgICAgICAgICAgKyBlc2NhcGUoZS5tZXNzYWdlICsgJycsIHRydWUpXG4gICAgICAgICAgICAgICAgICAgICsgJzwvcHJlPic7XG4gICAgICAgICAgICAgICAgaWYgKGFzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1zZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5jb25zdCBtYXJrZWRJbnN0YW5jZSA9IG5ldyBNYXJrZWQoKTtcbmZ1bmN0aW9uIG1hcmtlZChzcmMsIG9wdCkge1xuICAgIHJldHVybiBtYXJrZWRJbnN0YW5jZS5wYXJzZShzcmMsIG9wdCk7XG59XG4vKipcbiAqIFNldHMgdGhlIGRlZmF1bHQgb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnNcbiAqL1xubWFya2VkLm9wdGlvbnMgPVxuICAgIG1hcmtlZC5zZXRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgbWFya2VkSW5zdGFuY2Uuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgbWFya2VkLmRlZmF1bHRzID0gbWFya2VkSW5zdGFuY2UuZGVmYXVsdHM7XG4gICAgICAgIGNoYW5nZURlZmF1bHRzKG1hcmtlZC5kZWZhdWx0cyk7XG4gICAgICAgIHJldHVybiBtYXJrZWQ7XG4gICAgfTtcbi8qKlxuICogR2V0cyB0aGUgb3JpZ2luYWwgbWFya2VkIGRlZmF1bHQgb3B0aW9ucy5cbiAqL1xubWFya2VkLmdldERlZmF1bHRzID0gX2dldERlZmF1bHRzO1xubWFya2VkLmRlZmF1bHRzID0gX2RlZmF1bHRzO1xuLyoqXG4gKiBVc2UgRXh0ZW5zaW9uXG4gKi9cbm1hcmtlZC51c2UgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIG1hcmtlZEluc3RhbmNlLnVzZSguLi5hcmdzKTtcbiAgICBtYXJrZWQuZGVmYXVsdHMgPSBtYXJrZWRJbnN0YW5jZS5kZWZhdWx0cztcbiAgICBjaGFuZ2VEZWZhdWx0cyhtYXJrZWQuZGVmYXVsdHMpO1xuICAgIHJldHVybiBtYXJrZWQ7XG59O1xuLyoqXG4gKiBSdW4gY2FsbGJhY2sgZm9yIGV2ZXJ5IHRva2VuXG4gKi9cbm1hcmtlZC53YWxrVG9rZW5zID0gZnVuY3Rpb24gKHRva2VucywgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gbWFya2VkSW5zdGFuY2Uud2Fsa1Rva2Vucyh0b2tlbnMsIGNhbGxiYWNrKTtcbn07XG4vKipcbiAqIENvbXBpbGVzIG1hcmtkb3duIHRvIEhUTUwgd2l0aG91dCBlbmNsb3NpbmcgYHBgIHRhZy5cbiAqXG4gKiBAcGFyYW0gc3JjIFN0cmluZyBvZiBtYXJrZG93biBzb3VyY2UgdG8gYmUgY29tcGlsZWRcbiAqIEBwYXJhbSBvcHRpb25zIEhhc2ggb2Ygb3B0aW9uc1xuICogQHJldHVybiBTdHJpbmcgb2YgY29tcGlsZWQgSFRNTFxuICovXG5tYXJrZWQucGFyc2VJbmxpbmUgPSBtYXJrZWRJbnN0YW5jZS5wYXJzZUlubGluZTtcbi8qKlxuICogRXhwb3NlXG4gKi9cbm1hcmtlZC5QYXJzZXIgPSBfUGFyc2VyO1xubWFya2VkLnBhcnNlciA9IF9QYXJzZXIucGFyc2U7XG5tYXJrZWQuUmVuZGVyZXIgPSBfUmVuZGVyZXI7XG5tYXJrZWQuVGV4dFJlbmRlcmVyID0gX1RleHRSZW5kZXJlcjtcbm1hcmtlZC5MZXhlciA9IF9MZXhlcjtcbm1hcmtlZC5sZXhlciA9IF9MZXhlci5sZXg7XG5tYXJrZWQuVG9rZW5pemVyID0gX1Rva2VuaXplcjtcbm1hcmtlZC5Ib29rcyA9IF9Ib29rcztcbm1hcmtlZC5wYXJzZSA9IG1hcmtlZDtcbmNvbnN0IG9wdGlvbnMgPSBtYXJrZWQub3B0aW9ucztcbmNvbnN0IHNldE9wdGlvbnMgPSBtYXJrZWQuc2V0T3B0aW9ucztcbmNvbnN0IHVzZSA9IG1hcmtlZC51c2U7XG5jb25zdCB3YWxrVG9rZW5zID0gbWFya2VkLndhbGtUb2tlbnM7XG5jb25zdCBwYXJzZUlubGluZSA9IG1hcmtlZC5wYXJzZUlubGluZTtcbmNvbnN0IHBhcnNlID0gbWFya2VkO1xuY29uc3QgcGFyc2VyID0gX1BhcnNlci5wYXJzZTtcbmNvbnN0IGxleGVyID0gX0xleGVyLmxleDtcblxuZXhwb3J0IHsgX0hvb2tzIGFzIEhvb2tzLCBfTGV4ZXIgYXMgTGV4ZXIsIE1hcmtlZCwgX1BhcnNlciBhcyBQYXJzZXIsIF9SZW5kZXJlciBhcyBSZW5kZXJlciwgX1RleHRSZW5kZXJlciBhcyBUZXh0UmVuZGVyZXIsIF9Ub2tlbml6ZXIgYXMgVG9rZW5pemVyLCBfZGVmYXVsdHMgYXMgZGVmYXVsdHMsIF9nZXREZWZhdWx0cyBhcyBnZXREZWZhdWx0cywgbGV4ZXIsIG1hcmtlZCwgb3B0aW9ucywgcGFyc2UsIHBhcnNlSW5saW5lLCBwYXJzZXIsIHNldE9wdGlvbnMsIHVzZSwgd2Fsa1Rva2VucyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFya2VkLmVzbS5qcy5tYXBcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBtYXJrZWQgfSBmcm9tICdtYXJrZWQnO1xuY29uc3QgTWFya2Rvd25FZGl0b3IgPSAoeyByZWNvcmQsIHByb3BlcnR5LCBvbkNoYW5nZSB9KSA9PiB7XG4gICAgY29uc3QgW3Nob3dQcmV2aWV3LCBzZXRTaG93UHJldmlld10gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgICBjb25zdCBbc2hvd0hlbHAsIHNldFNob3dIZWxwXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBwcmV2aWV3UmVmID0gdXNlUmVmKG51bGwpO1xuICAgIGNvbnN0IHZhbHVlID0gcmVjb3JkLnBhcmFtc1twcm9wZXJ0eS5wYXRoXSB8fCAnJztcbiAgICBjb25zdCBpbnNlcnRTeW50YXggPSAoc3ludGF4LCBwbGFjZWhvbGRlciA9ICcnKSA9PiB7XG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcmtkb3duLXRleHRhcmVhJyk7XG4gICAgICAgIGlmICghdGV4dGFyZWEpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gdGV4dGFyZWEuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRleHRhcmVhLnNlbGVjdGlvbkVuZDtcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWRUZXh0ID0gdmFsdWUuc3Vic3RyaW5nKHN0YXJ0LCBlbmQpIHx8IHBsYWNlaG9sZGVyO1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSAnJztcbiAgICAgICAgc3dpdGNoIChzeW50YXgpIHtcbiAgICAgICAgICAgIGNhc2UgJ2JvbGQnOlxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIHN0YXJ0KSArIGAqKiR7c2VsZWN0ZWRUZXh0fSoqYCArIHZhbHVlLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnaXRhbGljJzpcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyBgKiR7c2VsZWN0ZWRUZXh0fSpgICsgdmFsdWUuc3Vic3RyaW5nKGVuZCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgb25DaGFuZ2UocHJvcGVydHkucGF0aCwgbmV3VmFsdWUpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRleHRhcmVhLmZvY3VzKCk7XG4gICAgICAgICAgICB0ZXh0YXJlYS5zZXRTZWxlY3Rpb25SYW5nZShzdGFydCArIHN5bnRheC5sZW5ndGggKyAyLCBlbmQgKyBzeW50YXgubGVuZ3RoICsgMik7XG4gICAgICAgIH0sIDApO1xuICAgIH07XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKCFwcmV2aWV3UmVmLmN1cnJlbnQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0gcHJldmlld1JlZi5jdXJyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKTtcbiAgICAgICAgZWxlbWVudHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbDtcbiAgICAgICAgICAgIGNvbnN0IHRhZyA9IGVsZW1lbnQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgc3dpdGNoICh0YWcpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdoMSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnaDInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2gzJzpcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncCc6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luID0gJzhweCAwJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3Ryb25nJzpcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5mb250V2VpZ2h0ID0gJ2JvbGQnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdlbSc6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZm9udFN0eWxlID0gJ2l0YWxpYyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2NvZGUnOlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNlZWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzJweCA0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndWwnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ29sJzpcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gJzIwcHgnO1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICc4cHgnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdsaSc6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luQm90dG9tID0gJzRweCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Jsb2NrcXVvdGUnOlxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc0cHggc29saWQgI2NjYycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjNjY2JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW46ICc4cHggMCcsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgW3ZhbHVlLCBzaG93UHJldmlld10pO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMjRweCcgfSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgZmxleDogMSB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgc3R5bGU6IHsgbWFyZ2luQm90dG9tOiAnMTJweCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzhweCcgfSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyB0eXBlOiAnYnV0dG9uJywgb25DbGljazogKCkgPT4gaW5zZXJ0U3ludGF4KCdib2xkJywgJ9C20LjRgNC90YvQuScpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJcIiwgbnVsbCwgXCJCXCIpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgdHlwZTogJ2J1dHRvbicsIG9uQ2xpY2s6ICgpID0+IGluc2VydFN5bnRheCgnaXRhbGljJywgJ9C60YPRgNGB0LjQsicpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlcIiwgbnVsbCwgXCJJXCIpKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgdHlwZTogJ2J1dHRvbicsIG9uQ2xpY2s6ICgpID0+IHNldFNob3dQcmV2aWV3KChwcmV2KSA9PiAhcHJldiksIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnNnB4IDEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjMDA3OEMxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgfSB9LCBzaG93UHJldmlldyA/ICfQodC60YDRi9GC0Ywg0L/RgNC10LLRjNGOJyA6ICfQn9C+0LrQsNC30LDRgtGMINC/0YDQtdCy0YzRjicpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBvbk1vdXNlRW50ZXI6ICgpID0+IHNldFNob3dIZWxwKHRydWUpLCBvbk1vdXNlTGVhdmU6ICgpID0+IHNldFNob3dIZWxwKGZhbHNlKSwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFwiP1wiLFxuICAgICAgICAgICAgICAgICAgICBzaG93SGVscCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMjRweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyNmZmYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2NjJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMjgwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDhweCByZ2JhKDAsMCwwLDAuMSknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpJbmRleDogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInN0cm9uZ1wiLCBudWxsLCBcIk1hcmtkb3duOlwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBzdHlsZTogeyBwYWRkaW5nTGVmdDogJzE2cHgnLCBtYXJnaW46IDAgfSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcIioqXFx1MDQzNlxcdTA0MzhcXHUwNDQwXFx1MDQzRFxcdTA0NEJcXHUwNDM5KipcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFxcdTIxOTIgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJcXHUwNDM2XFx1MDQzOFxcdTA0NDBcXHUwNDNEXFx1MDQ0QlxcdTA0MzlcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcIipcXHUwNDNBXFx1MDQ0M1xcdTA0NDBcXHUwNDQxXFx1MDQzOFxcdTA0MzIqXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcXHUyMTkyIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZW1cIiwgbnVsbCwgXCJcXHUwNDNBXFx1MDQ0M1xcdTA0NDBcXHUwNDQxXFx1MDQzOFxcdTA0MzJcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcIiMgXFx1MDQxN1xcdTA0MzBcXHUwNDMzXFx1MDQzRVxcdTA0M0JcXHUwNDNFXFx1MDQzMlxcdTA0M0VcXHUwNDNBXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcXHUyMTkyIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYlwiLCBudWxsLCBcIlxcdTA0MTdcXHUwNDMwXFx1MDQzM1xcdTA0M0VcXHUwNDNCXFx1MDQzRVxcdTA0MzJcXHUwNDNFXFx1MDQzQVwiKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiLSBcXHUwNDIxXFx1MDQzRlxcdTA0MzhcXHUwNDQxXFx1MDQzRVxcdTA0M0FcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFxcdTIxOTIgXFx1MjAyMiBcXHUwNDREXFx1MDQzQlxcdTA0MzVcXHUwNDNDXFx1MDQzNVxcdTA0M0RcXHUwNDQyXCIpKSkpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIiwgeyBpZDogJ21hcmtkb3duLXRleHRhcmVhJywgdmFsdWU6IHZhbHVlLCBvbkNoYW5nZTogKGUpID0+IG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIGUudGFyZ2V0LnZhbHVlKSwgcm93czogMTIsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdtb25vc3BhY2UnLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2NjJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gICAgICAgICAgICAgICAgICAgIHJlc2l6ZTogJ25vbmUnLFxuICAgICAgICAgICAgICAgIH0gfSkpLFxuICAgICAgICBzaG93UHJldmlldyAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHJlZjogcHJldmlld1JlZiwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2NjJyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTJweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZhZmFmYScsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgICAgICBtYXhIZWlnaHQ6ICczMDBweCcsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAnMS41JyxcbiAgICAgICAgICAgIH0sIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogbWFya2VkLnBhcnNlKHZhbHVlIHx8ICcnKSB9IH0pKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IE1hcmtkb3duRWRpdG9yO1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgRGFzaGJvYXJkUm91dGUgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL2Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkUm91dGUgPSBEYXNoYm9hcmRSb3V0ZVxuaW1wb3J0IFVwbG9hZFBob3RvIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy91cGxvYWQtcGhvdG8nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZFBob3RvID0gVXBsb2FkUGhvdG9cbmltcG9ydCBJbWFnZVByZXZpZXcgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL2ltYWdlLXByZXZpZXcnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkltYWdlUHJldmlldyA9IEltYWdlUHJldmlld1xuaW1wb3J0IFVwbG9hZE11bHRpcGxlUGhvdG9zIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy91cGxvYWQtbXVsdGlwbGUtcGhvdG9zJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRNdWx0aXBsZVBob3RvcyA9IFVwbG9hZE11bHRpcGxlUGhvdG9zXG5pbXBvcnQgSW1hZ2VzUHJldmlldyBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvaW1hZ2VzLXByZXZpZXcnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkltYWdlc1ByZXZpZXcgPSBJbWFnZXNQcmV2aWV3XG5pbXBvcnQgTWFya2Rvd25FZGl0b3IgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL21hcmtkb3duLWVkaXRvcidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTWFya2Rvd25FZGl0b3IgPSBNYXJrZG93bkVkaXRvciJdLCJuYW1lcyI6WyJEYXNoYm9hcmQiLCJ1c2VFZmZlY3QiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJVcGxvYWRQaG90byIsIm9uQ2hhbmdlIiwicHJvcGVydHkiLCJyZWNvcmQiLCJwaG90b1BhdGgiLCJwYXJhbXMiLCJuYW1lIiwiaGFuZGxlQ2hhbmdlIiwiZXZlbnQiLCJmaWxlIiwidGFyZ2V0IiwiZmlsZXMiLCJhbGxvd2VkVHlwZXMiLCJpbmNsdWRlcyIsInR5cGUiLCJhbGVydCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsImRhdGEiLCJqc29uIiwiZmlsZVBhdGgiLCJoYW5kbGVSZW1vdmUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwiZ2FwIiwibWFyZ2luVG9wIiwibWFyZ2luQm90dG9tIiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0IiwiZm9udEZhbWlseSIsInBhZGRpbmciLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwidGV4dEFsaWduIiwiY3Vyc29yIiwiaWQiLCJhY2NlcHQiLCJhbGlnbkl0ZW1zIiwicG9zaXRpb24iLCJ3aWR0aCIsImhlaWdodCIsIm92ZXJmbG93IiwiYm94U2hhZG93Iiwic3JjIiwiYWx0Iiwib2JqZWN0Rml0Iiwib25DbGljayIsInRvcCIsInJpZ2h0IiwiY29sb3IiLCJmb250V2VpZ2h0IiwidGl0bGUiLCJJbWFnZVByZXZpZXciLCJwYXRoIiwiVXBsb2FkTXVsdGlwbGVQaG90b3MiLCJwcm9wcyIsImV4aXN0aW5nUGhvdG9zIiwiT2JqZWN0IiwiZW50cmllcyIsImZvckVhY2giLCJrZXkiLCJ2YWx1ZSIsInN0YXJ0c1dpdGgiLCJwdXNoIiwicGhvdG9zIiwic2V0UGhvdG9zIiwidXNlU3RhdGUiLCJBcnJheSIsImZyb20iLCJ0b3RhbFBob3RvcyIsImxlbmd0aCIsIm5ld1Bob3RvUGF0aHMiLCJpc1ZhbGlkIiwidXBkYXRlZFBob3RvcyIsInNsaWNlIiwiaW5kZXgiLCJpIiwiaW5kZXhUb1JlbW92ZSIsInVwZGF0ZWQiLCJmaWx0ZXIiLCJfIiwibXVsdGlwbGUiLCJmbGV4V3JhcCIsIm1hcCIsInBob3RvIiwiSW1hZ2VzUHJldmlldyIsIk1hcmtkb3duRWRpdG9yIiwic2hvd1ByZXZpZXciLCJzZXRTaG93UHJldmlldyIsInNob3dIZWxwIiwic2V0U2hvd0hlbHAiLCJwcmV2aWV3UmVmIiwidXNlUmVmIiwiaW5zZXJ0U3ludGF4Iiwic3ludGF4IiwicGxhY2Vob2xkZXIiLCJ0ZXh0YXJlYSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzdGFydCIsInNlbGVjdGlvblN0YXJ0IiwiZW5kIiwic2VsZWN0aW9uRW5kIiwic2VsZWN0ZWRUZXh0Iiwic3Vic3RyaW5nIiwibmV3VmFsdWUiLCJzZXRUaW1lb3V0IiwiZm9jdXMiLCJzZXRTZWxlY3Rpb25SYW5nZSIsImN1cnJlbnQiLCJlbGVtZW50cyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbCIsImVsZW1lbnQiLCJ0YWciLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJhc3NpZ24iLCJtYXJnaW4iLCJmb250U3R5bGUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJtYXJnaW5MZWZ0IiwiYm9yZGVyTGVmdCIsInBhZGRpbmdMZWZ0IiwiZmxleCIsInByZXYiLCJvbk1vdXNlRW50ZXIiLCJvbk1vdXNlTGVhdmUiLCJ6SW5kZXgiLCJlIiwicm93cyIsImJveFNpemluZyIsInJlc2l6ZSIsInJlZiIsIm92ZXJmbG93WSIsIm1heEhlaWdodCIsImRhbmdlcm91c2x5U2V0SW5uZXJIVE1MIiwiX19odG1sIiwibWFya2VkIiwicGFyc2UiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJEYXNoYm9hcmRSb3V0ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUNBLE1BQU1BLFNBQVMsR0FBR0EsTUFBTTtJQUNwQkMsRUFBQUEsZUFBUyxDQUFDLE1BQU07SUFDWkMsSUFBQUEsTUFBTSxDQUFDQyxRQUFRLENBQUNDLElBQUksR0FBRywwQkFBMEI7SUFDckQsR0FBQyxDQUFDO0lBQ0YsRUFBQSxPQUFPLElBQUk7SUFDZixDQUFDOztJQ0xELE1BQU1D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QWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLGdCQUFnQjtJQUNoQjtJQUNBO0lBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNoRCxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDckQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLGdCQUFnQjtJQUNoQjtJQUNBO0lBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUN4RCxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDckQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLGdCQUFnQjtJQUNoQjtJQUNBO0lBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNsRCxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDckQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLGdCQUFnQjtJQUNoQjtJQUNBO0lBQ0EsWUFBWSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNsRCxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDckQsZ0JBQWdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ2xDLGdCQUFnQjtJQUNoQjtJQUNBO0lB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QyxjQUFjLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDekIsUUFBUSxPQUFPLEdBQUcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUM3QztJQUNBO0lBQ0E7SUFDQTtJQUNBLElBQUksTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDdkIsUUFBUSxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwRTtJQUNBLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDbkIsUUFBUSxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM1RDtJQUNBLElBQUksUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDdkIsUUFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ25EO0lBQ0EsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFO0lBQ2QsUUFBUSxPQUFPLE1BQU07SUFDckI7SUFDQSxJQUFJLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFO0lBQ3BCLFFBQVEsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUQ7SUFDQSxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7SUFDbEMsUUFBUSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDcEQsUUFBUSxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQ3hDLFFBQVEsSUFBSSxTQUFT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
