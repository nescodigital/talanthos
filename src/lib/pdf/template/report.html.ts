import { QuizUserData, ReportContent, BiblicalType, SECTION_TITLES } from '../types';
import { TYPE_DATA } from '../type-data';
import { SYMBOLS } from './symbols';
import { REPORT_STYLES } from './styles';

/**
 * Convert inline markdown within a text line:
 *   **bold** -> <strong>bold</strong>
 *   *italic* -> <em>italic</em>
 */
function inlineMdToHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/**
 * Lightweight markdown-to-HTML converter.
 * Handles:
 *   ## Header → <h2>
 *   **bold**, *italic* → inline HTML
 *   blank lines → <p> blocks
 *   Verse blocks: lines starting with ">" + subsequent **Reference** → .verse-block with ref
 */
function mdToHtml(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let paraLines: string[] = [];
  let hasOutputFirstPara = false;
  let pendingVerseText: string | null = null;

  const wrapDropCap = (text: string): string => {
    if (!text || text.length === 0) return text;
    const firstChar = text[0];
    const rest = text.slice(1);
    return `<span class="dropcap">${firstChar}</span>${rest}`;
  };

  const flushPara = () => {
    if (paraLines.length > 0) {
      const rawText = paraLines.join(' ').trim();
      if (rawText) {
        let htmlText = inlineMdToHtml(rawText);
        if (!hasOutputFirstPara) {
          htmlText = wrapDropCap(htmlText);
        }
        out.push(`<p>${htmlText}</p>`);
        hasOutputFirstPara = true;
      }
      paraLines = [];
    }
  };

  const flushVerse = (ref?: string) => {
    if (pendingVerseText !== null) {
      const textHtml = inlineMdToHtml(pendingVerseText);
      const refHtml = ref
        ? `<div class="verse-ref-inner">${inlineMdToHtml(ref)}</div>`
        : '';
      out.push(`<div class="verse-block">${textHtml}${refHtml}</div>`);
      pendingVerseText = null;
      hasOutputFirstPara = true;
    }
  };

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    // ## Header
    if (line.startsWith('## ')) {
      flushPara();
      flushVerse();
      const html = inlineMdToHtml(line.slice(3).trim());
      out.push(`<h2>${html}</h2>`);
      i++;
      continue;
    }

    // Blank line
    if (line === '') {
      flushPara();
      flushVerse();
      i++;
      continue;
    }

    // Verse text line starting with "> "
    if (line.startsWith('> ')) {
      flushPara();
      flushVerse();
      pendingVerseText = line.slice(2).trim();

      // Peek ahead: if next non-empty line is a **Reference**, consume it
      let j = i + 1;
      while (j < lines.length && lines[j].trim() === '') j++;
      if (j < lines.length) {
        const nextLine = lines[j].trim();
        if (/^\*\*[^*]+\*\*$/.test(nextLine)) {
          const ref = nextLine.replace(/^\*\*|\*\*$/g, '').trim();
          flushVerse(ref);
          i = j + 1;
          continue;
        }
      }
      // No ref found, flush as text-only verse
      flushVerse();
      i++;
      continue;
    }

    // Regular paragraph line
    paraLines.push(line);
    i++;
  }

  flushPara();
  flushVerse();

  return out.join('\n');
}

function renderSection(
  key: keyof ReportContent,
  content: string
): string {
  const { label, title } = SECTION_TITLES[key];
  const bodyHtml = mdToHtml(content);

  return `
<div class="section-page">
  <div class="section-label">${label} &nbsp; ${title}</div>
  <div class="section-rule"></div>
  <div class="section-body">
    ${bodyHtml}
  </div>
</div>
`;
}

export function buildReportHtml(
  user: QuizUserData,
  content: ReportContent
): string {
  const td = TYPE_DATA[user.primaryType];
  const typeLabel = td.name;
  const figure = td.figure;
  const verseText = td.coverVerse;
  const verseRef = td.coverVerseRef;
  const symbolSvg = SYMBOLS[td.symbolKey];

  const sections = (Object.keys(SECTION_TITLES) as Array<keyof ReportContent>)
    .map((key) => renderSection(key, content[key]))
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${typeLabel} Report — ${user.firstName}</title>
  <style>${REPORT_STYLES}</style>
</head>
<body>

<!-- ==================== COVER ==================== -->
<div class="cover-page">
  <div class="cover-content">
    <div class="cover-type-label">Type ${td.monogram}</div>
    <div class="cover-symbol">${symbolSvg}</div>
    <div class="cover-title">The ${typeLabel}</div>
    <div class="cover-figure">${figure}</div>
    <div class="cover-rule"></div>
    <div class="cover-tagline">${td.tagline}</div>
    <div class="cover-for">Prepared for</div>
    <div class="cover-name">${user.firstName}</div>
    <div class="cover-wordmark">Talanthos</div>
  </div>
</div>

<!-- ==================== VERSE PAGE ==================== -->
<div class="verse-page">
  <div class="verse-text">"${verseText}"</div>
  <div class="verse-ref">${verseRef}</div>
</div>

<!-- ==================== CONTENTS ==================== -->
<div class="contents-page">
  <div class="contents-title">Contents</div>
  <ul class="contents-list">
    ${(Object.keys(SECTION_TITLES) as Array<keyof ReportContent>).map((key) => {
      const { label, title } = SECTION_TITLES[key];
      return `<li class="contents-item"><span class="contents-label">${label}</span><span class="contents-name">${title}</span></li>`;
    }).join('\n')}
  </ul>
</div>

<!-- ==================== SECTIONS ==================== -->
${sections}

<!-- ==================== BACK PAGE ==================== -->
<div class="back-page">
  <div class="back-symbol">${symbolSvg}</div>
  <div class="back-wordmark">Talanthos</div>
  <div class="back-disclaimer">
    This report offers spiritual guidance, not professional financial, legal, or tax advice.
    Seek qualified counsel for decisions pertaining to your specific situation.
  </div>
</div>

</body>
</html>`;
}


