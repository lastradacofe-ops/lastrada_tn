/**
 * Turns a picked file into a storable data URL.
 *
 * The admin uploads photos for both products and offers and the pipeline is
 * identical, so it lives here once. Output is an 800x800 WebP letterboxed onto
 * the house cream, which is what the editor's helper text promises the owner.
 */
const PREVIEW_SIZE = 800;
const WEBP_QUALITY = 0.82;
const LETTERBOX_BACKGROUND = '#f7f3eb';

/** Contain-fits the image onto a square canvas rather than cropping it. */
async function renderSquareWebp(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas unavailable');

    const scale = Math.min(PREVIEW_SIZE / bitmap.width, PREVIEW_SIZE / bitmap.height);
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    ctx.fillStyle = LETTERBOX_BACKGROUND;
    ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.drawImage(bitmap, (PREVIEW_SIZE - width) / 2, (PREVIEW_SIZE - height) / 2, width, height);

    const blob = await new Promise<Blob>(
      (resolve, reject) => canvas.toBlob(
        result => (result ? resolve(result) : reject(new Error('WebP encode failed'))),
        'image/webp',
        WEBP_QUALITY,
      ),
    );
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Read failed')));
      reader.onerror = () => reject(new Error('Read failed'));
      reader.readAsDataURL(blob);
    });
  } finally {
    bitmap.close();
  }
}

/**
 * Builds a change handler for a file input that stores the result via `apply`.
 * Resets the input so re-picking the same file still fires a change event.
 */
export async function runImagePicker(
  file: File | undefined,
  apply: (dataUrl: string) => void,
  messages: { notAnImage: string; failed: string },
  onError: (message: string) => void,
): Promise<void> {
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    onError(messages.notAnImage);
    return;
  }
  try {
    apply(await renderSquareWebp(file));
  } catch {
    onError(messages.failed);
  }
}
