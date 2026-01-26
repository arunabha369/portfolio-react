-- 1. Add the 'views' column to the blogs table
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 2. (Optional but Recommended) Create the function for safe, atomic view counting
-- This matches the 'increment_blog_view' call in your code to prevent race conditions.
create or replace function increment_blog_view(blog_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update blogs
  set views = views + 1
  where id = blog_id;
end;
$$;
