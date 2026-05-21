export const REPORT_STYLES = `
@page {
  size: A4;
  margin: 22mm 24mm 28mm 24mm;
  @bottom-center {
    content: counter(page);
    font-family: 'Cormorant Garamond', serif;
    font-size: 9pt;
    color: #b88a4a;
  }
}
@page :first {
  margin: 0;
  @bottom-center { content: none; }
}
@page cover {
  margin: 0;
  @bottom-center { content: none; }
}
@page verse {
  margin: 0;
  @bottom-center { content: none; }
}
@page contents {
  @bottom-center { content: none; }
}
@page closing {
  @bottom-center { content: none; }
}

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');

:root {
  --ink: #2a2620;
  --gold: #b88a4a;
  --gold-muted: #9a7636;
  --parchment: #f5efe2;
  --rule: rgba(184,138,74,0.4);
  --display: 'Cormorant Garamond', Georgia, serif;
  --body: 'EB Garamond', Georgia, serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--body);
  font-size: 11pt;
  line-height: 1.65;
  color: var(--ink);
  background: #fff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ==================== COVER ==================== */
.cover-page {
  page: cover;
  page-break-after: always;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--parchment);
  position: relative;
  padding: 60px 40px;
}
.cover-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 20%, rgba(184,138,74,0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(184,138,74,0.04) 0%, transparent 50%);
  pointer-events: none;
}
.cover-content {
  position: relative;
  z-index: 1;
}
.cover-type-label {
  font-family: var(--display);
  font-size: 11pt;
  font-weight: 500;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 28px;
}
.cover-symbol {
  margin-bottom: 32px;
}
.cover-symbol svg {
  width: 140px;
  height: 140px;
}
.cover-title {
  font-family: var(--display);
  font-size: 42pt;
  font-weight: 600;
  line-height: 1.1;
  color: var(--ink);
  margin-bottom: 12px;
}
.cover-figure {
  font-family: var(--display);
  font-size: 16pt;
  font-style: italic;
  font-weight: 400;
  color: var(--gold-muted);
  margin-bottom: 24px;
}
.cover-rule {
  width: 80px;
  height: 1px;
  background: var(--gold);
  margin: 0 auto 24px;
}
.cover-tagline {
  font-family: var(--display);
  font-size: 10pt;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 64px;
}
.cover-for {
  font-family: var(--body);
  font-size: 11pt;
  font-style: italic;
  color: var(--gold-muted);
  margin-bottom: 8px;
}
.cover-name {
  font-family: var(--display);
  font-size: 18pt;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 48px;
}
.cover-wordmark {
  font-family: var(--display);
  font-size: 9pt;
  font-weight: 600;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
}

/* ==================== VERSE PAGE ==================== */
.verse-page {
  page: verse;
  page-break-after: always;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: #fff;
  padding: 80px 60px;
}
.verse-text {
  font-family: var(--display);
  font-size: 18pt;
  font-style: italic;
  font-weight: 400;
  line-height: 1.55;
  color: var(--ink);
  max-width: 420px;
  margin-bottom: 32px;
}
.verse-ref {
  font-family: var(--display);
  font-size: 10pt;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

/* ==================== CONTENTS ==================== */
.contents-page {
  page: contents;
  page-break-after: always;
  padding: 60px 0 40px;
  background: #fff;
}
.contents-title {
  font-family: var(--display);
  font-size: 24pt;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 40px;
  text-align: center;
}
.contents-list {
  list-style: none;
  max-width: 400px;
  margin: 0 auto;
}
.contents-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(184,138,74,0.15);
}
.contents-label {
  font-family: var(--display);
  font-size: 10pt;
  font-weight: 600;
  color: var(--gold);
  width: 28px;
  flex-shrink: 0;
}
.contents-name {
  font-family: var(--body);
  font-size: 11pt;
  color: var(--ink);
  flex: 1;
  padding-left: 8px;
}

/* ==================== CONTENT SECTIONS ==================== */
.section-page {
  page-break-before: always;
  page-break-inside: avoid;
  padding-top: 8px;
  background: #fff;
}
.section-label {
  font-family: var(--display);
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}
.section-title {
  font-family: var(--display);
  font-size: 26pt;
  font-weight: 600;
  line-height: 1.15;
  color: var(--ink);
  margin-bottom: 16px;
}
.section-rule {
  width: 60px;
  height: 1px;
  background: var(--gold);
  margin-bottom: 28px;
}
.section-body {
  font-family: var(--body);
  font-size: 11pt;
  line-height: 1.65;
  color: var(--ink);
  text-align: justify;
  hyphens: auto;
}
.section-body p {
  margin-bottom: 14px;
}

/* Drop cap: real span, not pseudo-element, for reliable print rendering */
.dropcap {
  font-family: var(--display);
  font-size: 3.4em;
  font-weight: 600;
  line-height: 0.82;
  color: var(--gold);
  float: left;
  margin-right: 5px;
  margin-top: 1px;
}

/* Sub-headers within sections (from Markdown ##) */
.section-body h2 {
  font-family: var(--display);
  font-size: 15pt;
  font-weight: 600;
  color: var(--gold);
  margin-top: 24px;
  margin-bottom: 12px;
  line-height: 1.3;
  page-break-after: avoid;
}



/* Verse blocks */
.verse-block {
  margin: 14px 0 18px;
  padding: 0 0 0 20px;
  border-left: 2px solid var(--rule);
  page-break-inside: avoid;
}
.verse-block em,
.verse-block strong {
  font-style: italic;
  font-weight: 400;
  font-size: 10.5pt;
  line-height: 1.6;
  color: var(--ink);
}
.verse-ref-inner {
  font-family: var(--display);
  font-size: 9pt;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-top: 6px;
}

/* Scripture group headers */
.scripture-group {
  margin-bottom: 28px;
}
.scripture-group-title {
  font-family: var(--display);
  font-size: 13pt;
  font-weight: 600;
  color: var(--gold);
  margin-bottom: 16px;
  letter-spacing: 0.05em;
}

/* ==================== BACK PAGE ==================== */
.back-page {
  page: closing;
  page-break-before: always;
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--parchment);
  padding: 80px 40px;
}
.back-symbol {
  margin-bottom: 24px;
}
.back-symbol svg {
  width: 48px;
  height: 48px;
}
.back-wordmark {
  font-family: var(--display);
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
}
.back-disclaimer {
  font-family: var(--body);
  font-size: 8.5pt;
  font-style: italic;
  color: var(--gold-muted);
  max-width: 360px;
  line-height: 1.5;
}

/* ==================== PRINT OVERRIDES ==================== */
@media print {
  body {
    background: #fff !important;
  }
  .cover-page, .back-page {
    background: var(--parchment) !important;
  }
  .section-page {
    page-break-before: always;
  }
}
`;
