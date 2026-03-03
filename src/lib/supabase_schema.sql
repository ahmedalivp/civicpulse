-- 1. Create the primary Civic Issues tracking table
CREATE TABLE civic_issues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text,
  author text DEFAULT 'anonymous' NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  upvotes integer DEFAULT 0,
  resolved boolean DEFAULT false
);

-- 2. Turn on Row Level Security (RLS) to ensure future users can only edit their own reports
ALTER TABLE civic_issues ENABLE ROW LEVEL SECURITY;

-- 3. Create a public read policy (So anyone landing on your Next.js site can instantly see the feed!)
CREATE POLICY "Public profiles are viewable by everyone" 
ON civic_issues 
FOR SELECT 
USING (true);

-- 4. Create an insert policy allowing anyone (or logged-in users) to submit civic reports
CREATE POLICY "Anyone can insert an issue" 
ON civic_issues 
FOR INSERT 
WITH CHECK (true);

-- 5. Seed the database with the initial MVP mock data
INSERT INTO civic_issues (title, category, description, author, latitude, longitude, upvotes) VALUES
  ('Massive Pothole on 5th Ave Needs Fixing!', 'Infrastructure', 'Hit this pothole driving to work, needs immediate leveling.', 'civic_watcher', 40.7128, -74.0060, 142),
  ('Overflowing trash bins at Central Park', 'Maintenance', 'Piles of garbage next to the playground. Unsafe and smells.', 'green_city', 40.7140, -74.0080, 89),
  ('Traffic light synced poorly, causing jams', 'Traffic', 'Light turns red too fast on 2nd Ave intersection.', 'local_commuter', 40.7110, -74.0040, 45);
