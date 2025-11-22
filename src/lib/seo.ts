import { Metadata } from 'next';

export const siteConfig = {
  name: 'OneTrueMint Financial',
  shortName: 'OTM Financial',
  description: 'Your trusted source for personal finance tips, budgeting strategies, investing guides, and financial planning advice to help you achieve financial freedom.',
  url: 'https://blog.onetruemint.com',
  ogImage: '/og-image.png',
  keywords: [
    'personal finance',
    'budgeting',
    'saving money',
    'investing',
    'financial planning',
    'debt management',
    'retirement planning',
    'financial freedom',
    'money management',
    'wealth building',
  ],
  author: {
    name: 'OneTrueMint',
    url: 'https://onetruemint.com',
  },
  social: {
    twitter: '@onetruemint',
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} - Personal Finance Blog`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.shortName,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.shortName,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.social.twitter,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

// Helper to generate article metadata
export function generateArticleMetadata({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  image,
}: {
  title: string;
  description: string;
  slug: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
}): Metadata {
  const url = `${siteConfig.url}/blog/${slug}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: tags,
    authors: authors?.map((name) => ({ name })),
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime,
      modifiedTime,
      authors,
      tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Helper to generate category/tag page metadata
export function generateListMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}
