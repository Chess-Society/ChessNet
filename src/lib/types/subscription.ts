export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  price_monthly?: number;
  price_annual: number;
  currency: string;
  max_students: number; // -1 = unlimited
  max_classes: number;
  max_schools: number;
  max_tournaments: number;
  max_storage_mb: number;
  max_custom_skills: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending' | 'failed';
  started_at: string;
  expires_at: string;
  cancelled_at?: string;
  payment_method?: 'paypal' | 'stripe' | 'manual';
  payment_reference?: string;
  payment_email?: string;
  amount_paid?: number;
  currency: string;
  auto_renew: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPayment {
  id: string;
  user_id: string;
  subscription_id?: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_method: 'paypal' | 'stripe' | 'manual';
  payment_reference?: string;
  payment_email?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paid_at?: string;
  failed_at?: string;
  refunded_at?: string;
  gateway_response: Record<string, any>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPlanLimits {
  plan_name: string;
  display_name: string;
  status: string;
  expires_at?: string;
  max_students: number;
  max_classes: number;
  max_schools: number;
  max_tournaments: number;
  max_storage_mb: number;
  max_custom_skills: number;
  features: string[];
}

export interface SubscriptionUpgradeData {
  current_plan: SubscriptionPlan;
  available_plans: SubscriptionPlan[];
  user_limits: UserPlanLimits;
  usage_stats: {
    students_count: number;
    classes_count: number;
    schools_count: number;
    tournaments_count: number;
    storage_used_mb: number;
    custom_skills_count: number;
  };
}
