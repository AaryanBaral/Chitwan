import Feedback from "../Models/feedback.model.js";

export async function seedFeedback(){
  const count = await Feedback.count();
  if (count > 0) return { skipped:true, model:'Feedback' };
  const rows = await Feedback.bulkCreate([
    { fullName:'Test User', email:'user1@example.com', subject:'Great service', message:'Loved the training!', rating:5, status:'reviewed' },
    { fullName:'Another User', email:'user2@example.com', subject:'Website', message:'The portal looks nice.', rating:4, status:'reviewed' },
  ])
  return { seeded: rows.length, model:'Feedback' }
}

export default seedFeedback;

