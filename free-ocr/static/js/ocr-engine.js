const OcrEngine = {
  mode: 'tesseract', // 'tesseract' | 'api' (future)

  async recognize(imageSrc) {
    if (this.mode === 'tesseract') {
      return this.tesseractRecognize(imageSrc);
    }
    // Future: return this.apiRecognize(imageSrc);
    throw new Error('Unknown OCR mode');
  },

  async tesseractRecognize(imageSrc, onProgress) {
    const worker = await Tesseract.createWorker('chi_sim+eng', 1, {
      logger: m => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round(m.progress * 100));
        }
      }
    });
    const { data } = await worker.recognize(imageSrc);
    await worker.terminate();
    return {
      text: data.text,
      confidence: Math.round(data.confidence)
    };
  },

  // Future API path — swap mode to 'api' and implement
  async apiRecognize(imageBlob) {
    const formData = new FormData();
    formData.append('image', imageBlob);
    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
};
