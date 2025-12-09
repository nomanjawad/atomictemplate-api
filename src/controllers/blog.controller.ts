/**
 * Blog Controller
 * Handles CRUD operations for blog posts
 */
import type { Request, Response } from 'express'
import { supabaseClient } from '@db'
import { BlogPostSchema } from '@atomictemplate/validations'

/**
 * List all blog posts
 * GET /api/blog
 * Query params: ?published=true, ?limit=10, ?offset=0
 */
export async function list(req: Request, res: Response) {
  try {
    if (!supabaseClient) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { published, limit, offset } = req.query
    const user = (req as any).user

    let query = supabaseClient
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })

    // Filter by published status if specified and user is not authenticated
    if (published === 'true' || !user) {
      query = query.eq('published', true)
    }

    // Pagination
    if (limit) {
      query = query.limit(Number(limit))
    }
    if (offset) {
      query = query.range(Number(offset), Number(offset) + (limit ? Number(limit) : 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Failed to list blog posts:', error.message)
      return res.status(500).json({ error: 'Failed to retrieve blog posts' })
    }

    return res.json({ success: true, data, count })
  } catch (err: any) {
    console.error('List blog posts error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get single blog post by slug
 * GET /api/blog/:slug
 */
export async function get(req: Request, res: Response) {
  try {
    const { slug } = req.params
    const user = (req as any).user

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    let query = supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)

    // Non-authenticated users can only see published posts
    if (!user) {
      query = query.eq('published', true)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Blog post not found' })
      }
      console.error(`Failed to get blog post ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to retrieve blog post' })
    }

    // Validate response to ensure it matches schema
    try {
      const validated = BlogPostSchema.parse(data)
      return res.json({ success: true, data: validated })
    } catch (parseErr: any) {
      console.error('Blog post validation failed:', parseErr.message)
      return res.status(500).json({ error: 'Invalid blog post data' })
    }
  } catch (err: any) {
    console.error('Get blog post error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Create new blog post
 * POST /api/blog
 * Body: { slug, title, excerpt?, content, featured_image?, tags?, meta_data?, published? }
 */
export async function create(req: Request, res: Response) {
  try {
    const user = (req as any).user
    const {
      slug,
      title,
      excerpt,
      content,
      featured_image,
      tags,
      meta_data,
      published
    } = req.body

    if (!slug || !title || !content) {
      return res.status(400).json({ error: 'slug, title, and content are required' })
    }

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    // Create the blog post
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .insert({
        slug,
        title,
        excerpt: excerpt || null,
        content,
        featured_image: featured_image || null,
        author_id: user?.id || null,
        tags: tags || [],
        meta_data: meta_data || null,
        published: published || false,
        published_at: published ? new Date().toISOString() : null
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Blog post with this slug already exists' })
      }
      console.error('Failed to create blog post:', error.message)
      return res.status(500).json({ error: 'Failed to create blog post' })
    }

    return res.status(201).json({ success: true, message: 'Blog post created successfully', data })
  } catch (err: any) {
    console.error('Create blog post error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Update blog post by slug
 * PUT /api/blog/:slug
 * Body: { title?, excerpt?, content?, featured_image?, tags?, meta_data?, published? }
 */
export async function update(req: Request, res: Response) {
  try {
    const { slug } = req.params
    const {
      title,
      excerpt,
      content,
      featured_image,
      tags,
      meta_data,
      published
    } = req.body

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (featured_image !== undefined) updateData.featured_image = featured_image
    if (tags !== undefined) updateData.tags = tags
    if (meta_data !== undefined) updateData.meta_data = meta_data
    if (published !== undefined) {
      updateData.published = published
      // Set published_at when publishing
      if (published) {
        updateData.published_at = new Date().toISOString()
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const { data, error } = await supabaseClient
      .from('blog_posts')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Blog post not found' })
      }
      console.error(`Failed to update blog post ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to update blog post' })
    }

    return res.json({ success: true, message: 'Blog post updated successfully', data })
  } catch (err: any) {
    console.error('Update blog post error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Delete blog post by slug
 * DELETE /api/blog/:slug
 */
export async function remove(req: Request, res: Response) {
  try {
    const { slug } = req.params

    if (!supabaseClient) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { error } = await supabaseClient
      .from('blog_posts')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error(`Failed to delete blog post ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to delete blog post' })
    }

    return res.json({ success: true, message: 'Blog post deleted successfully' })
  } catch (err: any) {
    console.error('Delete blog post error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
