import Training from "../Models/training.model.js";

function daysFromNow(d){ const t = new Date(); t.setDate(t.getDate()+d); return t }
function makeSlug(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

export async function seedTrainings(){
  const count = await Training.count();
  if (count > 0) return { skipped:true, model:'Training' };

  const rows = [];
  // 10 upcoming (future start)
  for (let i=1;i<=10;i++){
    const title = `Upcoming Training ${i}`;
    rows.push({
      title,
      slug: makeSlug(title),
      summary: 'Upcoming session for community members',
      mode: i%3===0 ? 'online' : (i%2===0 ? 'hybrid' : 'in_person'),
      location: i%3===0 ? 'Zoom' : 'Community Center',
      startAt: daysFromNow(5 + i*2),
      endAt: daysFromNow(6 + i*2),
      applicationOpenAt: daysFromNow(1),
      applicationCloseAt: daysFromNow(20),
      status: 'published',
    })
  }

  // 10 ongoing (already started, not finished); apps close in 20 days
  for (let i=1;i<=10;i++){
    const title = `Ongoing Training ${i}`;
    rows.push({
      title,
      slug: makeSlug(title),
      summary: 'Currently running session',
      mode: i%3===0 ? 'online' : (i%2===0 ? 'hybrid' : 'in_person'),
      location: i%3===0 ? 'Zoom' : 'Ward Office Hall',
      startAt: daysFromNow(-i),
      endAt: daysFromNow(10 + i),
      applicationOpenAt: daysFromNow(-7),
      applicationCloseAt: daysFromNow(20),
      status: 'published',
    })
  }

  const created = await Training.bulkCreate(rows);
  return { seeded: created.length, model:'Training' };
}

export default seedTrainings;
