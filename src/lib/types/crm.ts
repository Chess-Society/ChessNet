export interface Lead {
  id: string;
  ownerId: string;
  name: string;
  email?: string;
  phone?: string;
  schoolId?: string;
  classId?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
  source?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

