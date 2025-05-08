
export interface User {
  id: string; // UUID
  name: string | null;
  email: string | null;
  avatarUrl?: string | null;
}

export interface Course {
  id: string; // UUID
  title: string;
  description: string;
  created_at: string; // timestamp
  imageUrl?: string; // Optional image for the course card
  totalStages?: number; // Calculated or stored
  completedStages?: number; // Calculated for current user
}

export interface Stage {
  id: string; // UUID
  course_id: string; // UUID
  title: string;
  // file_path: string; // Path to Markdown file in Supabase Storage
  markdownContent: string; // For mock data, direct content
  order: number; // For display order
  position?: { x: number; y: number }; // For React Flow like visualization
}

export interface StageLink {
  id:string; // UUID
  from_stage_id: string; // UUID
  to_stage_id: string; // UUID
}

export interface UserProgress {
  id: string; // UUID
  user_id: string; // UUID
  stage_id: string; // UUID
  completed_at: string; // timestamp
}
