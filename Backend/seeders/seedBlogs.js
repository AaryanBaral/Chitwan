import Blog from "../Models/blog.model.js";

export async function seedBlogs(){
  const count = await Blog.count();
  if (count > 0) return { skipped: true, model: 'Blog' };
  const entries = [
    ['Conserving community forests','conserving-community-forests'],
    ['Bird migration season','bird-migration-season'],
    ['Responsible tourism tips','responsible-tourism-tips'],
    ['Local cuisine to try','local-cuisine-to-try'],
    ['Best time for jungle walks','best-time-jungle-walks'],
    ['Bird watching essentials','bird-watching-essentials'],
    ['Cultural festivals in ward','cultural-festivals-in-ward'],
    ['Eco-friendly travel checklist','eco-friendly-travel-checklist'],
    ['Volunteer programs highlight','volunteer-programs-highlight'],
    ['River safety guidelines','river-safety-guidelines']
  ];
  const rows = await Blog.bulkCreate(entries.map(([title, slug]) => ({
    title, slug, summary: 'Auto-seeded article', status:'published', publishedAt:new Date(), image: 'blogs/placeholder.svg'
  })));
  return { seeded: rows.length, model: 'Blog' };
}

export default seedBlogs;
