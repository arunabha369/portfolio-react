-- Template: run alongside any CREATE TABLE in the public schema.
--
-- As of Oct 30 2026, Supabase no longer auto-grants Data API access to new
-- public tables. Without these grants, PostgREST/supabase-js returns
-- "permission denied" for the table. Existing tables (blogs, blog_sections,
-- blog_comments, blog_likes, counter) already have their grants and are
-- unaffected — this only applies to tables created from now on.
--
-- Replace `your_table` below and run this in the same SQL editor session
-- (or migration) that creates the table.

grant select
on public.your_table
to anon;

grant select, insert, update, delete
on public.your_table
to authenticated;

grant select, insert, update, delete
on public.your_table
to service_role;
