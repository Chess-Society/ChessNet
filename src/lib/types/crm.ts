export interface Lead {
  id: string;
  owner_id: string;
  name: string;
  email?: string;
  phone?: string;
  school_id?: string;
  class_id?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
  source?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
