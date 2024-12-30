export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          app_use: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          id: number
          list_presets: Json | null
          name: string
          preferences: Json | null
          user_id: string | null
        }
        Insert: {
          app_use?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: number
          list_presets?: Json | null
          name?: string
          preferences?: Json | null
          user_id?: string | null
        }
        Update: {
          app_use?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: number
          list_presets?: Json | null
          name?: string
          preferences?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          account: number | null
          created_at: string
          folder: number | null
          icon: string | null
          id: number
          name: string | null
          space: number | null
        }
        Insert: {
          account?: number | null
          created_at?: string
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          space?: number | null
        }
        Update: {
          account?: number | null
          created_at?: string
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          space?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_folder_fkey"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          color: string | null
          created_at: string
          folder: number | null
          id: number
          list: number | null
          name: string | null
          space: number | null
          type: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          folder?: number | null
          id?: number
          list?: number | null
          name?: string | null
          space?: number | null
          type?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          folder?: number | null
          id?: number
          list?: number | null
          name?: string | null
          space?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_folder_fkey"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          comments: string[] | null
          complete: boolean | null
          created_at: string
          description: string | null
          end_date: string | null
          group: number | null
          id: number
          list: number | null
          name: string
          priority: string | null
          reminders: string[] | null
          repeat: Json | null
          space: number | null
          start_date: string | null
          trash: boolean | null
        }
        Insert: {
          comments?: string[] | null
          complete?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          group?: number | null
          id?: number
          list?: number | null
          name?: string
          priority?: string | null
          reminders?: string[] | null
          repeat?: Json | null
          space?: number | null
          start_date?: string | null
          trash?: boolean | null
        }
        Update: {
          comments?: string[] | null
          complete?: boolean | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          group?: number | null
          id?: number
          list?: number | null
          name?: string
          priority?: string | null
          reminders?: string[] | null
          repeat?: Json | null
          space?: number | null
          start_date?: string | null
          trash?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "elements_group_fkey"
            columns: ["group"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "elements_list_fkey"
            columns: ["list"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      lists: {
        Row: {
          account: number | null
          created_at: string
          description: string | null
          favorite: boolean | null
          folder: number | null
          icon: string | null
          id: number
          name: string | null
          settings: Json | null
          space: number | null
          view: string | null
        }
        Insert: {
          account?: number | null
          created_at?: string
          description?: string | null
          favorite?: boolean | null
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          settings?: Json | null
          space?: number | null
          view?: string | null
        }
        Update: {
          account?: number | null
          created_at?: string
          description?: string | null
          favorite?: boolean | null
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          settings?: Json | null
          space?: number | null
          view?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lists_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_folder_fkey"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          account: number | null
          color: string | null
          comments: string[] | null
          content: Json | null
          created_at: string
          folder: number | null
          icon: string | null
          id: number
          name: string | null
          notes: number | null
          space: number | null
          trash: boolean | null
          updated_at: string | null
        }
        Insert: {
          account?: number | null
          color?: string | null
          comments?: string[] | null
          content?: Json | null
          created_at?: string
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          notes?: number | null
          space?: number | null
          trash?: boolean | null
          updated_at?: string | null
        }
        Update: {
          account?: number | null
          color?: string | null
          comments?: string[] | null
          content?: Json | null
          created_at?: string
          folder?: number | null
          icon?: string | null
          id?: number
          name?: string | null
          notes?: number | null
          space?: number | null
          trash?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_folder_fkey"
            columns: ["folder"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_notes_fkey"
            columns: ["notes"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_space_fkey"
            columns: ["space"]
            isOneToOne: false
            referencedRelation: "spaces"
            referencedColumns: ["id"]
          },
        ]
      }
      spaces: {
        Row: {
          account: number
          color: string | null
          content: Json | null
          created_at: string
          description: string | null
          emoji: string | null
          id: number
          image_url: string | null
          name: string
        }
        Insert: {
          account: number
          color?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: number
          image_url?: string | null
          name: string
        }
        Update: {
          account?: number
          color?: string | null
          content?: Json | null
          created_at?: string
          description?: string | null
          emoji?: string | null
          id?: number
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "spaces_account_fkey"
            columns: ["account"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      space_data: {
        Row: {
          folder: number | null
          id: number | null
          name: string | null
          space: number | null
          type: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_avatar: {
        Args: {
          avatar_url: string
        }
        Returns: Record<string, unknown>
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
