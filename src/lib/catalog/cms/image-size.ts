import { readFileSync } from "node:fs";

/**
 * Ancho y alto de una imagen leyendo su cabecera (JPEG, PNG, WebP, AVIF), sin dependencias (plan §7.3).
 * El dominio exige dimensiones (`Media.width/height`) para reservar espacio y evitar CLS.
 */
export type ImageInfo = { width: number; height: number; mime: string };

function jpeg(b: Buffer): [number, number] | undefined {
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return undefined;
    const marker = b[i + 1];
    // SOF0–SOF15 salvo DHT (C4), JPG (C8) y DAC (CC): ahí están alto y ancho.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return undefined;
}

function webp(b: Buffer): [number, number] | undefined {
  const chunk = b.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
  if (chunk === "VP8L") {
    const bits = b.readUInt32LE(21);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  if (chunk === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
  return undefined;
}

function avif(b: Buffer): [number, number] | undefined {
  // Caja `ispe` (Image Spatial Extents): tamaño 4 + tipo 4 + versión/flags 4 + ancho 4 + alto 4.
  const at = b.indexOf("ispe");
  return at > 0 && at + 16 <= b.length ? [b.readUInt32BE(at + 8), b.readUInt32BE(at + 12)] : undefined;
}

export function imageInfo(file: string): ImageInfo | undefined {
  let b: Buffer;
  try {
    b = readFileSync(file);
  } catch {
    return undefined;
  }
  let size: [number, number] | undefined;
  let mime: string;
  if (b[0] === 0xff && b[1] === 0xd8) [size, mime] = [jpeg(b), "image/jpeg"];
  else if (b.toString("ascii", 1, 4) === "PNG") [size, mime] = [[b.readUInt32BE(16), b.readUInt32BE(20)], "image/png"];
  else if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") [size, mime] = [webp(b), "image/webp"];
  else if (b.toString("ascii", 4, 8) === "ftyp") [size, mime] = [avif(b), "image/avif"];
  else return undefined;
  return size && size[0] > 0 && size[1] > 0 ? { width: size[0], height: size[1], mime } : undefined;
}
