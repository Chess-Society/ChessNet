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
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  color?: string;
  active?: boolean;
  orderIndex?: number;
  createdAt: string;
}

export interface Class {
  id: string;
  owner_id: string;
  schoolId: string;
  schoolName?: string;
  name: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  maxStudents?: number;
  active?: boolean;
  price?: number;
  settings?: Record<string, any>;
  studentIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  owner_id: string;
  schoolId: string;
  classId?: string;
  name: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  grade?: string;
  level?: string;
  parentEmail?: string;
  parentPhone?: string;
  avatar?: string;
  notes?: string;
  rating?: number;
  active?: boolean;
  settings?: Record<string, any>;
  lichessUsername?: string;
  lichessAccessToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  owner_id: string;
  categoryId?: string;
  name: string;
  description?: string;
  icon?: string;
  resourceLink?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  difficulty?: number;
  estimatedHours?: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  assessmentCriteria?: string[];
  resources?: string[];
  orderIndex?: number;
  order?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSkill {
  id: string;
  owner_id: string;
  classId: string;
  skillId: string;
  orderIndex?: number;
  createdAt: string;
}

export interface ClassStudent {
  id: string;
  owner_id: string;
  classId: string;
  studentId: string;
  enrolledAt: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

export interface StudentSkill {
  id: string;
  owner_id: string;
  studentId: string;
  skillId: string;
  level: number; // 0-100
  mastered: boolean;
  notes?: string;
  lastPracticed?: string;
  updatedAt: string;
  createdAt: string;
}

export interface ClassWithDetails extends Class {
  school?: School;
  studentsCount?: number;
  skillsCount?: number;
}

export interface StudentWithDetails extends Student {
  class?: Class;
  skillsProgress?: StudentSkill[];
  attendanceSummary?: any; // To be defined or imported
}

export interface SkillWithDetails extends Omit<Skill, 'category'> {
  category?: Category | string;
  classesCount?: number;
  studentsMastered?: number;
}

export interface CreateClassForm {
  name: string;
  schoolId?: string;
  description?: string;
  level?: "beginner" | "intermediate" | "advanced";
  schedule?: string;
  maxStudents?: number;
  active?: boolean;
}

export interface CreateStudentForm {
  name: string;
  classId?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  grade?: string;
  parentEmail?: string;
  parentPhone?: string;
  notes?: string;
}

export interface CreateSkillForm {
  name: string;
  categoryId?: string;
  description?: string;
  icon?: string;
  resourceLink?: string;
  level?: "beginner" | "intermediate" | "advanced";
  difficulty?: number;
  estimatedHours?: number;
  learningObjectives?: string[];
  assessmentCriteria?: string[];
  resources?: string[];
  orderIndex?: number;
  order?: number;
  active?: boolean;
}

export interface StudentSkillForm {
  studentId: string;
  skillId: string;
  level: number;
  mastered: boolean;
  notes?: string;
}

export interface ClassOccupancy {
  owner_id: string;
  classId: string;
  enrolled: number;
}
