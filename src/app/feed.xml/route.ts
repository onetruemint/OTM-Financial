import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { siteConfig } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  await dbConnect();

  const posts = await Post.find({ published: true })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const itemsXml = posts
    .map((post) => {
      const authorObj = post.author as { name?: string } | null;
      const author = authorObj?.name || 'OneTrueMint';
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>${author}</author>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
