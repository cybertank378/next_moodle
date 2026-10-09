import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const logoDirectory = path.join(root, "public", "assets", "images", "logo");
const appDirectory = path.join(root, "src", "app");

await mkdir(logoDirectory, { recursive: true });

const svg = (name) => path.join(logoDirectory, name);

async function renderPng(input, output, width, height) {
  await sharp(input)
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(output);
}

await Promise.all([
  renderPng(
    svg("aksaventra-logo-on-light.svg"),
    svg("aksaventra-logo-on-light.png"),
    1200,
    288,
  ),
  renderPng(
    svg("aksaventra-logo-on-dark.svg"),
    svg("aksaventra-logo-on-dark.png"),
    1200,
    288,
  ),
  renderPng(
    svg("aksaventra-mark-on-light.svg"),
    svg("aksaventra-mark-on-light.png"),
    512,
    512,
  ),
  renderPng(
    svg("aksaventra-mark-on-dark.svg"),
    svg("aksaventra-mark-on-dark.png"),
    512,
    512,
  ),
  renderPng(
    svg("aksaventra-mark-on-light.svg"),
    path.join(appDirectory, "icon.png"),
    96,
    96,
  ),
  renderPng(
    svg("aksaventra-mark-on-light.svg"),
    path.join(appDirectory, "apple-icon.png"),
    180,
    180,
  ),
  renderPng(
    svg("aksaventra-mark-on-light.svg"),
    svg("web-app-manifest-192x192.png"),
    192,
    192,
  ),
  renderPng(
    svg("aksaventra-mark-on-light.svg"),
    svg("web-app-manifest-512x512.png"),
    512,
    512,
  ),
]);

const faviconSvg = await readFile(svg("aksaventra-mark-favicon.svg"));
const faviconSizes = [16, 32, 48];
const faviconFrames = await Promise.all(
  faviconSizes.map((size) =>
    sharp(faviconSvg)
      .resize(size, size, { fit: "contain" })
      .png({ compressionLevel: 9 })
      .toBuffer(),
  ),
);

const directorySize = 6 + faviconFrames.length * 16;
const header = Buffer.alloc(directorySize);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(faviconFrames.length, 4);

let offset = directorySize;
for (const [index, frame] of faviconFrames.entries()) {
  const entryOffset = 6 + index * 16;
  const size = faviconSizes[index];
  header.writeUInt8(size, entryOffset);
  header.writeUInt8(size, entryOffset + 1);
  header.writeUInt8(0, entryOffset + 2);
  header.writeUInt8(0, entryOffset + 3);
  header.writeUInt16LE(1, entryOffset + 4);
  header.writeUInt16LE(32, entryOffset + 6);
  header.writeUInt32LE(frame.length, entryOffset + 8);
  header.writeUInt32LE(offset, entryOffset + 12);
  offset += frame.length;
}

await writeFile(
  path.join(appDirectory, "favicon.ico"),
  Buffer.concat([header, ...faviconFrames]),
);
