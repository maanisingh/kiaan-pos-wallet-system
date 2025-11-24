-- Migration: Add phone and updated_at to users table

-- Add phone column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='users' AND column_name='updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
END $$;

-- Set updated_at for existing users
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;

-- Make updated_at NOT NULL
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
