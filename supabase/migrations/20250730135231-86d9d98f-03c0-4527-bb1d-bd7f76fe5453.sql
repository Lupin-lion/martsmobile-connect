-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create storage policies for car images
CREATE POLICY "Anyone can view car images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'car-images');

CREATE POLICY "Admins can upload car images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'car-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can update car images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'car-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admins can delete car images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'car-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Add image columns to cars table
ALTER TABLE cars 
ADD COLUMN main_image_url TEXT,
ADD COLUMN image_1_url TEXT,
ADD COLUMN image_2_url TEXT,
ADD COLUMN image_3_url TEXT,
ADD COLUMN image_4_url TEXT,
ADD COLUMN image_5_url TEXT;

-- Remove the old image_url column
ALTER TABLE cars DROP COLUMN IF EXISTS image_url;