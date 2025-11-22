import { siteConfig, defaultMetadata, generateArticleMetadata, generateListMetadata } from '../seo';

describe('siteConfig', () => {
  it('should have required properties', () => {
    expect(siteConfig.name).toBe('OneTrueMint Financial');
    expect(siteConfig.shortName).toBe('OTM Financial');
    expect(siteConfig.url).toBe('https://blog.onetruemint.com');
    expect(siteConfig.ogImage).toBe('/og-image.png');
  });

  it('should have keywords array', () => {
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
    expect(siteConfig.keywords.length).toBeGreaterThan(0);
    expect(siteConfig.keywords).toContain('personal finance');
  });

  it('should have author information', () => {
    expect(siteConfig.author.name).toBe('OneTrueMint');
    expect(siteConfig.author.url).toBe('https://onetruemint.com');
  });

  it('should have social information', () => {
    expect(siteConfig.social.twitter).toBe('@onetruemint');
  });
});

describe('defaultMetadata', () => {
  it('should have metadataBase', () => {
    expect(defaultMetadata.metadataBase).toBeDefined();
  });

  it('should have title configuration', () => {
    expect(defaultMetadata.title).toBeDefined();
    const title = defaultMetadata.title as { default: string; template: string };
    expect(title.default).toContain('OTM Financial');
    expect(title.template).toContain('%s');
  });

  it('should have description', () => {
    expect(defaultMetadata.description).toBe(siteConfig.description);
  });

  it('should have keywords', () => {
    expect(defaultMetadata.keywords).toEqual(siteConfig.keywords);
  });

  it('should have robots configuration', () => {
    expect(defaultMetadata.robots).toBeDefined();
    const robots = defaultMetadata.robots as any;
    expect(robots.index).toBe(true);
    expect(robots.follow).toBe(true);
  });

  it('should have openGraph configuration', () => {
    expect(defaultMetadata.openGraph).toBeDefined();
    const og = defaultMetadata.openGraph as any;
    expect(og.type).toBe('website');
    expect(og.locale).toBe('en_US');
  });

  it('should have twitter configuration', () => {
    expect(defaultMetadata.twitter).toBeDefined();
    const twitter = defaultMetadata.twitter as any;
    expect(twitter.card).toBe('summary_large_image');
  });

  it('should have alternates', () => {
    expect(defaultMetadata.alternates).toBeDefined();
  });
});

describe('generateArticleMetadata', () => {
  const baseArticle = {
    title: 'Test Article',
    description: 'Test description',
    slug: 'test-article',
    publishedTime: '2024-01-01T00:00:00Z',
  };

  it('should generate basic metadata', () => {
    const metadata = generateArticleMetadata(baseArticle);
    expect(metadata.title).toBe('Test Article');
    expect(metadata.description).toBe('Test description');
  });

  it('should generate openGraph metadata', () => {
    const metadata = generateArticleMetadata(baseArticle);
    const og = metadata.openGraph as any;
    expect(og.type).toBe('article');
    expect(og.url).toBe(`${siteConfig.url}/blog/test-article`);
    expect(og.publishedTime).toBe('2024-01-01T00:00:00Z');
  });

  it('should include modifiedTime when provided', () => {
    const metadata = generateArticleMetadata({
      ...baseArticle,
      modifiedTime: '2024-01-02T00:00:00Z',
    });
    const og = metadata.openGraph as any;
    expect(og.modifiedTime).toBe('2024-01-02T00:00:00Z');
  });

  it('should include authors when provided', () => {
    const metadata = generateArticleMetadata({
      ...baseArticle,
      authors: ['John Doe', 'Jane Doe'],
    });
    expect(metadata.authors).toEqual([{ name: 'John Doe' }, { name: 'Jane Doe' }]);
  });

  it('should include tags as keywords', () => {
    const metadata = generateArticleMetadata({
      ...baseArticle,
      tags: ['javascript', 'typescript'],
    });
    expect(metadata.keywords).toEqual(['javascript', 'typescript']);
  });

  it('should use custom image when provided', () => {
    const metadata = generateArticleMetadata({
      ...baseArticle,
      image: 'https://example.com/custom-image.jpg',
    });
    const og = metadata.openGraph as any;
    expect(og.images[0].url).toBe('https://example.com/custom-image.jpg');
  });

  it('should use default ogImage when no image provided', () => {
    const metadata = generateArticleMetadata(baseArticle);
    const og = metadata.openGraph as any;
    expect(og.images[0].url).toBe(siteConfig.ogImage);
  });

  it('should generate twitter metadata', () => {
    const metadata = generateArticleMetadata(baseArticle);
    const twitter = metadata.twitter as any;
    expect(twitter.card).toBe('summary_large_image');
    expect(twitter.title).toBe('Test Article');
  });

  it('should generate canonical URL', () => {
    const metadata = generateArticleMetadata(baseArticle);
    const alternates = metadata.alternates as any;
    expect(alternates.canonical).toBe(`${siteConfig.url}/blog/test-article`);
  });
});

describe('generateListMetadata', () => {
  const baseList = {
    title: 'Category Page',
    description: 'Category description',
    path: '/category/tech',
  };

  it('should generate basic metadata', () => {
    const metadata = generateListMetadata(baseList);
    expect(metadata.title).toBe('Category Page');
    expect(metadata.description).toBe('Category description');
  });

  it('should generate openGraph metadata', () => {
    const metadata = generateListMetadata(baseList);
    const og = metadata.openGraph as any;
    expect(og.type).toBe('website');
    expect(og.url).toBe(`${siteConfig.url}/category/tech`);
  });

  it('should generate twitter metadata with summary card', () => {
    const metadata = generateListMetadata(baseList);
    const twitter = metadata.twitter as any;
    expect(twitter.card).toBe('summary');
  });

  it('should generate canonical URL', () => {
    const metadata = generateListMetadata(baseList);
    const alternates = metadata.alternates as any;
    expect(alternates.canonical).toBe(`${siteConfig.url}/category/tech`);
  });
});
