export interface School {
  id: string;
  owner_id: string;
  name: string;
  city?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
  order_index?: number;
  created_at: string;
}

export interface Class {
  id: string;
  owner_id: string;
  school_id: string;
  school_name?: string;
  name: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  max_students?: number;
  active?: boolean;
  price?: number;
  settings?: Record<string, any>;
  studentIds?: string[];
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  owner_id: string;
  school_id: string;
  class_id?: string;
  name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  grade?: string;
  level?: string;
  parent_email?: string;
  parent_phone?: string;
  avatar?: string;
  notes?: string;
  rating?: number;
  active?: boolean;
  settings?: Record<string, any>;
  lichess_username?: string;
  lichess_access_token?: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  owner_id: string;
  category_id?: string;
  name: string;
  description?: string;
  icon?: string;
  resource_link?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  difficulty?: number;
  estimated_hours?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
  assessment_criteria?: string[];
  resources?: string[];
  order_index?: number;
  order?: number;
  active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassSkill {
  id: string;
  owner_id: string;
  class_id: string;
  skill_id: string;
  order_index?: number;
  created_at: string;
}

export interface ClassStudent {
  id: string;
  owner_id: string;
  class_id: string;
  student_id: string;
  enrolled_at: string;
  status: "active" | "inactive" | "suspended";
  created_at: string;
}

export interface StudentSkill {
  id: string;
  owner_id: string;
  student_id: string;
  skill_id: string;
  level: number; // 0-100
  mastered: boolean;
  notes?: string;
  last_practiced?: string;
  updated_at: string;
  created_at: string;
}

export interface ClassWithDetails extends Class {
  school?: School;
  students_count?: number;
  skills_count?: number;
}

export interface StudentWithDetails extends Student {
  class?: Class;
  skills_progress?: StudentSkill[];
  attendance_summary?: any; // To be defined or imported
}

export interface SkillWithDetails extends Omit<Skill, 'category'> {
  category?: Category | string;
  classes_count?: number;
  students_mastered?: number;
}

export interface CreateClassForm {
  name: string;
  school_id?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  max_students?: number;
  active?: boolean;
}

export interface CreateStudentForm {
  name: string;
  class_id?: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  grade?: string;
  parent_email?: string;
  parent_phone?: string;
  notes?: string;
}

export interface CreateSkillForm {
  name: string;
  category_id?: string;
  description?: string;
  icon?: string;
  resource_link?: string;
  level?: "beginner" | "intermediate" | "advanced";
  difficulty?: number;
  estimated_hours?: number;
  learning_objectives?: string[];
  assessment_criteria?: string[];
  resources?: string[];
  order_index?: number;
  order?: number;
  active?: boolean;
}

export interface StudentSkillForm {
  student_id: string;
  skill_id: string;
  level: number;
  mastered: boolean;
  notes?: string;
}

export interface ClassOccupancy {
  owner_id: string;
  class_id: string;
  enrolled: number;
}
