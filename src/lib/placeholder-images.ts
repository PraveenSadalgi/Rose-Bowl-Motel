import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export const getPlaceholderImage = (id: string): ImagePlaceholder => {
  const image = placeholderImages.find((img) => img.id === id);
  if (!image) {
    // Return a default or throw an error if an image is not found
    return {
      id: 'not-found',
      description: 'Image not found',
      imageUrl: 'https://picsum.photos/seed/error/600/400',
      imageHint: 'placeholder',
    };
  }
  return image;
};
