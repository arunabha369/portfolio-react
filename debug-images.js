
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lgkgqefwjlodqufcgbrj.supabase.co';
const supabaseKey = 'sb_publishable_A1BWaaWlLxmX9Sc6ZSMYYg_rmNo64vK';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBlogs() {
    console.log('Fetching blogs...');
    const { data, error } = await supabase
        .from('blogs')
        .select('title, cover_image, is_published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
        return;
    }

    console.log('Blogs found:', data.length);
    data.forEach(blog => {
        console.log(`- Title: ${blog.title}`);
        console.log(`  Published: ${blog.is_published}`);
        console.log(`  Cover Image: ${blog.cover_image}`);
        console.log('---');
    });
}

checkBlogs();
