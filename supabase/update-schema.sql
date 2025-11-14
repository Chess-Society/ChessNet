-- =====================
-- ChessNet: Schema Update Script
-- =====================

-- Add missing columns to colleges table if they don't exist
DO $$ 
BEGIN
    -- Add country column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'colleges' AND column_name = 'country') THEN
        ALTER TABLE public.colleges ADD COLUMN country TEXT DEFAULT 'ES';
    END IF;
    
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'colleges' AND column_name = 'user_id') THEN
        ALTER TABLE public.colleges ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add created_by column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'colleges' AND column_name = 'created_by') THEN
        ALTER TABLE public.colleges ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'colleges' AND column_name = 'updated_at') THEN
        ALTER TABLE public.colleges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_colleges_user_id ON public.colleges(user_id);
CREATE INDEX IF NOT EXISTS idx_colleges_created_by ON public.colleges(created_by);

-- Update existing records to have default values
UPDATE public.colleges 
SET country = 'ES' 
WHERE country IS NULL;

UPDATE public.colleges 
SET updated_at = NOW() 
WHERE updated_at IS NULL;

-- Create trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_colleges_updated_at ON public.colleges;
CREATE TRIGGER update_colleges_updated_at
    BEFORE UPDATE ON public.colleges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
