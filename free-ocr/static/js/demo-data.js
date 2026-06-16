const DemoData = {
  text: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="50" font-family="serif" font-size="18" fill="#333">2026年人工智能技术发展报告</text>
      <text x="30" y="80" font-family="serif" font-size="14" fill="#555">人工智能正在深刻改变各行各业的运作方式。</text>
      <text x="30" y="105" font-family="serif" font-size="14" fill="#555">从自然语言处理到计算机视觉，AI技术已经</text>
      <text x="30" y="130" font-family="serif" font-size="14" fill="#555">成为推动数字化转型的核心引擎。据预测，</text>
      <text x="30" y="155" font-family="serif" font-size="14" fill="#555">到2030年AI将为全球经济贡献超过15万亿</text>
      <text x="30" y="180" font-family="serif" font-size="14" fill="#555">美元的增长，成为21世纪最重要的技术革命。</text>
    </svg>`,
    result: `# 2026年人工智能技术发展报告

人工智能正在深刻改变各行各业的运作方式。从自然语言处理到计算机视觉，AI技术已经成为推动数字化转型的核心引擎。据预测，到2030年AI将为全球经济贡献超过15万亿美元的增长，成为21世纪最重要的技术革命。`
  },

  table: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="40" font-family="sans-serif" font-size="16" font-weight="bold" fill="#333">季度销售数据对比</text>
      <line x1="20" y1="55" x2="380" y2="55" stroke="#ddd" stroke-width="1"/>
      <text x="40" y="75" font-family="monospace" font-size="13" fill="#444">产品     Q1      Q2      Q3      Q4</text>
      <text x="40" y="95" font-family="monospace" font-size="13" fill="#444">A系列   12,500  15,800  18,200  22,100</text>
      <text x="40" y="115" font-family="monospace" font-size="13" fill="#444">B系列    8,300   9,600  10,400  13,700</text>
      <text x="40" y="135" font-family="monospace" font-size="13" fill="#444">C系列    5,200   6,100   7,800   9,200</text>
      <text x="40" y="155" font-family="monospace" font-size="13" fill="#444">总计   26,000  31,500  36,400  45,000</text>
    </svg>`,
    result: `## 季度销售数据对比

| 产品 | Q1 | Q2 | Q3 | Q4 |
|------|-----|-----|-----|-----|
| A系列 | 12,500 | 15,800 | 18,200 | 22,100 |
| B系列 | 8,300 | 9,600 | 10,400 | 13,700 |
| C系列 | 5,200 | 6,100 | 7,800 | 9,200 |
| **总计** | **26,000** | **31,500** | **36,400** | **45,000** |`
  },

  formula: {
    image: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
      <rect width="400" height="200" fill="#f8f9fa" rx="8"/>
      <text x="30" y="50" font-family="serif" font-size="16" fill="#333">傅里叶变换公式：</text>
      <text x="50" y="80" font-family="serif" font-size="20" font-style="italic" fill="#1a1a2e">F(ω) = ∫ f(t) · e^(-iωt) dt</text>
      <text x="30" y="115" font-family="serif" font-size="16" fill="#333">二次方程求根公式：</text>
      <text x="50" y="145" font-family="serif" font-size="20" font-style="italic" fill="#1a1a2e">x = (-b ± √(b² - 4ac)) / (2a)</text>
      <text x="30" y="175" font-family="serif" font-size="16" fill="#333">欧拉恒等式：</text>
      <text x="50" y="195" font-family="serif" font-size="18" font-style="italic" fill="#1a1a2e">e^(iπ) + 1 = 0</text>
    </svg>`,
    result: `## 数学公式

### 傅里叶变换公式

$$F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) \\cdot e^{-i\\omega t} \\, dt$$

### 二次方程求根公式

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### 欧拉恒等式

$$e^{i\\pi} + 1 = 0$$`
  }
};
