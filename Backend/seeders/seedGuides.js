import Guide from "../Models/guide.model.js";
import GuideImage from "../Models/guideImage.model.js";

export async function seedGuides() {
  const count = await Guide.count();
  // if (count > 0) return { skipped: true, model: 'Guide' };

  const base = [
    ["Ramesh Thapa","male","01-90-12345","G-001","+9779800000001","ramesh@example.com","Ward-1, Chitwan","English,Nepali","Nature Guide",5],
    ["Sita Gurung","female","01-94-54321","G-002","+9779811111112","sita@example.com","Ward-3, Chitwan","English","Cultural Tours",3],
    ["Hari Chaudhary","male","01-88-11111","G-003","+9779842222222","hari@example.com","Ward-6, Chitwan","Nepali","Bird Watching",7],
    ["Mina Lama","female","01-92-77777","G-004","+9779852020202","mina@example.com","Ward-4, Chitwan","English,Nepali","Jungle Walks",4],
    ["Kamal Adhikari","male","01-87-33333","G-005","+9779802222222","kamal@example.com","Ward-7, Chitwan","English","Safari Tours",6],
    ["Nita Shrestha","female","01-95-66666","G-006","+9779803333333","nita@example.com","Ward-2, Chitwan","Nepali","Cultural Tours",2],
    ["Bishal Karki","male","01-89-13579","G-007","+9779804444444","bishal@example.com","Ward-8, Chitwan","English,Nepali","Photography",8],
    ["Puja Rai","female","01-91-24680","G-008","+9779805555555","puja@example.com","Ward-9, Chitwan","English","Food Tours",3],
    ["Sanjay Poudel","male","01-86-11223","G-009","+9779806666666","sanjay@example.com","Ward-10, Chitwan","Nepali","Bird Watching",9],
    ["Asmita Dahal","female","01-93-99887","G-010","+9779807777777","asmita@example.com","Ward-5, Chitwan","English,Nepali","Cycling Tours",1],
    ["Gopal Gurung","male","01-85-66554","G-011","+9779808888888","gopal@example.com","Ward-11, Chitwan","English","Nature Guide",10],
    ["Laxmi Kumari","female","01-90-10101","G-012","+9779809999999","laxmi@example.com","Ward-12, Chitwan","English,Nepali","River Tours",5]
  ];

  const rows = await Guide.bulkCreate(base.map((r,i) => ({
    fullName: r[0], gender: r[1], dob: null,
    citizenshipNo: r[2], licenseNo: r[3], phone: r[4], email: r[5],
    address: r[6], languages: r[7], specialization: r[8], experienceYears: r[9], status: 'active'
  })));

  for (const g of rows) {
    await GuideImage.create({ guideId: g.id, path: `guides/placeholder.svg`, altText: g.fullName }).catch(() => {})
  }

  return { seeded: rows.length, model: 'Guide' };
}

export default seedGuides;
