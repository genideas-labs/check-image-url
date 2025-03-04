import { isImageUrl } from '../src/index';

describe('isImageUrl', () => {
  it('should return true for valid image URLs', async () => {
    expect(await isImageUrl('https://www.example.com/image.jpg')).toBe(true);
    expect(await isImageUrl('https://www.example.com/image.png')).toBe(true);
    expect(await isImageUrl('https://www.example.com/image.gif')).toBe(true);
  });

  it('should return false for invalid image URLs', async () => {
    expect(await isImageUrl('https://www.example.com/')).toBe(false);
    expect(await isImageUrl('https://www.example.com/not-an-image.txt')).toBe(false);
  });

    it('should return true for data URLs', async () => {
    expect(await isImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==')).toBe(true);
  });
});
