import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import fs from "fs";
import path from "path";

function getChromePath(): string | undefined {
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
  return undefined;
}

export interface RenderOptions {
  html: string;
  outputPath?: string;
  saveHtml?: boolean;
}

export async function renderPdf(options: RenderOptions): Promise<Buffer> {
  const { html, outputPath, saveHtml = true } = options;

  const isDev = process.env.NODE_ENV === "development";

  let executablePath: string | undefined;
  let args: string[] = ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"];

  if (isDev) {
    executablePath = getChromePath();
  } else {
    const remotePath = process.env.CHROMIUM_REMOTE_EXEC_PATH;
    if (remotePath) {
      // Vercel production: download chromium from remote URL
      executablePath = await chromium.executablePath(remotePath);
    } else {
      // Fallback: try local path
      executablePath = await chromium.executablePath();
    }
    args = chromium.args;
  }

  if (!executablePath) {
    throw new Error("Chromium executable path not found. Set CHROMIUM_EXECUTABLE_PATH or CHROMIUM_REMOTE_EXEC_PATH.");
  }

  console.log("[PDF] Launching Chromium at:", executablePath);

  let browser;
  try {
    browser = await puppeteer.launch({
      args,
      executablePath,
      headless: "new" as any,
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
    console.log("[PDF] Generated, size:", buffer.length);

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
  } catch (err: any) {
    console.error("[PDF] Render error:", err?.message || err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}
