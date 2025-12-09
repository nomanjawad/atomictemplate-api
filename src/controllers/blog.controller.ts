import type { Request, Response } from 'express'
import { supabaseClient } from '@db'
import { BlogPostSchema } from '@atomictemplate/validations'

export async function list(_req: Request, res: Response) {
  try {
    if (!supabaseClient) return res.status(500).json({ error: 'Supabase client not configured' })
    const { data, error } = await supabaseClient.from('blog_posts').select('*')
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unknown error' })
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { slug } = req.params
    if (!supabaseClient) return res.status(500).json({ error: 'Supabase client not configured' })
    const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('slug', slug).limit(1).single()
    if (error) return res.status(404).json({ error: 'Not found' })
    // Validate response to ensure it matches front-end schema
    try {
      const validated = BlogPostSchema.parse(data)
      return res.json({ data: validated })
    } catch (parseErr) {
      console.error('Validation failed', parseErr)
      return res.status(500).json({ error: 'Invalid data from DB' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Unknown error' })
  }
}
