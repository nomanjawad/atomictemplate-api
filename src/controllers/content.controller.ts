/**
 * Content Controller
 * Handles CRUD operations for common components and page content
 */
import { Request, Response } from 'express'
import { supabase } from '@db'

// ============================================================================
// Common Content Operations (header, footer, CTA, banner, etc.)
// ============================================================================

/**
 * Get all common content
 * GET /api/content/common
 */
export async function listCommonContent(req: Request, res: Response) {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { data, error } = await supabase
      .from('content_common')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      console.error('Failed to list common content:', error.message)
      return res.status(500).json({ error: 'Failed to retrieve common content' })
    }

    return res.json({ success: true, data })
  } catch (err: any) {
    console.error('List common content error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get common content by key
 * GET /api/content/common/:key
 */
export async function getCommonContent(req: Request, res: Response) {
  try {
    const { key } = req.params

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { data, error } = await supabase
      .from('content_common')
      .select('*')
      .eq('key', key)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: `Common content with key "${key}" not found` })
      }
      console.error(`Failed to get common content ${key}:`, error.message)
      return res.status(500).json({ error: 'Failed to retrieve common content' })
    }

    return res.json({ success: true, data })
  } catch (err: any) {
    console.error('Get common content error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Create or update common content by key
 * PUT /api/content/common/:key
 * Body: { data: {...} }
 */
export async function upsertCommonContent(req: Request, res: Response) {
  try {
    const { key } = req.params
    const { data: contentData } = req.body

    if (!contentData || typeof contentData !== 'object') {
      return res.status(400).json({ error: 'Invalid content data. Expected object in "data" field.' })
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from('content_common')
      .upsert(
        {
          key,
          data: contentData
        },
        {
          onConflict: 'key',
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error(`Failed to upsert common content ${key}:`, error.message)
      return res.status(500).json({ error: 'Failed to save common content' })
    }

    return res.json({ success: true, message: 'Common content saved successfully', data })
  } catch (err: any) {
    console.error('Upsert common content error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Delete common content by key
 * DELETE /api/content/common/:key
 */
export async function deleteCommonContent(req: Request, res: Response) {
  try {
    const { key } = req.params

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { error } = await supabase
      .from('content_common')
      .delete()
      .eq('key', key)

    if (error) {
      console.error(`Failed to delete common content ${key}:`, error.message)
      return res.status(500).json({ error: 'Failed to delete common content' })
    }

    return res.json({ success: true, message: 'Common content deleted successfully' })
  } catch (err: any) {
    console.error('Delete common content error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ============================================================================
// Page Content Operations (home, about, contact, gallery, etc.)
// ============================================================================

/**
 * Get all pages
 * GET /api/content/pages
 * Query params: ?published=true (filter by published status)
 */
export async function listPages(req: Request, res: Response) {
  try {
    const { published } = req.query
    const user = (req as any).user

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    let query = supabase
      .from('content_pages')
      .select('*')
      .order('slug', { ascending: true })

    // Filter by published status if specified and user is not authenticated
    if (published === 'true' && !user) {
      query = query.eq('published', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Failed to list pages:', error.message)
      return res.status(500).json({ error: 'Failed to retrieve pages' })
    }

    return res.json({ success: true, data })
  } catch (err: any) {
    console.error('List pages error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Get page by slug
 * GET /api/content/pages/:slug
 */
export async function getPage(req: Request, res: Response) {
  try {
    const { slug } = req.params
    const user = (req as any).user

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    let query = supabase
      .from('content_pages')
      .select('*')
      .eq('slug', slug)

    // Non-authenticated users can only see published pages
    if (!user) {
      query = query.eq('published', true)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: `Page "${slug}" not found` })
      }
      console.error(`Failed to get page ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to retrieve page' })
    }

    return res.json({ success: true, data })
  } catch (err: any) {
    console.error('Get page error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Create or update page by slug
 * PUT /api/content/pages/:slug
 * Body: { title, data, meta_data?, published? }
 */
export async function upsertPage(req: Request, res: Response) {
  try {
    const { slug } = req.params
    const { title, data: pageData, meta_data, published } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Page title is required' })
    }

    if (!pageData || typeof pageData !== 'object') {
      return res.status(400).json({ error: 'Invalid page data. Expected object in "data" field.' })
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    // Upsert (insert or update)
    const { data, error } = await supabase
      .from('content_pages')
      .upsert(
        {
          slug,
          title,
          data: pageData,
          meta_data: meta_data || null,
          published: published !== undefined ? published : false
        },
        {
          onConflict: 'slug',
          ignoreDuplicates: false
        }
      )
      .select()
      .single()

    if (error) {
      console.error(`Failed to upsert page ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to save page' })
    }

    return res.json({ success: true, message: 'Page saved successfully', data })
  } catch (err: any) {
    console.error('Upsert page error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * Delete page by slug
 * DELETE /api/content/pages/:slug
 */
export async function deletePage(req: Request, res: Response) {
  try {
    const { slug } = req.params

    if (!supabase) {
      return res.status(500).json({ error: 'Database service unavailable' })
    }

    const { error } = await supabase
      .from('content_pages')
      .delete()
      .eq('slug', slug)

    if (error) {
      console.error(`Failed to delete page ${slug}:`, error.message)
      return res.status(500).json({ error: 'Failed to delete page' })
    }

    return res.json({ success: true, message: 'Page deleted successfully' })
  } catch (err: any) {
    console.error('Delete page error:', err.message || err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
