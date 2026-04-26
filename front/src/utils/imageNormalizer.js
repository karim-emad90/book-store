const readExifOrientation = async (file) => {
  try {
    if (!file || !/jpe?g/i.test(file.type)) return 1;

    const buffer = await file.arrayBuffer();
    const view = new DataView(buffer);

    if (view.getUint16(0, false) !== 0xffd8) return 1;

    let offset = 2;
    const length = view.byteLength;

    while (offset < length) {
      const marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xffe1) {
        offset += 2;

        if (view.getUint32(offset, false) !== 0x45786966) return 1;

        const tiffOffset = offset + 6;
        const little = view.getUint16(tiffOffset, false) === 0x4949;
        const firstIFDOffset = view.getUint32(tiffOffset + 4, little);
        const ifdOffset = tiffOffset + firstIFDOffset;
        const entries = view.getUint16(ifdOffset, little);

        for (let i = 0; i < entries; i += 1) {
          const entryOffset = ifdOffset + 2 + i * 12;
          const tag = view.getUint16(entryOffset, little);

          if (tag === 0x0112) {
            return view.getUint16(entryOffset + 8, little) || 1;
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }

    return 1;
  } catch {
    return 1;
  }
};

const loadImageElement = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });

const canvasToBlob = (canvas, type = "image/jpeg", quality = 0.9) =>
  new Promise((resolve) => {
    canvas.toBlob(
      (blob) => resolve(blob),
      type,
      quality
    );
  });

const drawWithOrientation = (ctx, image, width, height, orientation) => {
  switch (orientation) {
    case 2:
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;

    case 3:
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;

    case 4:
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;

    case 5:
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;

    case 6:
      ctx.translate(height, 0);
      ctx.rotate(0.5 * Math.PI);
      break;

    case 7:
      ctx.translate(height, width);
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(-1, 1);
      break;

    case 8:
      ctx.translate(0, width);
      ctx.rotate(-0.5 * Math.PI);
      break;

    default:
      break;
  }

  ctx.drawImage(image, 0, 0);
};

const downscaleCanvas = (sourceCanvas, maxSize) => {
  const maxSide = Math.max(sourceCanvas.width, sourceCanvas.height);

  if (maxSide <= maxSize) return sourceCanvas;

  const scale = maxSize / maxSide;
  const canvas = document.createElement("canvas");

  canvas.width = Math.round(sourceCanvas.width * scale);
  canvas.height = Math.round(sourceCanvas.height * scale);

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, canvas.width, canvas.height);

  return canvas;
};

export async function normalizeProfileImageFile(file, options = {}) {
  const maxSize = options.maxSize || 900;
  const quality = options.quality || 0.9;

  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Please choose a valid image file.");
  }

  const orientation = await readExifOrientation(file);

  let image;

  try {
    image = await createImageBitmap(file, {
      imageOrientation: "none",
    });
  } catch {
    image = await loadImageElement(file);
  }

  const sourceWidth = image.width;
  const sourceHeight = image.height;
  const shouldSwap = [5, 6, 7, 8].includes(orientation);

  const canvas = document.createElement("canvas");
  canvas.width = shouldSwap ? sourceHeight : sourceWidth;
  canvas.height = shouldSwap ? sourceWidth : sourceHeight;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  drawWithOrientation(ctx, image, canvas.width, canvas.height, orientation);

  const finalCanvas = downscaleCanvas(canvas, maxSize);
  const blob = await canvasToBlob(finalCanvas, "image/jpeg", quality);

  if (!blob) {
    throw new Error("Image processing failed.");
  }

  const cleanName = `${Date.now()}-${file.name || "avatar"}`.replace(
    /\.(png|jpg|jpeg|webp|heic|heif)$/i,
    ".jpg"
  );

  return new File([blob], cleanName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}