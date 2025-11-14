# Inventario de esquema (Supabase / Postgres)

## Esquema: `public`

### Tabla: `announcements`  
Columnas: **9**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `college_id` | `uuid` | — | `nan` | — | `public.colleges.id` |
| 2 | `content` | `text` | — | `nan` | — |  |
| 3 | `created_at` | `timestamp with time zone` | — | `now()` | — |  |
| 4 | `created_by` | `uuid` | — | `nan` | — |  |
| 5 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 6 | `is_published` | `boolean` | — | `false` | — |  |
| 7 | `target_id` | `uuid` | ✔️ | `nan` | — |  |
| 8 | `target_type` | `text` | — | `'all'::text` | — |  |
| 9 | `title` | `text` | — | `nan` | — |  |


### Tabla: `attendance`  
Columnas: **7**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `class_id` | `uuid` | — | `nan` | — | `public.classes.id` |
| 2 | `created_at` | `timestamp with time zone` | — | `now()` | — |  |
| 3 | `date` | `date` | — | `nan` | — |  |
| 4 | `nota` | `text` | ✔️ | `nan` | — |  |
| 5 | `status` | `text` | — | `nan` | — |  |
| 6 | `student_id` | `uuid` | — | `nan` | — | `public.students.id` |
| 7 | `user_id` | `uuid` | — | `auth.uid()` | — |  |


### Tabla: `categories`  
Columnas: **4**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 2 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 3 | `name` | `text` | — | `nan` | — |  |
| 4 | `user_id` | `uuid` | ✔️ | `nan` | — |  |


### Tabla: `class_skills`  
Columnas: **4**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `class_id` | `uuid` | ✔️ | `nan` | — | `public.classes.id` |
| 2 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 3 | `owner_id` | `uuid` | ✔️ | `nan` | — |  |
| 4 | `skill_id` | `uuid` | ✔️ | `nan` | — | `public.skills.id` |


### Tabla: `class_students`  
Columnas: **5**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `class_id` | `uuid` | ✔️ | `nan` | — | `public.classes.id` |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 4 | `owner_id` | `uuid` | ✔️ | `nan` | — |  |
| 5 | `student_id` | `uuid` | ✔️ | `nan` | — | `public.students.id` |


### Tabla: `classes`  
Columnas: **5**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `college_id` | `uuid` | ✔️ | `nan` | — | `public.colleges.id` |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 4 | `name` | `text` | — | `nan` | — |  |
| 5 | `user_id` | `uuid` | ✔️ | `auth.uid()` | — |  |


### Tabla: `colleges`  
Columnas: **6**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `city` | `text` | ✔️ | `nan` | — |  |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `created_by` | `uuid` | ✔️ | `nan` | — |  |
| 4 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 5 | `name` | `text` | — | `nan` | — |  |
| 6 | `user_id` | `uuid` | ✔️ | `nan` | — |  |


### Tabla: `memberships`  
Columnas: **7**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 2 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 3 | `joined_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 4 | `role` | `text` | — | `'member'::text` | — |  |
| 5 | `school_id` | `uuid` | — | `nan` | — | `public.colleges.id` |
| 6 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 7 | `user_id` | `uuid` | — | `nan` | — |  |


### Tabla: `payments`  
Columnas: **22**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `amount` | `numeric` | — | `nan` | — |  |
| 2 | `class_id` | `uuid` | ✔️ | `nan` | — | `public.classes.id` |
| 3 | `concept` | `text` | — | `nan` | — |  |
| 4 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 5 | `currency` | `text` | ✔️ | `'EUR'::text` | — |  |
| 6 | `description` | `text` | ✔️ | `nan` | — |  |
| 7 | `due_date` | `date` | — | `nan` | — |  |
| 8 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 9 | `invoice_date` | `date` | ✔️ | `nan` | — |  |
| 10 | `invoice_number` | `text` | ✔️ | `nan` | — |  |
| 11 | `notes` | `text` | ✔️ | `nan` | — |  |
| 12 | `paid_date` | `date` | ✔️ | `nan` | — |  |
| 13 | `payment_method` | `text` | ✔️ | `nan` | — |  |
| 14 | `payment_reference` | `text` | ✔️ | `nan` | — |  |
| 15 | `payment_type` | `text` | — | `nan` | — |  |
| 16 | `period_end` | `date` | ✔️ | `nan` | — |  |
| 17 | `period_start` | `date` | ✔️ | `nan` | — |  |
| 18 | `school_id` | `uuid` | ✔️ | `nan` | — | `public.colleges.id` |
| 19 | `status` | `text` | — | `'pending'::text` | — |  |
| 20 | `student_id` | `uuid` | ✔️ | `nan` | — | `public.students.id` |
| 21 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 22 | `user_id` | `uuid` | — | `nan` | — |  |


### Tabla: `profiles`  
Columnas: **9**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `avatar_url` | `text` | ✔️ | `nan` | — |  |
| 2 | `email` | `text` | ✔️ | `nan` | — |  |
| 3 | `full_name` | `text` | ✔️ | `nan` | — |  |
| 4 | `id` | `uuid` | — | `nan` | ✔️ |  |
| 5 | `notification_preferences` | `jsonb` | ✔️ | `'{"student_progress": true, "attendance_alerts": true, "payment_reminders": true, "tournament_updates": true, "system_notifications": true}'::jsonb` | — |  |
| 6 | `privacy_settings` | `jsonb` | ✔️ | `'{"show_email": false, "show_phone": false, "profile_visibility": "private"}'::jsonb` | — |  |
| 7 | `settings` | `jsonb` | ✔️ | `'{"language": "es", "timezone": "Europe/Madrid", "dark_mode": true, "email_updates": true, "notifications": true}'::jsonb` | — |  |
| 8 | `ui_preferences` | `jsonb` | ✔️ | `'{"auto_refresh": true, "compact_mode": false, "items_per_page": 20, "dashboard_layout": "default"}'::jsonb` | — |  |
| 9 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |


### Tabla: `skills`  
Columnas: **7**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `category_id` | `uuid` | ✔️ | `nan` | — | `public.categories.id` |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `icon` | `text` | ✔️ | `nan` | — |  |
| 4 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 5 | `name` | `text` | — | `nan` | — |  |
| 6 | `resource_link` | `text` | ✔️ | `nan` | — |  |
| 7 | `user_id` | `uuid` | ✔️ | `auth.uid()` | — |  |


### Tabla: `student_skills`  
Columnas: **5**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `completed_at` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 2 | `mastered_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `skill_id` | `uuid` | — | `nan` | ✔️ | `public.skills.id` |
| 4 | `student_id` | `uuid` | — | `nan` | ✔️ | `public.students.id` |
| 5 | `user_id` | `uuid` | ✔️ | `auth.uid()` | — |  |


### Tabla: `students`  
Columnas: **9**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `avatar` | `text` | ✔️ | `nan` | — |  |
| 2 | `class_id` | `uuid` | ✔️ | `nan` | — | `public.classes.id` |
| 3 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 4 | `first_name` | `text` | ✔️ | `nan` | — |  |
| 5 | `id` | `uuid` | — | `gen_random_uuid()` | ✔️ |  |
| 6 | `last_name` | `text` | ✔️ | `nan` | — |  |
| 7 | `name` | `text` | — | `nan` | — |  |
| 8 | `notes` | `text` | ✔️ | `nan` | — |  |
| 9 | `user_id` | `uuid` | ✔️ | `auth.uid()` | — |  |


### Tabla: `subscription_payments`  
Columnas: **17**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `amount` | `numeric` | — | `nan` | — |  |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `currency` | `text` | ✔️ | `'EUR'::text` | — |  |
| 4 | `failed_at` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 5 | `gateway_response` | `jsonb` | ✔️ | `'{}'::jsonb` | — |  |
| 6 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 7 | `notes` | `text` | ✔️ | `nan` | — |  |
| 8 | `paid_at` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 9 | `payment_email` | `text` | ✔️ | `nan` | — |  |
| 10 | `payment_method` | `text` | — | `nan` | — |  |
| 11 | `payment_reference` | `text` | ✔️ | `nan` | — |  |
| 12 | `plan_id` | `uuid` | — | `nan` | — | `public.subscription_plans.id` |
| 13 | `refunded_at` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 14 | `status` | `text` | — | `'pending'::text` | — |  |
| 15 | `subscription_id` | `uuid` | ✔️ | `nan` | — | `public.user_subscriptions.id` |
| 16 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 17 | `user_id` | `uuid` | — | `nan` | — |  |


### Tabla: `subscription_plans`  
Columnas: **17**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 2 | `currency` | `text` | ✔️ | `'EUR'::text` | — |  |
| 3 | `description` | `text` | ✔️ | `nan` | — |  |
| 4 | `display_name` | `text` | — | `nan` | — |  |
| 5 | `features` | `jsonb` | ✔️ | `'[]'::jsonb` | — |  |
| 6 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 7 | `is_active` | `boolean` | ✔️ | `true` | — |  |
| 8 | `max_classes` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 9 | `max_colleges` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 10 | `max_custom_skills` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 11 | `max_storage_mb` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 12 | `max_students` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 13 | `max_tournaments` | `integer` | ✔️ | `'-1'::integer` | — |  |
| 14 | `name` | `text` | — | `nan` | — |  |
| 15 | `price_annual` | `numeric` | — | `nan` | — |  |
| 16 | `sort_order` | `integer` | ✔️ | `0` | — |  |
| 17 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |


### Tabla: `tournament_matches`  
Columnas: **12**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `black_player_id` | `uuid` | — | `nan` | — | `public.tournament_participants.id` |
| 2 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 3 | `game_date` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 4 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 5 | `moves` | `text` | ✔️ | `nan` | — |  |
| 6 | `notes` | `text` | ✔️ | `nan` | — |  |
| 7 | `result` | `text` | ✔️ | `nan` | — |  |
| 8 | `round_number` | `integer` | — | `nan` | — |  |
| 9 | `time_control` | `text` | ✔️ | `nan` | — |  |
| 10 | `tournament_id` | `uuid` | — | `nan` | — | `public.tournaments.id` |
| 11 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 12 | `white_player_id` | `uuid` | — | `nan` | — | `public.tournament_participants.id` |


### Tabla: `tournament_participants`  
Columnas: **14**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 2 | `current_rating` | `integer` | ✔️ | `1200` | — |  |
| 3 | `draws` | `integer` | ✔️ | `0` | — |  |
| 4 | `games_played` | `integer` | ✔️ | `0` | — |  |
| 5 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 6 | `initial_rating` | `integer` | ✔️ | `1200` | — |  |
| 7 | `losses` | `integer` | ✔️ | `0` | — |  |
| 8 | `points` | `numeric` | ✔️ | `0.00` | — |  |
| 9 | `registration_date` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 10 | `status` | `text` | — | `'registered'::text` | — |  |
| 11 | `student_id` | `uuid` | — | `nan` | — | `public.students.id` |
| 12 | `tournament_id` | `uuid` | — | `nan` | — | `public.tournaments.id` |
| 13 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 14 | `wins` | `integer` | ✔️ | `0` | — |  |


### Tabla: `tournaments`  
Columnas: **22**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 2 | `current_round` | `integer` | ✔️ | `0` | — |  |
| 3 | `description` | `text` | ✔️ | `nan` | — |  |
| 4 | `end_date` | `timestamp with time zone` | — | `nan` | — |  |
| 5 | `entry_fee` | `numeric` | ✔️ | `0.00` | — |  |
| 6 | `format` | `text` | — | `'swiss'::text` | — |  |
| 7 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 8 | `location` | `text` | ✔️ | `nan` | — |  |
| 9 | `max_players` | `integer` | ✔️ | `32` | — |  |
| 10 | `name` | `text` | — | `nan` | — |  |
| 11 | `notes` | `text` | ✔️ | `nan` | — |  |
| 12 | `organizer` | `text` | ✔️ | `nan` | — |  |
| 13 | `players_registered` | `integer` | ✔️ | `0` | — |  |
| 14 | `prize_pool` | `numeric` | ✔️ | `0.00` | — |  |
| 15 | `registration_deadline` | `timestamp with time zone` | — | `nan` | — |  |
| 16 | `rules` | `text` | ✔️ | `nan` | — |  |
| 17 | `start_date` | `timestamp with time zone` | — | `nan` | — |  |
| 18 | `status` | `text` | — | `'upcoming'::text` | — |  |
| 19 | `time_control` | `text` | ✔️ | `'15+10'::text` | — |  |
| 20 | `total_rounds` | `integer` | ✔️ | `0` | — |  |
| 21 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 22 | `user_id` | `uuid` | — | `nan` | — |  |


### Tabla: `user_subscriptions`  
Columnas: **16**

| # | Columna | Tipo | Nullable | Default | PK | FK |
|---:|---|---|:---:|---|:---:|---|

| 1 | `amount_paid` | `numeric` | ✔️ | `nan` | — |  |
| 2 | `auto_renew` | `boolean` | ✔️ | `false` | — |  |
| 3 | `cancelled_at` | `timestamp with time zone` | ✔️ | `nan` | — |  |
| 4 | `created_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 5 | `currency` | `text` | ✔️ | `'EUR'::text` | — |  |
| 6 | `expires_at` | `timestamp with time zone` | — | `nan` | — |  |
| 7 | `id` | `uuid` | — | `uuid_generate_v4()` | ✔️ |  |
| 8 | `metadata` | `jsonb` | ✔️ | `'{}'::jsonb` | — |  |
| 9 | `payment_email` | `text` | ✔️ | `nan` | — |  |
| 10 | `payment_method` | `text` | ✔️ | `nan` | — |  |
| 11 | `payment_reference` | `text` | ✔️ | `nan` | — |  |
| 12 | `plan_id` | `uuid` | — | `nan` | — | `public.subscription_plans.id` |
| 13 | `started_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 14 | `status` | `text` | — | `'active'::text` | — |  |
| 15 | `updated_at` | `timestamp with time zone` | ✔️ | `now()` | — |  |
| 16 | `user_id` | `uuid` | — | `nan` | — |  |

