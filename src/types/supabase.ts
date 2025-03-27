
// This file defines the Supabase database types
// It will be used to provide type safety when interacting with the database

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
          invitation_sent?: boolean
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
          invitation_sent?: boolean
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
          invitation_sent?: boolean
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
      transactions: {
        Row: {
          id: string
          transaction_number: string
          transaction_type: string
          customer_id: string
          sales_rep_id: string | null
          transaction_date: string
          due_date: string | null
          terms: string | null
          message: string | null
          net_total: number
          tax_total: number
          other_fees: number
          gross_total: number
          status: string
        }
        Insert: {
          id?: string
          transaction_number: string
          transaction_type: string
          customer_id: string
          sales_rep_id?: string | null
          transaction_date: string
          due_date?: string | null
          terms?: string | null
          message?: string | null
          net_total: number
          tax_total: number
          other_fees: number
          gross_total: number
          status: string
        }
        Update: {
          id?: string
          transaction_number?: string
          transaction_type?: string
          customer_id?: string
          sales_rep_id?: string | null
          transaction_date?: string
          due_date?: string | null
          terms?: string | null
          message?: string | null
          net_total?: number
          tax_total?: number
          other_fees?: number
          gross_total?: number
          status?: string
        }
        Relationships: []
      }
      transaction_items: {
        Row: {
          id: number
          transaction_id: string
          product_id: string | null
          description: string | null
          quantity: number
          unit_of_measure: string
          unit_type: string
          unit_price: number
          tax_percent: number
          amount: number
          primary_quantity: number | null
        }
        Insert: {
          id?: number
          transaction_id: string
          product_id?: string | null
          description?: string | null
          quantity: number
          unit_of_measure: string
          unit_type: string
          unit_price: number
          tax_percent: number
          amount: number
          primary_quantity?: number | null
        }
        Update: {
          id?: number
          transaction_id?: string
          product_id?: string | null
          description?: string | null
          quantity?: number
          unit_of_measure?: string
          unit_type?: string
          unit_price?: number
          tax_percent?: number
          amount?: number
          primary_quantity?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          company: string | null
          billing_address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          billing_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          company?: string | null
          billing_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
      insert_predefined_roles: {
        Args: Record<string, never>
        Returns: undefined
      }
      set_app_variables: {
        Args: {
          p_user_id: string
          p_company_id: string
        }
        Returns: undefined
      }
      exec_sql: {
        Args: {
          sql_query: string
        }
        Returns: Json
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
