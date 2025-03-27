export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          type: string
          address: string | null
          phone: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          id: string
          user_id: string | null
          full_name: string
          email: string
          phone: string | null
          address: string | null
          company_id: string
          role_id: string | null
          is_admin: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          address?: string | null
          company_id: string
          role_id?: string | null
          is_admin?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          address?: string | null
          company_id?: string
          role_id?: string | null
          is_admin?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      invitations: {
        Row: {
          id: string
          email: string
          company_id: string
          role_id: string | null
          invited_by: string
          token: string
          expires_at: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          company_id: string
          role_id?: string | null
          invited_by: string
          token: string
          expires_at: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_id?: string
          role_id?: string | null
          invited_by?: string
          token?: string
          expires_at?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      modules: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          id: string
          role_id: string
          module_id: string
          can_view: boolean
          can_create: boolean
          can_edit: boolean
          can_delete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          role_id: string
          module_id: string
          can_view?: boolean
          can_create?: boolean
          can_edit?: boolean
          can_delete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role_id?: string
          module_id?: string
          can_view?: boolean
          can_create?: boolean
          can_edit?: boolean
          can_delete?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_module_id_fkey"
            columns: ["module_id"]
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissions_role_id_fkey"
            columns: ["role_id"]
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          primary_unit_of_measure: string
          secondary_unit_of_measure: string | null
          conversion_factor: number | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          primary_unit_of_measure: string
          secondary_unit_of_measure?: string | null
          conversion_factor?: number | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          primary_unit_of_measure?: string
          secondary_unit_of_measure?: string | null
          conversion_factor?: number | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          is_predefined: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_predefined?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_predefined?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          id: number
          product_id: number | null
          quantity: number
          primary_quantity: number | null
          unit_type: string
        }
        Insert: {
          id?: number
          product_id?: number | null
          quantity: number
          primary_quantity?: number | null
          unit_type?: string
        }
        Update: {
          id?: number
          product_id?: number | null
          quantity?: number
          primary_quantity?: number | null
          unit_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_product_units: {
        Args: {
          product_id: number
        }
        Returns: {
          unit_type: string
          unit_name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}