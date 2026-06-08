const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function resolveImage(image: string | null | undefined): string | undefined {
  if (!image) return undefined;
  if (image.startsWith('http')) return image;
  return `${API_URL}${image}`;
}
