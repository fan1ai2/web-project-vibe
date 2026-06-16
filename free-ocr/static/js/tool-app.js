function toolApp() {
  return {
    // State
    imageSrc: null,
    imageBlob: null,
    dragOver: false,
    loading: false,
    result: '',
    renderedMarkdown: '',
    confidence: null,
    error: false,
    copied: false,
    activeTab: 'preview',

    // Handle file input
    handleFile(event) {
      this.error = false;
      this.result = '';
      const file = event.target.files[0];
      if (!file) return;
      this.loadImage(file);
    },

    // Handle drop
    handleDrop(event) {
      this.dragOver = false;
      this.error = false;
      this.result = '';
      const file = event.dataTransfer.files[0];
      if (!file) return;
      this.loadImage(file);
    },

    // Load image from file
    loadImage(file) {
      if (!file.type.startsWith('image/')) return;
      this.imageBlob = file;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = e.target.result;
      reader.readAsDataURL(file);
    },

    // Handle paste
    handlePaste(event) {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          this.error = false;
          this.result = '';
          const file = item.getAsFile();
          this.imageBlob = file;
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = e.target.result;
          reader.readAsDataURL(file);
          break;
        }
      }
    },

    // Recognize
    async recognize() {
      if (!this.imageSrc) return;
      this.loading = true;
      this.error = false;
      this.result = '';
      this.renderedMarkdown = '';

      try {
        const ocrResult = await OcrEngine.recognize(this.imageSrc, progress => {
          // Progress updates handled by Tesseract logger
        });
        this.result = ocrResult.text;
        this.confidence = ocrResult.confidence;
        this.renderMarkdown(ocrResult.text);
        this.activeTab = 'preview';
      } catch (err) {
        console.error('OCR failed:', err);
        this.error = true;
        this.confidence = null;
      } finally {
        this.loading = false;
      }
    },

    // Render markdown with KaTeX
    renderMarkdown(text) {
      const rawHtml = marked.parse(text);
      this.renderedMarkdown = rawHtml;
      // KaTeX render after DOM update
      this.$nextTick(() => {
        try {
          renderMathInElement(this.$el.querySelector('.markdown-body'), {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ]
          });
        } catch (e) {
          // KaTeX rendering may fail gracefully on non-formula content
        }
        // Highlight code blocks
        this.$el.querySelectorAll('.markdown-body pre code').forEach(block => {
          hljs.highlightElement(block);
        });
      });
    },

    // Load demo sample
    loadDemo(type) {
      const demo = DemoData[type];
      this.result = demo.result;
      this.confidence = 99;
      this.error = false;
      this.loading = false;
      this.imageSrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(demo.image)));
      this.renderMarkdown(demo.result);
      this.activeTab = 'preview';
      window.scrollTo({ top: this.$el.offsetTop, behavior: 'smooth' });
    },

    // Copy result
    async copyResult() {
      try {
        await navigator.clipboard.writeText(this.result);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      } catch (err) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = this.result;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.copied = true;
        setTimeout(() => this.copied = false, 2000);
      }
    },

    // Download markdown
    downloadMd() {
      const blob = new Blob([this.result], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ocr-result.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    // Init
    init() {
      document.addEventListener('paste', this.handlePaste.bind(this));
      if (typeof Tesseract === 'undefined') {
        console.warn('Tesseract.js not loaded — OCR will use demo mode');
      }
    }
  };
}
