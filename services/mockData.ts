import { BlogPost, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Best practices, architecture, and coding patterns.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, Kubernetes, and cloud infrastructure.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Generative AI, LLMs, and data science.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Web Development',
    slug: 'web-dev',
    description: 'Modern frontend frameworks, CSS, and accessibility.',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: '101',
    title: 'The Future of React Server Components',
    slug: 'future-of-react-server-components',
    excerpt: 'Understanding how RSC changes the paradigm of modern web development and what it means for your next project.',
    content: `React Server Components (RSC) represent a major shift in how we build React applications. 

## What are Server Components?

Traditionally, React components run on the client. With RSC, components can run on the server, allowing them to access the database directly and send only the rendered HTML to the client.

### Key Benefits
1. **Zero Bundle Size**: Dependencies used in Server Components aren't sent to the client.
2. **Direct Backend Access**: Query your database directly inside your component.
3. **Automatic Code Splitting**: Server components help split your client bundles automatically.

This shift requires a mental model change but offers significant performance improvements for data-heavy applications.`,
    featuredImage: 'https://picsum.photos/seed/react/800/400',
    categoryId: '1',
    author: 'Alex Dev',
    tags: ['React', 'Frontend', 'Performance'],
    views: 1250,
    seoTitle: 'React Server Components Guide',
    seoDescription: 'A deep dive into React Server Components.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '102',
    title: 'Scaling Kubernetes in Production',
    slug: 'scaling-kubernetes-production',
    excerpt: 'Lessons learned from managing a 500-node cluster in a high-traffic environment.',
    content: 'Kubernetes is powerful, but managing it at scale requires a different set of tools and practices...',
    featuredImage: 'https://picsum.photos/seed/k8s/800/400',
    categoryId: '2',
    author: 'Sarah Ops',
    tags: ['Kubernetes', 'DevOps', 'Scaling'],
    views: 890,
    seoTitle: 'Kubernetes Scaling Tips',
    seoDescription: 'How to scale k8s effectively.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: '103',
    title: 'Introduction to Gemini API',
    slug: 'intro-to-gemini-api',
    excerpt: 'Getting started with Google\'s latest multimodal AI models using TypeScript.',
    content: 'The Gemini API offers a robust way to integrate AI into your applications...',
    featuredImage: 'https://picsum.photos/seed/ai/800/400',
    categoryId: '3',
    author: 'Tech Lead',
    tags: ['AI', 'Gemini', 'API'],
    views: 450,
    seoTitle: 'Gemini API Tutorial',
    seoDescription: 'Learn to use Gemini API.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '104',
    title: 'CSS Architecture for Large Teams',
    slug: 'css-architecture',
    excerpt: 'How to maintain sanity in your stylesheets when working with 50+ developers.',
    content: 'Utility-first CSS, CSS-in-JS, or BEM? The answer depends on your team structure...',
    featuredImage: 'https://picsum.photos/seed/css/800/400',
    categoryId: '4',
    author: 'Design Lead',
    tags: ['CSS', 'Tailwind', 'Architecture'],
    views: 320,
    seoTitle: 'CSS Architecture Guide',
    seoDescription: 'Scalable CSS practices.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: '105',
    title: 'PostgreSQL Indexing Strategies',
    slug: 'postgres-indexing',
    excerpt: 'Optimize your database queries by understanding B-Tree, GIN, and GiST indexes.',
    content: 'Database performance often comes down to proper indexing...',
    featuredImage: 'https://picsum.photos/seed/db/800/400',
    categoryId: '1',
    author: 'Data Engineer',
    tags: ['Database', 'SQL', 'Performance'],
    views: 600,
    seoTitle: 'Postgres Indexing',
    seoDescription: 'Mastering SQL indexes.',
    isPublished: true,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  }
];