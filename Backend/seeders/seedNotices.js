import Notice from "../Models/notice.model.js";

export async function seedNotices(){
  const count = await Notice.count();
  if (count > 0) return { skipped: true, model: 'Notice' };
  const now = new Date();
  const titles = [
    'Community training registration open','Ward clean-up program this weekend','Flora documentation drive',
    'Public hearing schedule','Blog contest announcement','Road maintenance notice','Riverbank safety advisory',
    'Festival traffic plan','Public library timing update','Emergency drill next month'
  ];
  const rows = await Notice.bulkCreate(titles.map((t,i)=>({
    title: t,
    summary: 'Auto-seeded notice',
    status: 'published',
    displayFrom: now,
    priority: i,
    // Seed with an image attachment path
    attachment: 'notices/placeholder.svg'
  })));
  return { seeded: rows.length, model: 'Notice' };
}

export default seedNotices;
