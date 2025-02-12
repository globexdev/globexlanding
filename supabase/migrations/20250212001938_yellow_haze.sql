/*
  # Add email column to profiles table

  1. Changes
    - Add email column to profiles table
    - Update handle_new_user trigger to store email
  
  2. Security
    - Email column is added with NOT NULL constraint
    - Trigger is updated to store email from auth.users
*/

-- Add email column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text NOT NULL;
  END IF;
END $$;

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    email,
    first_name,
    last_name,
    avatar_url,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NULL,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;