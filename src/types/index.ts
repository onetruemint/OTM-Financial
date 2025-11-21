export interface IPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: IAuthor | string;
  category: ICategory | string;
  tags: (ITag | string)[];
  likes: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthor {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface SearchParams {
  q?: string;
  category?: string;
  tag?: string;
  page?: string;
}
