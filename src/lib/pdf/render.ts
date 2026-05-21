import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

function getChromePath(): string {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH;
  }
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  if (process.platform === "linux") {
    return "/usr/bin/google-chrome";
  }
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  return "/usr/bin/google-chrome";
}

export interface RenderOptions {
  html: string;
  outputPath?: string;
  saveHtml?: boolean;
}

export async function renderPdf(options: RenderOptions): Promise<Buffer> {
  const { html, outputPath, saveHtml = true } = options;

  const isDev = process.env.NODE_ENV === "development";

  let executablePath: string;
  let args: string[] = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];

  if (isDev) {
    executablePath = getChromePath();
    args = [];
  } else {
    const chromium = await import("@sparticuz/chromium");
    executablePath = await chromium.default.executablePath();
    args = chromium.default.args;
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args,
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    // Wait for Google Fonts to load
    await page.evaluate(() => document.fonts.ready);
    // Extra safety wait
    await new Promise((r) => setTimeout(r, 800));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    const buffer = Buffer.from(pdf);

    if (outputPath) {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ PDF saved to ${outputPath}`);
    }

    if (saveHtml && outputPath) {
      const htmlPath = outputPath.replace(/\.pdf$/, ".html");
      fs.writeFileSync(htmlPath, html);
      console.log(`✓ HTML saved to ${htmlPath}`);
    }

    return buffer;
  } finally {
    if (browser) await browser.close();
  }
}
