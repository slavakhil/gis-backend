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
        const response = await fetch('/api/file', {
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
          const response = await fetch('/api/file', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvZGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL3VwbG9hZC1waG90by5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9pbWFnZS1wcmV2aWV3LmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL3VwbG9hZC1tdWx0aXBsZS1waG90b3MuanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvaW1hZ2VzLXByZXZpZXcuanMiLCIuLi9ub2RlX21vZHVsZXMvbWFya2VkL2xpYi9tYXJrZWQuZXNtLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL21hcmtkb3duLWVkaXRvci5qcyIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvYWRtaW4vcmVzb3VyY2VzL9Cd0L7QstC+0YHRgtC4JztcbiAgICB9KTtcbiAgICByZXR1cm4gbnVsbDtcbn07XG5leHBvcnQgeyBEYXNoYm9hcmQgfTtcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5jb25zdCBVcGxvYWRQaG90byA9ICh7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkIH0pID0+IHtcbiAgICBjb25zdCBwaG90b1BhdGggPSByZWNvcmQucGFyYW1zW3Byb3BlcnR5Lm5hbWVdO1xuICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlID0gZXZlbnQudGFyZ2V0LmZpbGVzPy5bMF07XG4gICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgYWxsb3dlZFR5cGVzID0gWydpbWFnZS9wbmcnLCAnaW1hZ2UvanBlZycsICdpbWFnZS9qcGcnXTtcbiAgICAgICAgaWYgKCFhbGxvd2VkVHlwZXMuaW5jbHVkZXMoZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgYWxlcnQoJ9Cg0LDQt9GA0LXRiNC10L3RiyDRgtC+0LvRjNC60L4g0YTQsNC50LvRiyBQTkcsIEpQRyDQuNC70LggSlBFRycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2ZpbGUnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaWYgKGRhdGEuZmlsZVBhdGgpIHtcbiAgICAgICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsIGRhdGEuZmlsZVBhdGgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsICcnKTtcbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzFlbScsIG1hcmdpblRvcDogJzFlbScgfSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCcsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgIH0gfSwgXCJcXHUwNDE4XFx1MDQzN1xcdTA0M0VcXHUwNDMxXFx1MDQ0MFxcdTA0MzBcXHUwNDM2XFx1MDQzNVxcdTA0M0RcXHUwNDM4XFx1MDQ0RlwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggZGFzaGVkICNjY2MnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgXCJcXHUwNDFEXFx1MDQzMFxcdTA0MzZcXHUwNDNDXFx1MDQzOFxcdTA0NDJcXHUwNDM1LCBcXHUwNDQ3XFx1MDQ0MlxcdTA0M0VcXHUwNDMxXFx1MDQ0QiBcXHUwNDM3XFx1MDQzMFxcdTA0MzNcXHUwNDQwXFx1MDQ0M1xcdTA0MzdcXHUwNDM4XFx1MDQ0MlxcdTA0NEMgXFx1MDQ0NFxcdTA0M0VcXHUwNDQyXFx1MDQzRSAoUE5HLCBKUEcsIEpQRUcpXCIsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyBpZDogJ2ZpbGUtdXBsb2FkJywgdHlwZTogJ2ZpbGUnLCBhY2NlcHQ6ICcucG5nLC5qcGcsLmpwZWcnLCBvbkNoYW5nZTogaGFuZGxlQ2hhbmdlLCBzdHlsZTogeyBkaXNwbGF5OiAnbm9uZScgfSB9KSksXG4gICAgICAgIHBob3RvUGF0aCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMWVtJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzE0MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTQwcHgnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgNHB4IDhweCByZ2JhKDAsMCwwLDAuMTUpJyxcbiAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogcGhvdG9QYXRoLCBhbHQ6ICd1cGxvYWRlZCcsIHN0eWxlOiB7IHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnLCBvYmplY3RGaXQ6ICdjb3ZlcicgfSB9KSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgb25DbGljazogaGFuZGxlUmVtb3ZlLCB0eXBlOiAnYnV0dG9uJywgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmY0ZDRmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcyNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzI0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sIHRpdGxlOiAnXFx1MDQyM1xcdTA0MzRcXHUwNDMwXFx1MDQzQlxcdTA0MzhcXHUwNDQyXFx1MDQ0QyBcXHUwNDQ0XFx1MDQzRVxcdTA0NDJcXHUwNDNFJyB9LCBcIlxcdTAwRDdcIikpKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBVcGxvYWRQaG90bztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5jb25zdCBJbWFnZVByZXZpZXcgPSAoeyByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHJlY29yZC5wYXJhbXNbcHJvcGVydHkucGF0aF07XG4gICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJcXHUwNDFEXFx1MDQzNVxcdTA0NDIgXFx1MDQzOFxcdTA0MzdcXHUwNDNFXFx1MDQzMVxcdTA0NDBcXHUwNDMwXFx1MDQzNlxcdTA0MzVcXHUwNDNEXFx1MDQzOFxcdTA0NEZcIik7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogZmlsZVBhdGgsIGFsdDogJ2FzZGZhc2RmJywgc3R5bGU6IHsgd2lkdGg6ICcxNTBweCcsIGhlaWdodDogJzE1MHB4Jywgb2JqZWN0Rml0OiAnY292ZXInLCBib3JkZXJSYWRpdXM6IDggfSB9KSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgSW1hZ2VQcmV2aWV3O1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuY29uc3QgVXBsb2FkTXVsdGlwbGVQaG90b3MgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkIH0gPSBwcm9wcztcbiAgICBjb25zdCBleGlzdGluZ1Bob3RvcyA9IFtdO1xuICAgIE9iamVjdC5lbnRyaWVzKHJlY29yZC5wYXJhbXMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoa2V5LnN0YXJ0c1dpdGgoYCR7cHJvcGVydHkubmFtZX0uYCkgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgZXhpc3RpbmdQaG90b3MucHVzaCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBbcGhvdG9zLCBzZXRQaG90b3NdID0gdXNlU3RhdGUoZXhpc3RpbmdQaG90b3MpO1xuICAgIGNvbnN0IGhhbmRsZUNoYW5nZSA9IGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBmaWxlcyA9IEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LmZpbGVzIHx8IFtdKTtcbiAgICAgICAgY29uc3QgdG90YWxQaG90b3MgPSBwaG90b3MubGVuZ3RoICsgZmlsZXMubGVuZ3RoO1xuICAgICAgICBpZiAodG90YWxQaG90b3MgPiAzKSB7XG4gICAgICAgICAgICBhbGVydCgn0JzQvtC20L3QviDQt9Cw0LPRgNGD0LfQuNGC0Ywg0LzQsNC60YHQuNC80YPQvCAzINGE0L7RgtC+0LPRgNCw0YTQuNC4LicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5ld1Bob3RvUGF0aHMgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gWydpbWFnZS9wbmcnLCAnaW1hZ2UvanBlZycsICdpbWFnZS9qcGcnXS5pbmNsdWRlcyhmaWxlLnR5cGUpO1xuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ9Cc0L7QttC90L4g0LfQsNCz0YDRg9C20LDRgtGMINGC0L7Qu9GM0LrQviDQuNC30L7QsdGA0LDQttC10L3QuNGPOiBwbmcsIGpwZywganBlZycpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgICAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9maWxlJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgaWYgKGRhdGEuZmlsZVBhdGgpIHtcbiAgICAgICAgICAgICAgICBuZXdQaG90b1BhdGhzLnB1c2goZGF0YS5maWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdXBkYXRlZFBob3RvcyA9IFsuLi5waG90b3MsIC4uLm5ld1Bob3RvUGF0aHNdLnNsaWNlKDAsIDMpO1xuICAgICAgICBzZXRQaG90b3ModXBkYXRlZFBob3Rvcyk7XG4gICAgICAgIHVwZGF0ZWRQaG90b3MuZm9yRWFjaCgocGF0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIG9uQ2hhbmdlKGAke3Byb3BlcnR5Lm5hbWV9LiR7aW5kZXh9YCwgcGF0aCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gdXBkYXRlZFBob3Rvcy5sZW5ndGg7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBvbkNoYW5nZShgJHtwcm9wZXJ0eS5uYW1lfS4ke2l9YCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVJlbW92ZSA9IChpbmRleFRvUmVtb3ZlKSA9PiB7XG4gICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBwaG90b3MuZmlsdGVyKChfLCBpbmRleCkgPT4gaW5kZXggIT09IGluZGV4VG9SZW1vdmUpO1xuICAgICAgICBzZXRQaG90b3ModXBkYXRlZCk7XG4gICAgICAgIHVwZGF0ZWQuZm9yRWFjaCgocGF0aCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIG9uQ2hhbmdlKGAke3Byb3BlcnR5Lm5hbWV9LiR7aW5kZXh9YCwgcGF0aCk7XG4gICAgICAgIH0pO1xuICAgICAgICBmb3IgKGxldCBpID0gdXBkYXRlZC5sZW5ndGg7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICBvbkNoYW5nZShgJHtwcm9wZXJ0eS5uYW1lfS4ke2l9YCwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzFlbScsIG1hcmdpblRvcDogJzFlbScgfSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzhweCcsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEycHgnLFxuICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUm9ib3RvLCBzYW5zLXNlcmlmJyxcbiAgICAgICAgICAgIH0gfSwgXCJcXHUwNDE4XFx1MDQzN1xcdTA0M0VcXHUwNDMxXFx1MDQ0MFxcdTA0MzBcXHUwNDM2XFx1MDQzNVxcdTA0M0RcXHUwNDM4XFx1MDQ0RlwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHsgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggZGFzaGVkICNjY2MnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzhweCcsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgXCJcXHUwNDE3XFx1MDQzMFxcdTA0MzNcXHUwNDQwXFx1MDQ0M1xcdTA0MzdcXHUwNDM4XFx1MDQ0MlxcdTA0NEMgXFx1MDQ0NFxcdTA0M0VcXHUwNDQyXFx1MDQzRVxcdTA0MzNcXHUwNDQwXFx1MDQzMFxcdTA0NDRcXHUwNDM4XFx1MDQzOCAoXFx1MDQzQ1xcdTA0MzBcXHUwNDNBXFx1MDQ0MS4gMylcIixcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6ICdmaWxlJywgYWNjZXB0OiAnaW1hZ2UvcG5nLGltYWdlL2pwZWcsaW1hZ2UvanBnJywgbXVsdGlwbGU6IHRydWUsIG9uQ2hhbmdlOiBoYW5kbGVDaGFuZ2UsIHN0eWxlOiB7IGRpc3BsYXk6ICdub25lJyB9IH0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnMTJweCcsIGZsZXhXcmFwOiAnd3JhcCcgfSB9LCBwaG90b3MubWFwKChwaG90bywgaW5kZXgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsga2V5OiBpbmRleCwgc3R5bGU6IHsgcG9zaXRpb246ICdyZWxhdGl2ZScgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogcGhvdG8sIGFsdDogYNCk0L7RgtC+ICR7aW5kZXggKyAxfWAsIHN0eWxlOiB7IHdpZHRoOiAnMTIwcHgnLCBoZWlnaHQ6ICcxMjBweCcsIG9iamVjdEZpdDogJ2NvdmVyJywgYm9yZGVyUmFkaXVzOiAnOHB4JyB9IH0pLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IHR5cGU6ICdidXR0b24nLCBvbkNsaWNrOiAoKSA9PiBoYW5kbGVSZW1vdmUoaW5kZXgpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgdG9wOiAnLTZweCcsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnLTZweCcsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICdyZWQnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMjBweCcsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJzIwcHgnLFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICB9IH0sIFwiXFx1MDBEN1wiKSkpKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBVcGxvYWRNdWx0aXBsZVBob3RvcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5jb25zdCBJbWFnZXNQcmV2aWV3ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZWNvcmQsIHByb3BlcnR5IH0gPSBwcm9wcztcbiAgICBjb25zdCBwaG90b3MgPSBbXTtcbiAgICBPYmplY3QuZW50cmllcyhyZWNvcmQucGFyYW1zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKGtleS5zdGFydHNXaXRoKGAke3Byb3BlcnR5Lm5hbWV9LmApICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBob3Rvcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAnNXB4JywgZmxleFdyYXA6ICd3cmFwJyB9IH0sIHBob3Rvcy5tYXAoKHNyYywgaW5kZXgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsga2V5OiBpbmRleCwgc3JjOiBzcmMsIGFsdDogYHBob3RvLSR7aW5kZXh9YCwgc3R5bGU6IHsgd2lkdGg6IDEyMCwgaGVpZ2h0OiAxMjAsIG9iamVjdEZpdDogJ2NvdmVyJywgYm9yZGVyOiAnMXB4IHNvbGlkICNjY2MnIH0gfSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEltYWdlc1ByZXZpZXc7XG4iLCIvKipcbiAqIG1hcmtlZCB2MTUuMC44IC0gYSBtYXJrZG93biBwYXJzZXJcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDI1LCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmtlZGpzL21hcmtlZFxuICovXG5cbi8qKlxuICogRE8gTk9UIEVESVQgVEhJUyBGSUxFXG4gKiBUaGUgY29kZSBpbiB0aGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGZyb20gZmlsZXMgaW4gLi9zcmMvXG4gKi9cblxuLyoqXG4gKiBHZXRzIHRoZSBvcmlnaW5hbCBtYXJrZWQgZGVmYXVsdCBvcHRpb25zLlxuICovXG5mdW5jdGlvbiBfZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXN5bmM6IGZhbHNlLFxuICAgICAgICBicmVha3M6IGZhbHNlLFxuICAgICAgICBleHRlbnNpb25zOiBudWxsLFxuICAgICAgICBnZm06IHRydWUsXG4gICAgICAgIGhvb2tzOiBudWxsLFxuICAgICAgICBwZWRhbnRpYzogZmFsc2UsXG4gICAgICAgIHJlbmRlcmVyOiBudWxsLFxuICAgICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgICB0b2tlbml6ZXI6IG51bGwsXG4gICAgICAgIHdhbGtUb2tlbnM6IG51bGwsXG4gICAgfTtcbn1cbmxldCBfZGVmYXVsdHMgPSBfZ2V0RGVmYXVsdHMoKTtcbmZ1bmN0aW9uIGNoYW5nZURlZmF1bHRzKG5ld0RlZmF1bHRzKSB7XG4gICAgX2RlZmF1bHRzID0gbmV3RGVmYXVsdHM7XG59XG5cbmNvbnN0IG5vb3BUZXN0ID0geyBleGVjOiAoKSA9PiBudWxsIH07XG5mdW5jdGlvbiBlZGl0KHJlZ2V4LCBvcHQgPSAnJykge1xuICAgIGxldCBzb3VyY2UgPSB0eXBlb2YgcmVnZXggPT09ICdzdHJpbmcnID8gcmVnZXggOiByZWdleC5zb3VyY2U7XG4gICAgY29uc3Qgb2JqID0ge1xuICAgICAgICByZXBsYWNlOiAobmFtZSwgdmFsKSA9PiB7XG4gICAgICAgICAgICBsZXQgdmFsU291cmNlID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyB2YWwgOiB2YWwuc291cmNlO1xuICAgICAgICAgICAgdmFsU291cmNlID0gdmFsU291cmNlLnJlcGxhY2Uob3RoZXIuY2FyZXQsICckMScpO1xuICAgICAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UobmFtZSwgdmFsU291cmNlKTtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFJlZ2V4OiAoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChzb3VyY2UsIG9wdCk7XG4gICAgICAgIH0sXG4gICAgfTtcbiAgICByZXR1cm4gb2JqO1xufVxuY29uc3Qgb3RoZXIgPSB7XG4gICAgY29kZVJlbW92ZUluZGVudDogL14oPzogezEsNH18IHswLDN9XFx0KS9nbSxcbiAgICBvdXRwdXRMaW5rUmVwbGFjZTogL1xcXFwoW1xcW1xcXV0pL2csXG4gICAgaW5kZW50Q29kZUNvbXBlbnNhdGlvbjogL14oXFxzKykoPzpgYGApLyxcbiAgICBiZWdpbm5pbmdTcGFjZTogL15cXHMrLyxcbiAgICBlbmRpbmdIYXNoOiAvIyQvLFxuICAgIHN0YXJ0aW5nU3BhY2VDaGFyOiAvXiAvLFxuICAgIGVuZGluZ1NwYWNlQ2hhcjogLyAkLyxcbiAgICBub25TcGFjZUNoYXI6IC9bXiBdLyxcbiAgICBuZXdMaW5lQ2hhckdsb2JhbDogL1xcbi9nLFxuICAgIHRhYkNoYXJHbG9iYWw6IC9cXHQvZyxcbiAgICBtdWx0aXBsZVNwYWNlR2xvYmFsOiAvXFxzKy9nLFxuICAgIGJsYW5rTGluZTogL15bIFxcdF0qJC8sXG4gICAgZG91YmxlQmxhbmtMaW5lOiAvXFxuWyBcXHRdKlxcblsgXFx0XSokLyxcbiAgICBibG9ja3F1b3RlU3RhcnQ6IC9eIHswLDN9Pi8sXG4gICAgYmxvY2txdW90ZVNldGV4dFJlcGxhY2U6IC9cXG4gezAsM30oKD86PSt8LSspICopKD89XFxufCQpL2csXG4gICAgYmxvY2txdW90ZVNldGV4dFJlcGxhY2UyOiAvXiB7MCwzfT5bIFxcdF0/L2dtLFxuICAgIGxpc3RSZXBsYWNlVGFiczogL15cXHQrLyxcbiAgICBsaXN0UmVwbGFjZU5lc3Rpbmc6IC9eIHsxLDR9KD89KCB7NH0pKlteIF0pL2csXG4gICAgbGlzdElzVGFzazogL15cXFtbIHhYXVxcXSAvLFxuICAgIGxpc3RSZXBsYWNlVGFzazogL15cXFtbIHhYXVxcXSArLyxcbiAgICBhbnlMaW5lOiAvXFxuLipcXG4vLFxuICAgIGhyZWZCcmFja2V0czogL148KC4qKT4kLyxcbiAgICB0YWJsZURlbGltaXRlcjogL1s6fF0vLFxuICAgIHRhYmxlQWxpZ25DaGFyczogL15cXHx8XFx8ICokL2csXG4gICAgdGFibGVSb3dCbGFua0xpbmU6IC9cXG5bIFxcdF0qJC8sXG4gICAgdGFibGVBbGlnblJpZ2h0OiAvXiAqLSs6ICokLyxcbiAgICB0YWJsZUFsaWduQ2VudGVyOiAvXiAqOi0rOiAqJC8sXG4gICAgdGFibGVBbGlnbkxlZnQ6IC9eICo6LSsgKiQvLFxuICAgIHN0YXJ0QVRhZzogL148YSAvaSxcbiAgICBlbmRBVGFnOiAvXjxcXC9hPi9pLFxuICAgIHN0YXJ0UHJlU2NyaXB0VGFnOiAvXjwocHJlfGNvZGV8a2JkfHNjcmlwdCkoXFxzfD4pL2ksXG4gICAgZW5kUHJlU2NyaXB0VGFnOiAvXjxcXC8ocHJlfGNvZGV8a2JkfHNjcmlwdCkoXFxzfD4pL2ksXG4gICAgc3RhcnRBbmdsZUJyYWNrZXQ6IC9ePC8sXG4gICAgZW5kQW5nbGVCcmFja2V0OiAvPiQvLFxuICAgIHBlZGFudGljSHJlZlRpdGxlOiAvXihbXidcIl0qW15cXHNdKVxccysoWydcIl0pKC4qKVxcMi8sXG4gICAgdW5pY29kZUFscGhhTnVtZXJpYzogL1tcXHB7TH1cXHB7Tn1dL3UsXG4gICAgZXNjYXBlVGVzdDogL1smPD5cIiddLyxcbiAgICBlc2NhcGVSZXBsYWNlOiAvWyY8PlwiJ10vZyxcbiAgICBlc2NhcGVUZXN0Tm9FbmNvZGU6IC9bPD5cIiddfCYoPyEoI1xcZHsxLDd9fCNbWHhdW2EtZkEtRjAtOV17MSw2fXxcXHcrKTspLyxcbiAgICBlc2NhcGVSZXBsYWNlTm9FbmNvZGU6IC9bPD5cIiddfCYoPyEoI1xcZHsxLDd9fCNbWHhdW2EtZkEtRjAtOV17MSw2fXxcXHcrKTspL2csXG4gICAgdW5lc2NhcGVUZXN0OiAvJigjKD86XFxkKyl8KD86I3hbMC05QS1GYS1mXSspfCg/OlxcdyspKTs/L2lnLFxuICAgIGNhcmV0OiAvKF58W15cXFtdKVxcXi9nLFxuICAgIHBlcmNlbnREZWNvZGU6IC8lMjUvZyxcbiAgICBmaW5kUGlwZTogL1xcfC9nLFxuICAgIHNwbGl0UGlwZTogLyBcXHwvLFxuICAgIHNsYXNoUGlwZTogL1xcXFxcXHwvZyxcbiAgICBjYXJyaWFnZVJldHVybjogL1xcclxcbnxcXHIvZyxcbiAgICBzcGFjZUxpbmU6IC9eICskL2dtLFxuICAgIG5vdFNwYWNlU3RhcnQ6IC9eXFxTKi8sXG4gICAgZW5kaW5nTmV3bGluZTogL1xcbiQvLFxuICAgIGxpc3RJdGVtUmVnZXg6IChidWxsKSA9PiBuZXcgUmVnRXhwKGBeKCB7MCwzfSR7YnVsbH0pKCg/OltcXHQgXVteXFxcXG5dKik/KD86XFxcXG58JCkpYCksXG4gICAgbmV4dEJ1bGxldFJlZ2V4OiAoaW5kZW50KSA9PiBuZXcgUmVnRXhwKGBeIHswLCR7TWF0aC5taW4oMywgaW5kZW50IC0gMSl9fSg/OlsqKy1dfFxcXFxkezEsOX1bLildKSgoPzpbIFxcdF1bXlxcXFxuXSopPyg/OlxcXFxufCQpKWApLFxuICAgIGhyUmVnZXg6IChpbmRlbnQpID0+IG5ldyBSZWdFeHAoYF4gezAsJHtNYXRoLm1pbigzLCBpbmRlbnQgLSAxKX19KCg/Oi0gKil7Myx9fCg/Ol8gKil7Myx9fCg/OlxcXFwqICopezMsfSkoPzpcXFxcbit8JClgKSxcbiAgICBmZW5jZXNCZWdpblJlZ2V4OiAoaW5kZW50KSA9PiBuZXcgUmVnRXhwKGBeIHswLCR7TWF0aC5taW4oMywgaW5kZW50IC0gMSl9fSg/OlxcYFxcYFxcYHx+fn4pYCksXG4gICAgaGVhZGluZ0JlZ2luUmVnZXg6IChpbmRlbnQpID0+IG5ldyBSZWdFeHAoYF4gezAsJHtNYXRoLm1pbigzLCBpbmRlbnQgLSAxKX19I2ApLFxuICAgIGh0bWxCZWdpblJlZ2V4OiAoaW5kZW50KSA9PiBuZXcgUmVnRXhwKGBeIHswLCR7TWF0aC5taW4oMywgaW5kZW50IC0gMSl9fTwoPzpbYS16XS4qPnwhLS0pYCwgJ2knKSxcbn07XG4vKipcbiAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAqL1xuY29uc3QgbmV3bGluZSA9IC9eKD86WyBcXHRdKig/OlxcbnwkKSkrLztcbmNvbnN0IGJsb2NrQ29kZSA9IC9eKCg/OiB7NH18IHswLDN9XFx0KVteXFxuXSsoPzpcXG4oPzpbIFxcdF0qKD86XFxufCQpKSopPykrLztcbmNvbnN0IGZlbmNlcyA9IC9eIHswLDN9KGB7Myx9KD89W15gXFxuXSooPzpcXG58JCkpfH57Myx9KShbXlxcbl0qKSg/OlxcbnwkKSg/OnwoW1xcc1xcU10qPykoPzpcXG58JCkpKD86IHswLDN9XFwxW35gXSogKig/PVxcbnwkKXwkKS87XG5jb25zdCBociA9IC9eIHswLDN9KCg/Oi1bXFx0IF0qKXszLH18KD86X1sgXFx0XSopezMsfXwoPzpcXCpbIFxcdF0qKXszLH0pKD86XFxuK3wkKS87XG5jb25zdCBoZWFkaW5nID0gL14gezAsM30oI3sxLDZ9KSg/PVxcc3wkKSguKikoPzpcXG4rfCQpLztcbmNvbnN0IGJ1bGxldCA9IC8oPzpbKistXXxcXGR7MSw5fVsuKV0pLztcbmNvbnN0IGxoZWFkaW5nQ29yZSA9IC9eKD8hYnVsbCB8YmxvY2tDb2RlfGZlbmNlc3xibG9ja3F1b3RlfGhlYWRpbmd8aHRtbHx0YWJsZSkoKD86LnxcXG4oPyFcXHMqP1xcbnxidWxsIHxibG9ja0NvZGV8ZmVuY2VzfGJsb2NrcXVvdGV8aGVhZGluZ3xodG1sfHRhYmxlKSkrPylcXG4gezAsM30oPSt8LSspICooPzpcXG4rfCQpLztcbmNvbnN0IGxoZWFkaW5nID0gZWRpdChsaGVhZGluZ0NvcmUpXG4gICAgLnJlcGxhY2UoL2J1bGwvZywgYnVsbGV0KSAvLyBsaXN0cyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2Jsb2NrQ29kZS9nLCAvKD86IHs0fXwgezAsM31cXHQpLykgLy8gaW5kZW50ZWQgY29kZSBibG9ja3MgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9mZW5jZXMvZywgLyB7MCwzfSg/OmB7Myx9fH57Myx9KS8pIC8vIGZlbmNlZCBjb2RlIGJsb2NrcyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2Jsb2NrcXVvdGUvZywgLyB7MCwzfT4vKSAvLyBibG9ja3F1b3RlIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvaGVhZGluZy9nLCAvIHswLDN9I3sxLDZ9LykgLy8gQVRYIGhlYWRpbmcgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9odG1sL2csIC8gezAsM308W15cXG4+XSs+XFxuLykgLy8gYmxvY2sgaHRtbCBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL1xcfHRhYmxlL2csICcnKSAvLyB0YWJsZSBub3QgaW4gY29tbW9ubWFya1xuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgbGhlYWRpbmdHZm0gPSBlZGl0KGxoZWFkaW5nQ29yZSlcbiAgICAucmVwbGFjZSgvYnVsbC9nLCBidWxsZXQpIC8vIGxpc3RzIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvYmxvY2tDb2RlL2csIC8oPzogezR9fCB7MCwzfVxcdCkvKSAvLyBpbmRlbnRlZCBjb2RlIGJsb2NrcyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2ZlbmNlcy9nLCAvIHswLDN9KD86YHszLH18fnszLH0pLykgLy8gZmVuY2VkIGNvZGUgYmxvY2tzIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvYmxvY2txdW90ZS9nLCAvIHswLDN9Pi8pIC8vIGJsb2NrcXVvdGUgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKC9oZWFkaW5nL2csIC8gezAsM30jezEsNn0vKSAvLyBBVFggaGVhZGluZyBjYW4gaW50ZXJydXB0XG4gICAgLnJlcGxhY2UoL2h0bWwvZywgLyB7MCwzfTxbXlxcbj5dKz5cXG4vKSAvLyBibG9jayBodG1sIGNhbiBpbnRlcnJ1cHRcbiAgICAucmVwbGFjZSgvdGFibGUvZywgLyB7MCwzfVxcfD8oPzpbOlxcLSBdKlxcfCkrW1xcOlxcLSBdKlxcbi8pIC8vIHRhYmxlIGNhbiBpbnRlcnJ1cHRcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IF9wYXJhZ3JhcGggPSAvXihbXlxcbl0rKD86XFxuKD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfGZlbmNlc3xsaXN0fGh0bWx8dGFibGV8ICtcXG4pW15cXG5dKykqKS87XG5jb25zdCBibG9ja1RleHQgPSAvXlteXFxuXSsvO1xuY29uc3QgX2Jsb2NrTGFiZWwgPSAvKD8hXFxzKlxcXSkoPzpcXFxcLnxbXlxcW1xcXVxcXFxdKSsvO1xuY29uc3QgZGVmID0gZWRpdCgvXiB7MCwzfVxcWyhsYWJlbClcXF06ICooPzpcXG5bIFxcdF0qKT8oW148XFxzXVteXFxzXSp8PC4qPz4pKD86KD86ICsoPzpcXG5bIFxcdF0qKT98ICpcXG5bIFxcdF0qKSh0aXRsZSkpPyAqKD86XFxuK3wkKS8pXG4gICAgLnJlcGxhY2UoJ2xhYmVsJywgX2Jsb2NrTGFiZWwpXG4gICAgLnJlcGxhY2UoJ3RpdGxlJywgLyg/OlwiKD86XFxcXFwiP3xbXlwiXFxcXF0pKlwifCdbXidcXG5dKig/OlxcblteJ1xcbl0rKSpcXG4/J3xcXChbXigpXSpcXCkpLylcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IGxpc3QgPSBlZGl0KC9eKCB7MCwzfWJ1bGwpKFsgXFx0XVteXFxuXSs/KT8oPzpcXG58JCkvKVxuICAgIC5yZXBsYWNlKC9idWxsL2csIGJ1bGxldClcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IF90YWcgPSAnYWRkcmVzc3xhcnRpY2xlfGFzaWRlfGJhc2V8YmFzZWZvbnR8YmxvY2txdW90ZXxib2R5fGNhcHRpb24nXG4gICAgKyAnfGNlbnRlcnxjb2x8Y29sZ3JvdXB8ZGR8ZGV0YWlsc3xkaWFsb2d8ZGlyfGRpdnxkbHxkdHxmaWVsZHNldHxmaWdjYXB0aW9uJ1xuICAgICsgJ3xmaWd1cmV8Zm9vdGVyfGZvcm18ZnJhbWV8ZnJhbWVzZXR8aFsxLTZdfGhlYWR8aGVhZGVyfGhyfGh0bWx8aWZyYW1lJ1xuICAgICsgJ3xsZWdlbmR8bGl8bGlua3xtYWlufG1lbnV8bWVudWl0ZW18bWV0YXxuYXZ8bm9mcmFtZXN8b2x8b3B0Z3JvdXB8b3B0aW9uJ1xuICAgICsgJ3xwfHBhcmFtfHNlYXJjaHxzZWN0aW9ufHN1bW1hcnl8dGFibGV8dGJvZHl8dGR8dGZvb3R8dGh8dGhlYWR8dGl0bGUnXG4gICAgKyAnfHRyfHRyYWNrfHVsJztcbmNvbnN0IF9jb21tZW50ID0gLzwhLS0oPzotPz58W1xcc1xcU10qPyg/Oi0tPnwkKSkvO1xuY29uc3QgaHRtbCA9IGVkaXQoJ14gezAsM30oPzonIC8vIG9wdGlvbmFsIGluZGVudGF0aW9uXG4gICAgKyAnPChzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhKVtcXFxccz5dW1xcXFxzXFxcXFNdKj8oPzo8L1xcXFwxPlteXFxcXG5dKlxcXFxuK3wkKScgLy8gKDEpXG4gICAgKyAnfGNvbW1lbnRbXlxcXFxuXSooXFxcXG4rfCQpJyAvLyAoMilcbiAgICArICd8PFxcXFw/W1xcXFxzXFxcXFNdKj8oPzpcXFxcPz5cXFxcbip8JCknIC8vICgzKVxuICAgICsgJ3w8IVtBLVpdW1xcXFxzXFxcXFNdKj8oPzo+XFxcXG4qfCQpJyAvLyAoNClcbiAgICArICd8PCFcXFxcW0NEQVRBXFxcXFtbXFxcXHNcXFxcU10qPyg/OlxcXFxdXFxcXF0+XFxcXG4qfCQpJyAvLyAoNSlcbiAgICArICd8PC8/KHRhZykoPzogK3xcXFxcbnwvPz4pW1xcXFxzXFxcXFNdKj8oPzooPzpcXFxcblsgXFx0XSopK1xcXFxufCQpJyAvLyAoNilcbiAgICArICd8PCg/IXNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWEpKFthLXpdW1xcXFx3LV0qKSg/OmF0dHJpYnV0ZSkqPyAqLz8+KD89WyBcXFxcdF0qKD86XFxcXG58JCkpW1xcXFxzXFxcXFNdKj8oPzooPzpcXFxcblsgXFx0XSopK1xcXFxufCQpJyAvLyAoNykgb3BlbiB0YWdcbiAgICArICd8PC8oPyFzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhKVthLXpdW1xcXFx3LV0qXFxcXHMqPig/PVsgXFxcXHRdKig/OlxcXFxufCQpKVtcXFxcc1xcXFxTXSo/KD86KD86XFxcXG5bIFxcdF0qKStcXFxcbnwkKScgLy8gKDcpIGNsb3NpbmcgdGFnXG4gICAgKyAnKScsICdpJylcbiAgICAucmVwbGFjZSgnY29tbWVudCcsIF9jb21tZW50KVxuICAgIC5yZXBsYWNlKCd0YWcnLCBfdGFnKVxuICAgIC5yZXBsYWNlKCdhdHRyaWJ1dGUnLCAvICtbYS16QS1aOl9dW1xcdy46LV0qKD86ICo9ICpcIlteXCJcXG5dKlwifCAqPSAqJ1teJ1xcbl0qJ3wgKj0gKlteXFxzXCInPTw+YF0rKT8vKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgcGFyYWdyYXBoID0gZWRpdChfcGFyYWdyYXBoKVxuICAgIC5yZXBsYWNlKCdocicsIGhyKVxuICAgIC5yZXBsYWNlKCdoZWFkaW5nJywgJyB7MCwzfSN7MSw2fSg/OlxcXFxzfCQpJylcbiAgICAucmVwbGFjZSgnfGxoZWFkaW5nJywgJycpIC8vIHNldGV4dCBoZWFkaW5ncyBkb24ndCBpbnRlcnJ1cHQgY29tbW9ubWFyayBwYXJhZ3JhcGhzXG4gICAgLnJlcGxhY2UoJ3x0YWJsZScsICcnKVxuICAgIC5yZXBsYWNlKCdibG9ja3F1b3RlJywgJyB7MCwzfT4nKVxuICAgIC5yZXBsYWNlKCdmZW5jZXMnLCAnIHswLDN9KD86YHszLH0oPz1bXmBcXFxcbl0qXFxcXG4pfH57Myx9KVteXFxcXG5dKlxcXFxuJylcbiAgICAucmVwbGFjZSgnbGlzdCcsICcgezAsM30oPzpbKistXXwxWy4pXSkgJykgLy8gb25seSBsaXN0cyBzdGFydGluZyBmcm9tIDEgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKCdodG1sJywgJzwvPyg/OnRhZykoPzogK3xcXFxcbnwvPz4pfDwoPzpzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhfCEtLSknKVxuICAgIC5yZXBsYWNlKCd0YWcnLCBfdGFnKSAvLyBwYXJzIGNhbiBiZSBpbnRlcnJ1cHRlZCBieSB0eXBlICg2KSBodG1sIGJsb2Nrc1xuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgYmxvY2txdW90ZSA9IGVkaXQoL14oIHswLDN9PiA/KHBhcmFncmFwaHxbXlxcbl0qKSg/OlxcbnwkKSkrLylcbiAgICAucmVwbGFjZSgncGFyYWdyYXBoJywgcGFyYWdyYXBoKVxuICAgIC5nZXRSZWdleCgpO1xuLyoqXG4gKiBOb3JtYWwgQmxvY2sgR3JhbW1hclxuICovXG5jb25zdCBibG9ja05vcm1hbCA9IHtcbiAgICBibG9ja3F1b3RlLFxuICAgIGNvZGU6IGJsb2NrQ29kZSxcbiAgICBkZWYsXG4gICAgZmVuY2VzLFxuICAgIGhlYWRpbmcsXG4gICAgaHIsXG4gICAgaHRtbCxcbiAgICBsaGVhZGluZyxcbiAgICBsaXN0LFxuICAgIG5ld2xpbmUsXG4gICAgcGFyYWdyYXBoLFxuICAgIHRhYmxlOiBub29wVGVzdCxcbiAgICB0ZXh0OiBibG9ja1RleHQsXG59O1xuLyoqXG4gKiBHRk0gQmxvY2sgR3JhbW1hclxuICovXG5jb25zdCBnZm1UYWJsZSA9IGVkaXQoJ14gKihbXlxcXFxuIF0uKilcXFxcbicgLy8gSGVhZGVyXG4gICAgKyAnIHswLDN9KCg/OlxcXFx8ICopPzo/LSs6PyAqKD86XFxcXHwgKjo/LSs6PyAqKSooPzpcXFxcfCAqKT8pJyAvLyBBbGlnblxuICAgICsgJyg/OlxcXFxuKCg/Oig/ISAqXFxcXG58aHJ8aGVhZGluZ3xibG9ja3F1b3RlfGNvZGV8ZmVuY2VzfGxpc3R8aHRtbCkuKig/OlxcXFxufCQpKSopXFxcXG4qfCQpJykgLy8gQ2VsbHNcbiAgICAucmVwbGFjZSgnaHInLCBocilcbiAgICAucmVwbGFjZSgnaGVhZGluZycsICcgezAsM30jezEsNn0oPzpcXFxcc3wkKScpXG4gICAgLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpXG4gICAgLnJlcGxhY2UoJ2NvZGUnLCAnKD86IHs0fXwgezAsM31cXHQpW15cXFxcbl0nKVxuICAgIC5yZXBsYWNlKCdmZW5jZXMnLCAnIHswLDN9KD86YHszLH0oPz1bXmBcXFxcbl0qXFxcXG4pfH57Myx9KVteXFxcXG5dKlxcXFxuJylcbiAgICAucmVwbGFjZSgnbGlzdCcsICcgezAsM30oPzpbKistXXwxWy4pXSkgJykgLy8gb25seSBsaXN0cyBzdGFydGluZyBmcm9tIDEgY2FuIGludGVycnVwdFxuICAgIC5yZXBsYWNlKCdodG1sJywgJzwvPyg/OnRhZykoPzogK3xcXFxcbnwvPz4pfDwoPzpzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhfCEtLSknKVxuICAgIC5yZXBsYWNlKCd0YWcnLCBfdGFnKSAvLyB0YWJsZXMgY2FuIGJlIGludGVycnVwdGVkIGJ5IHR5cGUgKDYpIGh0bWwgYmxvY2tzXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBibG9ja0dmbSA9IHtcbiAgICAuLi5ibG9ja05vcm1hbCxcbiAgICBsaGVhZGluZzogbGhlYWRpbmdHZm0sXG4gICAgdGFibGU6IGdmbVRhYmxlLFxuICAgIHBhcmFncmFwaDogZWRpdChfcGFyYWdyYXBoKVxuICAgICAgICAucmVwbGFjZSgnaHInLCBocilcbiAgICAgICAgLnJlcGxhY2UoJ2hlYWRpbmcnLCAnIHswLDN9I3sxLDZ9KD86XFxcXHN8JCknKVxuICAgICAgICAucmVwbGFjZSgnfGxoZWFkaW5nJywgJycpIC8vIHNldGV4dCBoZWFkaW5ncyBkb24ndCBpbnRlcnJ1cHQgY29tbW9ubWFyayBwYXJhZ3JhcGhzXG4gICAgICAgIC5yZXBsYWNlKCd0YWJsZScsIGdmbVRhYmxlKSAvLyBpbnRlcnJ1cHQgcGFyYWdyYXBocyB3aXRoIHRhYmxlXG4gICAgICAgIC5yZXBsYWNlKCdibG9ja3F1b3RlJywgJyB7MCwzfT4nKVxuICAgICAgICAucmVwbGFjZSgnZmVuY2VzJywgJyB7MCwzfSg/OmB7Myx9KD89W15gXFxcXG5dKlxcXFxuKXx+ezMsfSlbXlxcXFxuXSpcXFxcbicpXG4gICAgICAgIC5yZXBsYWNlKCdsaXN0JywgJyB7MCwzfSg/OlsqKy1dfDFbLildKSAnKSAvLyBvbmx5IGxpc3RzIHN0YXJ0aW5nIGZyb20gMSBjYW4gaW50ZXJydXB0XG4gICAgICAgIC5yZXBsYWNlKCdodG1sJywgJzwvPyg/OnRhZykoPzogK3xcXFxcbnwvPz4pfDwoPzpzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhfCEtLSknKVxuICAgICAgICAucmVwbGFjZSgndGFnJywgX3RhZykgLy8gcGFycyBjYW4gYmUgaW50ZXJydXB0ZWQgYnkgdHlwZSAoNikgaHRtbCBibG9ja3NcbiAgICAgICAgLmdldFJlZ2V4KCksXG59O1xuLyoqXG4gKiBQZWRhbnRpYyBncmFtbWFyIChvcmlnaW5hbCBKb2huIEdydWJlcidzIGxvb3NlIG1hcmtkb3duIHNwZWNpZmljYXRpb24pXG4gKi9cbmNvbnN0IGJsb2NrUGVkYW50aWMgPSB7XG4gICAgLi4uYmxvY2tOb3JtYWwsXG4gICAgaHRtbDogZWRpdCgnXiAqKD86Y29tbWVudCAqKD86XFxcXG58XFxcXHMqJCknXG4gICAgICAgICsgJ3w8KHRhZylbXFxcXHNcXFxcU10rPzwvXFxcXDE+ICooPzpcXFxcbnsyLH18XFxcXHMqJCknIC8vIGNsb3NlZCB0YWdcbiAgICAgICAgKyAnfDx0YWcoPzpcIlteXCJdKlwifFxcJ1teXFwnXSpcXCd8XFxcXHNbXlxcJ1wiLz5cXFxcc10qKSo/Lz8+ICooPzpcXFxcbnsyLH18XFxcXHMqJCkpJylcbiAgICAgICAgLnJlcGxhY2UoJ2NvbW1lbnQnLCBfY29tbWVudClcbiAgICAgICAgLnJlcGxhY2UoL3RhZy9nLCAnKD8hKD86J1xuICAgICAgICArICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZXx2YXJ8c2FtcHxrYmR8c3ViJ1xuICAgICAgICArICd8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKSdcbiAgICAgICAgKyAnXFxcXGIpXFxcXHcrKD8hOnxbXlxcXFx3XFxcXHNAXSpAKVxcXFxiJylcbiAgICAgICAgLmdldFJlZ2V4KCksXG4gICAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogKyhbXCIoXVteXFxuXStbXCIpXSkpPyAqKD86XFxuK3wkKS8sXG4gICAgaGVhZGluZzogL14oI3sxLDZ9KSguKikoPzpcXG4rfCQpLyxcbiAgICBmZW5jZXM6IG5vb3BUZXN0LCAvLyBmZW5jZXMgbm90IHN1cHBvcnRlZFxuICAgIGxoZWFkaW5nOiAvXiguKz8pXFxuIHswLDN9KD0rfC0rKSAqKD86XFxuK3wkKS8sXG4gICAgcGFyYWdyYXBoOiBlZGl0KF9wYXJhZ3JhcGgpXG4gICAgICAgIC5yZXBsYWNlKCdocicsIGhyKVxuICAgICAgICAucmVwbGFjZSgnaGVhZGluZycsICcgKiN7MSw2fSAqW15cXG5dJylcbiAgICAgICAgLnJlcGxhY2UoJ2xoZWFkaW5nJywgbGhlYWRpbmcpXG4gICAgICAgIC5yZXBsYWNlKCd8dGFibGUnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpXG4gICAgICAgIC5yZXBsYWNlKCd8ZmVuY2VzJywgJycpXG4gICAgICAgIC5yZXBsYWNlKCd8bGlzdCcsICcnKVxuICAgICAgICAucmVwbGFjZSgnfGh0bWwnLCAnJylcbiAgICAgICAgLnJlcGxhY2UoJ3x0YWcnLCAnJylcbiAgICAgICAgLmdldFJlZ2V4KCksXG59O1xuLyoqXG4gKiBJbmxpbmUtTGV2ZWwgR3JhbW1hclxuICovXG5jb25zdCBlc2NhcGUkMSA9IC9eXFxcXChbIVwiIyQlJicoKSorLFxcLS4vOjs8PT4/QFxcW1xcXVxcXFxeX2B7fH1+XSkvO1xuY29uc3QgaW5saW5lQ29kZSA9IC9eKGArKShbXmBdfFteYF1bXFxzXFxTXSo/W15gXSlcXDEoPyFgKS87XG5jb25zdCBiciA9IC9eKCB7Mix9fFxcXFwpXFxuKD8hXFxzKiQpLztcbmNvbnN0IGlubGluZVRleHQgPSAvXihgK3xbXmBdKSg/Oig/PSB7Mix9XFxuKXxbXFxzXFxTXSo/KD86KD89W1xcXFw8IVxcW2AqX118XFxiX3wkKXxbXiBdKD89IHsyLH1cXG4pKSkvO1xuLy8gbGlzdCBvZiB1bmljb2RlIHB1bmN0dWF0aW9uIG1hcmtzLCBwbHVzIGFueSBtaXNzaW5nIGNoYXJhY3RlcnMgZnJvbSBDb21tb25NYXJrIHNwZWNcbmNvbnN0IF9wdW5jdHVhdGlvbiA9IC9bXFxwe1B9XFxwe1N9XS91O1xuY29uc3QgX3B1bmN0dWF0aW9uT3JTcGFjZSA9IC9bXFxzXFxwe1B9XFxwe1N9XS91O1xuY29uc3QgX25vdFB1bmN0dWF0aW9uT3JTcGFjZSA9IC9bXlxcc1xccHtQfVxccHtTfV0vdTtcbmNvbnN0IHB1bmN0dWF0aW9uID0gZWRpdCgvXigoPyFbKl9dKXB1bmN0U3BhY2UpLywgJ3UnKVxuICAgIC5yZXBsYWNlKC9wdW5jdFNwYWNlL2csIF9wdW5jdHVhdGlvbk9yU3BhY2UpLmdldFJlZ2V4KCk7XG4vLyBHRk0gYWxsb3dzIH4gaW5zaWRlIHN0cm9uZyBhbmQgZW0gZm9yIHN0cmlrZXRocm91Z2hcbmNvbnN0IF9wdW5jdHVhdGlvbkdmbVN0cm9uZ0VtID0gLyg/IX4pW1xccHtQfVxccHtTfV0vdTtcbmNvbnN0IF9wdW5jdHVhdGlvbk9yU3BhY2VHZm1TdHJvbmdFbSA9IC8oPyF+KVtcXHNcXHB7UH1cXHB7U31dL3U7XG5jb25zdCBfbm90UHVuY3R1YXRpb25PclNwYWNlR2ZtU3Ryb25nRW0gPSAvKD86W15cXHNcXHB7UH1cXHB7U31dfH4pL3U7XG4vLyBzZXF1ZW5jZXMgZW0gc2hvdWxkIHNraXAgb3ZlciBbdGl0bGVdKGxpbmspLCBgY29kZWAsIDxodG1sPlxuY29uc3QgYmxvY2tTa2lwID0gL1xcW1teW1xcXV0qP1xcXVxcKCg/OlxcXFwufFteXFxcXFxcKFxcKV18XFwoKD86XFxcXC58W15cXFxcXFwoXFwpXSkqXFwpKSpcXCl8YFteYF0qP2B8PFtePD5dKj8+L2c7XG5jb25zdCBlbVN0cm9uZ0xEZWxpbUNvcmUgPSAvXig/OlxcKisoPzooKD8hXFwqKXB1bmN0KXxbXlxccypdKSl8Xl8rKD86KCg/IV8pcHVuY3QpfChbXlxcc19dKSkvO1xuY29uc3QgZW1TdHJvbmdMRGVsaW0gPSBlZGl0KGVtU3Ryb25nTERlbGltQ29yZSwgJ3UnKVxuICAgIC5yZXBsYWNlKC9wdW5jdC9nLCBfcHVuY3R1YXRpb24pXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBlbVN0cm9uZ0xEZWxpbUdmbSA9IGVkaXQoZW1TdHJvbmdMRGVsaW1Db3JlLCAndScpXG4gICAgLnJlcGxhY2UoL3B1bmN0L2csIF9wdW5jdHVhdGlvbkdmbVN0cm9uZ0VtKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgZW1TdHJvbmdSRGVsaW1Bc3RDb3JlID0gJ15bXl8qXSo/X19bXl8qXSo/XFxcXCpbXl8qXSo/KD89X18pJyAvLyBTa2lwIG9ycGhhbiBpbnNpZGUgc3Ryb25nXG4gICAgKyAnfFteKl0rKD89W14qXSknIC8vIENvbnN1bWUgdG8gZGVsaW1cbiAgICArICd8KD8hXFxcXCopcHVuY3QoXFxcXCorKSg/PVtcXFxcc118JCknIC8vICgxKSAjKioqIGNhbiBvbmx5IGJlIGEgUmlnaHQgRGVsaW1pdGVyXG4gICAgKyAnfG5vdFB1bmN0U3BhY2UoXFxcXCorKSg/IVxcXFwqKSg/PXB1bmN0U3BhY2V8JCknIC8vICgyKSBhKioqIywgYSoqKiBjYW4gb25seSBiZSBhIFJpZ2h0IERlbGltaXRlclxuICAgICsgJ3woPyFcXFxcKilwdW5jdFNwYWNlKFxcXFwqKykoPz1ub3RQdW5jdFNwYWNlKScgLy8gKDMpICMqKiphLCAqKiphIGNhbiBvbmx5IGJlIExlZnQgRGVsaW1pdGVyXG4gICAgKyAnfFtcXFxcc10oXFxcXCorKSg/IVxcXFwqKSg/PXB1bmN0KScgLy8gKDQpICoqKiMgY2FuIG9ubHkgYmUgTGVmdCBEZWxpbWl0ZXJcbiAgICArICd8KD8hXFxcXCopcHVuY3QoXFxcXCorKSg/IVxcXFwqKSg/PXB1bmN0KScgLy8gKDUpICMqKiojIGNhbiBiZSBlaXRoZXIgTGVmdCBvciBSaWdodCBEZWxpbWl0ZXJcbiAgICArICd8bm90UHVuY3RTcGFjZShcXFxcKispKD89bm90UHVuY3RTcGFjZSknOyAvLyAoNikgYSoqKmEgY2FuIGJlIGVpdGhlciBMZWZ0IG9yIFJpZ2h0IERlbGltaXRlclxuY29uc3QgZW1TdHJvbmdSRGVsaW1Bc3QgPSBlZGl0KGVtU3Ryb25nUkRlbGltQXN0Q29yZSwgJ2d1JylcbiAgICAucmVwbGFjZSgvbm90UHVuY3RTcGFjZS9nLCBfbm90UHVuY3R1YXRpb25PclNwYWNlKVxuICAgIC5yZXBsYWNlKC9wdW5jdFNwYWNlL2csIF9wdW5jdHVhdGlvbk9yU3BhY2UpXG4gICAgLnJlcGxhY2UoL3B1bmN0L2csIF9wdW5jdHVhdGlvbilcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IGVtU3Ryb25nUkRlbGltQXN0R2ZtID0gZWRpdChlbVN0cm9uZ1JEZWxpbUFzdENvcmUsICdndScpXG4gICAgLnJlcGxhY2UoL25vdFB1bmN0U3BhY2UvZywgX25vdFB1bmN0dWF0aW9uT3JTcGFjZUdmbVN0cm9uZ0VtKVxuICAgIC5yZXBsYWNlKC9wdW5jdFNwYWNlL2csIF9wdW5jdHVhdGlvbk9yU3BhY2VHZm1TdHJvbmdFbSlcbiAgICAucmVwbGFjZSgvcHVuY3QvZywgX3B1bmN0dWF0aW9uR2ZtU3Ryb25nRW0pXG4gICAgLmdldFJlZ2V4KCk7XG4vLyAoNikgTm90IGFsbG93ZWQgZm9yIF9cbmNvbnN0IGVtU3Ryb25nUkRlbGltVW5kID0gZWRpdCgnXlteXypdKj9cXFxcKlxcXFwqW15fKl0qP19bXl8qXSo/KD89XFxcXCpcXFxcKiknIC8vIFNraXAgb3JwaGFuIGluc2lkZSBzdHJvbmdcbiAgICArICd8W15fXSsoPz1bXl9dKScgLy8gQ29uc3VtZSB0byBkZWxpbVxuICAgICsgJ3woPyFfKXB1bmN0KF8rKSg/PVtcXFxcc118JCknIC8vICgxKSAjX19fIGNhbiBvbmx5IGJlIGEgUmlnaHQgRGVsaW1pdGVyXG4gICAgKyAnfG5vdFB1bmN0U3BhY2UoXyspKD8hXykoPz1wdW5jdFNwYWNlfCQpJyAvLyAoMikgYV9fXyMsIGFfX18gY2FuIG9ubHkgYmUgYSBSaWdodCBEZWxpbWl0ZXJcbiAgICArICd8KD8hXylwdW5jdFNwYWNlKF8rKSg/PW5vdFB1bmN0U3BhY2UpJyAvLyAoMykgI19fX2EsIF9fX2EgY2FuIG9ubHkgYmUgTGVmdCBEZWxpbWl0ZXJcbiAgICArICd8W1xcXFxzXShfKykoPyFfKSg/PXB1bmN0KScgLy8gKDQpIF9fXyMgY2FuIG9ubHkgYmUgTGVmdCBEZWxpbWl0ZXJcbiAgICArICd8KD8hXylwdW5jdChfKykoPyFfKSg/PXB1bmN0KScsICdndScpIC8vICg1KSAjX19fIyBjYW4gYmUgZWl0aGVyIExlZnQgb3IgUmlnaHQgRGVsaW1pdGVyXG4gICAgLnJlcGxhY2UoL25vdFB1bmN0U3BhY2UvZywgX25vdFB1bmN0dWF0aW9uT3JTcGFjZSlcbiAgICAucmVwbGFjZSgvcHVuY3RTcGFjZS9nLCBfcHVuY3R1YXRpb25PclNwYWNlKVxuICAgIC5yZXBsYWNlKC9wdW5jdC9nLCBfcHVuY3R1YXRpb24pXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBhbnlQdW5jdHVhdGlvbiA9IGVkaXQoL1xcXFwocHVuY3QpLywgJ2d1JylcbiAgICAucmVwbGFjZSgvcHVuY3QvZywgX3B1bmN0dWF0aW9uKVxuICAgIC5nZXRSZWdleCgpO1xuY29uc3QgYXV0b2xpbmsgPSBlZGl0KC9ePChzY2hlbWU6W15cXHNcXHgwMC1cXHgxZjw+XSp8ZW1haWwpPi8pXG4gICAgLnJlcGxhY2UoJ3NjaGVtZScsIC9bYS16QS1aXVthLXpBLVowLTkrLi1dezEsMzF9LylcbiAgICAucmVwbGFjZSgnZW1haWwnLCAvW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSsoQClbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyg/IVstX10pLylcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IF9pbmxpbmVDb21tZW50ID0gZWRpdChfY29tbWVudCkucmVwbGFjZSgnKD86LS0+fCQpJywgJy0tPicpLmdldFJlZ2V4KCk7XG5jb25zdCB0YWcgPSBlZGl0KCdeY29tbWVudCdcbiAgICArICd8XjwvW2EtekEtWl1bXFxcXHc6LV0qXFxcXHMqPicgLy8gc2VsZi1jbG9zaW5nIHRhZ1xuICAgICsgJ3xePFthLXpBLVpdW1xcXFx3LV0qKD86YXR0cmlidXRlKSo/XFxcXHMqLz8+JyAvLyBvcGVuIHRhZ1xuICAgICsgJ3xePFxcXFw/W1xcXFxzXFxcXFNdKj9cXFxcPz4nIC8vIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24sIGUuZy4gPD9waHAgPz5cbiAgICArICd8XjwhW2EtekEtWl0rXFxcXHNbXFxcXHNcXFxcU10qPz4nIC8vIGRlY2xhcmF0aW9uLCBlLmcuIDwhRE9DVFlQRSBodG1sPlxuICAgICsgJ3xePCFcXFxcW0NEQVRBXFxcXFtbXFxcXHNcXFxcU10qP1xcXFxdXFxcXF0+JykgLy8gQ0RBVEEgc2VjdGlvblxuICAgIC5yZXBsYWNlKCdjb21tZW50JywgX2lubGluZUNvbW1lbnQpXG4gICAgLnJlcGxhY2UoJ2F0dHJpYnV0ZScsIC9cXHMrW2EtekEtWjpfXVtcXHcuOi1dKig/Olxccyo9XFxzKlwiW15cIl0qXCJ8XFxzKj1cXHMqJ1teJ10qJ3xcXHMqPVxccypbXlxcc1wiJz08PmBdKyk/LylcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IF9pbmxpbmVMYWJlbCA9IC8oPzpcXFsoPzpcXFxcLnxbXlxcW1xcXVxcXFxdKSpcXF18XFxcXC58YFteYF0qYHxbXlxcW1xcXVxcXFxgXSkqPy87XG5jb25zdCBsaW5rID0gZWRpdCgvXiE/XFxbKGxhYmVsKVxcXVxcKFxccyooaHJlZikoPzpcXHMrKHRpdGxlKSk/XFxzKlxcKS8pXG4gICAgLnJlcGxhY2UoJ2xhYmVsJywgX2lubGluZUxhYmVsKVxuICAgIC5yZXBsYWNlKCdocmVmJywgLzwoPzpcXFxcLnxbXlxcbjw+XFxcXF0pKz58W15cXHNcXHgwMC1cXHgxZl0qLylcbiAgICAucmVwbGFjZSgndGl0bGUnLCAvXCIoPzpcXFxcXCI/fFteXCJcXFxcXSkqXCJ8Jyg/OlxcXFwnP3xbXidcXFxcXSkqJ3xcXCgoPzpcXFxcXFwpP3xbXilcXFxcXSkqXFwpLylcbiAgICAuZ2V0UmVnZXgoKTtcbmNvbnN0IHJlZmxpbmsgPSBlZGl0KC9eIT9cXFsobGFiZWwpXFxdXFxbKHJlZilcXF0vKVxuICAgIC5yZXBsYWNlKCdsYWJlbCcsIF9pbmxpbmVMYWJlbClcbiAgICAucmVwbGFjZSgncmVmJywgX2Jsb2NrTGFiZWwpXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCBub2xpbmsgPSBlZGl0KC9eIT9cXFsocmVmKVxcXSg/OlxcW1xcXSk/LylcbiAgICAucmVwbGFjZSgncmVmJywgX2Jsb2NrTGFiZWwpXG4gICAgLmdldFJlZ2V4KCk7XG5jb25zdCByZWZsaW5rU2VhcmNoID0gZWRpdCgncmVmbGlua3xub2xpbmsoPyFcXFxcKCknLCAnZycpXG4gICAgLnJlcGxhY2UoJ3JlZmxpbmsnLCByZWZsaW5rKVxuICAgIC5yZXBsYWNlKCdub2xpbmsnLCBub2xpbmspXG4gICAgLmdldFJlZ2V4KCk7XG4vKipcbiAqIE5vcm1hbCBJbmxpbmUgR3JhbW1hclxuICovXG5jb25zdCBpbmxpbmVOb3JtYWwgPSB7XG4gICAgX2JhY2twZWRhbDogbm9vcFRlc3QsIC8vIG9ubHkgdXNlZCBmb3IgR0ZNIHVybFxuICAgIGFueVB1bmN0dWF0aW9uLFxuICAgIGF1dG9saW5rLFxuICAgIGJsb2NrU2tpcCxcbiAgICBicixcbiAgICBjb2RlOiBpbmxpbmVDb2RlLFxuICAgIGRlbDogbm9vcFRlc3QsXG4gICAgZW1TdHJvbmdMRGVsaW0sXG4gICAgZW1TdHJvbmdSRGVsaW1Bc3QsXG4gICAgZW1TdHJvbmdSRGVsaW1VbmQsXG4gICAgZXNjYXBlOiBlc2NhcGUkMSxcbiAgICBsaW5rLFxuICAgIG5vbGluayxcbiAgICBwdW5jdHVhdGlvbixcbiAgICByZWZsaW5rLFxuICAgIHJlZmxpbmtTZWFyY2gsXG4gICAgdGFnLFxuICAgIHRleHQ6IGlubGluZVRleHQsXG4gICAgdXJsOiBub29wVGVzdCxcbn07XG4vKipcbiAqIFBlZGFudGljIElubGluZSBHcmFtbWFyXG4gKi9cbmNvbnN0IGlubGluZVBlZGFudGljID0ge1xuICAgIC4uLmlubGluZU5vcm1hbCxcbiAgICBsaW5rOiBlZGl0KC9eIT9cXFsobGFiZWwpXFxdXFwoKC4qPylcXCkvKVxuICAgICAgICAucmVwbGFjZSgnbGFiZWwnLCBfaW5saW5lTGFiZWwpXG4gICAgICAgIC5nZXRSZWdleCgpLFxuICAgIHJlZmxpbms6IGVkaXQoL14hP1xcWyhsYWJlbClcXF1cXHMqXFxbKFteXFxdXSopXFxdLylcbiAgICAgICAgLnJlcGxhY2UoJ2xhYmVsJywgX2lubGluZUxhYmVsKVxuICAgICAgICAuZ2V0UmVnZXgoKSxcbn07XG4vKipcbiAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICovXG5jb25zdCBpbmxpbmVHZm0gPSB7XG4gICAgLi4uaW5saW5lTm9ybWFsLFxuICAgIGVtU3Ryb25nUkRlbGltQXN0OiBlbVN0cm9uZ1JEZWxpbUFzdEdmbSxcbiAgICBlbVN0cm9uZ0xEZWxpbTogZW1TdHJvbmdMRGVsaW1HZm0sXG4gICAgdXJsOiBlZGl0KC9eKCg/OmZ0cHxodHRwcz8pOlxcL1xcL3x3d3dcXC4pKD86W2EtekEtWjAtOVxcLV0rXFwuPykrW15cXHM8XSp8XmVtYWlsLywgJ2knKVxuICAgICAgICAucmVwbGFjZSgnZW1haWwnLCAvW0EtWmEtejAtOS5fKy1dKyhAKVthLXpBLVowLTktX10rKD86XFwuW2EtekEtWjAtOS1fXSpbYS16QS1aMC05XSkrKD8hWy1fXSkvKVxuICAgICAgICAuZ2V0UmVnZXgoKSxcbiAgICBfYmFja3BlZGFsOiAvKD86W14/IS4sOjsqXydcIn4oKSZdK3xcXChbXildKlxcKXwmKD8hW2EtekEtWjAtOV0rOyQpfFs/IS4sOjsqXydcIn4pXSsoPyEkKSkrLyxcbiAgICBkZWw6IC9eKH5+PykoPz1bXlxcc35dKSgoPzpcXFxcLnxbXlxcXFxdKSo/KD86XFxcXC58W15cXHN+XFxcXF0pKVxcMSg/PVtefl18JCkvLFxuICAgIHRleHQ6IC9eKFtgfl0rfFteYH5dKSg/Oig/PSB7Mix9XFxuKXwoPz1bYS16QS1aMC05LiEjJCUmJyorXFwvPT9fYHtcXHx9fi1dK0ApfFtcXHNcXFNdKj8oPzooPz1bXFxcXDwhXFxbYCp+X118XFxiX3xodHRwcz86XFwvXFwvfGZ0cDpcXC9cXC98d3d3XFwufCQpfFteIF0oPz0gezIsfVxcbil8W15hLXpBLVowLTkuISMkJSYnKitcXC89P19ge1xcfH1+LV0oPz1bYS16QS1aMC05LiEjJCUmJyorXFwvPT9fYHtcXHx9fi1dK0ApKSkvLFxufTtcbi8qKlxuICogR0ZNICsgTGluZSBCcmVha3MgSW5saW5lIEdyYW1tYXJcbiAqL1xuY29uc3QgaW5saW5lQnJlYWtzID0ge1xuICAgIC4uLmlubGluZUdmbSxcbiAgICBicjogZWRpdChicikucmVwbGFjZSgnezIsfScsICcqJykuZ2V0UmVnZXgoKSxcbiAgICB0ZXh0OiBlZGl0KGlubGluZUdmbS50ZXh0KVxuICAgICAgICAucmVwbGFjZSgnXFxcXGJfJywgJ1xcXFxiX3wgezIsfVxcXFxuJylcbiAgICAgICAgLnJlcGxhY2UoL1xcezIsXFx9L2csICcqJylcbiAgICAgICAgLmdldFJlZ2V4KCksXG59O1xuLyoqXG4gKiBleHBvcnRzXG4gKi9cbmNvbnN0IGJsb2NrID0ge1xuICAgIG5vcm1hbDogYmxvY2tOb3JtYWwsXG4gICAgZ2ZtOiBibG9ja0dmbSxcbiAgICBwZWRhbnRpYzogYmxvY2tQZWRhbnRpYyxcbn07XG5jb25zdCBpbmxpbmUgPSB7XG4gICAgbm9ybWFsOiBpbmxpbmVOb3JtYWwsXG4gICAgZ2ZtOiBpbmxpbmVHZm0sXG4gICAgYnJlYWtzOiBpbmxpbmVCcmVha3MsXG4gICAgcGVkYW50aWM6IGlubGluZVBlZGFudGljLFxufTtcblxuLyoqXG4gKiBIZWxwZXJzXG4gKi9cbmNvbnN0IGVzY2FwZVJlcGxhY2VtZW50cyA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OycsXG59O1xuY29uc3QgZ2V0RXNjYXBlUmVwbGFjZW1lbnQgPSAoY2gpID0+IGVzY2FwZVJlcGxhY2VtZW50c1tjaF07XG5mdW5jdGlvbiBlc2NhcGUoaHRtbCwgZW5jb2RlKSB7XG4gICAgaWYgKGVuY29kZSkge1xuICAgICAgICBpZiAob3RoZXIuZXNjYXBlVGVzdC50ZXN0KGh0bWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKG90aGVyLmVzY2FwZVJlcGxhY2UsIGdldEVzY2FwZVJlcGxhY2VtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKG90aGVyLmVzY2FwZVRlc3ROb0VuY29kZS50ZXN0KGh0bWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKG90aGVyLmVzY2FwZVJlcGxhY2VOb0VuY29kZSwgZ2V0RXNjYXBlUmVwbGFjZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBodG1sO1xufVxuZnVuY3Rpb24gY2xlYW5VcmwoaHJlZikge1xuICAgIHRyeSB7XG4gICAgICAgIGhyZWYgPSBlbmNvZGVVUkkoaHJlZikucmVwbGFjZShvdGhlci5wZXJjZW50RGVjb2RlLCAnJScpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaHJlZjtcbn1cbmZ1bmN0aW9uIHNwbGl0Q2VsbHModGFibGVSb3csIGNvdW50KSB7XG4gICAgLy8gZW5zdXJlIHRoYXQgZXZlcnkgY2VsbC1kZWxpbWl0aW5nIHBpcGUgaGFzIGEgc3BhY2VcbiAgICAvLyBiZWZvcmUgaXQgdG8gZGlzdGluZ3Vpc2ggaXQgZnJvbSBhbiBlc2NhcGVkIHBpcGVcbiAgICBjb25zdCByb3cgPSB0YWJsZVJvdy5yZXBsYWNlKG90aGVyLmZpbmRQaXBlLCAobWF0Y2gsIG9mZnNldCwgc3RyKSA9PiB7XG4gICAgICAgIGxldCBlc2NhcGVkID0gZmFsc2U7XG4gICAgICAgIGxldCBjdXJyID0gb2Zmc2V0O1xuICAgICAgICB3aGlsZSAoLS1jdXJyID49IDAgJiYgc3RyW2N1cnJdID09PSAnXFxcXCcpXG4gICAgICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQ7XG4gICAgICAgIGlmIChlc2NhcGVkKSB7XG4gICAgICAgICAgICAvLyBvZGQgbnVtYmVyIG9mIHNsYXNoZXMgbWVhbnMgfCBpcyBlc2NhcGVkXG4gICAgICAgICAgICAvLyBzbyB3ZSBsZWF2ZSBpdCBhbG9uZVxuICAgICAgICAgICAgcmV0dXJuICd8JztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGFkZCBzcGFjZSBiZWZvcmUgdW5lc2NhcGVkIHxcbiAgICAgICAgICAgIHJldHVybiAnIHwnO1xuICAgICAgICB9XG4gICAgfSksIGNlbGxzID0gcm93LnNwbGl0KG90aGVyLnNwbGl0UGlwZSk7XG4gICAgbGV0IGkgPSAwO1xuICAgIC8vIEZpcnN0L2xhc3QgY2VsbCBpbiBhIHJvdyBjYW5ub3QgYmUgZW1wdHkgaWYgaXQgaGFzIG5vIGxlYWRpbmcvdHJhaWxpbmcgcGlwZVxuICAgIGlmICghY2VsbHNbMF0udHJpbSgpKSB7XG4gICAgICAgIGNlbGxzLnNoaWZ0KCk7XG4gICAgfVxuICAgIGlmIChjZWxscy5sZW5ndGggPiAwICYmICFjZWxscy5hdCgtMSk/LnRyaW0oKSkge1xuICAgICAgICBjZWxscy5wb3AoKTtcbiAgICB9XG4gICAgaWYgKGNvdW50KSB7XG4gICAgICAgIGlmIChjZWxscy5sZW5ndGggPiBjb3VudCkge1xuICAgICAgICAgICAgY2VsbHMuc3BsaWNlKGNvdW50KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHdoaWxlIChjZWxscy5sZW5ndGggPCBjb3VudClcbiAgICAgICAgICAgICAgICBjZWxscy5wdXNoKCcnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKDsgaSA8IGNlbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIGxlYWRpbmcgb3IgdHJhaWxpbmcgd2hpdGVzcGFjZSBpcyBpZ25vcmVkIHBlciB0aGUgZ2ZtIHNwZWNcbiAgICAgICAgY2VsbHNbaV0gPSBjZWxsc1tpXS50cmltKCkucmVwbGFjZShvdGhlci5zbGFzaFBpcGUsICd8Jyk7XG4gICAgfVxuICAgIHJldHVybiBjZWxscztcbn1cbi8qKlxuICogUmVtb3ZlIHRyYWlsaW5nICdjJ3MuIEVxdWl2YWxlbnQgdG8gc3RyLnJlcGxhY2UoL2MqJC8sICcnKS5cbiAqIC9jKiQvIGlzIHZ1bG5lcmFibGUgdG8gUkVET1MuXG4gKlxuICogQHBhcmFtIHN0clxuICogQHBhcmFtIGNcbiAqIEBwYXJhbSBpbnZlcnQgUmVtb3ZlIHN1ZmZpeCBvZiBub24tYyBjaGFycyBpbnN0ZWFkLiBEZWZhdWx0IGZhbHNleS5cbiAqL1xuZnVuY3Rpb24gcnRyaW0oc3RyLCBjLCBpbnZlcnQpIHtcbiAgICBjb25zdCBsID0gc3RyLmxlbmd0aDtcbiAgICBpZiAobCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIC8vIExlbmd0aCBvZiBzdWZmaXggbWF0Y2hpbmcgdGhlIGludmVydCBjb25kaXRpb24uXG4gICAgbGV0IHN1ZmZMZW4gPSAwO1xuICAgIC8vIFN0ZXAgbGVmdCB1bnRpbCB3ZSBmYWlsIHRvIG1hdGNoIHRoZSBpbnZlcnQgY29uZGl0aW9uLlxuICAgIHdoaWxlIChzdWZmTGVuIDwgbCkge1xuICAgICAgICBjb25zdCBjdXJyQ2hhciA9IHN0ci5jaGFyQXQobCAtIHN1ZmZMZW4gLSAxKTtcbiAgICAgICAgaWYgKGN1cnJDaGFyID09PSBjICYmIHRydWUpIHtcbiAgICAgICAgICAgIHN1ZmZMZW4rKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHIuc2xpY2UoMCwgbCAtIHN1ZmZMZW4pO1xufVxuZnVuY3Rpb24gZmluZENsb3NpbmdCcmFja2V0KHN0ciwgYikge1xuICAgIGlmIChzdHIuaW5kZXhPZihiWzFdKSA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICBsZXQgbGV2ZWwgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzdHJbaV0gPT09ICdcXFxcJykge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0cltpXSA9PT0gYlswXSkge1xuICAgICAgICAgICAgbGV2ZWwrKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzdHJbaV0gPT09IGJbMV0pIHtcbiAgICAgICAgICAgIGxldmVsLS07XG4gICAgICAgICAgICBpZiAobGV2ZWwgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufVxuXG5mdW5jdGlvbiBvdXRwdXRMaW5rKGNhcCwgbGluaywgcmF3LCBsZXhlciwgcnVsZXMpIHtcbiAgICBjb25zdCBocmVmID0gbGluay5ocmVmO1xuICAgIGNvbnN0IHRpdGxlID0gbGluay50aXRsZSB8fCBudWxsO1xuICAgIGNvbnN0IHRleHQgPSBjYXBbMV0ucmVwbGFjZShydWxlcy5vdGhlci5vdXRwdXRMaW5rUmVwbGFjZSwgJyQxJyk7XG4gICAgaWYgKGNhcFswXS5jaGFyQXQoMCkgIT09ICchJykge1xuICAgICAgICBsZXhlci5zdGF0ZS5pbkxpbmsgPSB0cnVlO1xuICAgICAgICBjb25zdCB0b2tlbiA9IHtcbiAgICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgIHJhdyxcbiAgICAgICAgICAgIGhyZWYsXG4gICAgICAgICAgICB0aXRsZSxcbiAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICB0b2tlbnM6IGxleGVyLmlubGluZVRva2Vucyh0ZXh0KSxcbiAgICAgICAgfTtcbiAgICAgICAgbGV4ZXIuc3RhdGUuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgICAgcmF3LFxuICAgICAgICBocmVmLFxuICAgICAgICB0aXRsZSxcbiAgICAgICAgdGV4dCxcbiAgICB9O1xufVxuZnVuY3Rpb24gaW5kZW50Q29kZUNvbXBlbnNhdGlvbihyYXcsIHRleHQsIHJ1bGVzKSB7XG4gICAgY29uc3QgbWF0Y2hJbmRlbnRUb0NvZGUgPSByYXcubWF0Y2gocnVsZXMub3RoZXIuaW5kZW50Q29kZUNvbXBlbnNhdGlvbik7XG4gICAgaWYgKG1hdGNoSW5kZW50VG9Db2RlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBjb25zdCBpbmRlbnRUb0NvZGUgPSBtYXRjaEluZGVudFRvQ29kZVsxXTtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgIC5tYXAobm9kZSA9PiB7XG4gICAgICAgIGNvbnN0IG1hdGNoSW5kZW50SW5Ob2RlID0gbm9kZS5tYXRjaChydWxlcy5vdGhlci5iZWdpbm5pbmdTcGFjZSk7XG4gICAgICAgIGlmIChtYXRjaEluZGVudEluTm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW2luZGVudEluTm9kZV0gPSBtYXRjaEluZGVudEluTm9kZTtcbiAgICAgICAgaWYgKGluZGVudEluTm9kZS5sZW5ndGggPj0gaW5kZW50VG9Db2RlLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUuc2xpY2UoaW5kZW50VG9Db2RlLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSlcbiAgICAgICAgLmpvaW4oJ1xcbicpO1xufVxuLyoqXG4gKiBUb2tlbml6ZXJcbiAqL1xuY2xhc3MgX1Rva2VuaXplciB7XG4gICAgb3B0aW9ucztcbiAgICBydWxlczsgLy8gc2V0IGJ5IHRoZSBsZXhlclxuICAgIGxleGVyOyAvLyBzZXQgYnkgdGhlIGxleGVyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IF9kZWZhdWx0cztcbiAgICB9XG4gICAgc3BhY2Uoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2submV3bGluZS5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXAgJiYgY2FwWzBdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3NwYWNlJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29kZShzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5jb2RlLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNhcFswXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIuY29kZVJlbW92ZUluZGVudCwgJycpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgY29kZUJsb2NrU3R5bGU6ICdpbmRlbnRlZCcsXG4gICAgICAgICAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpY1xuICAgICAgICAgICAgICAgICAgICA/IHJ0cmltKHRleHQsICdcXG4nKVxuICAgICAgICAgICAgICAgICAgICA6IHRleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGZlbmNlcyhzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5mZW5jZXMuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCByYXcgPSBjYXBbMF07XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gaW5kZW50Q29kZUNvbXBlbnNhdGlvbihyYXcsIGNhcFszXSB8fCAnJywgdGhpcy5ydWxlcyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgICAgICAgICByYXcsXG4gICAgICAgICAgICAgICAgbGFuZzogY2FwWzJdID8gY2FwWzJdLnRyaW0oKS5yZXBsYWNlKHRoaXMucnVsZXMuaW5saW5lLmFueVB1bmN0dWF0aW9uLCAnJDEnKSA6IGNhcFsyXSxcbiAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoZWFkaW5nKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmhlYWRpbmcuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGNhcFsyXS50cmltKCk7XG4gICAgICAgICAgICAvLyByZW1vdmUgdHJhaWxpbmcgI3NcbiAgICAgICAgICAgIGlmICh0aGlzLnJ1bGVzLm90aGVyLmVuZGluZ0hhc2gudGVzdCh0ZXh0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWQgPSBydHJpbSh0ZXh0LCAnIycpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IHRyaW1tZWQudHJpbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICghdHJpbW1lZCB8fCB0aGlzLnJ1bGVzLm90aGVyLmVuZGluZ1NwYWNlQ2hhci50ZXN0KHRyaW1tZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbW1vbk1hcmsgcmVxdWlyZXMgc3BhY2UgYmVmb3JlIHRyYWlsaW5nICNzXG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB0cmltbWVkLnRyaW0oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICBkZXB0aDogY2FwWzFdLmxlbmd0aCxcbiAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmUodGV4dCksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGhyKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmhyLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaHInLFxuICAgICAgICAgICAgICAgIHJhdzogcnRyaW0oY2FwWzBdLCAnXFxuJyksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGJsb2NrcXVvdGUoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuYmxvY2suYmxvY2txdW90ZS5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGxldCBsaW5lcyA9IHJ0cmltKGNhcFswXSwgJ1xcbicpLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICAgIGxldCByYXcgPSAnJztcbiAgICAgICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICBjb25zdCB0b2tlbnMgPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChsaW5lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluQmxvY2txdW90ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRMaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIGxldCBpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBnZXQgbGluZXMgdXAgdG8gYSBjb250aW51YXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucnVsZXMub3RoZXIuYmxvY2txdW90ZVN0YXJ0LnRlc3QobGluZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGluZXMucHVzaChsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbkJsb2NrcXVvdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFpbkJsb2NrcXVvdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRMaW5lcy5wdXNoKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxpbmVzID0gbGluZXMuc2xpY2UoaSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFJhdyA9IGN1cnJlbnRMaW5lcy5qb2luKCdcXG4nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGV4dCA9IGN1cnJlbnRSYXdcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJlY2VkZSBzZXRleHQgY29udGludWF0aW9uIHdpdGggNCBzcGFjZXMgc28gaXQgaXNuJ3QgYSBzZXRleHRcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5ibG9ja3F1b3RlU2V0ZXh0UmVwbGFjZSwgJ1xcbiAgICAkMScpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIuYmxvY2txdW90ZVNldGV4dFJlcGxhY2UyLCAnJyk7XG4gICAgICAgICAgICAgICAgcmF3ID0gcmF3ID8gYCR7cmF3fVxcbiR7Y3VycmVudFJhd31gIDogY3VycmVudFJhdztcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dCA/IGAke3RleHR9XFxuJHtjdXJyZW50VGV4dH1gIDogY3VycmVudFRleHQ7XG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgYmxvY2txdW90ZSBsaW5lcyBhcyB0b3AgbGV2ZWwgdG9rZW5zXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2UgcGFyYWdyYXBocyBpZiB0aGlzIGlzIGEgY29udGludWF0aW9uXG4gICAgICAgICAgICAgICAgY29uc3QgdG9wID0gdGhpcy5sZXhlci5zdGF0ZS50b3A7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5zdGF0ZS50b3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuYmxvY2tUb2tlbnMoY3VycmVudFRleHQsIHRva2VucywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sZXhlci5zdGF0ZS50b3AgPSB0b3A7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgbm8gY29udGludWF0aW9uIHRoZW4gd2UgYXJlIGRvbmVcbiAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VG9rZW4gPSB0b2tlbnMuYXQoLTEpO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBibG9ja3F1b3RlIGNvbnRpbnVhdGlvbiBjYW5ub3QgYmUgcHJlY2VkZWQgYnkgYSBjb2RlIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICdibG9ja3F1b3RlJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIGNvbnRpbnVhdGlvbiBpbiBuZXN0ZWQgYmxvY2txdW90ZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvbGRUb2tlbiA9IGxhc3RUb2tlbjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV3VGV4dCA9IG9sZFRva2VuLnJhdyArICdcXG4nICsgbGluZXMuam9pbignXFxuJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1Rva2VuID0gdGhpcy5ibG9ja3F1b3RlKG5ld1RleHQpO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdID0gbmV3VG9rZW47XG4gICAgICAgICAgICAgICAgICAgIHJhdyA9IHJhdy5zdWJzdHJpbmcoMCwgcmF3Lmxlbmd0aCAtIG9sZFRva2VuLnJhdy5sZW5ndGgpICsgbmV3VG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMCwgdGV4dC5sZW5ndGggLSBvbGRUb2tlbi50ZXh0Lmxlbmd0aCkgKyBuZXdUb2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGFzdFRva2VuPy50eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5jbHVkZSBjb250aW51YXRpb24gaW4gbmVzdGVkIGxpc3RcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkVG9rZW4gPSBsYXN0VG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RleHQgPSBvbGRUb2tlbi5yYXcgKyAnXFxuJyArIGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdUb2tlbiA9IHRoaXMubGlzdChuZXdUZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXSA9IG5ld1Rva2VuO1xuICAgICAgICAgICAgICAgICAgICByYXcgPSByYXcuc3Vic3RyaW5nKDAsIHJhdy5sZW5ndGggLSBsYXN0VG9rZW4ucmF3Lmxlbmd0aCkgKyBuZXdUb2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygwLCB0ZXh0Lmxlbmd0aCAtIG9sZFRva2VuLnJhdy5sZW5ndGgpICsgbmV3VG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IG5ld1RleHQuc3Vic3RyaW5nKHRva2Vucy5hdCgtMSkucmF3Lmxlbmd0aCkuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdibG9ja3F1b3RlJyxcbiAgICAgICAgICAgICAgICByYXcsXG4gICAgICAgICAgICAgICAgdG9rZW5zLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGxpc3Qoc3JjKSB7XG4gICAgICAgIGxldCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmxpc3QuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBsZXQgYnVsbCA9IGNhcFsxXS50cmltKCk7XG4gICAgICAgICAgICBjb25zdCBpc29yZGVyZWQgPSBidWxsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICBjb25zdCBsaXN0ID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0JyxcbiAgICAgICAgICAgICAgICByYXc6ICcnLFxuICAgICAgICAgICAgICAgIG9yZGVyZWQ6IGlzb3JkZXJlZCxcbiAgICAgICAgICAgICAgICBzdGFydDogaXNvcmRlcmVkID8gK2J1bGwuc2xpY2UoMCwgLTEpIDogJycsXG4gICAgICAgICAgICAgICAgbG9vc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBidWxsID0gaXNvcmRlcmVkID8gYFxcXFxkezEsOX1cXFxcJHtidWxsLnNsaWNlKC0xKX1gIDogYFxcXFwke2J1bGx9YDtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAgICAgICBidWxsID0gaXNvcmRlcmVkID8gYnVsbCA6ICdbKistXSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBHZXQgbmV4dCBsaXN0IGl0ZW1cbiAgICAgICAgICAgIGNvbnN0IGl0ZW1SZWdleCA9IHRoaXMucnVsZXMub3RoZXIubGlzdEl0ZW1SZWdleChidWxsKTtcbiAgICAgICAgICAgIGxldCBlbmRzV2l0aEJsYW5rTGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBidWxsZXQgcG9pbnQgY2FuIHN0YXJ0IGEgbmV3IExpc3QgSXRlbVxuICAgICAgICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICAgICAgICAgIGxldCBlbmRFYXJseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCByYXcgPSAnJztcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUNvbnRlbnRzID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKCEoY2FwID0gaXRlbVJlZ2V4LmV4ZWMoc3JjKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJ1bGVzLmJsb2NrLmhyLnRlc3Qoc3JjKSkgeyAvLyBFbmQgbGlzdCBpZiBidWxsZXQgd2FzIGFjdHVhbGx5IEhSIChwb3NzaWJseSBtb3ZlIGludG8gaXRlbVJlZ2V4PylcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJhdyA9IGNhcFswXTtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGxldCBsaW5lID0gY2FwWzJdLnNwbGl0KCdcXG4nLCAxKVswXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIubGlzdFJlcGxhY2VUYWJzLCAodCkgPT4gJyAnLnJlcGVhdCgzICogdC5sZW5ndGgpKTtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dExpbmUgPSBzcmMuc3BsaXQoJ1xcbicsIDEpWzBdO1xuICAgICAgICAgICAgICAgIGxldCBibGFua0xpbmUgPSAhbGluZS50cmltKCk7XG4gICAgICAgICAgICAgICAgbGV0IGluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSAyO1xuICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudHMgPSBsaW5lLnRyaW1TdGFydCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChibGFua0xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gY2FwWzFdLmxlbmd0aCArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBjYXBbMl0uc2VhcmNoKHRoaXMucnVsZXMub3RoZXIubm9uU3BhY2VDaGFyKTsgLy8gRmluZCBmaXJzdCBub24tc3BhY2UgY2hhclxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSBpbmRlbnQgPiA0ID8gMSA6IGluZGVudDsgLy8gVHJlYXQgaW5kZW50ZWQgY29kZSBibG9ja3MgKD4gNCBzcGFjZXMpIGFzIGhhdmluZyBvbmx5IDEgaW5kZW50XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50cyA9IGxpbmUuc2xpY2UoaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ICs9IGNhcFsxXS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChibGFua0xpbmUgJiYgdGhpcy5ydWxlcy5vdGhlci5ibGFua0xpbmUudGVzdChuZXh0TGluZSkpIHsgLy8gSXRlbXMgYmVnaW4gd2l0aCBhdCBtb3N0IG9uZSBibGFuayBsaW5lXG4gICAgICAgICAgICAgICAgICAgIHJhdyArPSBuZXh0TGluZSArICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKG5leHRMaW5lLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICBlbmRFYXJseSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZW5kRWFybHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dEJ1bGxldFJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5uZXh0QnVsbGV0UmVnZXgoaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaHJSZWdleCA9IHRoaXMucnVsZXMub3RoZXIuaHJSZWdleChpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmZW5jZXNCZWdpblJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5mZW5jZXNCZWdpblJlZ2V4KGluZGVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhlYWRpbmdCZWdpblJlZ2V4ID0gdGhpcy5ydWxlcy5vdGhlci5oZWFkaW5nQmVnaW5SZWdleChpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBodG1sQmVnaW5SZWdleCA9IHRoaXMucnVsZXMub3RoZXIuaHRtbEJlZ2luUmVnZXgoaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgZm9sbG93aW5nIGxpbmVzIHNob3VsZCBiZSBpbmNsdWRlZCBpbiBMaXN0IEl0ZW1cbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmF3TGluZSA9IHNyYy5zcGxpdCgnXFxuJywgMSlbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV4dExpbmVXaXRob3V0VGFicztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRMaW5lID0gcmF3TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlLWFsaWduIHRvIGZvbGxvdyBjb21tb25tYXJrIG5lc3RpbmcgcnVsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXh0TGluZSA9IG5leHRMaW5lLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci5saXN0UmVwbGFjZU5lc3RpbmcsICcgICcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRMaW5lV2l0aG91dFRhYnMgPSBuZXh0TGluZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5leHRMaW5lV2l0aG91dFRhYnMgPSBuZXh0TGluZS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIudGFiQ2hhckdsb2JhbCwgJyAgICAnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuZCBsaXN0IGl0ZW0gaWYgZm91bmQgY29kZSBmZW5jZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmZW5jZXNCZWdpblJlZ2V4LnRlc3QobmV4dExpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbmQgbGlzdCBpdGVtIGlmIGZvdW5kIHN0YXJ0IG9mIG5ldyBoZWFkaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGluZ0JlZ2luUmVnZXgudGVzdChuZXh0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVuZCBsaXN0IGl0ZW0gaWYgZm91bmQgc3RhcnQgb2YgaHRtbCBibG9ja1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGh0bWxCZWdpblJlZ2V4LnRlc3QobmV4dExpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbmQgbGlzdCBpdGVtIGlmIGZvdW5kIHN0YXJ0IG9mIG5ldyBidWxsZXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0UmVnZXgudGVzdChuZXh0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEhvcml6b250YWwgcnVsZSBmb3VuZFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhyUmVnZXgudGVzdChuZXh0TGluZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0TGluZVdpdGhvdXRUYWJzLnNlYXJjaCh0aGlzLnJ1bGVzLm90aGVyLm5vblNwYWNlQ2hhcikgPj0gaW5kZW50IHx8ICFuZXh0TGluZS50cmltKCkpIHsgLy8gRGVkZW50IGlmIHBvc3NpYmxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzICs9ICdcXG4nICsgbmV4dExpbmVXaXRob3V0VGFicy5zbGljZShpbmRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IGVub3VnaCBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibGFua0xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhcmFncmFwaCBjb250aW51YXRpb24gdW5sZXNzIGxhc3QgbGluZSB3YXMgYSBkaWZmZXJlbnQgYmxvY2sgbGV2ZWwgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5lLnJlcGxhY2UodGhpcy5ydWxlcy5vdGhlci50YWJDaGFyR2xvYmFsLCAnICAgICcpLnNlYXJjaCh0aGlzLnJ1bGVzLm90aGVyLm5vblNwYWNlQ2hhcikgPj0gNCkgeyAvLyBpbmRlbnRlZCBjb2RlIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmVuY2VzQmVnaW5SZWdleC50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGluZ0JlZ2luUmVnZXgudGVzdChsaW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhyUmVnZXgudGVzdChsaW5lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzICs9ICdcXG4nICsgbmV4dExpbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWJsYW5rTGluZSAmJiAhbmV4dExpbmUudHJpbSgpKSB7IC8vIENoZWNrIGlmIGN1cnJlbnQgbGluZSBpcyBibGFua1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsYW5rTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByYXcgKz0gcmF3TGluZSArICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyhyYXdMaW5lLmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZSA9IG5leHRMaW5lV2l0aG91dFRhYnMuc2xpY2UoaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWxpc3QubG9vc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHByZXZpb3VzIGl0ZW0gZW5kZWQgd2l0aCBhIGJsYW5rIGxpbmUsIHRoZSBsaXN0IGlzIGxvb3NlXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmRzV2l0aEJsYW5rTGluZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5sb29zZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5ydWxlcy5vdGhlci5kb3VibGVCbGFua0xpbmUudGVzdChyYXcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRzV2l0aEJsYW5rTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IGlzdGFzayA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IGlzY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgdGFzayBsaXN0IGl0ZW1zXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgICAgICAgICAgICAgICAgaXN0YXNrID0gdGhpcy5ydWxlcy5vdGhlci5saXN0SXNUYXNrLmV4ZWMoaXRlbUNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzdGFzaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXNjaGVja2VkID0gaXN0YXNrWzBdICE9PSAnWyBdICc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudHMgPSBpdGVtQ29udGVudHMucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLmxpc3RSZXBsYWNlVGFzaywgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdsaXN0X2l0ZW0nLFxuICAgICAgICAgICAgICAgICAgICByYXcsXG4gICAgICAgICAgICAgICAgICAgIHRhc2s6ICEhaXN0YXNrLFxuICAgICAgICAgICAgICAgICAgICBjaGVja2VkOiBpc2NoZWNrZWQsXG4gICAgICAgICAgICAgICAgICAgIGxvb3NlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogaXRlbUNvbnRlbnRzLFxuICAgICAgICAgICAgICAgICAgICB0b2tlbnM6IFtdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxpc3QucmF3ICs9IHJhdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERvIG5vdCBjb25zdW1lIG5ld2xpbmVzIGF0IGVuZCBvZiBmaW5hbCBpdGVtLiBBbHRlcm5hdGl2ZWx5LCBtYWtlIGl0ZW1SZWdleCAqc3RhcnQqIHdpdGggYW55IG5ld2xpbmVzIHRvIHNpbXBsaWZ5L3NwZWVkIHVwIGVuZHNXaXRoQmxhbmtMaW5lIGxvZ2ljXG4gICAgICAgICAgICBjb25zdCBsYXN0SXRlbSA9IGxpc3QuaXRlbXMuYXQoLTEpO1xuICAgICAgICAgICAgaWYgKGxhc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgbGFzdEl0ZW0ucmF3ID0gbGFzdEl0ZW0ucmF3LnRyaW1FbmQoKTtcbiAgICAgICAgICAgICAgICBsYXN0SXRlbS50ZXh0ID0gbGFzdEl0ZW0udGV4dC50cmltRW5kKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBub3QgYSBsaXN0IHNpbmNlIHRoZXJlIHdlcmUgbm8gaXRlbXNcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0LnJhdyA9IGxpc3QucmF3LnRyaW1FbmQoKTtcbiAgICAgICAgICAgIC8vIEl0ZW0gY2hpbGQgdG9rZW5zIGhhbmRsZWQgaGVyZSBhdCBlbmQgYmVjYXVzZSB3ZSBuZWVkZWQgdG8gaGF2ZSB0aGUgZmluYWwgaXRlbSB0byB0cmltIGl0IGZpcnN0XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLnRvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxpc3QuaXRlbXNbaV0udG9rZW5zID0gdGhpcy5sZXhlci5ibG9ja1Rva2VucyhsaXN0Lml0ZW1zW2ldLnRleHQsIFtdKTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpc3QubG9vc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgbGlzdCBzaG91bGQgYmUgbG9vc2VcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BhY2VycyA9IGxpc3QuaXRlbXNbaV0udG9rZW5zLmZpbHRlcih0ID0+IHQudHlwZSA9PT0gJ3NwYWNlJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc011bHRpcGxlTGluZUJyZWFrcyA9IHNwYWNlcnMubGVuZ3RoID4gMCAmJiBzcGFjZXJzLnNvbWUodCA9PiB0aGlzLnJ1bGVzLm90aGVyLmFueUxpbmUudGVzdCh0LnJhdykpO1xuICAgICAgICAgICAgICAgICAgICBsaXN0Lmxvb3NlID0gaGFzTXVsdGlwbGVMaW5lQnJlYWtzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFNldCBhbGwgaXRlbXMgdG8gbG9vc2UgaWYgbGlzdCBpcyBsb29zZVxuICAgICAgICAgICAgaWYgKGxpc3QubG9vc2UpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QuaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5pdGVtc1tpXS5sb29zZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaHRtbChzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5odG1sLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgICAgICAgIGJsb2NrOiB0cnVlLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHByZTogY2FwWzFdID09PSAncHJlJyB8fCBjYXBbMV0gPT09ICdzY3JpcHQnIHx8IGNhcFsxXSA9PT0gJ3N0eWxlJyxcbiAgICAgICAgICAgICAgICB0ZXh0OiBjYXBbMF0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRlZihzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5kZWYuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCB0YWcgPSBjYXBbMV0udG9Mb3dlckNhc2UoKS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIubXVsdGlwbGVTcGFjZUdsb2JhbCwgJyAnKTtcbiAgICAgICAgICAgIGNvbnN0IGhyZWYgPSBjYXBbMl0gPyBjYXBbMl0ucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLmhyZWZCcmFja2V0cywgJyQxJykucmVwbGFjZSh0aGlzLnJ1bGVzLmlubGluZS5hbnlQdW5jdHVhdGlvbiwgJyQxJykgOiAnJztcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gY2FwWzNdID8gY2FwWzNdLnN1YnN0cmluZygxLCBjYXBbM10ubGVuZ3RoIC0gMSkucmVwbGFjZSh0aGlzLnJ1bGVzLmlubGluZS5hbnlQdW5jdHVhdGlvbiwgJyQxJykgOiBjYXBbM107XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkZWYnLFxuICAgICAgICAgICAgICAgIHRhZyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICBocmVmLFxuICAgICAgICAgICAgICAgIHRpdGxlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0YWJsZShzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay50YWJsZS5leGVjKHNyYyk7XG4gICAgICAgIGlmICghY2FwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnJ1bGVzLm90aGVyLnRhYmxlRGVsaW1pdGVyLnRlc3QoY2FwWzJdKSkge1xuICAgICAgICAgICAgLy8gZGVsaW1pdGVyIHJvdyBtdXN0IGhhdmUgYSBwaXBlICh8KSBvciBjb2xvbiAoOikgb3RoZXJ3aXNlIGl0IGlzIGEgc2V0ZXh0IGhlYWRpbmdcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoZWFkZXJzID0gc3BsaXRDZWxscyhjYXBbMV0pO1xuICAgICAgICBjb25zdCBhbGlnbnMgPSBjYXBbMl0ucmVwbGFjZSh0aGlzLnJ1bGVzLm90aGVyLnRhYmxlQWxpZ25DaGFycywgJycpLnNwbGl0KCd8Jyk7XG4gICAgICAgIGNvbnN0IHJvd3MgPSBjYXBbM10/LnRyaW0oKSA/IGNhcFszXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIudGFibGVSb3dCbGFua0xpbmUsICcnKS5zcGxpdCgnXFxuJykgOiBbXTtcbiAgICAgICAgY29uc3QgaXRlbSA9IHtcbiAgICAgICAgICAgIHR5cGU6ICd0YWJsZScsXG4gICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgIGhlYWRlcjogW10sXG4gICAgICAgICAgICBhbGlnbjogW10sXG4gICAgICAgICAgICByb3dzOiBbXSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGhlYWRlcnMubGVuZ3RoICE9PSBhbGlnbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBoZWFkZXIgYW5kIGFsaWduIGNvbHVtbnMgbXVzdCBiZSBlcXVhbCwgcm93cyBjYW4gYmUgZGlmZmVyZW50LlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3QgYWxpZ24gb2YgYWxpZ25zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ydWxlcy5vdGhlci50YWJsZUFsaWduUmlnaHQudGVzdChhbGlnbikpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmFsaWduLnB1c2goJ3JpZ2h0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnJ1bGVzLm90aGVyLnRhYmxlQWxpZ25DZW50ZXIudGVzdChhbGlnbikpIHtcbiAgICAgICAgICAgICAgICBpdGVtLmFsaWduLnB1c2goJ2NlbnRlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5ydWxlcy5vdGhlci50YWJsZUFsaWduTGVmdC50ZXN0KGFsaWduKSkge1xuICAgICAgICAgICAgICAgIGl0ZW0uYWxpZ24ucHVzaCgnbGVmdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbS5hbGlnbi5wdXNoKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVhZGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaXRlbS5oZWFkZXIucHVzaCh7XG4gICAgICAgICAgICAgICAgdGV4dDogaGVhZGVyc1tpXSxcbiAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lKGhlYWRlcnNbaV0pLFxuICAgICAgICAgICAgICAgIGhlYWRlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhbGlnbjogaXRlbS5hbGlnbltpXSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgICAgICAgIGl0ZW0ucm93cy5wdXNoKHNwbGl0Q2VsbHMocm93LCBpdGVtLmhlYWRlci5sZW5ndGgpLm1hcCgoY2VsbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IGNlbGwsXG4gICAgICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmUoY2VsbCksXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiBpdGVtLmFsaWduW2ldLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfVxuICAgIGxoZWFkaW5nKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmxoZWFkaW5nLmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgZGVwdGg6IGNhcFsyXS5jaGFyQXQoMCkgPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNhcFsxXSxcbiAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lKGNhcFsxXSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhcmFncmFwaChzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5wYXJhZ3JhcGguZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0ID0gY2FwWzFdLmNoYXJBdChjYXBbMV0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nXG4gICAgICAgICAgICAgICAgPyBjYXBbMV0uc2xpY2UoMCwgLTEpXG4gICAgICAgICAgICAgICAgOiBjYXBbMV07XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZSh0ZXh0KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGV4dChzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5ibG9jay50ZXh0LmV4ZWMoc3JjKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmUoY2FwWzBdKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZXNjYXBlKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5lc2NhcGUuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdlc2NhcGUnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNhcFsxXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGFnKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS50YWcuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rICYmIHRoaXMucnVsZXMub3RoZXIuc3RhcnRBVGFnLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rICYmIHRoaXMucnVsZXMub3RoZXIuZW5kQVRhZy50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLmluTGluayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgJiYgdGhpcy5ydWxlcy5vdGhlci5zdGFydFByZVNjcmlwdFRhZy50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrICYmIHRoaXMucnVsZXMub3RoZXIuZW5kUHJlU2NyaXB0VGFnLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgaW5MaW5rOiB0aGlzLmxleGVyLnN0YXRlLmluTGluayxcbiAgICAgICAgICAgICAgICBpblJhd0Jsb2NrOiB0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2ssXG4gICAgICAgICAgICAgICAgYmxvY2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNhcFswXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGluayhzcmMpIHtcbiAgICAgICAgY29uc3QgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUubGluay5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGNvbnN0IHRyaW1tZWRVcmwgPSBjYXBbMl0udHJpbSgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGVkYW50aWMgJiYgdGhpcy5ydWxlcy5vdGhlci5zdGFydEFuZ2xlQnJhY2tldC50ZXN0KHRyaW1tZWRVcmwpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29tbW9ubWFyayByZXF1aXJlcyBtYXRjaGluZyBhbmdsZSBicmFja2V0c1xuICAgICAgICAgICAgICAgIGlmICghKHRoaXMucnVsZXMub3RoZXIuZW5kQW5nbGVCcmFja2V0LnRlc3QodHJpbW1lZFVybCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZW5kaW5nIGFuZ2xlIGJyYWNrZXQgY2Fubm90IGJlIGVzY2FwZWRcbiAgICAgICAgICAgICAgICBjb25zdCBydHJpbVNsYXNoID0gcnRyaW0odHJpbW1lZFVybC5zbGljZSgwLCAtMSksICdcXFxcJyk7XG4gICAgICAgICAgICAgICAgaWYgKCh0cmltbWVkVXJsLmxlbmd0aCAtIHJ0cmltU2xhc2gubGVuZ3RoKSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGZpbmQgY2xvc2luZyBwYXJlbnRoZXNpc1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RQYXJlbkluZGV4ID0gZmluZENsb3NpbmdCcmFja2V0KGNhcFsyXSwgJygpJyk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RQYXJlbkluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBjYXBbMF0uaW5kZXhPZignIScpID09PSAwID8gNSA6IDQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtMZW4gPSBzdGFydCArIGNhcFsxXS5sZW5ndGggKyBsYXN0UGFyZW5JbmRleDtcbiAgICAgICAgICAgICAgICAgICAgY2FwWzJdID0gY2FwWzJdLnN1YnN0cmluZygwLCBsYXN0UGFyZW5JbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIGNhcFswXSA9IGNhcFswXS5zdWJzdHJpbmcoMCwgbGlua0xlbikudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICBjYXBbM10gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgaHJlZiA9IGNhcFsyXTtcbiAgICAgICAgICAgIGxldCB0aXRsZSA9ICcnO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAgIC8vIHNwbGl0IHBlZGFudGljIGhyZWYgYW5kIHRpdGxlXG4gICAgICAgICAgICAgICAgY29uc3QgbGluayA9IHRoaXMucnVsZXMub3RoZXIucGVkYW50aWNIcmVmVGl0bGUuZXhlYyhocmVmKTtcbiAgICAgICAgICAgICAgICBpZiAobGluaykge1xuICAgICAgICAgICAgICAgICAgICBocmVmID0gbGlua1sxXTtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGUgPSBsaW5rWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpdGxlID0gY2FwWzNdID8gY2FwWzNdLnNsaWNlKDEsIC0xKSA6ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaHJlZiA9IGhyZWYudHJpbSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMucnVsZXMub3RoZXIuc3RhcnRBbmdsZUJyYWNrZXQudGVzdChocmVmKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMgJiYgISh0aGlzLnJ1bGVzLm90aGVyLmVuZEFuZ2xlQnJhY2tldC50ZXN0KHRyaW1tZWRVcmwpKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBwZWRhbnRpYyBhbGxvd3Mgc3RhcnRpbmcgYW5nbGUgYnJhY2tldCB3aXRob3V0IGVuZGluZyBhbmdsZSBicmFja2V0XG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSwgLTEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXRMaW5rKGNhcCwge1xuICAgICAgICAgICAgICAgIGhyZWY6IGhyZWYgPyBocmVmLnJlcGxhY2UodGhpcy5ydWxlcy5pbmxpbmUuYW55UHVuY3R1YXRpb24sICckMScpIDogaHJlZixcbiAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUgPyB0aXRsZS5yZXBsYWNlKHRoaXMucnVsZXMuaW5saW5lLmFueVB1bmN0dWF0aW9uLCAnJDEnKSA6IHRpdGxlLFxuICAgICAgICAgICAgfSwgY2FwWzBdLCB0aGlzLmxleGVyLCB0aGlzLnJ1bGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZWZsaW5rKHNyYywgbGlua3MpIHtcbiAgICAgICAgbGV0IGNhcDtcbiAgICAgICAgaWYgKChjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5yZWZsaW5rLmV4ZWMoc3JjKSlcbiAgICAgICAgICAgIHx8IChjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5ub2xpbmsuZXhlYyhzcmMpKSkge1xuICAgICAgICAgICAgY29uc3QgbGlua1N0cmluZyA9IChjYXBbMl0gfHwgY2FwWzFdKS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIubXVsdGlwbGVTcGFjZUdsb2JhbCwgJyAnKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBsaW5rc1tsaW5rU3RyaW5nLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICAgICAgaWYgKCFsaW5rKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGNhcFswXS5jaGFyQXQoMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICByYXc6IHRleHQsXG4gICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXRMaW5rKGNhcCwgbGluaywgY2FwWzBdLCB0aGlzLmxleGVyLCB0aGlzLnJ1bGVzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbVN0cm9uZyhzcmMsIG1hc2tlZFNyYywgcHJldkNoYXIgPSAnJykge1xuICAgICAgICBsZXQgbWF0Y2ggPSB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZ0xEZWxpbS5leGVjKHNyYyk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIF8gY2FuJ3QgYmUgYmV0d2VlbiB0d28gYWxwaGFudW1lcmljcy4gXFxwe0x9XFxwe059IGluY2x1ZGVzIG5vbi1lbmdsaXNoIGFscGhhYmV0L251bWJlcnMgYXMgd2VsbFxuICAgICAgICBpZiAobWF0Y2hbM10gJiYgcHJldkNoYXIubWF0Y2godGhpcy5ydWxlcy5vdGhlci51bmljb2RlQWxwaGFOdW1lcmljKSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgY29uc3QgbmV4dENoYXIgPSBtYXRjaFsxXSB8fCBtYXRjaFsyXSB8fCAnJztcbiAgICAgICAgaWYgKCFuZXh0Q2hhciB8fCAhcHJldkNoYXIgfHwgdGhpcy5ydWxlcy5pbmxpbmUucHVuY3R1YXRpb24uZXhlYyhwcmV2Q2hhcikpIHtcbiAgICAgICAgICAgIC8vIHVuaWNvZGUgUmVnZXggY291bnRzIGVtb2ppIGFzIDEgY2hhcjsgc3ByZWFkIGludG8gYXJyYXkgZm9yIHByb3BlciBjb3VudCAodXNlZCBtdWx0aXBsZSB0aW1lcyBiZWxvdylcbiAgICAgICAgICAgIGNvbnN0IGxMZW5ndGggPSBbLi4ubWF0Y2hbMF1dLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBsZXQgckRlbGltLCByTGVuZ3RoLCBkZWxpbVRvdGFsID0gbExlbmd0aCwgbWlkRGVsaW1Ub3RhbCA9IDA7XG4gICAgICAgICAgICBjb25zdCBlbmRSZWcgPSBtYXRjaFswXVswXSA9PT0gJyonID8gdGhpcy5ydWxlcy5pbmxpbmUuZW1TdHJvbmdSRGVsaW1Bc3QgOiB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZ1JEZWxpbVVuZDtcbiAgICAgICAgICAgIGVuZFJlZy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgLy8gQ2xpcCBtYXNrZWRTcmMgdG8gc2FtZSBzZWN0aW9uIG9mIHN0cmluZyBhcyBzcmMgKG1vdmUgdG8gbGV4ZXI/KVxuICAgICAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKC0xICogc3JjLmxlbmd0aCArIGxMZW5ndGgpO1xuICAgICAgICAgICAgd2hpbGUgKChtYXRjaCA9IGVuZFJlZy5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByRGVsaW0gPSBtYXRjaFsxXSB8fCBtYXRjaFsyXSB8fCBtYXRjaFszXSB8fCBtYXRjaFs0XSB8fCBtYXRjaFs1XSB8fCBtYXRjaFs2XTtcbiAgICAgICAgICAgICAgICBpZiAoIXJEZWxpbSlcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIHNraXAgc2luZ2xlICogaW4gX19hYmMqYWJjX19cbiAgICAgICAgICAgICAgICByTGVuZ3RoID0gWy4uLnJEZWxpbV0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaFszXSB8fCBtYXRjaFs0XSkgeyAvLyBmb3VuZCBhbm90aGVyIExlZnQgRGVsaW1cbiAgICAgICAgICAgICAgICAgICAgZGVsaW1Ub3RhbCArPSByTGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobWF0Y2hbNV0gfHwgbWF0Y2hbNl0pIHsgLy8gZWl0aGVyIExlZnQgb3IgUmlnaHQgRGVsaW1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxMZW5ndGggJSAzICYmICEoKGxMZW5ndGggKyByTGVuZ3RoKSAlIDMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaWREZWxpbVRvdGFsICs9IHJMZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8gQ29tbW9uTWFyayBFbXBoYXNpcyBSdWxlcyA5LTEwXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVsaW1Ub3RhbCAtPSByTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChkZWxpbVRvdGFsID4gMClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7IC8vIEhhdmVuJ3QgZm91bmQgZW5vdWdoIGNsb3NpbmcgZGVsaW1pdGVyc1xuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBleHRyYSBjaGFyYWN0ZXJzLiAqYSoqKiAtPiAqYSpcbiAgICAgICAgICAgICAgICByTGVuZ3RoID0gTWF0aC5taW4ockxlbmd0aCwgckxlbmd0aCArIGRlbGltVG90YWwgKyBtaWREZWxpbVRvdGFsKTtcbiAgICAgICAgICAgICAgICAvLyBjaGFyIGxlbmd0aCBjYW4gYmUgPjEgZm9yIHVuaWNvZGUgY2hhcmFjdGVycztcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0Q2hhckxlbmd0aCA9IFsuLi5tYXRjaFswXV1bMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhdyA9IHNyYy5zbGljZSgwLCBsTGVuZ3RoICsgbWF0Y2guaW5kZXggKyBsYXN0Q2hhckxlbmd0aCArIHJMZW5ndGgpO1xuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBgZW1gIGlmIHNtYWxsZXN0IGRlbGltaXRlciBoYXMgb2RkIGNoYXIgY291bnQuICphKioqXG4gICAgICAgICAgICAgICAgaWYgKE1hdGgubWluKGxMZW5ndGgsIHJMZW5ndGgpICUgMikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gcmF3LnNsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICByYXcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZVRva2Vucyh0ZXh0KSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlICdzdHJvbmcnIGlmIHNtYWxsZXN0IGRlbGltaXRlciBoYXMgZXZlbiBjaGFyIGNvdW50LiAqKmEqKipcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gcmF3LnNsaWNlKDIsIC0yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3Ryb25nJyxcbiAgICAgICAgICAgICAgICAgICAgcmF3LFxuICAgICAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lVG9rZW5zKHRleHQpLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29kZXNwYW4oc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmNvZGUuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBsZXQgdGV4dCA9IGNhcFsyXS5yZXBsYWNlKHRoaXMucnVsZXMub3RoZXIubmV3TGluZUNoYXJHbG9iYWwsICcgJyk7XG4gICAgICAgICAgICBjb25zdCBoYXNOb25TcGFjZUNoYXJzID0gdGhpcy5ydWxlcy5vdGhlci5ub25TcGFjZUNoYXIudGVzdCh0ZXh0KTtcbiAgICAgICAgICAgIGNvbnN0IGhhc1NwYWNlQ2hhcnNPbkJvdGhFbmRzID0gdGhpcy5ydWxlcy5vdGhlci5zdGFydGluZ1NwYWNlQ2hhci50ZXN0KHRleHQpICYmIHRoaXMucnVsZXMub3RoZXIuZW5kaW5nU3BhY2VDaGFyLnRlc3QodGV4dCk7XG4gICAgICAgICAgICBpZiAoaGFzTm9uU3BhY2VDaGFycyAmJiBoYXNTcGFjZUNoYXJzT25Cb3RoRW5kcykge1xuICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnN1YnN0cmluZygxLCB0ZXh0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnY29kZXNwYW4nLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGJyKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5ici5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2JyJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGVsKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5kZWwuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkZWwnLFxuICAgICAgICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgICAgICAgIHRleHQ6IGNhcFsyXSxcbiAgICAgICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lVG9rZW5zKGNhcFsyXSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGF1dG9saW5rKHNyYykge1xuICAgICAgICBjb25zdCBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5hdXRvbGluay5leGVjKHNyYyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICAgIGxldCB0ZXh0LCBocmVmO1xuICAgICAgICAgICAgaWYgKGNhcFsyXSA9PT0gJ0AnKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGNhcFsxXTtcbiAgICAgICAgICAgICAgICBocmVmID0gJ21haWx0bzonICsgdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRleHQgPSBjYXBbMV07XG4gICAgICAgICAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgIGhyZWYsXG4gICAgICAgICAgICAgICAgdG9rZW5zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhdzogdGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXJsKHNyYykge1xuICAgICAgICBsZXQgY2FwO1xuICAgICAgICBpZiAoY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUudXJsLmV4ZWMoc3JjKSkge1xuICAgICAgICAgICAgbGV0IHRleHQsIGhyZWY7XG4gICAgICAgICAgICBpZiAoY2FwWzJdID09PSAnQCcpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gY2FwWzBdO1xuICAgICAgICAgICAgICAgIGhyZWYgPSAnbWFpbHRvOicgKyB0ZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZG8gZXh0ZW5kZWQgYXV0b2xpbmsgcGF0aCB2YWxpZGF0aW9uXG4gICAgICAgICAgICAgICAgbGV0IHByZXZDYXBaZXJvO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkNhcFplcm8gPSBjYXBbMF07XG4gICAgICAgICAgICAgICAgICAgIGNhcFswXSA9IHRoaXMucnVsZXMuaW5saW5lLl9iYWNrcGVkYWwuZXhlYyhjYXBbMF0pPy5bMF0gPz8gJyc7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAocHJldkNhcFplcm8gIT09IGNhcFswXSk7XG4gICAgICAgICAgICAgICAgdGV4dCA9IGNhcFswXTtcbiAgICAgICAgICAgICAgICBpZiAoY2FwWzFdID09PSAnd3d3LicpIHtcbiAgICAgICAgICAgICAgICAgICAgaHJlZiA9ICdodHRwOi8vJyArIGNhcFswXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhyZWYgPSBjYXBbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dCxcbiAgICAgICAgICAgICAgICBocmVmLFxuICAgICAgICAgICAgICAgIHRva2VuczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByYXc6IHRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlubGluZVRleHQoc3JjKSB7XG4gICAgICAgIGNvbnN0IGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnRleHQuZXhlYyhzcmMpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgICBjb25zdCBlc2NhcGVkID0gdGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgICAgICAgdGV4dDogY2FwWzBdLFxuICAgICAgICAgICAgICAgIGVzY2FwZWQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIEJsb2NrIExleGVyXG4gKi9cbmNsYXNzIF9MZXhlciB7XG4gICAgdG9rZW5zO1xuICAgIG9wdGlvbnM7XG4gICAgc3RhdGU7XG4gICAgdG9rZW5pemVyO1xuICAgIGlubGluZVF1ZXVlO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgLy8gVG9rZW5MaXN0IGNhbm5vdCBiZSBjcmVhdGVkIGluIG9uZSBnb1xuICAgICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgICAgICB0aGlzLnRva2Vucy5saW5rcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgX2RlZmF1bHRzO1xuICAgICAgICB0aGlzLm9wdGlvbnMudG9rZW5pemVyID0gdGhpcy5vcHRpb25zLnRva2VuaXplciB8fCBuZXcgX1Rva2VuaXplcigpO1xuICAgICAgICB0aGlzLnRva2VuaXplciA9IHRoaXMub3B0aW9ucy50b2tlbml6ZXI7XG4gICAgICAgIHRoaXMudG9rZW5pemVyLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIHRoaXMudG9rZW5pemVyLmxleGVyID0gdGhpcztcbiAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZSA9IFtdO1xuICAgICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICAgICAgaW5MaW5rOiBmYWxzZSxcbiAgICAgICAgICAgIGluUmF3QmxvY2s6IGZhbHNlLFxuICAgICAgICAgICAgdG9wOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBydWxlcyA9IHtcbiAgICAgICAgICAgIG90aGVyLFxuICAgICAgICAgICAgYmxvY2s6IGJsb2NrLm5vcm1hbCxcbiAgICAgICAgICAgIGlubGluZTogaW5saW5lLm5vcm1hbCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgcnVsZXMuYmxvY2sgPSBibG9jay5wZWRhbnRpYztcbiAgICAgICAgICAgIHJ1bGVzLmlubGluZSA9IGlubGluZS5wZWRhbnRpYztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICAgICAgICBydWxlcy5ibG9jayA9IGJsb2NrLmdmbTtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICAgICAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLmJyZWFrcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJ1bGVzLmlubGluZSA9IGlubGluZS5nZm07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50b2tlbml6ZXIucnVsZXMgPSBydWxlcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogRXhwb3NlIFJ1bGVzXG4gICAgICovXG4gICAgc3RhdGljIGdldCBydWxlcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJsb2NrLFxuICAgICAgICAgICAgaW5saW5lLFxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgTGV4IE1ldGhvZFxuICAgICAqL1xuICAgIHN0YXRpYyBsZXgoc3JjLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGxleGVyID0gbmV3IF9MZXhlcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIGxleGVyLmxleChzcmMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgTGV4IElubGluZSBNZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgbGV4SW5saW5lKHNyYywgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBsZXhlciA9IG5ldyBfTGV4ZXIob3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBsZXhlci5pbmxpbmVUb2tlbnMoc3JjKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJlcHJvY2Vzc2luZ1xuICAgICAqL1xuICAgIGxleChzcmMpIHtcbiAgICAgICAgc3JjID0gc3JjLnJlcGxhY2Uob3RoZXIuY2FycmlhZ2VSZXR1cm4sICdcXG4nKTtcbiAgICAgICAgdGhpcy5ibG9ja1Rva2VucyhzcmMsIHRoaXMudG9rZW5zKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlubGluZVF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5pbmxpbmVRdWV1ZVtpXTtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lVG9rZW5zKG5leHQuc3JjLCBuZXh0LnRva2Vucyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZSA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gICAgfVxuICAgIGJsb2NrVG9rZW5zKHNyYywgdG9rZW5zID0gW10sIGxhc3RQYXJhZ3JhcGhDbGlwcGVkID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgc3JjID0gc3JjLnJlcGxhY2Uob3RoZXIudGFiQ2hhckdsb2JhbCwgJyAgICAnKS5yZXBsYWNlKG90aGVyLnNwYWNlTGluZSwgJycpO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChzcmMpIHtcbiAgICAgICAgICAgIGxldCB0b2tlbjtcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucz8uYmxvY2s/LnNvbWUoKGV4dFRva2VuaXplcikgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbiA9IGV4dFRva2VuaXplci5jYWxsKHsgbGV4ZXI6IHRoaXMgfSwgc3JjLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBuZXdsaW5lXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5zcGFjZShzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VG9rZW4gPSB0b2tlbnMuYXQoLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5yYXcubGVuZ3RoID09PSAxICYmIGxhc3RUb2tlbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlJ3MgYSBzaW5nbGUgXFxuIGFzIGEgc3BhY2VyLCBpdCdzIHRlcm1pbmF0aW5nIHRoZSBsYXN0IGxpbmUsXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvIG1vdmUgaXQgdGhlcmUgc28gdGhhdCB3ZSBkb24ndCBnZXQgdW5uZWNlc3NhcnkgcGFyYWdyYXBoIHRhZ3NcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb2RlXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5jb2RlKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgLy8gQW4gaW5kZW50ZWQgY29kZSBibG9jayBjYW5ub3QgaW50ZXJydXB0IGEgcGFyYWdyYXBoLlxuICAgICAgICAgICAgICAgIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICdwYXJhZ3JhcGgnIHx8IGxhc3RUb2tlbj8udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9ICdcXG4nICsgdG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5hdCgtMSkuc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZmVuY2VzXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5mZW5jZXMoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaGVhZGluZ1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaGVhZGluZyhzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoclxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaHIoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYmxvY2txdW90ZVxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuYmxvY2txdW90ZShzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsaXN0XG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5saXN0KHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGh0bWxcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmh0bWwoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZGVmXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5kZWYoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFRva2VuID0gdG9rZW5zLmF0KC0xKTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdFRva2VuPy50eXBlID09PSAncGFyYWdyYXBoJyB8fCBsYXN0VG9rZW4/LnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9ICdcXG4nICsgdG9rZW4ucmF3O1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5hdCgtMSkuc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCF0aGlzLnRva2Vucy5saW5rc1t0b2tlbi50YWddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9rZW5zLmxpbmtzW3Rva2VuLnRhZ10gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBocmVmOiB0b2tlbi5ocmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHRva2VuLnRpdGxlLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRhYmxlIChnZm0pXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci50YWJsZShzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsaGVhZGluZ1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIubGhlYWRpbmcoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdG9wLWxldmVsIHBhcmFncmFwaFxuICAgICAgICAgICAgLy8gcHJldmVudCBwYXJhZ3JhcGggY29uc3VtaW5nIGV4dGVuc2lvbnMgYnkgY2xpcHBpbmcgJ3NyYycgdG8gZXh0ZW5zaW9uIHN0YXJ0XG4gICAgICAgICAgICBsZXQgY3V0U3JjID0gc3JjO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zPy5zdGFydEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0SW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wU3JjID0gc3JjLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wU3RhcnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuc3RhcnRCbG9jay5mb3JFYWNoKChnZXRTdGFydEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBTdGFydCA9IGdldFN0YXJ0SW5kZXguY2FsbCh7IGxleGVyOiB0aGlzIH0sIHRlbXBTcmMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBTdGFydCA9PT0gJ251bWJlcicgJiYgdGVtcFN0YXJ0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1pbihzdGFydEluZGV4LCB0ZW1wU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCBJbmZpbml0eSAmJiBzdGFydEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY3V0U3JjID0gc3JjLnN1YnN0cmluZygwLCBzdGFydEluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUudG9wICYmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnBhcmFncmFwaChjdXRTcmMpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RQYXJhZ3JhcGhDbGlwcGVkICYmIGxhc3RUb2tlbj8udHlwZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gJ1xcbicgKyB0b2tlbi50ZXh0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLmF0KC0xKS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdFBhcmFncmFwaENsaXBwZWQgPSBjdXRTcmMubGVuZ3RoICE9PSBzcmMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0ZXh0XG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci50ZXh0KHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RUb2tlbiA9IHRva2Vucy5hdCgtMSk7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RUb2tlbj8udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9ICdcXG4nICsgdG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5hdCgtMSkuc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyck1zZyA9ICdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUudG9wID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9XG4gICAgaW5saW5lKHNyYywgdG9rZW5zID0gW10pIHtcbiAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5wdXNoKHsgc3JjLCB0b2tlbnMgfSk7XG4gICAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExleGluZy9Db21waWxpbmdcbiAgICAgKi9cbiAgICBpbmxpbmVUb2tlbnMoc3JjLCB0b2tlbnMgPSBbXSkge1xuICAgICAgICAvLyBTdHJpbmcgd2l0aCBsaW5rcyBtYXNrZWQgdG8gYXZvaWQgaW50ZXJmZXJlbmNlIHdpdGggZW0gYW5kIHN0cm9uZ1xuICAgICAgICBsZXQgbWFza2VkU3JjID0gc3JjO1xuICAgICAgICBsZXQgbWF0Y2ggPSBudWxsO1xuICAgICAgICAvLyBNYXNrIG91dCByZWZsaW5rc1xuICAgICAgICBpZiAodGhpcy50b2tlbnMubGlua3MpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtzID0gT2JqZWN0LmtleXModGhpcy50b2tlbnMubGlua3MpO1xuICAgICAgICAgICAgaWYgKGxpbmtzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLnJlZmxpbmtTZWFyY2guZXhlYyhtYXNrZWRTcmMpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5rcy5pbmNsdWRlcyhtYXRjaFswXS5zbGljZShtYXRjaFswXS5sYXN0SW5kZXhPZignWycpICsgMSwgLTEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKDAsIG1hdGNoLmluZGV4KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ1snICsgJ2EnLnJlcGVhdChtYXRjaFswXS5sZW5ndGggLSAyKSArICddJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgbWFza2VkU3JjLnNsaWNlKHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5yZWZsaW5rU2VhcmNoLmxhc3RJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFzayBvdXQgZXNjYXBlZCBjaGFyYWN0ZXJzXG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUuYW55UHVuY3R1YXRpb24uZXhlYyhtYXNrZWRTcmMpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoMCwgbWF0Y2guaW5kZXgpICsgJysrJyArIG1hc2tlZFNyYy5zbGljZSh0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUuYW55UHVuY3R1YXRpb24ubGFzdEluZGV4KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBNYXNrIG91dCBvdGhlciBibG9ja3NcbiAgICAgICAgd2hpbGUgKChtYXRjaCA9IHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5ibG9ja1NraXAuZXhlYyhtYXNrZWRTcmMpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoMCwgbWF0Y2guaW5kZXgpICsgJ1snICsgJ2EnLnJlcGVhdChtYXRjaFswXS5sZW5ndGggLSAyKSArICddJyArIG1hc2tlZFNyYy5zbGljZSh0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUuYmxvY2tTa2lwLmxhc3RJbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGtlZXBQcmV2Q2hhciA9IGZhbHNlO1xuICAgICAgICBsZXQgcHJldkNoYXIgPSAnJztcbiAgICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICAgICAgaWYgKCFrZWVwUHJldkNoYXIpIHtcbiAgICAgICAgICAgICAgICBwcmV2Q2hhciA9ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2VlcFByZXZDaGFyID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgICAgICAvLyBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnM/LmlubGluZT8uc29tZSgoZXh0VG9rZW5pemVyKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuID0gZXh0VG9rZW5pemVyLmNhbGwoeyBsZXhlcjogdGhpcyB9LCBzcmMsIHRva2VucykpIHtcbiAgICAgICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVzY2FwZVxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZXNjYXBlKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRhZ1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIudGFnKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxpbmtcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmxpbmsoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmVmbGluaywgbm9saW5rXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5yZWZsaW5rKHNyYywgdGhpcy50b2tlbnMubGlua3MpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VG9rZW4gPSB0b2tlbnMuYXQoLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSAndGV4dCcgJiYgbGFzdFRva2VuPy50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSB0b2tlbi5yYXc7XG4gICAgICAgICAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9IHRva2VuLnRleHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZW0gJiBzdHJvbmdcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmVtU3Ryb25nKHNyYywgbWFza2VkU3JjLCBwcmV2Q2hhcikpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvZGVcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmNvZGVzcGFuKHNyYykpIHtcbiAgICAgICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGJyXG4gICAgICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5icihzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkZWwgKGdmbSlcbiAgICAgICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmRlbChzcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBhdXRvbGlua1xuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuYXV0b2xpbmsoc3JjKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXJsIChnZm0pXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW5MaW5rICYmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnVybChzcmMpKSkge1xuICAgICAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdGV4dFxuICAgICAgICAgICAgLy8gcHJldmVudCBpbmxpbmVUZXh0IGNvbnN1bWluZyBleHRlbnNpb25zIGJ5IGNsaXBwaW5nICdzcmMnIHRvIGV4dGVuc2lvbiBzdGFydFxuICAgICAgICAgICAgbGV0IGN1dFNyYyA9IHNyYztcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucz8uc3RhcnRJbmxpbmUpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhcnRJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBTcmMgPSBzcmMuc2xpY2UoMSk7XG4gICAgICAgICAgICAgICAgbGV0IHRlbXBTdGFydDtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5zdGFydElubGluZS5mb3JFYWNoKChnZXRTdGFydEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBTdGFydCA9IGdldFN0YXJ0SW5kZXguY2FsbCh7IGxleGVyOiB0aGlzIH0sIHRlbXBTcmMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBTdGFydCA9PT0gJ251bWJlcicgJiYgdGVtcFN0YXJ0ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1pbihzdGFydEluZGV4LCB0ZW1wU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCBJbmZpbml0eSAmJiBzdGFydEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY3V0U3JjID0gc3JjLnN1YnN0cmluZygwLCBzdGFydEluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaW5saW5lVGV4dChjdXRTcmMpKSB7XG4gICAgICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4ucmF3LnNsaWNlKC0xKSAhPT0gJ18nKSB7IC8vIFRyYWNrIHByZXZDaGFyIGJlZm9yZSBzdHJpbmcgb2YgX19fXyBzdGFydGVkXG4gICAgICAgICAgICAgICAgICAgIHByZXZDaGFyID0gdG9rZW4ucmF3LnNsaWNlKC0xKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAga2VlcFByZXZDaGFyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0VG9rZW4gPSB0b2tlbnMuYXQoLTEpO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0VG9rZW4/LnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9IHRva2VuLnJhdztcbiAgICAgICAgICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gdG9rZW4udGV4dDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3JjKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyTXNnID0gJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9XG59XG5cbi8qKlxuICogUmVuZGVyZXJcbiAqL1xuY2xhc3MgX1JlbmRlcmVyIHtcbiAgICBvcHRpb25zO1xuICAgIHBhcnNlcjsgLy8gc2V0IGJ5IHRoZSBwYXJzZXJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgX2RlZmF1bHRzO1xuICAgIH1cbiAgICBzcGFjZSh0b2tlbikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvZGUoeyB0ZXh0LCBsYW5nLCBlc2NhcGVkIH0pIHtcbiAgICAgICAgY29uc3QgbGFuZ1N0cmluZyA9IChsYW5nIHx8ICcnKS5tYXRjaChvdGhlci5ub3RTcGFjZVN0YXJ0KT8uWzBdO1xuICAgICAgICBjb25zdCBjb2RlID0gdGV4dC5yZXBsYWNlKG90aGVyLmVuZGluZ05ld2xpbmUsICcnKSArICdcXG4nO1xuICAgICAgICBpZiAoIWxhbmdTdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiAnPHByZT48Y29kZT4nXG4gICAgICAgICAgICAgICAgKyAoZXNjYXBlZCA/IGNvZGUgOiBlc2NhcGUoY29kZSwgdHJ1ZSkpXG4gICAgICAgICAgICAgICAgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICc8cHJlPjxjb2RlIGNsYXNzPVwibGFuZ3VhZ2UtJ1xuICAgICAgICAgICAgKyBlc2NhcGUobGFuZ1N0cmluZylcbiAgICAgICAgICAgICsgJ1wiPidcbiAgICAgICAgICAgICsgKGVzY2FwZWQgPyBjb2RlIDogZXNjYXBlKGNvZGUsIHRydWUpKVxuICAgICAgICAgICAgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgfVxuICAgIGJsb2NrcXVvdGUoeyB0b2tlbnMgfSkge1xuICAgICAgICBjb25zdCBib2R5ID0gdGhpcy5wYXJzZXIucGFyc2UodG9rZW5zKTtcbiAgICAgICAgcmV0dXJuIGA8YmxvY2txdW90ZT5cXG4ke2JvZHl9PC9ibG9ja3F1b3RlPlxcbmA7XG4gICAgfVxuICAgIGh0bWwoeyB0ZXh0IH0pIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGhlYWRpbmcoeyB0b2tlbnMsIGRlcHRoIH0pIHtcbiAgICAgICAgcmV0dXJuIGA8aCR7ZGVwdGh9PiR7dGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKX08L2gke2RlcHRofT5cXG5gO1xuICAgIH1cbiAgICBocih0b2tlbikge1xuICAgICAgICByZXR1cm4gJzxocj5cXG4nO1xuICAgIH1cbiAgICBsaXN0KHRva2VuKSB7XG4gICAgICAgIGNvbnN0IG9yZGVyZWQgPSB0b2tlbi5vcmRlcmVkO1xuICAgICAgICBjb25zdCBzdGFydCA9IHRva2VuLnN0YXJ0O1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRva2VuLml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdG9rZW4uaXRlbXNbal07XG4gICAgICAgICAgICBib2R5ICs9IHRoaXMubGlzdGl0ZW0oaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdHlwZSA9IG9yZGVyZWQgPyAnb2wnIDogJ3VsJztcbiAgICAgICAgY29uc3Qgc3RhcnRBdHRyID0gKG9yZGVyZWQgJiYgc3RhcnQgIT09IDEpID8gKCcgc3RhcnQ9XCInICsgc3RhcnQgKyAnXCInKSA6ICcnO1xuICAgICAgICByZXR1cm4gJzwnICsgdHlwZSArIHN0YXJ0QXR0ciArICc+XFxuJyArIGJvZHkgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbiAgICB9XG4gICAgbGlzdGl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgaXRlbUJvZHkgPSAnJztcbiAgICAgICAgaWYgKGl0ZW0udGFzaykge1xuICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSB0aGlzLmNoZWNrYm94KHsgY2hlY2tlZDogISFpdGVtLmNoZWNrZWQgfSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5sb29zZSkge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnRva2Vuc1swXT8udHlwZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50b2tlbnNbMF0udGV4dCA9IGNoZWNrYm94ICsgJyAnICsgaXRlbS50b2tlbnNbMF0udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udG9rZW5zWzBdLnRva2VucyAmJiBpdGVtLnRva2Vuc1swXS50b2tlbnMubGVuZ3RoID4gMCAmJiBpdGVtLnRva2Vuc1swXS50b2tlbnNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRva2Vuc1swXS50b2tlbnNbMF0udGV4dCA9IGNoZWNrYm94ICsgJyAnICsgZXNjYXBlKGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50b2tlbnMudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICByYXc6IGNoZWNrYm94ICsgJyAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogY2hlY2tib3ggKyAnICcsXG4gICAgICAgICAgICAgICAgICAgICAgICBlc2NhcGVkOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpdGVtQm9keSArPSBjaGVja2JveCArICcgJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpdGVtQm9keSArPSB0aGlzLnBhcnNlci5wYXJzZShpdGVtLnRva2VucywgISFpdGVtLmxvb3NlKTtcbiAgICAgICAgcmV0dXJuIGA8bGk+JHtpdGVtQm9keX08L2xpPlxcbmA7XG4gICAgfVxuICAgIGNoZWNrYm94KHsgY2hlY2tlZCB9KSB7XG4gICAgICAgIHJldHVybiAnPGlucHV0ICdcbiAgICAgICAgICAgICsgKGNoZWNrZWQgPyAnY2hlY2tlZD1cIlwiICcgOiAnJylcbiAgICAgICAgICAgICsgJ2Rpc2FibGVkPVwiXCIgdHlwZT1cImNoZWNrYm94XCI+JztcbiAgICB9XG4gICAgcGFyYWdyYXBoKHsgdG9rZW5zIH0pIHtcbiAgICAgICAgcmV0dXJuIGA8cD4ke3RoaXMucGFyc2VyLnBhcnNlSW5saW5lKHRva2Vucyl9PC9wPlxcbmA7XG4gICAgfVxuICAgIHRhYmxlKHRva2VuKSB7XG4gICAgICAgIGxldCBoZWFkZXIgPSAnJztcbiAgICAgICAgLy8gaGVhZGVyXG4gICAgICAgIGxldCBjZWxsID0gJyc7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdG9rZW4uaGVhZGVyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjZWxsICs9IHRoaXMudGFibGVjZWxsKHRva2VuLmhlYWRlcltqXSk7XG4gICAgICAgIH1cbiAgICAgICAgaGVhZGVyICs9IHRoaXMudGFibGVyb3coeyB0ZXh0OiBjZWxsIH0pO1xuICAgICAgICBsZXQgYm9keSA9ICcnO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRva2VuLnJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJvdyA9IHRva2VuLnJvd3Nbal07XG4gICAgICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJvdy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIGNlbGwgKz0gdGhpcy50YWJsZWNlbGwocm93W2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy50YWJsZXJvdyh7IHRleHQ6IGNlbGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHkpXG4gICAgICAgICAgICBib2R5ID0gYDx0Ym9keT4ke2JvZHl9PC90Ym9keT5gO1xuICAgICAgICByZXR1cm4gJzx0YWJsZT5cXG4nXG4gICAgICAgICAgICArICc8dGhlYWQ+XFxuJ1xuICAgICAgICAgICAgKyBoZWFkZXJcbiAgICAgICAgICAgICsgJzwvdGhlYWQ+XFxuJ1xuICAgICAgICAgICAgKyBib2R5XG4gICAgICAgICAgICArICc8L3RhYmxlPlxcbic7XG4gICAgfVxuICAgIHRhYmxlcm93KHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiBgPHRyPlxcbiR7dGV4dH08L3RyPlxcbmA7XG4gICAgfVxuICAgIHRhYmxlY2VsbCh0b2tlbikge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gdGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zKTtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRva2VuLmhlYWRlciA/ICd0aCcgOiAndGQnO1xuICAgICAgICBjb25zdCB0YWcgPSB0b2tlbi5hbGlnblxuICAgICAgICAgICAgPyBgPCR7dHlwZX0gYWxpZ249XCIke3Rva2VuLmFsaWdufVwiPmBcbiAgICAgICAgICAgIDogYDwke3R5cGV9PmA7XG4gICAgICAgIHJldHVybiB0YWcgKyBjb250ZW50ICsgYDwvJHt0eXBlfT5cXG5gO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzcGFuIGxldmVsIHJlbmRlcmVyXG4gICAgICovXG4gICAgc3Ryb25nKHsgdG9rZW5zIH0pIHtcbiAgICAgICAgcmV0dXJuIGA8c3Ryb25nPiR7dGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKX08L3N0cm9uZz5gO1xuICAgIH1cbiAgICBlbSh7IHRva2VucyB9KSB7XG4gICAgICAgIHJldHVybiBgPGVtPiR7dGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKX08L2VtPmA7XG4gICAgfVxuICAgIGNvZGVzcGFuKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiBgPGNvZGU+JHtlc2NhcGUodGV4dCwgdHJ1ZSl9PC9jb2RlPmA7XG4gICAgfVxuICAgIGJyKHRva2VuKSB7XG4gICAgICAgIHJldHVybiAnPGJyPic7XG4gICAgfVxuICAgIGRlbCh7IHRva2VucyB9KSB7XG4gICAgICAgIHJldHVybiBgPGRlbD4ke3RoaXMucGFyc2VyLnBhcnNlSW5saW5lKHRva2Vucyl9PC9kZWw+YDtcbiAgICB9XG4gICAgbGluayh7IGhyZWYsIHRpdGxlLCB0b2tlbnMgfSkge1xuICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKTtcbiAgICAgICAgY29uc3QgY2xlYW5IcmVmID0gY2xlYW5VcmwoaHJlZik7XG4gICAgICAgIGlmIChjbGVhbkhyZWYgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGhyZWYgPSBjbGVhbkhyZWY7XG4gICAgICAgIGxldCBvdXQgPSAnPGEgaHJlZj1cIicgKyBocmVmICsgJ1wiJztcbiAgICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgICAgICBvdXQgKz0gJyB0aXRsZT1cIicgKyAoZXNjYXBlKHRpdGxlKSkgKyAnXCInO1xuICAgICAgICB9XG4gICAgICAgIG91dCArPSAnPicgKyB0ZXh0ICsgJzwvYT4nO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICBpbWFnZSh7IGhyZWYsIHRpdGxlLCB0ZXh0IH0pIHtcbiAgICAgICAgY29uc3QgY2xlYW5IcmVmID0gY2xlYW5VcmwoaHJlZik7XG4gICAgICAgIGlmIChjbGVhbkhyZWYgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBlc2NhcGUodGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaHJlZiA9IGNsZWFuSHJlZjtcbiAgICAgICAgbGV0IG91dCA9IGA8aW1nIHNyYz1cIiR7aHJlZn1cIiBhbHQ9XCIke3RleHR9XCJgO1xuICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgICAgIG91dCArPSBgIHRpdGxlPVwiJHtlc2NhcGUodGl0bGUpfVwiYDtcbiAgICAgICAgfVxuICAgICAgICBvdXQgKz0gJz4nO1xuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICB0ZXh0KHRva2VuKSB7XG4gICAgICAgIHJldHVybiAndG9rZW5zJyBpbiB0b2tlbiAmJiB0b2tlbi50b2tlbnNcbiAgICAgICAgICAgID8gdGhpcy5wYXJzZXIucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zKVxuICAgICAgICAgICAgOiAoJ2VzY2FwZWQnIGluIHRva2VuICYmIHRva2VuLmVzY2FwZWQgPyB0b2tlbi50ZXh0IDogZXNjYXBlKHRva2VuLnRleHQpKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGV4dFJlbmRlcmVyXG4gKiByZXR1cm5zIG9ubHkgdGhlIHRleHR1YWwgcGFydCBvZiB0aGUgdG9rZW5cbiAqL1xuY2xhc3MgX1RleHRSZW5kZXJlciB7XG4gICAgLy8gbm8gbmVlZCBmb3IgYmxvY2sgbGV2ZWwgcmVuZGVyZXJzXG4gICAgc3Ryb25nKHsgdGV4dCB9KSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBlbSh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgY29kZXNwYW4oeyB0ZXh0IH0pIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGRlbCh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgaHRtbCh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgdGV4dCh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgbGluayh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gJycgKyB0ZXh0O1xuICAgIH1cbiAgICBpbWFnZSh7IHRleHQgfSkge1xuICAgICAgICByZXR1cm4gJycgKyB0ZXh0O1xuICAgIH1cbiAgICBicigpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQYXJzaW5nICYgQ29tcGlsaW5nXG4gKi9cbmNsYXNzIF9QYXJzZXIge1xuICAgIG9wdGlvbnM7XG4gICAgcmVuZGVyZXI7XG4gICAgdGV4dFJlbmRlcmVyO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBfZGVmYXVsdHM7XG4gICAgICAgIHRoaXMub3B0aW9ucy5yZW5kZXJlciA9IHRoaXMub3B0aW9ucy5yZW5kZXJlciB8fCBuZXcgX1JlbmRlcmVyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXI7XG4gICAgICAgIHRoaXMucmVuZGVyZXIub3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgdGhpcy5yZW5kZXJlci5wYXJzZXIgPSB0aGlzO1xuICAgICAgICB0aGlzLnRleHRSZW5kZXJlciA9IG5ldyBfVGV4dFJlbmRlcmVyKCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBQYXJzZSBNZXRob2RcbiAgICAgKi9cbiAgICBzdGF0aWMgcGFyc2UodG9rZW5zLCBvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlciA9IG5ldyBfUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBQYXJzZSBJbmxpbmUgTWV0aG9kXG4gICAgICovXG4gICAgc3RhdGljIHBhcnNlSW5saW5lKHRva2Vucywgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBwYXJzZXIgPSBuZXcgX1BhcnNlcihvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZUlubGluZSh0b2tlbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBMb29wXG4gICAgICovXG4gICAgcGFyc2UodG9rZW5zLCB0b3AgPSB0cnVlKSB7XG4gICAgICAgIGxldCBvdXQgPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGFueVRva2VuID0gdG9rZW5zW2ldO1xuICAgICAgICAgICAgLy8gUnVuIGFueSByZW5kZXJlciBleHRlbnNpb25zXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnM/LnJlbmRlcmVycz8uW2FueVRva2VuLnR5cGVdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZ2VuZXJpY1Rva2VuID0gYW55VG9rZW47XG4gICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzW2dlbmVyaWNUb2tlbi50eXBlXS5jYWxsKHsgcGFyc2VyOiB0aGlzIH0sIGdlbmVyaWNUb2tlbik7XG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gZmFsc2UgfHwgIVsnc3BhY2UnLCAnaHInLCAnaGVhZGluZycsICdjb2RlJywgJ3RhYmxlJywgJ2Jsb2NrcXVvdGUnLCAnbGlzdCcsICdodG1sJywgJ3BhcmFncmFwaCcsICd0ZXh0J10uaW5jbHVkZXMoZ2VuZXJpY1Rva2VuLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZXQgfHwgJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gYW55VG9rZW47XG4gICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuc3BhY2UodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnaHInOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmhyKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2hlYWRpbmcnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmhlYWRpbmcodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnY29kZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuY29kZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICd0YWJsZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIudGFibGUodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnYmxvY2txdW90ZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdsaXN0Jzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saXN0KHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2h0bWwnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmh0bWwodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAncGFyYWdyYXBoJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRUb2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYm9keSA9IHRoaXMucmVuZGVyZXIudGV4dCh0ZXh0VG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSArIDEgPCB0b2tlbnMubGVuZ3RoICYmIHRva2Vuc1tpICsgMV0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0VG9rZW4gPSB0b2tlbnNbKytpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvZHkgKz0gJ1xcbicgKyB0aGlzLnJlbmRlcmVyLnRleHQodGV4dFRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhdzogYm9keSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBib2R5LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuczogW3sgdHlwZTogJ3RleHQnLCByYXc6IGJvZHksIHRleHQ6IGJvZHksIGVzY2FwZWQ6IHRydWUgfV0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dCArPSBib2R5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyck1zZyA9ICdUb2tlbiB3aXRoIFwiJyArIHRva2VuLnR5cGUgKyAnXCIgdHlwZSB3YXMgbm90IGZvdW5kLic7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBJbmxpbmUgVG9rZW5zXG4gICAgICovXG4gICAgcGFyc2VJbmxpbmUodG9rZW5zLCByZW5kZXJlciA9IHRoaXMucmVuZGVyZXIpIHtcbiAgICAgICAgbGV0IG91dCA9ICcnO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgYW55VG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICAvLyBSdW4gYW55IHJlbmRlcmVyIGV4dGVuc2lvbnNcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucz8ucmVuZGVyZXJzPy5bYW55VG9rZW4udHlwZV0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5yZW5kZXJlcnNbYW55VG9rZW4udHlwZV0uY2FsbCh7IHBhcnNlcjogdGhpcyB9LCBhbnlUb2tlbik7XG4gICAgICAgICAgICAgICAgaWYgKHJldCAhPT0gZmFsc2UgfHwgIVsnZXNjYXBlJywgJ2h0bWwnLCAnbGluaycsICdpbWFnZScsICdzdHJvbmcnLCAnZW0nLCAnY29kZXNwYW4nLCAnYnInLCAnZGVsJywgJ3RleHQnXS5pbmNsdWRlcyhhbnlUb2tlbi50eXBlKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmV0IHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGFueVRva2VuO1xuICAgICAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXNjYXBlJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIudGV4dCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdodG1sJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuaHRtbCh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdsaW5rJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIubGluayh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdpbWFnZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmltYWdlKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cm9uZyc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLnN0cm9uZyh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdlbSc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmVtKHRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvZGVzcGFuJzoge1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuY29kZXNwYW4odG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnYnInOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5icih0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdkZWwnOiB7XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5kZWwodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAndGV4dCc6IHtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLnRleHQodG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJNc2cgPSAnVG9rZW4gd2l0aCBcIicgKyB0b2tlbi50eXBlICsgJ1wiIHR5cGUgd2FzIG5vdCBmb3VuZC4nO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG59XG5cbmNsYXNzIF9Ib29rcyB7XG4gICAgb3B0aW9ucztcbiAgICBibG9jaztcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgX2RlZmF1bHRzO1xuICAgIH1cbiAgICBzdGF0aWMgcGFzc1Rocm91Z2hIb29rcyA9IG5ldyBTZXQoW1xuICAgICAgICAncHJlcHJvY2VzcycsXG4gICAgICAgICdwb3N0cHJvY2VzcycsXG4gICAgICAgICdwcm9jZXNzQWxsVG9rZW5zJyxcbiAgICBdKTtcbiAgICAvKipcbiAgICAgKiBQcm9jZXNzIG1hcmtkb3duIGJlZm9yZSBtYXJrZWRcbiAgICAgKi9cbiAgICBwcmVwcm9jZXNzKG1hcmtkb3duKSB7XG4gICAgICAgIHJldHVybiBtYXJrZG93bjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJvY2VzcyBIVE1MIGFmdGVyIG1hcmtlZCBpcyBmaW5pc2hlZFxuICAgICAqL1xuICAgIHBvc3Rwcm9jZXNzKGh0bWwpIHtcbiAgICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgYWxsIHRva2VucyBiZWZvcmUgd2FsayB0b2tlbnNcbiAgICAgKi9cbiAgICBwcm9jZXNzQWxsVG9rZW5zKHRva2Vucykge1xuICAgICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm92aWRlIGZ1bmN0aW9uIHRvIHRva2VuaXplIG1hcmtkb3duXG4gICAgICovXG4gICAgcHJvdmlkZUxleGVyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9jayA/IF9MZXhlci5sZXggOiBfTGV4ZXIubGV4SW5saW5lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcm92aWRlIGZ1bmN0aW9uIHRvIHBhcnNlIHRva2Vuc1xuICAgICAqL1xuICAgIHByb3ZpZGVQYXJzZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJsb2NrID8gX1BhcnNlci5wYXJzZSA6IF9QYXJzZXIucGFyc2VJbmxpbmU7XG4gICAgfVxufVxuXG5jbGFzcyBNYXJrZWQge1xuICAgIGRlZmF1bHRzID0gX2dldERlZmF1bHRzKCk7XG4gICAgb3B0aW9ucyA9IHRoaXMuc2V0T3B0aW9ucztcbiAgICBwYXJzZSA9IHRoaXMucGFyc2VNYXJrZG93bih0cnVlKTtcbiAgICBwYXJzZUlubGluZSA9IHRoaXMucGFyc2VNYXJrZG93bihmYWxzZSk7XG4gICAgUGFyc2VyID0gX1BhcnNlcjtcbiAgICBSZW5kZXJlciA9IF9SZW5kZXJlcjtcbiAgICBUZXh0UmVuZGVyZXIgPSBfVGV4dFJlbmRlcmVyO1xuICAgIExleGVyID0gX0xleGVyO1xuICAgIFRva2VuaXplciA9IF9Ub2tlbml6ZXI7XG4gICAgSG9va3MgPSBfSG9va3M7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLnVzZSguLi5hcmdzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUnVuIGNhbGxiYWNrIGZvciBldmVyeSB0b2tlblxuICAgICAqL1xuICAgIHdhbGtUb2tlbnModG9rZW5zLCBjYWxsYmFjaykge1xuICAgICAgICBsZXQgdmFsdWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgdG9rZW5zKSB7XG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KGNhbGxiYWNrLmNhbGwodGhpcywgdG9rZW4pKTtcbiAgICAgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RhYmxlJzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZVRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2VsbCBvZiB0YWJsZVRva2VuLmhlYWRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdCh0aGlzLndhbGtUb2tlbnMoY2VsbC50b2tlbnMsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGFibGVUb2tlbi5yb3dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNlbGwgb2Ygcm93KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdCh0aGlzLndhbGtUb2tlbnMoY2VsbC50b2tlbnMsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2xpc3QnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RUb2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuY29uY2F0KHRoaXMud2Fsa1Rva2VucyhsaXN0VG9rZW4uaXRlbXMsIGNhbGxiYWNrKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGdlbmVyaWNUb2tlbiA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0cy5leHRlbnNpb25zPy5jaGlsZFRva2Vucz8uW2dlbmVyaWNUb2tlbi50eXBlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0cy5leHRlbnNpb25zLmNoaWxkVG9rZW5zW2dlbmVyaWNUb2tlbi50eXBlXS5mb3JFYWNoKChjaGlsZFRva2VucykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRva2VucyA9IGdlbmVyaWNUb2tlbltjaGlsZFRva2Vuc10uZmxhdChJbmZpbml0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdCh0aGlzLndhbGtUb2tlbnModG9rZW5zLCBjYWxsYmFjaykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZ2VuZXJpY1Rva2VuLnRva2Vucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLmNvbmNhdCh0aGlzLndhbGtUb2tlbnMoZ2VuZXJpY1Rva2VuLnRva2VucywgY2FsbGJhY2spKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgICB1c2UoLi4uYXJncykge1xuICAgICAgICBjb25zdCBleHRlbnNpb25zID0gdGhpcy5kZWZhdWx0cy5leHRlbnNpb25zIHx8IHsgcmVuZGVyZXJzOiB7fSwgY2hpbGRUb2tlbnM6IHt9IH07XG4gICAgICAgIGFyZ3MuZm9yRWFjaCgocGFjaykgPT4ge1xuICAgICAgICAgICAgLy8gY29weSBvcHRpb25zIHRvIG5ldyBvYmplY3RcbiAgICAgICAgICAgIGNvbnN0IG9wdHMgPSB7IC4uLnBhY2sgfTtcbiAgICAgICAgICAgIC8vIHNldCBhc3luYyB0byB0cnVlIGlmIGl0IHdhcyBzZXQgdG8gdHJ1ZSBiZWZvcmVcbiAgICAgICAgICAgIG9wdHMuYXN5bmMgPSB0aGlzLmRlZmF1bHRzLmFzeW5jIHx8IG9wdHMuYXN5bmMgfHwgZmFsc2U7XG4gICAgICAgICAgICAvLyA9PS0tIFBhcnNlIFwiYWRkb25cIiBleHRlbnNpb25zIC0tPT0gLy9cbiAgICAgICAgICAgIGlmIChwYWNrLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgICAgICAgICBwYWNrLmV4dGVuc2lvbnMuZm9yRWFjaCgoZXh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZXh0Lm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXh0ZW5zaW9uIG5hbWUgcmVxdWlyZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJ3JlbmRlcmVyJyBpbiBleHQpIHsgLy8gUmVuZGVyZXIgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldlJlbmRlcmVyID0gZXh0ZW5zaW9ucy5yZW5kZXJlcnNbZXh0Lm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZSZW5kZXJlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgZXh0ZW5zaW9uIHdpdGggZnVuYyB0byBydW4gbmV3IGV4dGVuc2lvbiBidXQgZmFsbCBiYWNrIGlmIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5yZW5kZXJlcnNbZXh0Lm5hbWVdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJldCA9IGV4dC5yZW5kZXJlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IHByZXZSZW5kZXJlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnJlbmRlcmVyc1tleHQubmFtZV0gPSBleHQucmVuZGVyZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCd0b2tlbml6ZXInIGluIGV4dCkgeyAvLyBUb2tlbml6ZXIgRXh0ZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFleHQubGV2ZWwgfHwgKGV4dC5sZXZlbCAhPT0gJ2Jsb2NrJyAmJiBleHQubGV2ZWwgIT09ICdpbmxpbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImV4dGVuc2lvbiBsZXZlbCBtdXN0IGJlICdibG9jaycgb3IgJ2lubGluZSdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHRMZXZlbCA9IGV4dGVuc2lvbnNbZXh0LmxldmVsXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHRMZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dExldmVsLnVuc2hpZnQoZXh0LnRva2VuaXplcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRlbnNpb25zW2V4dC5sZXZlbF0gPSBbZXh0LnRva2VuaXplcl07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXh0LnN0YXJ0KSB7IC8vIEZ1bmN0aW9uIHRvIGNoZWNrIGZvciBzdGFydCBvZiB0b2tlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleHQubGV2ZWwgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuc3RhcnRCbG9jaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5zdGFydEJsb2NrLnB1c2goZXh0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMuc3RhcnRCbG9jayA9IFtleHQuc3RhcnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV4dC5sZXZlbCA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuc3RhcnRJbmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMuc3RhcnRJbmxpbmUucHVzaChleHQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5zdGFydElubGluZSA9IFtleHQuc3RhcnRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICgnY2hpbGRUb2tlbnMnIGluIGV4dCAmJiBleHQuY2hpbGRUb2tlbnMpIHsgLy8gQ2hpbGQgdG9rZW5zIHRvIGJlIHZpc2l0ZWQgYnkgd2Fsa1Rva2Vuc1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5jaGlsZFRva2Vuc1tleHQubmFtZV0gPSBleHQuY2hpbGRUb2tlbnM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBvcHRzLmV4dGVuc2lvbnMgPSBleHRlbnNpb25zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gPT0tLSBQYXJzZSBcIm92ZXJ3cml0ZVwiIGV4dGVuc2lvbnMgLS09PSAvL1xuICAgICAgICAgICAgaWYgKHBhY2sucmVuZGVyZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZGVmYXVsdHMucmVuZGVyZXIgfHwgbmV3IF9SZW5kZXJlcih0aGlzLmRlZmF1bHRzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gcGFjay5yZW5kZXJlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShwcm9wIGluIHJlbmRlcmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZW5kZXJlciAnJHtwcm9wfScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoWydvcHRpb25zJywgJ3BhcnNlciddLmluY2x1ZGVzKHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgb3B0aW9ucyBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyZXJQcm9wID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVuZGVyZXJGdW5jID0gcGFjay5yZW5kZXJlcltyZW5kZXJlclByb3BdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2UmVuZGVyZXIgPSByZW5kZXJlcltyZW5kZXJlclByb3BdO1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHJlbmRlcmVyIHdpdGggZnVuYyB0byBydW4gZXh0ZW5zaW9uLCBidXQgZmFsbCBiYWNrIGlmIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlcmVyW3JlbmRlcmVyUHJvcF0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJldCA9IHJlbmRlcmVyRnVuYy5hcHBseShyZW5kZXJlciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldCA9IHByZXZSZW5kZXJlci5hcHBseShyZW5kZXJlciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0IHx8ICcnO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFjay50b2tlbml6ZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbml6ZXIgPSB0aGlzLmRlZmF1bHRzLnRva2VuaXplciB8fCBuZXcgX1Rva2VuaXplcih0aGlzLmRlZmF1bHRzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gcGFjay50b2tlbml6ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocHJvcCBpbiB0b2tlbml6ZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHRva2VuaXplciAnJHtwcm9wfScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoWydvcHRpb25zJywgJ3J1bGVzJywgJ2xleGVyJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBvcHRpb25zLCBydWxlcywgYW5kIGxleGVyIHByb3BlcnRpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRva2VuaXplclByb3AgPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0b2tlbml6ZXJGdW5jID0gcGFjay50b2tlbml6ZXJbdG9rZW5pemVyUHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZUb2tlbml6ZXIgPSB0b2tlbml6ZXJbdG9rZW5pemVyUHJvcF07XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdG9rZW5pemVyIHdpdGggZnVuYyB0byBydW4gZXh0ZW5zaW9uLCBidXQgZmFsbCBiYWNrIGlmIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgY2Fubm90IHR5cGUgdG9rZW5pemVyIGZ1bmN0aW9uIGR5bmFtaWNhbGx5XG4gICAgICAgICAgICAgICAgICAgIHRva2VuaXplclt0b2tlbml6ZXJQcm9wXSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmV0ID0gdG9rZW5pemVyRnVuYy5hcHBseSh0b2tlbml6ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBwcmV2VG9rZW5pemVyLmFwcGx5KHRva2VuaXplciwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvcHRzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vID09LS0gUGFyc2UgSG9va3MgZXh0ZW5zaW9ucyAtLT09IC8vXG4gICAgICAgICAgICBpZiAocGFjay5ob29rcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhvb2tzID0gdGhpcy5kZWZhdWx0cy5ob29rcyB8fCBuZXcgX0hvb2tzKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIHBhY2suaG9va3MpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEocHJvcCBpbiBob29rcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgaG9vayAnJHtwcm9wfScgZG9lcyBub3QgZXhpc3RgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoWydvcHRpb25zJywgJ2Jsb2NrJ10uaW5jbHVkZXMocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBvcHRpb25zIGFuZCBibG9jayBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBob29rc1Byb3AgPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBob29rc0Z1bmMgPSBwYWNrLmhvb2tzW2hvb2tzUHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByZXZIb29rID0gaG9va3NbaG9va3NQcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9Ib29rcy5wYXNzVGhyb3VnaEhvb2tzLmhhcyhwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBjYW5ub3QgdHlwZSBob29rIGZ1bmN0aW9uIGR5bmFtaWNhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rc1tob29rc1Byb3BdID0gKGFyZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRzLmFzeW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoaG9va3NGdW5jLmNhbGwoaG9va3MsIGFyZykpLnRoZW4ocmV0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2SG9vay5jYWxsKGhvb2tzLCByZXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmV0ID0gaG9va3NGdW5jLmNhbGwoaG9va3MsIGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZIb29rLmNhbGwoaG9va3MsIHJldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBjYW5ub3QgdHlwZSBob29rIGZ1bmN0aW9uIGR5bmFtaWNhbGx5XG4gICAgICAgICAgICAgICAgICAgICAgICBob29rc1tob29rc1Byb3BdID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmV0ID0gaG9va3NGdW5jLmFwcGx5KGhvb2tzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQgPSBwcmV2SG9vay5hcHBseShob29rcywgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG9wdHMuaG9va3MgPSBob29rcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vID09LS0gUGFyc2UgV2Fsa1Rva2VucyBleHRlbnNpb25zIC0tPT0gLy9cbiAgICAgICAgICAgIGlmIChwYWNrLndhbGtUb2tlbnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3YWxrVG9rZW5zID0gdGhpcy5kZWZhdWx0cy53YWxrVG9rZW5zO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhY2tXYWxrdG9rZW5zID0gcGFjay53YWxrVG9rZW5zO1xuICAgICAgICAgICAgICAgIG9wdHMud2Fsa1Rva2VucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsdWVzID0gW107XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5wdXNoKHBhY2tXYWxrdG9rZW5zLmNhbGwodGhpcywgdG9rZW4pKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHdhbGtUb2tlbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5jb25jYXQod2Fsa1Rva2Vucy5jYWxsKHRoaXMsIHRva2VuKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHsgLi4udGhpcy5kZWZhdWx0cywgLi4ub3B0cyB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0KSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdHMgPSB7IC4uLnRoaXMuZGVmYXVsdHMsIC4uLm9wdCB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbGV4ZXIoc3JjLCBvcHRpb25zKSB7XG4gICAgICAgIHJldHVybiBfTGV4ZXIubGV4KHNyYywgb3B0aW9ucyA/PyB0aGlzLmRlZmF1bHRzKTtcbiAgICB9XG4gICAgcGFyc2VyKHRva2Vucywgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gX1BhcnNlci5wYXJzZSh0b2tlbnMsIG9wdGlvbnMgPz8gdGhpcy5kZWZhdWx0cyk7XG4gICAgfVxuICAgIHBhcnNlTWFya2Rvd24oYmxvY2tUeXBlKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgICAgIGNvbnN0IHBhcnNlID0gKHNyYywgb3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ09wdCA9IHsgLi4ub3B0aW9ucyB9O1xuICAgICAgICAgICAgY29uc3Qgb3B0ID0geyAuLi50aGlzLmRlZmF1bHRzLCAuLi5vcmlnT3B0IH07XG4gICAgICAgICAgICBjb25zdCB0aHJvd0Vycm9yID0gdGhpcy5vbkVycm9yKCEhb3B0LnNpbGVudCwgISFvcHQuYXN5bmMpO1xuICAgICAgICAgICAgLy8gdGhyb3cgZXJyb3IgaWYgYW4gZXh0ZW5zaW9uIHNldCBhc3luYyB0byB0cnVlIGJ1dCBwYXJzZSB3YXMgY2FsbGVkIHdpdGggYXN5bmM6IGZhbHNlXG4gICAgICAgICAgICBpZiAodGhpcy5kZWZhdWx0cy5hc3luYyA9PT0gdHJ1ZSAmJiBvcmlnT3B0LmFzeW5jID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBFcnJvcignbWFya2VkKCk6IFRoZSBhc3luYyBvcHRpb24gd2FzIHNldCB0byB0cnVlIGJ5IGFuIGV4dGVuc2lvbi4gUmVtb3ZlIGFzeW5jOiBmYWxzZSBmcm9tIHRoZSBwYXJzZSBvcHRpb25zIG9iamVjdCB0byByZXR1cm4gYSBQcm9taXNlLicpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRocm93IGVycm9yIGluIGNhc2Ugb2Ygbm9uIHN0cmluZyBpbnB1dFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcmMgPT09ICd1bmRlZmluZWQnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBFcnJvcignbWFya2VkKCk6IGlucHV0IHBhcmFtZXRlciBpcyB1bmRlZmluZWQgb3IgbnVsbCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3JjICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aHJvd0Vycm9yKG5ldyBFcnJvcignbWFya2VkKCk6IGlucHV0IHBhcmFtZXRlciBpcyBvZiB0eXBlICdcbiAgICAgICAgICAgICAgICAgICAgKyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3JjKSArICcsIHN0cmluZyBleHBlY3RlZCcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHQuaG9va3MpIHtcbiAgICAgICAgICAgICAgICBvcHQuaG9va3Mub3B0aW9ucyA9IG9wdDtcbiAgICAgICAgICAgICAgICBvcHQuaG9va3MuYmxvY2sgPSBibG9ja1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsZXhlciA9IG9wdC5ob29rcyA/IG9wdC5ob29rcy5wcm92aWRlTGV4ZXIoKSA6IChibG9ja1R5cGUgPyBfTGV4ZXIubGV4IDogX0xleGVyLmxleElubGluZSk7XG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSBvcHQuaG9va3MgPyBvcHQuaG9va3MucHJvdmlkZVBhcnNlcigpIDogKGJsb2NrVHlwZSA/IF9QYXJzZXIucGFyc2UgOiBfUGFyc2VyLnBhcnNlSW5saW5lKTtcbiAgICAgICAgICAgIGlmIChvcHQuYXN5bmMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG9wdC5ob29rcyA/IG9wdC5ob29rcy5wcmVwcm9jZXNzKHNyYykgOiBzcmMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHNyYyA9PiBsZXhlcihzcmMsIG9wdCkpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHRva2VucyA9PiBvcHQuaG9va3MgPyBvcHQuaG9va3MucHJvY2Vzc0FsbFRva2Vucyh0b2tlbnMpIDogdG9rZW5zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbih0b2tlbnMgPT4gb3B0LndhbGtUb2tlbnMgPyBQcm9taXNlLmFsbCh0aGlzLndhbGtUb2tlbnModG9rZW5zLCBvcHQud2Fsa1Rva2VucykpLnRoZW4oKCkgPT4gdG9rZW5zKSA6IHRva2VucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odG9rZW5zID0+IHBhcnNlcih0b2tlbnMsIG9wdCkpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGh0bWwgPT4gb3B0Lmhvb2tzID8gb3B0Lmhvb2tzLnBvc3Rwcm9jZXNzKGh0bWwpIDogaHRtbClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHRocm93RXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAob3B0Lmhvb2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IG9wdC5ob29rcy5wcmVwcm9jZXNzKHNyYyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCB0b2tlbnMgPSBsZXhlcihzcmMsIG9wdCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5ob29rcykge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMgPSBvcHQuaG9va3MucHJvY2Vzc0FsbFRva2Vucyh0b2tlbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAob3B0LndhbGtUb2tlbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53YWxrVG9rZW5zKHRva2Vucywgb3B0LndhbGtUb2tlbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IHBhcnNlcih0b2tlbnMsIG9wdCk7XG4gICAgICAgICAgICAgICAgaWYgKG9wdC5ob29rcykge1xuICAgICAgICAgICAgICAgICAgICBodG1sID0gb3B0Lmhvb2tzLnBvc3Rwcm9jZXNzKGh0bWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gaHRtbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRocm93RXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBwYXJzZTtcbiAgICB9XG4gICAgb25FcnJvcihzaWxlbnQsIGFzeW5jKSB7XG4gICAgICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgICAgICAgZS5tZXNzYWdlICs9ICdcXG5QbGVhc2UgcmVwb3J0IHRoaXMgdG8gaHR0cHM6Ly9naXRodWIuY29tL21hcmtlZGpzL21hcmtlZC4nO1xuICAgICAgICAgICAgaWYgKHNpbGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9ICc8cD5BbiBlcnJvciBvY2N1cnJlZDo8L3A+PHByZT4nXG4gICAgICAgICAgICAgICAgICAgICsgZXNjYXBlKGUubWVzc2FnZSArICcnLCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICArICc8L3ByZT4nO1xuICAgICAgICAgICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBtc2c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXN5bmMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuY29uc3QgbWFya2VkSW5zdGFuY2UgPSBuZXcgTWFya2VkKCk7XG5mdW5jdGlvbiBtYXJrZWQoc3JjLCBvcHQpIHtcbiAgICByZXR1cm4gbWFya2VkSW5zdGFuY2UucGFyc2Uoc3JjLCBvcHQpO1xufVxuLyoqXG4gKiBTZXRzIHRoZSBkZWZhdWx0IG9wdGlvbnMuXG4gKlxuICogQHBhcmFtIG9wdGlvbnMgSGFzaCBvZiBvcHRpb25zXG4gKi9cbm1hcmtlZC5vcHRpb25zID1cbiAgICBtYXJrZWQuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgICAgIG1hcmtlZEluc3RhbmNlLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIG1hcmtlZC5kZWZhdWx0cyA9IG1hcmtlZEluc3RhbmNlLmRlZmF1bHRzO1xuICAgICAgICBjaGFuZ2VEZWZhdWx0cyhtYXJrZWQuZGVmYXVsdHMpO1xuICAgICAgICByZXR1cm4gbWFya2VkO1xuICAgIH07XG4vKipcbiAqIEdldHMgdGhlIG9yaWdpbmFsIG1hcmtlZCBkZWZhdWx0IG9wdGlvbnMuXG4gKi9cbm1hcmtlZC5nZXREZWZhdWx0cyA9IF9nZXREZWZhdWx0cztcbm1hcmtlZC5kZWZhdWx0cyA9IF9kZWZhdWx0cztcbi8qKlxuICogVXNlIEV4dGVuc2lvblxuICovXG5tYXJrZWQudXNlID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICBtYXJrZWRJbnN0YW5jZS51c2UoLi4uYXJncyk7XG4gICAgbWFya2VkLmRlZmF1bHRzID0gbWFya2VkSW5zdGFuY2UuZGVmYXVsdHM7XG4gICAgY2hhbmdlRGVmYXVsdHMobWFya2VkLmRlZmF1bHRzKTtcbiAgICByZXR1cm4gbWFya2VkO1xufTtcbi8qKlxuICogUnVuIGNhbGxiYWNrIGZvciBldmVyeSB0b2tlblxuICovXG5tYXJrZWQud2Fsa1Rva2VucyA9IGZ1bmN0aW9uICh0b2tlbnMsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIG1hcmtlZEluc3RhbmNlLndhbGtUb2tlbnModG9rZW5zLCBjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBDb21waWxlcyBtYXJrZG93biB0byBIVE1MIHdpdGhvdXQgZW5jbG9zaW5nIGBwYCB0YWcuXG4gKlxuICogQHBhcmFtIHNyYyBTdHJpbmcgb2YgbWFya2Rvd24gc291cmNlIHRvIGJlIGNvbXBpbGVkXG4gKiBAcGFyYW0gb3B0aW9ucyBIYXNoIG9mIG9wdGlvbnNcbiAqIEByZXR1cm4gU3RyaW5nIG9mIGNvbXBpbGVkIEhUTUxcbiAqL1xubWFya2VkLnBhcnNlSW5saW5lID0gbWFya2VkSW5zdGFuY2UucGFyc2VJbmxpbmU7XG4vKipcbiAqIEV4cG9zZVxuICovXG5tYXJrZWQuUGFyc2VyID0gX1BhcnNlcjtcbm1hcmtlZC5wYXJzZXIgPSBfUGFyc2VyLnBhcnNlO1xubWFya2VkLlJlbmRlcmVyID0gX1JlbmRlcmVyO1xubWFya2VkLlRleHRSZW5kZXJlciA9IF9UZXh0UmVuZGVyZXI7XG5tYXJrZWQuTGV4ZXIgPSBfTGV4ZXI7XG5tYXJrZWQubGV4ZXIgPSBfTGV4ZXIubGV4O1xubWFya2VkLlRva2VuaXplciA9IF9Ub2tlbml6ZXI7XG5tYXJrZWQuSG9va3MgPSBfSG9va3M7XG5tYXJrZWQucGFyc2UgPSBtYXJrZWQ7XG5jb25zdCBvcHRpb25zID0gbWFya2VkLm9wdGlvbnM7XG5jb25zdCBzZXRPcHRpb25zID0gbWFya2VkLnNldE9wdGlvbnM7XG5jb25zdCB1c2UgPSBtYXJrZWQudXNlO1xuY29uc3Qgd2Fsa1Rva2VucyA9IG1hcmtlZC53YWxrVG9rZW5zO1xuY29uc3QgcGFyc2VJbmxpbmUgPSBtYXJrZWQucGFyc2VJbmxpbmU7XG5jb25zdCBwYXJzZSA9IG1hcmtlZDtcbmNvbnN0IHBhcnNlciA9IF9QYXJzZXIucGFyc2U7XG5jb25zdCBsZXhlciA9IF9MZXhlci5sZXg7XG5cbmV4cG9ydCB7IF9Ib29rcyBhcyBIb29rcywgX0xleGVyIGFzIExleGVyLCBNYXJrZWQsIF9QYXJzZXIgYXMgUGFyc2VyLCBfUmVuZGVyZXIgYXMgUmVuZGVyZXIsIF9UZXh0UmVuZGVyZXIgYXMgVGV4dFJlbmRlcmVyLCBfVG9rZW5pemVyIGFzIFRva2VuaXplciwgX2RlZmF1bHRzIGFzIGRlZmF1bHRzLCBfZ2V0RGVmYXVsdHMgYXMgZ2V0RGVmYXVsdHMsIGxleGVyLCBtYXJrZWQsIG9wdGlvbnMsIHBhcnNlLCBwYXJzZUlubGluZSwgcGFyc2VyLCBzZXRPcHRpb25zLCB1c2UsIHdhbGtUb2tlbnMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1hcmtlZC5lc20uanMubWFwXG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbWFya2VkIH0gZnJvbSAnbWFya2VkJztcbmNvbnN0IE1hcmtkb3duRWRpdG9yID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSwgb25DaGFuZ2UgfSkgPT4ge1xuICAgIGNvbnN0IFtzaG93UHJldmlldywgc2V0U2hvd1ByZXZpZXddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW3Nob3dIZWxwLCBzZXRTaG93SGVscF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgcHJldmlld1JlZiA9IHVzZVJlZihudWxsKTtcbiAgICBjb25zdCB2YWx1ZSA9IHJlY29yZC5wYXJhbXNbcHJvcGVydHkucGF0aF0gfHwgJyc7XG4gICAgY29uc3QgaW5zZXJ0U3ludGF4ID0gKHN5bnRheCwgcGxhY2Vob2xkZXIgPSAnJykgPT4ge1xuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXJrZG93bi10ZXh0YXJlYScpO1xuICAgICAgICBpZiAoIXRleHRhcmVhKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBzdGFydCA9IHRleHRhcmVhLnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICBjb25zdCBlbmQgPSB0ZXh0YXJlYS5zZWxlY3Rpb25FbmQ7XG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVGV4dCA9IHZhbHVlLnN1YnN0cmluZyhzdGFydCwgZW5kKSB8fCBwbGFjZWhvbGRlcjtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gJyc7XG4gICAgICAgIHN3aXRjaCAoc3ludGF4KSB7XG4gICAgICAgICAgICBjYXNlICdib2xkJzpcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydCkgKyBgKioke3NlbGVjdGVkVGV4dH0qKmAgKyB2YWx1ZS5zdWJzdHJpbmcoZW5kKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2l0YWxpYyc6XG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnQpICsgYCoke3NlbGVjdGVkVGV4dH0qYCArIHZhbHVlLnN1YnN0cmluZyhlbmQpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIG5ld1ZhbHVlKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0ZXh0YXJlYS5mb2N1cygpO1xuICAgICAgICAgICAgdGV4dGFyZWEuc2V0U2VsZWN0aW9uUmFuZ2Uoc3RhcnQgKyBzeW50YXgubGVuZ3RoICsgMiwgZW5kICsgc3ludGF4Lmxlbmd0aCArIDIpO1xuICAgICAgICB9LCAwKTtcbiAgICB9O1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghcHJldmlld1JlZi5jdXJyZW50KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBlbGVtZW50cyA9IHByZXZpZXdSZWYuY3VycmVudC5xdWVyeVNlbGVjdG9yQWxsKCcqJyk7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gZWw7XG4gICAgICAgICAgICBjb25zdCB0YWcgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHN3aXRjaCAodGFnKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaDEnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2gyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdoMyc6XG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oZWxlbWVudC5zdHlsZSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogJzEycHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnOHB4JyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3AnOlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1hcmdpbiA9ICc4cHggMCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0cm9uZyc6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuZm9udFdlaWdodCA9ICdib2xkJztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZW0nOlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmZvbnRTdHlsZSA9ICdpdGFsaWMnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb2RlJzpcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZWVlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcycHggNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnbW9ub3NwYWNlJyxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3VsJzpcbiAgICAgICAgICAgICAgICBjYXNlICdvbCc6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luTGVmdCA9ICcyMHB4JztcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnOHB4JztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGknOlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm1hcmdpbkJvdHRvbSA9ICc0cHgnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdibG9ja3F1b3RlJzpcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihlbGVtZW50LnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNHB4IHNvbGlkICNjY2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzY2NicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAnOHB4IDAnLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIFt2YWx1ZSwgc2hvd1ByZXZpZXddKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBkaXNwbGF5OiAnZmxleCcsIGdhcDogJzI0cHgnIH0gfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IGZsZXg6IDEgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IHN0eWxlOiB7IG1hcmdpbkJvdHRvbTogJzEycHgnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICc4cHgnIH0gfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgdHlwZTogJ2J1dHRvbicsIG9uQ2xpY2s6ICgpID0+IGluc2VydFN5bnRheCgnYm9sZCcsICfQttC40YDQvdGL0LknKSwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiXCIsIG51bGwsIFwiQlwiKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IHR5cGU6ICdidXR0b24nLCBvbkNsaWNrOiAoKSA9PiBpbnNlcnRTeW50YXgoJ2l0YWxpYycsICfQutGD0YDRgdC40LInKSwgc3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc2cHggMTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogJyMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIG51bGwsIFwiSVwiKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IHR5cGU6ICdidXR0b24nLCBvbkNsaWNrOiAoKSA9PiBzZXRTaG93UHJldmlldygocHJldikgPT4gIXByZXYpLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzZweCAxMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzAwNzhDMScsXG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnI2ZmZicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDc4QzEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICAgIH0gfSwgc2hvd1ByZXZpZXcgPyAn0KHQutGA0YvRgtGMINC/0YDQtdCy0YzRjicgOiAn0J/QvtC60LDQt9Cw0YLRjCDQv9GA0LXQstGM0Y4nKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgb25Nb3VzZUVudGVyOiAoKSA9PiBzZXRTaG93SGVscCh0cnVlKSwgb25Nb3VzZUxlYXZlOiAoKSA9PiBzZXRTaG93SGVscChmYWxzZSksIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAnYXV0bycsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMDA3OEMxJyxcbiAgICAgICAgICAgICAgICAgICAgfSB9LFxuICAgICAgICAgICAgICAgICAgICBcIj9cIixcbiAgICAgICAgICAgICAgICAgICAgc2hvd0hlbHAgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJzI0cHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NjYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTBweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzI4MHB4JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCA4cHggcmdiYSgwLDAsMCwwLjEpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwicFwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzdHJvbmdcIiwgbnVsbCwgXCJNYXJrZG93bjpcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInVsXCIsIHsgc3R5bGU6IHsgcGFkZGluZ0xlZnQ6ICcxNnB4JywgbWFyZ2luOiAwIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCIqKlxcdTA0MzZcXHUwNDM4XFx1MDQ0MFxcdTA0M0RcXHUwNDRCXFx1MDQzOSoqXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcXHUyMTkyIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3Ryb25nXCIsIG51bGwsIFwiXFx1MDQzNlxcdTA0MzhcXHUwNDQwXFx1MDQzRFxcdTA0NEJcXHUwNDM5XCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCIqXFx1MDQzQVxcdTA0NDNcXHUwNDQwXFx1MDQ0MVxcdTA0MzhcXHUwNDMyKlwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXFx1MjE5MiBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImVtXCIsIG51bGwsIFwiXFx1MDQzQVxcdTA0NDNcXHUwNDQwXFx1MDQ0MVxcdTA0MzhcXHUwNDMyXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCIjIFxcdTA0MTdcXHUwNDMwXFx1MDQzM1xcdTA0M0VcXHUwNDNCXFx1MDQzRVxcdTA0MzJcXHUwNDNFXFx1MDQzQVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXFx1MjE5MiBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJcIiwgbnVsbCwgXCJcXHUwNDE3XFx1MDQzMFxcdTA0MzNcXHUwNDNFXFx1MDQzQlxcdTA0M0VcXHUwNDMyXFx1MDQzRVxcdTA0M0FcIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcIi0gXFx1MDQyMVxcdTA0M0ZcXHUwNDM4XFx1MDQ0MVxcdTA0M0VcXHUwNDNBXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBcXHUyMTkyIFxcdTIwMjIgXFx1MDQ0RFxcdTA0M0JcXHUwNDM1XFx1MDQzQ1xcdTA0MzVcXHUwNDNEXFx1MDQ0MlwiKSkpKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIsIHsgaWQ6ICdtYXJrZG93bi10ZXh0YXJlYScsIHZhbHVlOiB2YWx1ZSwgb25DaGFuZ2U6IChlKSA9PiBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBlLnRhcmdldC52YWx1ZSksIHJvd3M6IDEyLCBzdHlsZToge1xuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnbW9ub3NwYWNlJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NjYycsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgICAgICAgICAgICAgICAgICByZXNpemU6ICdub25lJyxcbiAgICAgICAgICAgICAgICB9IH0pKSxcbiAgICAgICAgc2hvd1ByZXZpZXcgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyByZWY6IHByZXZpZXdSZWYsIHN0eWxlOiB7XG4gICAgICAgICAgICAgICAgZmxleDogMSxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2NjYycsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzEycHgnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmYWZhZmEnLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgICAgICAgICAgICAgbWF4SGVpZ2h0OiAnMzAwcHgnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogJzEuNScsXG4gICAgICAgICAgICB9LCBkYW5nZXJvdXNseVNldElubmVySFRNTDogeyBfX2h0bWw6IG1hcmtlZC5wYXJzZSh2YWx1ZSB8fCAnJykgfSB9KSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBNYXJrZG93bkVkaXRvcjtcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IERhc2hib2FyZFJvdXRlIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9kYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZFJvdXRlID0gRGFzaGJvYXJkUm91dGVcbmltcG9ydCBVcGxvYWRQaG90byBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvdXBsb2FkLXBob3RvJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRQaG90byA9IFVwbG9hZFBob3RvXG5pbXBvcnQgSW1hZ2VQcmV2aWV3IGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9pbWFnZS1wcmV2aWV3J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5JbWFnZVByZXZpZXcgPSBJbWFnZVByZXZpZXdcbmltcG9ydCBVcGxvYWRNdWx0aXBsZVBob3RvcyBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvdXBsb2FkLW11bHRpcGxlLXBob3RvcydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkTXVsdGlwbGVQaG90b3MgPSBVcGxvYWRNdWx0aXBsZVBob3Rvc1xuaW1wb3J0IEltYWdlc1ByZXZpZXcgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL2ltYWdlcy1wcmV2aWV3J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5JbWFnZXNQcmV2aWV3ID0gSW1hZ2VzUHJldmlld1xuaW1wb3J0IE1hcmtkb3duRWRpdG9yIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9tYXJrZG93bi1lZGl0b3InXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLk1hcmtkb3duRWRpdG9yID0gTWFya2Rvd25FZGl0b3IiXSwibmFtZXMiOlsiRGFzaGJvYXJkIiwidXNlRWZmZWN0Iiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiVXBsb2FkUGhvdG8iLCJvbkNoYW5nZSIsInByb3BlcnR5IiwicmVjb3JkIiwicGhvdG9QYXRoIiwicGFyYW1zIiwibmFtZSIsImhhbmRsZUNoYW5nZSIsImV2ZW50IiwiZmlsZSIsInRhcmdldCIsImZpbGVzIiwiYWxsb3dlZFR5cGVzIiwiaW5jbHVkZXMiLCJ0eXBlIiwiYWxlcnQiLCJmb3JtRGF0YSIsIkZvcm1EYXRhIiwiYXBwZW5kIiwicmVzcG9uc2UiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJkYXRhIiwianNvbiIsImZpbGVQYXRoIiwiaGFuZGxlUmVtb3ZlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImdhcCIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsImZvbnRTaXplIiwibGluZUhlaWdodCIsImZvbnRGYW1pbHkiLCJwYWRkaW5nIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZCIsInRleHRBbGlnbiIsImN1cnNvciIsImlkIiwiYWNjZXB0IiwiYWxpZ25JdGVtcyIsInBvc2l0aW9uIiwid2lkdGgiLCJoZWlnaHQiLCJvdmVyZmxvdyIsImJveFNoYWRvdyIsInNyYyIsImFsdCIsIm9iamVjdEZpdCIsIm9uQ2xpY2siLCJ0b3AiLCJyaWdodCIsImNvbG9yIiwiZm9udFdlaWdodCIsInRpdGxlIiwiSW1hZ2VQcmV2aWV3IiwicGF0aCIsIlVwbG9hZE11bHRpcGxlUGhvdG9zIiwicHJvcHMiLCJleGlzdGluZ1Bob3RvcyIsIk9iamVjdCIsImVudHJpZXMiLCJmb3JFYWNoIiwia2V5IiwidmFsdWUiLCJzdGFydHNXaXRoIiwicHVzaCIsInBob3RvcyIsInNldFBob3RvcyIsInVzZVN0YXRlIiwiQXJyYXkiLCJmcm9tIiwidG90YWxQaG90b3MiLCJsZW5ndGgiLCJuZXdQaG90b1BhdGhzIiwiaXNWYWxpZCIsInVwZGF0ZWRQaG90b3MiLCJzbGljZSIsImluZGV4IiwiaSIsImluZGV4VG9SZW1vdmUiLCJ1cGRhdGVkIiwiZmlsdGVyIiwiXyIsIm11bHRpcGxlIiwiZmxleFdyYXAiLCJtYXAiLCJwaG90byIsIkltYWdlc1ByZXZpZXciLCJNYXJrZG93bkVkaXRvciIsInNob3dQcmV2aWV3Iiwic2V0U2hvd1ByZXZpZXciLCJzaG93SGVscCIsInNldFNob3dIZWxwIiwicHJldmlld1JlZiIsInVzZVJlZiIsImluc2VydFN5bnRheCIsInN5bnRheCIsInBsYWNlaG9sZGVyIiwidGV4dGFyZWEiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3RhcnQiLCJzZWxlY3Rpb25TdGFydCIsImVuZCIsInNlbGVjdGlvbkVuZCIsInNlbGVjdGVkVGV4dCIsInN1YnN0cmluZyIsIm5ld1ZhbHVlIiwic2V0VGltZW91dCIsImZvY3VzIiwic2V0U2VsZWN0aW9uUmFuZ2UiLCJjdXJyZW50IiwiZWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZWwiLCJlbGVtZW50IiwidGFnIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwiYXNzaWduIiwibWFyZ2luIiwiZm9udFN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwibWFyZ2luTGVmdCIsImJvcmRlckxlZnQiLCJwYWRkaW5nTGVmdCIsImZsZXgiLCJwcmV2Iiwib25Nb3VzZUVudGVyIiwib25Nb3VzZUxlYXZlIiwiekluZGV4IiwiZSIsInJvd3MiLCJib3hTaXppbmciLCJyZXNpemUiLCJyZWYiLCJvdmVyZmxvd1kiLCJtYXhIZWlnaHQiLCJkYW5nZXJvdXNseVNldElubmVySFRNTCIsIl9faHRtbCIsIm1hcmtlZCIsInBhcnNlIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiRGFzaGJvYXJkUm91dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUFDQSxNQUFNQSxTQUFTLEdBQUdBLE1BQU07SUFDcEJDLEVBQUFBLGVBQVMsQ0FBQyxNQUFNO0lBQ1pDLElBQUFBLE1BQU0sQ0FBQ0MsUUFBUSxDQUFDQyxJQUFJLEdBQUcsMEJBQTBCO0lBQ3JELEdBQUMsQ0FBQztJQUNGLEVBQUEsT0FBTyxJQUFJO0lBQ2YsQ0FBQzs7SUNMRCxNQUFNQyxXQUFXLEdB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LENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDaEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDeEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDbEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDbEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDakQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUMvQyxnQkFBZ0IsSUFBSSxTQUFTLEVBQUUsSUFBSSxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUUsSUFBSSxLQUFLLE1BQU0sRUFBRTtJQUNuRixvQkFBb0IsU0FBUyxDQUFDLEdBQUcsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUc7SUFDckQsb0JBQW9CLFNBQVMsQ0FBQyxJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHO0lBQ3RELG9CQUFvQixJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLElBQUk7SUFDaEU7SUFDQSxxQkFBcUIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUN4RCxvQkFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHO0lBQ25ELHdCQUF3QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7SUFDeEMsd0JBQXdCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztJQUMxQyxxQkFBcUI7SUFDckI7SUFDQSxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDbkQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDdEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBO0lBQ0EsWUFBWSxJQUFJLE1BQU0sR0FBRyxHQUFHO0lBQzVCLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUU7SUFDckQsZ0JBQWdCLElBQUksVUFBVSxHQUFHLFFBQVE7SUFDekMsZ0JBQWdCLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVDLGdCQUFnQixJQUFJLFNBQVM7SUFDN0IsZ0JBQWdCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEtBQUs7SUFDOUUsb0JBQW9CLFNBQVMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sQ0FBQztJQUM1RSxvQkFBb0IsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRTtJQUN6RSx3QkFBd0IsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQztJQUNwRTtJQUNBLGlCQUFpQixDQUFDO0lBQ2xCLGdCQUFnQixJQUFJLFVBQVUsR0FBRyxRQUFRLElBQUksVUFBVSxJQUFJLENBQUMsRUFBRTtJQUM5RCxvQkFBb0IsTUFBTSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUM7SUFDN0Q7SUFDQTtJQUNBLFlBQVksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtJQUM5RSxnQkFBZ0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDL0MsZ0JBQWdCLElBQUksb0JBQW9CLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxXQUFXLEVBQUU7SUFDN0Usb0JBQW9CLFNBQVMsQ0FBQyxHQUFHLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHO0lBQ3JELG9CQUFvQixTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSTtJQUN2RCxvQkFBb0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDMUMsb0JBQW9CLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSTtJQUNoRTtJQUNBLHFCQUFxQjtJQUNyQixvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEM7SUFDQSxnQkFBZ0Isb0JBQW9CLEdBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTTtJQUNuRSxnQkFBZ0IsR0FBRyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDckQsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2xELGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDL0MsZ0JBQWdCLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDaEQsb0JBQW9CLFNBQVMsQ0FBQyxHQUFHLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHO0lBQ3JELG9CQUFvQixTQUFTLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSTtJQUN2RCxvQkFBb0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7SUFDMUMsb0JBQW9CLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSTtJQUNoRTtJQUNBLHFCQUFxQjtJQUNyQixvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEM7SUFDQSxnQkFBZ0I7SUFDaEI7SUFDQSxZQUFZLElBQUksR0FBRyxFQUFFO0lBQ3JCLGdCQUFnQixNQUFNLE1BQU0sR0FBRyx5QkFBeUIsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM1RSxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtJQUN6QyxvQkFBb0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7SUFDekMsb0JBQW9CO0lBQ3BCO0lBQ0EscUJBQXFCO0lBQ3JCLG9CQUFvQixNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUMzQztJQUNBO0lBQ0E7SUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUk7SUFDN0IsUUFBUSxPQUFPLE1BQU07SUFDckI7SUFDQSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRTtJQUM3QixRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDO0lBQzlDLFFBQVEsT0FBTyxNQUFNO0lBQ3JCO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUU7SUFDbkM7SUFDQSxRQUFRLElBQUksU0FBUyxHQUFHLEdBQUc7SUFDM0IsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJO0lBQ3hCO0lBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO0lBQy9CLFlBQVksTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN4RCxZQUFZLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7SUFDbEMsZ0JBQWdCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3BHLG9CQUFvQixJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQzNGLHdCQUF3QixTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUs7SUFDbEUsOEJBQThCLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUc7SUFDdEUsOEJBQThCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDbEc7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBLFFBQVEsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDN0YsWUFBWSxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDO0lBQ3RJO0lBQ0E7SUFDQSxRQUFRLE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3hGLFlBQVksU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO0lBQ3hLO0lBQ0EsUUFBUSxJQUFJLFlBQVksR0FBRyxLQUFLO0lBQ2hDLFFBQVEsSUFBSSxRQUFRLEdBQUcsRUFBRTtJQUN6QixRQUFRLE9BQU8sR0FBRyxFQUFFO0lBQ3BCLFlBQVksSUFBSSxDQUFDLFlBQVksRUFBRTtJQUMvQixnQkFBZ0IsUUFBUSxHQUFHLEVBQUU7SUFDN0I7SUFDQSxZQUFZLFlBQVksR0FBRyxLQUFLO0lBQ2hDLFlBQVksSUFBSSxLQUFLO0lBQ3JCO0lBQ0EsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLEtBQUs7SUFDeEUsZ0JBQWdCLElBQUksS0FBSyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUFFO0lBQzdFLG9CQUFvQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUN6RCxvQkFBb0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEMsb0JBQW9CLE9BQU8sSUFBSTtJQUMvQjtJQUNBLGdCQUFnQixPQUFPLEtBQUs7SUFDNUIsYUFBYSxDQUFDLEVBQUU7SUFDaEIsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3BELGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2pELGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ2xELGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDbEMsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO0lBQ3hFLGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDL0MsZ0JBQWdCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLElBQUksU0FBUyxFQUFFLElBQUksS0FBSyxNQUFNLEVBQUU7SUFDekUsb0JBQW9CLFNBQVMsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUc7SUFDOUMsb0JBQW9CLFNBQVMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUk7SUFDaEQ7SUFDQSxxQkFBcUI7SUFDckIsb0JBQW9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3RDO0lBQ0EsZ0JBQWdCO0lBQ2hCO0lBQ0E7SUFDQSxZQUFZLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUU7SUFDM0UsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDdEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDaEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDakQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDdEQsZ0JBQWdCLEdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3JELGdCQUFnQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNsQyxnQkFBZ0I7SUFDaEI7SUFDQTtJQUNBLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ3pFLGdCQUFnQixHQUFHLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUNyRCxnQkFBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxL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
