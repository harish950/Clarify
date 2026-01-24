export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      job_matches: {
        Row: {
          created_at: string
          experience_score: number | null
          id: string
          interests_score: number | null
          job_id: string
          match_explanation: Json | null
          skills_score: number | null
          updated_at: string
          user_id: string
          weighted_score: number | null
        }
        Insert: {
          created_at?: string
          experience_score?: number | null
          id?: string
          interests_score?: number | null
          job_id: string
          match_explanation?: Json | null
          skills_score?: number | null
          updated_at?: string
          user_id: string
          weighted_score?: number | null
        }
        Update: {
          created_at?: string
          experience_score?: number | null
          id?: string
          interests_score?: number | null
          job_id?: string
          match_explanation?: Json | null
          skills_score?: number | null
          updated_at?: string
          user_id?: string
          weighted_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string | null
          created_at: string
          description: string | null
          description_embedding: string | null
          embedding_updated_at: string | null
          experience_embedding: string | null
          experience_level: string | null
          external_id: string | null
          id: string
          job_type: string | null
          location: string | null
          required_skills: string[] | null
          salary: string | null
          skills_embedding: string | null
          source_url: string | null
          title: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          description?: string | null
          description_embedding?: string | null
          embedding_updated_at?: string | null
          experience_embedding?: string | null
          experience_level?: string | null
          external_id?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          required_skills?: string[] | null
          salary?: string | null
          skills_embedding?: string | null
          source_url?: string | null
          title: string
        }
        Update: {
          company?: string | null
          created_at?: string
          description?: string | null
          description_embedding?: string | null
          embedding_updated_at?: string | null
          experience_embedding?: string | null
          experience_level?: string | null
          external_id?: string | null
          id?: string
          job_type?: string | null
          location?: string | null
          required_skills?: string[] | null
          salary?: string | null
          skills_embedding?: string | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      saved_paths: {
        Row: {
          career_id: string
          career_name: string
          id: string
          progress_percentage: number | null
          roadmap: Json | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          career_id: string
          career_name: string
          id?: string
          progress_percentage?: number | null
          roadmap?: Json | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          career_id?: string
          career_name?: string
          id?: string
          progress_percentage?: number | null
          roadmap?: Json | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          career_goals: string[] | null
          created_at: string
          email: string | null
          embedding_updated_at: string | null
          experience_embedding: string | null
          id: string
          interests: string[] | null
          interests_embedding: string | null
          linkedin_url: string | null
          name: string | null
          parsed_experience: string | null
          parsed_skills: string[] | null
          resume_text: string | null
          salary_range: string | null
          skills_embedding: string | null
          updated_at: string
          user_id: string
          work_environment: string | null
        }
        Insert: {
          career_goals?: string[] | null
          created_at?: string
          email?: string | null
          embedding_updated_at?: string | null
          experience_embedding?: string | null
          id?: string
          interests?: string[] | null
          interests_embedding?: string | null
          linkedin_url?: string | null
          name?: string | null
          parsed_experience?: string | null
          parsed_skills?: string[] | null
          resume_text?: string | null
          salary_range?: string | null
          skills_embedding?: string | null
          updated_at?: string
          user_id: string
          work_environment?: string | null
        }
        Update: {
          career_goals?: string[] | null
          created_at?: string
          email?: string | null
          embedding_updated_at?: string | null
          experience_embedding?: string | null
          id?: string
          interests?: string[] | null
          interests_embedding?: string | null
          linkedin_url?: string | null
          name?: string | null
          parsed_experience?: string | null
          parsed_skills?: string[] | null
          resume_text?: string | null
          salary_range?: string | null
          skills_embedding?: string | null
          updated_at?: string
          user_id?: string
          work_environment?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compute_job_match_score: {
        Args: { p_job_id: string; p_user_id: string }
        Returns: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
