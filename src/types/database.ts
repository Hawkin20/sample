export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'viewer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'viewer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'viewer' | 'admin'
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          long_description: string | null
          status: 'published' | 'draft' | 'archived'
          featured: boolean
          cover_image: string | null
          github_url: string | null
          live_url: string | null
          tags: string[]
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          long_description?: string | null
          status?: 'published' | 'draft' | 'archived'
          featured?: boolean
          cover_image?: string | null
          github_url?: string | null
          live_url?: string | null
          tags?: string[]
          order_index?: number
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          long_description?: string | null
          status?: 'published' | 'draft' | 'archived'
          featured?: boolean
          cover_image?: string | null
          github_url?: string | null
          live_url?: string | null
          tags?: string[]
          order_index?: number
          updated_at?: string
        }
      }
      project_gallery: {
        Row: {
          id: string
          project_id: string
          image_url: string
          caption: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          image_url: string
          caption?: string | null
          order_index?: number
        }
        Update: {
          image_url?: string
          caption?: string | null
          order_index?: number
        }
      }
      technologies: {
        Row: {
          id: string
          name: string
          icon_url: string | null
          category: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon_url?: string | null
          category?: string
          order_index?: number
        }
        Update: {
          name?: string
          icon_url?: string | null
          category?: string
          order_index?: number
        }
      }
      project_technologies: {
        Row: {
          project_id: string
          technology_id: string
        }
        Insert: {
          project_id: string
          technology_id: string
        }
        Update: Record<string, never>
      }
      journey: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'job' | 'education' | 'milestone'
          company: string | null
          location: string | null
          start_date: string | null
          end_date: string | null
          current: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type?: 'job' | 'education' | 'milestone'
          company?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          order_index?: number
        }
        Update: {
          title?: string
          description?: string | null
          type?: 'job' | 'education' | 'milestone'
          company?: string | null
          location?: string | null
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          order_index?: number
          updated_at?: string
        }
      }
      roadmap: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'planned' | 'in_progress' | 'completed' | 'archived'
          priority: number
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'archived'
          priority?: number
          order_index?: number
        }
        Update: {
          title?: string
          description?: string | null
          status?: 'planned' | 'in_progress' | 'completed' | 'archived'
          priority?: number
          order_index?: number
          updated_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
        }
        Update: {
          value?: Json
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          action: string
          entity_type: string | null
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          entity_type?: string | null
          entity_id?: string | null
          metadata?: Json
        }
        Update: Record<string, never>
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ProjectGallery = Database['public']['Tables']['project_gallery']['Row']
export type Technology = Database['public']['Tables']['technologies']['Row']
export type Journey = Database['public']['Tables']['journey']['Row']
export type Roadmap = Database['public']['Tables']['roadmap']['Row']
export type Settings = Database['public']['Tables']['settings']['Row']
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type ContactMessage = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}
