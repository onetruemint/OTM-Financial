import cloudinary, { UploadResult } from '../cloudinary';

describe('cloudinary', () => {
  it('should export cloudinary instance', () => {
    expect(cloudinary).toBeDefined();
    expect(cloudinary.config).toBeDefined();
  });

  it('should have config function', () => {
    expect(typeof cloudinary.config).toBe('function');
  });

  it('should have uploader', () => {
    expect(cloudinary.uploader).toBeDefined();
  });

  it('should have api', () => {
    expect(cloudinary.api).toBeDefined();
  });
});

describe('UploadResult interface', () => {
  it('should define upload result structure', () => {
    const result: UploadResult = {
      secure_url: 'https://example.com/image.jpg',
      public_id: 'image123',
      width: 800,
      height: 600,
      format: 'jpg',
    };

    expect(result.secure_url).toBe('https://example.com/image.jpg');
    expect(result.public_id).toBe('image123');
    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
    expect(result.format).toBe('jpg');
  });
});
