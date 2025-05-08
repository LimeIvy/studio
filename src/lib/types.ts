
export interface User {
  id: string; // UUID
  name: string | null;
  email: string | null;
  avatarUrl?: string | null;
  xp: number; // Experience Points
  level: number; // User Level
  // teamMemberships might be derived or checked directly against Team.members for mock data
}

export type CourseMode = 'public' | 'team';

export interface Course {
  id: string; // UUID
  title: string;
  description: string;
  created_at: string; // timestamp
  imageUrl?: string; // Optional image for the course card
  totalStages?: number; // Calculated or stored
  completedStages?: number; // Calculated for current user
  mode: CourseMode;
  price?: number; // For public courses, 0 or undefined for free
  creatorId: string; // user.id of the course creator
  teamId?: string; // team.id, only if mode is 'team'
  isPublished?: boolean; // For public courses, default true for mock data
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
  xpAward: number; // XP awarded for completing this stage
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

export interface TeamMember {
  userId: string;
  role: 'leader' | 'editor' | 'member';
}
export interface Team {
  id: string; // UUID
  name: string;
  description?: string;
  leaderId: string; // user.id
  members: TeamMember[];
  created_at: string; // timestamp
}

// For returning detailed info from completeStage
export interface StageCompletionResult {
  progress: UserProgress;
  xpAwarded: number;
  leveledUp: boolean;
  newLevel?: number;
  oldLevel?: number;
}
