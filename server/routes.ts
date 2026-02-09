import { Router, Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query } from './db';
import { requireAuth, requireAdmin } from './middleware';
import { AuthRequest, DBUser, DBPost } from './types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// --- Validation Schemas ---
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const CategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  slug: z.string().min(2).optional(),
});

const PostSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3).optional(),
  content: z.string().min(20),
  excerpt: z.string().optional(),
  category_id: z.string().uuid().optional(),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  is_published: z.boolean().optional()
});

// --- Helper for Mapping ---
const mapPost = (row: any) => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  featuredImage: row.featured_image,
  categoryId: row.category_id,
  author: row.author_name || 'Unknown',
  tags: row.tags || [],
  views: row.views,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  isPublished: row.is_published,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// --- AUTH ROUTES ---

router.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    const result = await query<DBUser>('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, role: user.role, username: user.username }
      }
    });
  } catch (error) {
    next(error);
  }
});

// --- PUBLIC ROUTES ---

// GET /api/categories
router.get('/categories', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts
router.get('/posts', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0, search, category, tag } = req.query;
    
    let queryText = `
      SELECT p.*, u.username as author_name, c.name as category_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIdx = 1;

    // Filter logic (Public only sees published posts)
    // The Admin API has its own route.
    queryText += ` AND p.is_published = true`;

    if (search) {
      queryText += ` AND (p.title ILIKE $${paramIdx} OR p.content ILIKE $${paramIdx})`;
      params.push(`%${search}%`);
      paramIdx++;
    }

    if (category) {
      // Check if it's UUID or Slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(category));
      if (isUUID) {
         queryText += ` AND p.category_id = $${paramIdx}`;
      } else {
         queryText += ` AND c.slug = $${paramIdx}`;
      }
      params.push(category);
      paramIdx++;
    }

    if (tag) {
       queryText += ` AND $${paramIdx} = ANY(p.tags)`;
       params.push(tag);
       paramIdx++;
    }

    queryText += ` ORDER BY p.created_at DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    res.json({ success: true, data: result.rows.map(mapPost) });
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:slugOrId
router.get('/posts/:slugOrId', async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    const queryText = `
      SELECT p.*, u.username as author_name, c.name as category_name
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${isUUID ? 'p.id = $1' : 'p.slug = $1'}
    `;

    const result = await query(queryText, [slugOrId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const post = result.rows[0];
    
    // Only increment view if published
    if (post.is_published) {
      query('UPDATE posts SET views = views + 1 WHERE id = $1', [post.id]).catch(console.error);
    }

    res.json({ success: true, data: mapPost(post) });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN ROUTES (PROTECTED) ---

// GET /api/admin/posts (Includes drafts)
router.get('/admin/posts', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const result = await query(`
      SELECT p.*, u.username as author_name, c.name as category_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: result.rows.map(mapPost) });
  } catch (error) {
    next(error);
  }
});

// POST /api/categories
router.post('/categories', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, slug } = CategorySchema.parse(req.body);
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const result = await query(`
      INSERT INTO categories (name, slug, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [name, finalSlug, description]);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// PUT /api/categories/:id
router.put('/categories/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const result = await query(`
      UPDATE categories SET name = $1, description = $2
      WHERE id = $3
      RETURNING *
    `, [name, description, id]);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts
router.post('/posts', requireAuth, requireAdmin, async (req: Request, res, next) => {
  try {
    const authReq = req as any as AuthRequest;
    const body = PostSchema.parse((req as any).body);
    const authorId = authReq.user?.id;
    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const insertResult = await query(`
      INSERT INTO posts (
        title, slug, content, excerpt, category_id, author_id, is_published, 
        featured_image, tags, seo_title, seo_description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id
    `, [
      body.title, slug, body.content, body.excerpt, body.category_id, authorId, body.is_published || false,
      body.featuredImage, body.tags || [], body.seoTitle, body.seoDescription
    ]);

    const newId = insertResult.rows[0].id;
    
    // Fetch full post to get joins
    const fullPost = await query(`
      SELECT p.*, u.username as author_name, c.name as category_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [newId]);

    res.status(201).json({ success: true, data: mapPost(fullPost.rows[0]) });
  } catch (error) {
    next(error);
  }
});

// PUT /api/posts/:id
router.put('/posts/:id', requireAuth, requireAdmin, async (req: Request, res, next) => {
  try {
    const { id } = (req as any).params;
    const body = (req as any).body;
    
    const fieldMap: Record<string, string> = {
      title: 'title',
      slug: 'slug',
      content: 'content',
      excerpt: 'excerpt',
      categoryId: 'category_id',
      isPublished: 'is_published',
      featuredImage: 'featured_image',
      tags: 'tags',
      seoTitle: 'seo_title',
      seoDescription: 'seo_description'
    };

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    Object.keys(body).forEach(key => {
      if (fieldMap[key] && body[key] !== undefined) {
        fields.push(`${fieldMap[key]} = $${idx}`);
        values.push(body[key]);
        idx++;
      }
    });

    if (fields.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

    values.push(id);

    await query(`
      UPDATE posts SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${idx}
    `, values);

    // Fetch full post to get joins
    const fullPost = await query(`
      SELECT p.*, u.username as author_name, c.name as category_name 
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);

    if (fullPost.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, data: mapPost(fullPost.rows[0]) });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id
router.delete('/posts/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = (req as any).params;
    const result = await query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;