export const SvgPlaceholderMixin = {
  methods: {
    $toNumber(val) {
      console.log('$toNumber', val);
      return Number(val.replace(/[^\d.-]/g, ''));
    },

    // eslint-disable-next-line no-unused-vars
    $SvgPlaceholder({
                      width = 280,
                      height = 400,
                      text = null,
                      fontFamily = 'sans-serif',
                      fontWeight = 'bold',
                      fontSize = null,
                      dy = null,
                      bgColor = 'rgba(0, 0, 0, 0.2)',
                      textColor = 'rgba(0,0,0,0.6)',
                      dataUri = true,
                      charset = 'UTF-8',
                    } = {}) {

      const _width = typeof width !== 'number' ? this.$toNumber(width) : width;
      const _height = typeof height !== 'number' ? this.$toNumber(height): height;
      const _fontSize = fontSize !== null ? fontSize : Math.floor(Math.min(_width, _height) * 0.2);
      const _dy = dy !== null ? dy : _fontSize * 0.35;
      const _text = text !== null ? text : `${_width}×${_height}`;

      const str = `<svg xmlns="http://www.w3.org/2000/svg" width="${_width}" height="${_height}" viewBox="0 0 ${_width} ${_height}">
                      <rect fill="${bgColor}" width="${_width}" height="${_height}"/>
                      <text fill="${textColor}" font-family="${fontFamily}" font-size="${_fontSize}" dy="${_dy}" font-weight="${fontWeight}" x="50%" y="50%" text-anchor="middle">${_text}</text>
                    </svg>`;

      const cleaned = str
        .replace(/[\t\n\r]/gim, '') // Strip newlines and tabs
        .replace(/\s\s+/g, ' ') // Condense multiple spaces
        .replace(/'/gim, '\\i'); // Normalize quotes

      if (dataUri) {
        const encoded = encodeURIComponent(cleaned)
          .replace(/\(/g, '%28') // Encode brackets
          .replace(/\)/g, '%29');

        return `data:image/svg+xml;charset=${charset},${encoded}`;
      }

      return cleaned;
    },

  },
};
