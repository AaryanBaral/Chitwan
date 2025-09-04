import Hotel from "../Models/hotel.model.js";

export async function seedHotels(){
  const count = await Hotel.count();
  // if (count > 0) return { skipped: true, model: 'Hotel' };
  const names = [
    'Rapti Riverside Resort','Jungle Inn','Safari View Lodge','Tharu Heritage Stay','Green Park Hotel',
    'Wildlife Haven','Chitwan Eco Lodge','Riverbank Retreat','Parkside Homestay','Forest Edge Resort',
    'Community Guest House','Sunset View Hotel'
  ];
  const rows = await Hotel.bulkCreate(names.map((name, i) => ({
    name,
    description: 'Comfortable stay near the park',
    address: `Ward-${(i%12)+1}, Chitwan`,
    city: 'Chitwan', country: 'Nepal',
    contactPhone: `+97798000001${(i+10).toString().padStart(2,'0')}`,
    images: JSON.stringify([ 'hotels/placeholder.svg' ]),
    status:'active'
  })));
  return { seeded: rows.length, model: 'Hotel' };
}

export default seedHotels;
