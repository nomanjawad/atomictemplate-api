/**
 * @module repositories/base
 * @description Base repository class with common database operations
 */
import { supabaseClient } from '@db';
import { DatabaseError, ServiceUnavailableError } from '@utils';
/**
 * Abstract base repository class
 * Provides common CRUD operations for all repositories
 */
export class BaseRepository {
    /**
     * Get Supabase client with null check
     * Throws ServiceUnavailableError if client is not initialized
     */
    get client() {
        if (!supabaseClient) {
            throw new ServiceUnavailableError('Database service unavailable');
        }
        return supabaseClient;
    }
    /**
     * Find all records with optional filters
     * @param filters - Column filters for the query
     * @returns Array of records
     */
    async findAll(filters) {
        try {
            let query = this.client.from(this.tableName).select('*');
            if (filters) {
                query = query.match(filters);
            }
            const { data, error } = await query;
            if (error) {
                throw new DatabaseError(`Failed to fetch from ${this.tableName}: ${error.message}`);
            }
            return (data || []);
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error fetching from ${this.tableName}`);
        }
    }
    /**
     * Find a single record by ID
     * @param id - Record ID
     * @returns Record or null if not found
     */
    async findById(id) {
        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to fetch from ${this.tableName}: ${error.message}`);
            }
            return data;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error fetching from ${this.tableName}`);
        }
    }
    /**
     * Find a single record by slug
     * @param slug - Record slug
     * @returns Record or null if not found
     */
    async findBySlug(slug) {
        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to fetch from ${this.tableName}: ${error.message}`);
            }
            return data;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error fetching from ${this.tableName}`);
        }
    }
    /**
     * Create a new record
     * @param payload - Data to insert
     * @returns Created record
     */
    async create(payload) {
        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .insert(payload)
                .select()
                .single();
            if (error) {
                throw new DatabaseError(`Failed to create in ${this.tableName}: ${error.message}`);
            }
            return data;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error creating in ${this.tableName}`);
        }
    }
    /**
     * Update a record by ID
     * @param id - Record ID
     * @param payload - Data to update
     * @returns Updated record or null if not found
     */
    async update(id, payload) {
        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .update(payload)
                .eq('id', id)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to update in ${this.tableName}: ${error.message}`);
            }
            return data;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error updating in ${this.tableName}`);
        }
    }
    /**
     * Update a record by slug
     * @param slug - Record slug
     * @param payload - Data to update
     * @returns Updated record or null if not found
     */
    async updateBySlug(slug, payload) {
        try {
            const { data, error } = await this.client
                .from(this.tableName)
                .update(payload)
                .eq('slug', slug)
                .select()
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                throw new DatabaseError(`Failed to update in ${this.tableName}: ${error.message}`);
            }
            return data;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error updating in ${this.tableName}`);
        }
    }
    /**
     * Delete a record by ID
     * @param id - Record ID
     * @returns true if deleted, false if not found
     */
    async delete(id) {
        try {
            const { error } = await this.client
                .from(this.tableName)
                .delete()
                .eq('id', id);
            if (error) {
                throw new DatabaseError(`Failed to delete from ${this.tableName}: ${error.message}`);
            }
            return true;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error deleting from ${this.tableName}`);
        }
    }
    /**
     * Delete a record by slug
     * @param slug - Record slug
     * @returns true if deleted, false if not found
     */
    async deleteBySlug(slug) {
        try {
            const { error } = await this.client
                .from(this.tableName)
                .delete()
                .eq('slug', slug);
            if (error) {
                throw new DatabaseError(`Failed to delete from ${this.tableName}: ${error.message}`);
            }
            return true;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error deleting from ${this.tableName}`);
        }
    }
    /**
     * Count records with optional filters
     * @param filters - Column filters for the query
     * @returns Count of records
     */
    async count(filters) {
        try {
            let query = this.client
                .from(this.tableName)
                .select('*', { count: 'exact', head: true });
            if (filters) {
                query = query.match(filters);
            }
            const { count, error } = await query;
            if (error) {
                throw new DatabaseError(`Failed to count in ${this.tableName}: ${error.message}`);
            }
            return count || 0;
        }
        catch (err) {
            if (err instanceof DatabaseError)
                throw err;
            throw new DatabaseError(`Unexpected error counting in ${this.tableName}`);
        }
    }
}
