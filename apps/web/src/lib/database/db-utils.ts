/**
 * Database Utilities
 * 
 * Provides shared utilities for database operations to reduce code duplication
 * and ensure consistent error handling and data access patterns.
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { env, isSupabaseConfigured } from '@/lib/env';

export interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
  single?: boolean;
}

export interface InsertOptions {
  returning?: string;
  upsert?: boolean;
  ignoreDuplicates?: boolean;
}

export interface UpdateOptions {
  returning?: string;
  filters?: Record<string, any>;
}

export interface DeleteOptions {
  returning?: string;
  filters?: Record<string, any>;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Gets Supabase client for database operations
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  return createRouteHandlerClient({ cookies });
}

/**
 * Generic query function with common options
 */
export async function query<T = any>(
  table: string,
  options: QueryOptions = {}
): Promise<{ data: T[] | T | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from(table);

    // Apply select
    if (options.select) {
      query = query.select(options.select);
    }

    // Apply filters
    if (options.filters) {
      for (const [column, value] of Object.entries(options.filters)) {
        if (Array.isArray(value)) {
          query = query.in(column, value);
        } else if (value === null) {
          query = query.is(column, null);
        } else {
          query = query.eq(column, value);
        }
      }
    }

    // Apply ordering
    if (options.orderBy) {
      for (const order of options.orderBy) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    // Execute query
    if (options.single) {
      const { data, error } = await query.single();
      return { data, error: error?.message || null };
    } else {
      const { data, error } = await query;
      return { data: data || [], error: error?.message || null };
    }
  } catch (error) {
    console.error(`Database query error for table ${table}:`, error);
    return { data: null, error: 'Database query failed' };
  }
}

/**
 * Generic insert function
 */
export async function insert<T = any>(
  table: string,
  data: T | T[],
  options: InsertOptions = {}
): Promise<{ data: T | T[] | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from(table);

    // Apply options
    if (options.returning) {
      query = query.select(options.returning);
    }

    if (options.upsert) {
      query = query.upsert(data, { onConflict: 'id' });
    } else if (options.ignoreDuplicates) {
      query = query.insert(data, { ignoreDuplicates: true });
    } else {
      query = query.insert(data);
    }

    const { data: result, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: result, error: null };
  } catch (error) {
    console.error(`Database insert error for table ${table}:`, error);
    return { data: null, error: 'Database insert failed' };
  }
}

/**
 * Generic update function
 */
export async function update<T = any>(
  table: string,
  data: Partial<T>,
  options: UpdateOptions = {}
): Promise<{ data: T | T[] | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from(table).update(data);

    // Apply filters
    if (options.filters) {
      for (const [column, value] of Object.entries(options.filters)) {
        if (Array.isArray(value)) {
          query = query.in(column, value);
        } else if (value === null) {
          query = query.is(column, null);
        } else {
          query = query.eq(column, value);
        }
      }
    }

    // Apply returning
    if (options.returning) {
      query = query.select(options.returning);
    }

    const { data: result, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: result, error: null };
  } catch (error) {
    console.error(`Database update error for table ${table}:`, error);
    return { data: null, error: 'Database update failed' };
  }
}

/**
 * Generic delete function
 */
export async function remove<T = any>(
  table: string,
  options: DeleteOptions = {}
): Promise<{ data: T | T[] | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase.from(table).delete();

    // Apply filters
    if (options.filters) {
      for (const [column, value] of Object.entries(options.filters)) {
        if (Array.isArray(value)) {
          query = query.in(column, value);
        } else if (value === null) {
          query = query.is(column, null);
        } else {
          query = query.eq(column, value);
        }
      }
    }

    // Apply returning
    if (options.returning) {
      query = query.select(options.returning);
    }

    const { data: result, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: result, error: null };
  } catch (error) {
    console.error(`Database delete error for table ${table}:`, error);
    return { data: null, error: 'Database delete failed' };
  }
}

/**
 * Paginated query function
 */
export async function queryPaginated<T = any>(
  table: string,
  pagination: PaginationOptions = {},
  queryOptions: Omit<QueryOptions, 'limit' | 'offset'> = {}
): Promise<{ data: PaginatedResult<T> | null; error: string | null }> {
  try {
    const page = pagination.page || 1;
    const limit = Math.min(pagination.limit || 10, pagination.maxLimit || 100);
    const offset = (page - 1) * limit;

    // Get total count
    const { data: countData, error: countError } = await query(table, {
      ...queryOptions,
      select: 'count',
    });

    if (countError) {
      return { data: null, error: countError };
    }

    const total = Array.isArray(countData) ? countData.length : 1;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const { data, error } = await query<T>(table, {
      ...queryOptions,
      limit,
      offset,
    });

    if (error) {
      return { data: null, error };
    }

    const result: PaginatedResult<T> = {
      data: Array.isArray(data) ? data : [data],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return { data: result, error: null };
  } catch (error) {
    console.error(`Database paginated query error for table ${table}:`, error);
    return { data: null, error: 'Database paginated query failed' };
  }
}

/**
 * Batch operations
 */
export async function batchInsert<T = any>(
  table: string,
  data: T[],
  batchSize: number = 100
): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const results: T[] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const { data: batchResult, error } = await insert(table, batch);
      
      if (error) {
        return { data: null, error };
      }
      
      if (batchResult) {
        results.push(...(Array.isArray(batchResult) ? batchResult : [batchResult]));
      }
    }
    
    return { data: results, error: null };
  } catch (error) {
    console.error(`Database batch insert error for table ${table}:`, error);
    return { data: null, error: 'Database batch insert failed' };
  }
}

/**
 * Transaction-like operations (using Supabase RPC)
 */
export async function executeTransaction<T = any>(
  operations: Array<{
    type: 'insert' | 'update' | 'delete';
    table: string;
    data?: any;
    filters?: Record<string, any>;
  }>
): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const supabase = getSupabaseClient();
    const results: T[] = [];

    for (const operation of operations) {
      let result;
      
      switch (operation.type) {
        case 'insert':
          result = await insert(operation.table, operation.data);
          break;
        case 'update':
          result = await update(operation.table, operation.data, { filters: operation.filters });
          break;
        case 'delete':
          result = await remove(operation.table, { filters: operation.filters });
          break;
        default:
          return { data: null, error: `Unknown operation type: ${operation.type}` };
      }

      if (result.error) {
        return { data: null, error: result.error };
      }

      if (result.data) {
        results.push(...(Array.isArray(result.data) ? result.data : [result.data]));
      }
    }

    return { data: results, error: null };
  } catch (error) {
    console.error('Database transaction error:', error);
    return { data: null, error: 'Database transaction failed' };
  }
}

/**
 * Common table operations
 */
export const tables = {
  // User-related tables
  userProfiles: {
    async getById(id: string) {
      return query('user_profiles', { filters: { id }, single: true });
    },
    
    async getByEmail(email: string) {
      return query('user_profiles', { filters: { email }, single: true });
    },
    
    async create(profile: any) {
      return insert('user_profiles', profile);
    },
    
    async update(id: string, updates: any) {
      return update('user_profiles', updates, { filters: { id } });
    },
    
    async delete(id: string) {
      return remove('user_profiles', { filters: { id } });
    },
  },

  // Job-related tables
  jobs: {
    async getAll(options: QueryOptions = {}) {
      return query('jobs', options);
    },
    
    async getById(id: string) {
      return query('jobs', { filters: { id }, single: true });
    },
    
    async getByEmployer(employerId: string, options: QueryOptions = {}) {
      return query('jobs', { ...options, filters: { ...options.filters, employer_id: employerId } });
    },
    
    async create(job: any) {
      return insert('jobs', job);
    },
    
    async update(id: string, updates: any) {
      return update('jobs', updates, { filters: { id } });
    },
    
    async delete(id: string) {
      return remove('jobs', { filters: { id } });
    },
  },

  // Application-related tables
  applications: {
    async getAll(options: QueryOptions = {}) {
      return query('job_applications', options);
    },
    
    async getById(id: string) {
      return query('job_applications', { filters: { id }, single: true });
    },
    
    async getByUser(userId: string, options: QueryOptions = {}) {
      return query('job_applications', { ...options, filters: { ...options.filters, user_id: userId } });
    },
    
    async getByJob(jobId: string, options: QueryOptions = {}) {
      return query('job_applications', { ...options, filters: { ...options.filters, job_id: jobId } });
    },
    
    async create(application: any) {
      return insert('job_applications', application);
    },
    
    async update(id: string, updates: any) {
      return update('job_applications', updates, { filters: { id } });
    },
    
    async delete(id: string) {
      return remove('job_applications', { filters: { id } });
    },
  },
};

/**
 * Utility functions for common database operations
 */
export const dbUtils = {
  /**
   * Generates a unique ID
   */
  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Adds timestamps to data
   */
  addTimestamps(data: any, includeUpdated: boolean = true): any {
    const now = new Date().toISOString();
    return {
      ...data,
      created_at: now,
      ...(includeUpdated && { updated_at: now }),
    };
  },

  /**
   * Sanitizes data for database insertion
   */
  sanitizeData(data: any): any {
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'string') {
          sanitized[key] = value.trim();
        } else {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  },

  /**
   * Converts filters to Supabase query format
   */
  buildFilters(filters: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }
    
    return result;
  },
};
