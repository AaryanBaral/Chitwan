import Training from "../Models/training.model.js";

function daysFromNow(d){ const t = new Date(); t.setDate(t.getDate()+d); return t }

export async function seedTrainings(){
  const count = await Training.count();
  if (count > 0) return { skipped:true, model:'Training' };
  const rows = await Training.bulkCreate([
    { title:'Nature Guiding Basics', slug:'nature-guiding-basics', summary:'Intro course for local guides', mode:'in_person', location:'Ward Office Hall', startAt: daysFromNow(7), endAt: daysFromNow(8), status:'published' },
    { title:'Responsible Tourism Workshop', slug:'responsible-tourism-workshop', summary:'Sustainable practices', mode:'hybrid', location:'Community Center', startAt: daysFromNow(20), endAt: daysFromNow(21), status:'published' },
    { title:'First Aid for Fieldwork', slug:'first-aid-fieldwork', summary:'Safety basics', mode:'in_person', location:'Clinic Hall', startAt: daysFromNow(12), endAt: daysFromNow(12), status:'published' },
    { title:'Bird Identification 101', slug:'bird-identification-101', summary:'Learn key species', mode:'online', location:'Zoom', startAt: daysFromNow(15), endAt: daysFromNow(15), status:'published' },
    { title:'Community Engagement Skills', slug:'community-engagement-skills', summary:'Work with locals', mode:'in_person', location:'Community Center', startAt: daysFromNow(30), endAt: daysFromNow(31), status:'published' }
  ])
  return { seeded: rows.length, model:'Training' }
}

export default seedTrainings;
