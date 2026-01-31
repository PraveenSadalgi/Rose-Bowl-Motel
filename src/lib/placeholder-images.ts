import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export const getPlaceholderImage = (id: string): ImagePlaceholder => {
  if (!placeholderImages || !Array.isArray(placeholderImages)) {
    console.error('Error: placeholderImages is unavailable or not an array.', placeholderImages);
    return {
      id: 'error-data',
      description: 'Data Error',
      imageUrl: 'https://picsum.photos/seed/error/600/400',
      imageHint: 'data error',
    };
  }

  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    console.warn(`Warning: Image placeholder not found for id: "${id}"`);
    return {
      id: 'not-found',
      description: 'Image not found',
      imageUrl: 'https://picsum.photos/seed/error/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};
