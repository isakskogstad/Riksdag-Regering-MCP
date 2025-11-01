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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_activity_log: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_fetch_control: {
        Row: {
          data_type: string
          id: string
          should_stop: boolean | null
          source: string
          updated_at: string | null
        }
        Insert: {
          data_type: string
          id?: string
          should_stop?: boolean | null
          source: string
          updated_at?: string | null
        }
        Update: {
          data_type?: string
          id?: string
          should_stop?: boolean | null
          source?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      data_fetch_progress: {
        Row: {
          created_at: string | null
          current_page: number | null
          data_type: string
          error_message: string | null
          id: string
          items_fetched: number | null
          last_fetched_at: string | null
          next_page_url: string | null
          pages_processed: number | null
          source: string
          status: string | null
          total_items: number | null
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_page?: number | null
          data_type: string
          error_message?: string | null
          id?: string
          items_fetched?: number | null
          last_fetched_at?: string | null
          next_page_url?: string | null
          pages_processed?: number | null
          source: string
          status?: string | null
          total_items?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_page?: number | null
          data_type?: string
          error_message?: string | null
          id?: string
          items_fetched?: number | null
          last_fetched_at?: string | null
          next_page_url?: string | null
          pages_processed?: number | null
          source?: string
          status?: string | null
          total_items?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      document_analytics: {
        Row: {
          created_at: string
          document_id: string
          id: string
          last_viewed_at: string | null
          table_name: string
          updated_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          last_viewed_at?: string | null
          table_name: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          last_viewed_at?: string | null
          table_name?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          document_id: string
          id: string
          table_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          id?: string
          table_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          table_name?: string
          user_id?: string
        }
        Relationships: []
      }
      file_download_queue: {
        Row: {
          attempts: number | null
          bucket: string
          column_name: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_url: string
          id: string
          max_attempts: number | null
          record_id: string
          started_at: string | null
          status: string | null
          storage_path: string
          table_name: string
        }
        Insert: {
          attempts?: number | null
          bucket: string
          column_name: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_url: string
          id?: string
          max_attempts?: number | null
          record_id: string
          started_at?: string | null
          status?: string | null
          storage_path: string
          table_name: string
        }
        Update: {
          attempts?: number | null
          bucket?: string
          column_name?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_url?: string
          id?: string
          max_attempts?: number | null
          record_id?: string
          started_at?: string | null
          status?: string | null
          storage_path?: string
          table_name?: string
        }
        Relationships: []
      }
      file_queue_control: {
        Row: {
          created_at: string
          current_batch: number
          id: string
          is_running: boolean
          last_run_at: string | null
          started_at: string | null
          started_by: string | null
          stopped_at: string | null
          total_processed: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_batch?: number
          id?: string
          is_running?: boolean
          last_run_at?: string | null
          started_at?: string | null
          started_by?: string | null
          stopped_at?: string | null
          total_processed?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_batch?: number
          id?: string
          is_running?: boolean
          last_run_at?: string | null
          started_at?: string | null
          started_by?: string | null
          stopped_at?: string | null
          total_processed?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          auth_user_id: string
          created_at: string
          email: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          email?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          email?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regeringskansliet_api_log: {
        Row: {
          antal_poster: number | null
          created_at: string
          endpoint: string
          felmeddelande: string | null
          id: string
          status: string
        }
        Insert: {
          antal_poster?: number | null
          created_at?: string
          endpoint: string
          felmeddelande?: string | null
          id?: string
          status: string
        }
        Update: {
          antal_poster?: number | null
          created_at?: string
          endpoint?: string
          felmeddelande?: string | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      regeringskansliet_arendeforteckningar: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_artiklar: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_bistands_strategier: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_dagordningar: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_debattartiklar: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_departementsserien: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_dokument: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          bilagor: Json | null
          created_at: string
          document_id: string
          id: string
          innehall: string | null
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          bilagor?: Json | null
          created_at?: string
          document_id: string
          id?: string
          innehall?: string | null
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          bilagor?: Json | null
          created_at?: string
          document_id?: string
          id?: string
          innehall?: string | null
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_faktapromemoria: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_forordningsmotiv: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_informationsmaterial: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_internationella_overenskommelser: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_kategorier: {
        Row: {
          beskrivning: string | null
          created_at: string
          id: string
          kod: string
          namn: string | null
          updated_at: string
        }
        Insert: {
          beskrivning?: string | null
          created_at?: string
          id?: string
          kod: string
          namn?: string | null
          updated_at?: string
        }
        Update: {
          beskrivning?: string | null
          created_at?: string
          id?: string
          kod?: string
          namn?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regeringskansliet_kommittedirektiv: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_lagradsremiss: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_mr_granskningar: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_overenskommelser_avtal: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_pressmeddelanden: {
        Row: {
          created_at: string
          departement: string | null
          document_id: string
          id: string
          innehall: string | null
          local_bilagor: Json | null
          publicerad_datum: string | null
          titel: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          departement?: string | null
          document_id: string
          id?: string
          innehall?: string | null
          local_bilagor?: Json | null
          publicerad_datum?: string | null
          titel?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          departement?: string | null
          document_id?: string
          id?: string
          innehall?: string | null
          local_bilagor?: Json | null
          publicerad_datum?: string | null
          titel?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_propositioner: {
        Row: {
          beteckningsnummer: string | null
          created_at: string
          departement: string | null
          document_id: string
          id: string
          local_pdf_url: string | null
          pdf_url: string | null
          publicerad_datum: string | null
          titel: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          beteckningsnummer?: string | null
          created_at?: string
          departement?: string | null
          document_id: string
          id?: string
          local_pdf_url?: string | null
          pdf_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          beteckningsnummer?: string | null
          created_at?: string
          departement?: string | null
          document_id?: string
          id?: string
          local_pdf_url?: string | null
          pdf_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_rapporter: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_regeringsarenden: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_regeringsuppdrag: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_remisser: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_sakrad: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_skrivelse: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_sou: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_tal: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_ud_avrader: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      regeringskansliet_uttalanden: {
        Row: {
          avsandare: string | null
          beteckningsnummer: string | null
          created_at: string
          document_id: string
          id: string
          kategorier: string[] | null
          local_files: Json | null
          markdown_url: string | null
          publicerad_datum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
          uppdaterad_datum: string | null
          url: string | null
        }
        Insert: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Update: {
          avsandare?: string | null
          beteckningsnummer?: string | null
          created_at?: string
          document_id?: string
          id?: string
          kategorier?: string[] | null
          local_files?: Json | null
          markdown_url?: string | null
          publicerad_datum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
          uppdaterad_datum?: string | null
          url?: string | null
        }
        Relationships: []
      }
      riksdagen_anforanden: {
        Row: {
          anfdatum: string | null
          anforande_id: string
          anftext: string | null
          avsnittsrubrik: string | null
          created_at: string
          debattnamn: string | null
          debattsekund: number | null
          dok_id: string | null
          id: string
          intressent_id: string | null
          parti: string | null
          talare: string | null
          updated_at: string
        }
        Insert: {
          anfdatum?: string | null
          anforande_id: string
          anftext?: string | null
          avsnittsrubrik?: string | null
          created_at?: string
          debattnamn?: string | null
          debattsekund?: number | null
          dok_id?: string | null
          id?: string
          intressent_id?: string | null
          parti?: string | null
          talare?: string | null
          updated_at?: string
        }
        Update: {
          anfdatum?: string | null
          anforande_id?: string
          anftext?: string | null
          avsnittsrubrik?: string | null
          created_at?: string
          debattnamn?: string | null
          debattsekund?: number | null
          dok_id?: string | null
          id?: string
          intressent_id?: string | null
          parti?: string | null
          talare?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      riksdagen_api_log: {
        Row: {
          antal_poster: number | null
          created_at: string
          endpoint: string
          felmeddelande: string | null
          id: string
          status: string
        }
        Insert: {
          antal_poster?: number | null
          created_at?: string
          endpoint: string
          felmeddelande?: string | null
          id?: string
          status: string
        }
        Update: {
          antal_poster?: number | null
          created_at?: string
          endpoint?: string
          felmeddelande?: string | null
          id?: string
          status?: string
        }
        Relationships: []
      }
      riksdagen_dokument: {
        Row: {
          beteckning: string | null
          created_at: string
          datum: string | null
          dok_id: string
          doktyp: string | null
          dokument_url_html: string | null
          dokument_url_text: string | null
          id: string
          local_html_url: string | null
          local_pdf_url: string | null
          nummer: string | null
          organ: string | null
          rm: string | null
          status: string | null
          subtitel: string | null
          subtyp: string | null
          systemdatum: string | null
          titel: string | null
          typ: string | null
          updated_at: string
        }
        Insert: {
          beteckning?: string | null
          created_at?: string
          datum?: string | null
          dok_id: string
          doktyp?: string | null
          dokument_url_html?: string | null
          dokument_url_text?: string | null
          id?: string
          local_html_url?: string | null
          local_pdf_url?: string | null
          nummer?: string | null
          organ?: string | null
          rm?: string | null
          status?: string | null
          subtitel?: string | null
          subtyp?: string | null
          systemdatum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
        }
        Update: {
          beteckning?: string | null
          created_at?: string
          datum?: string | null
          dok_id?: string
          doktyp?: string | null
          dokument_url_html?: string | null
          dokument_url_text?: string | null
          id?: string
          local_html_url?: string | null
          local_pdf_url?: string | null
          nummer?: string | null
          organ?: string | null
          rm?: string | null
          status?: string | null
          subtitel?: string | null
          subtyp?: string | null
          systemdatum?: string | null
          titel?: string | null
          typ?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      riksdagen_ledamoter: {
        Row: {
          bild_url: string | null
          created_at: string
          efternamn: string | null
          fornamn: string | null
          id: string
          intressent_id: string
          local_bild_url: string | null
          parti: string | null
          status: string | null
          tilltalsnamn: string | null
          updated_at: string
          valkrets: string | null
        }
        Insert: {
          bild_url?: string | null
          created_at?: string
          efternamn?: string | null
          fornamn?: string | null
          id?: string
          intressent_id: string
          local_bild_url?: string | null
          parti?: string | null
          status?: string | null
          tilltalsnamn?: string | null
          updated_at?: string
          valkrets?: string | null
        }
        Update: {
          bild_url?: string | null
          created_at?: string
          efternamn?: string | null
          fornamn?: string | null
          id?: string
          intressent_id?: string
          local_bild_url?: string | null
          parti?: string | null
          status?: string | null
          tilltalsnamn?: string | null
          updated_at?: string
          valkrets?: string | null
        }
        Relationships: []
      }
      riksdagen_utskott: {
        Row: {
          beskrivning: string | null
          created_at: string
          id: string
          namn: string | null
          updated_at: string
          utskott_kod: string
        }
        Insert: {
          beskrivning?: string | null
          created_at?: string
          id?: string
          namn?: string | null
          updated_at?: string
          utskott_kod: string
        }
        Update: {
          beskrivning?: string | null
          created_at?: string
          id?: string
          namn?: string | null
          updated_at?: string
          utskott_kod?: string
        }
        Relationships: []
      }
      riksdagen_votering_ledamoter: {
        Row: {
          created_at: string
          id: string
          intressent_id: string | null
          parti: string | null
          rost: string | null
          votering_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intressent_id?: string | null
          parti?: string | null
          rost?: string | null
          votering_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intressent_id?: string | null
          parti?: string | null
          rost?: string | null
          votering_id?: string
        }
        Relationships: []
      }
      riksdagen_voteringar: {
        Row: {
          beteckning: string | null
          created_at: string
          id: string
          punkt: number | null
          rm: string | null
          titel: string | null
          updated_at: string
          vinnare: string | null
          votering_datum: string | null
          votering_id: string
          votering_typ: string | null
        }
        Insert: {
          beteckning?: string | null
          created_at?: string
          id?: string
          punkt?: number | null
          rm?: string | null
          titel?: string | null
          updated_at?: string
          vinnare?: string | null
          votering_datum?: string | null
          votering_id: string
          votering_typ?: string | null
        }
        Update: {
          beteckning?: string | null
          created_at?: string
          id?: string
          punkt?: number | null
          rm?: string | null
          titel?: string | null
          updated_at?: string
          vinnare?: string | null
          votering_datum?: string | null
          votering_id?: string
          votering_typ?: string | null
        }
        Relationships: []
      }
      storage_statistics: {
        Row: {
          bucket_id: string
          file_count: number
          last_updated: string
          total_size_bytes: number
        }
        Insert: {
          bucket_id: string
          file_count?: number
          last_updated?: string
          total_size_bytes?: number
        }
        Update: {
          bucket_id?: string
          file_count?: number
          last_updated?: string
          total_size_bytes?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_table_sizes: {
        Args: never
        Returns: {
          last_updated: string
          row_count: number
          size_bytes: number
          table_name: string
          total_size: string
        }[]
      }
      get_user_roles_with_emails: {
        Args: never
        Returns: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_document_view: {
        Args: { p_document_id: string; p_table_name: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      log_admin_activity: {
        Args: {
          p_action_type: string
          p_description: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      refresh_storage_statistics: { Args: never; Returns: undefined }
      reset_stuck_auto_process: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
