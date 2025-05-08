
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
  order: number; // For display order
  position?: { x: number; y: number }; // For React Flow like visualization
  fileType: 'md' | 'pdf'; // Type of the content file
  filePath: string; // Path to the content file (e.g., 'docs/introduction.md' or 'slides/chapter1.pdf')
  markdownContent?: string; // Content for 'md' files, or a brief description if desired for 'pdf'
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
