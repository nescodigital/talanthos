import puppeteer from "puppeteer-core";

export interface GeneratePdfOptions {
  html: string;
  sessionId: string;
}

function getChromePath(): string {
  if (process.env.CHROMIUM_EXECUTABLE_PATH) {
    return process.env.CHROMIUM_EXECUTABLE_PATH;
  }
  // macOS
  if (process.platform === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  // Linux
  if (process.platform === "linux") {
    return "/usr/bin/google-chrome";
  }
  // Windows
  if (process.platform === "win32") {
    return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }
  return "/usr/bin/google-chrome";
}

export async function generatePdf({ html }: GeneratePdfOptions): Promise<Buffer> {
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

    // Wait for fonts
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "60px", right: "50px", bottom: "50px", left: "50px" },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    if (browser) await browser.close();
  }
}
