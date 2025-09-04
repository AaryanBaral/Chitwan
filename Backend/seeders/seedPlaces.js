import PlaceCategory from "../Models/placeCategory.model.js";
import Place from "../Models/place.model.js";

export async function seedPlaces(){
  // let catEco = await PlaceCategory.findOne({ where: { slug: 'eco-park' } })
  // if (!catEco) catEco = await PlaceCategory.create({ name:'Eco Park', slug:'eco-park', description:'Eco tourism sites', status:'active' })
  // let catHeritage = await PlaceCategory.findOne({ where: { slug: 'heritage' } })
  // if (!catHeritage) catHeritage = await PlaceCategory.create({ name:'Heritage', slug:'heritage', description:'Cultural heritage sites', status:'active' })

  const count = await Place.count();
  if (count > 0) return { skipped:true, model:'Place' };
  const rows = await Place.bulkCreate([
    { name:'Rapti River Bank', description:'Sunset viewpoint', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Tharu Cultural Museum', description:'Local culture and history', categoryId: catHeritage.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Elephant Breeding Center', description:'Conservation site', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Community Forest Trail', description:'Nature walk', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Old Bazaar Area', description:'Historic market', categoryId: catHeritage.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Bird Tower Viewpoint', description:'Birding spot', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Cultural Performance Hall', description:'Evening shows', categoryId: catHeritage.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'River Confluence Point', description:'Scenic site', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Heritage Temple', description:'Religious site', categoryId: catHeritage.id, city:'Chitwan', country:'Nepal', status:'active' },
    { name:'Wetland Boardwalk', description:'Nature spot', categoryId: catEco.id, city:'Chitwan', country:'Nepal', status:'active' },
  ])
  // attach images
  const { default: PlaceImage } = await import("../Models/placeImage.model.js")
  for (const p of rows) {
    await PlaceImage.create({ placeId: p.id, path: 'places/placeholder.svg', altText: p.name }).catch(()=>{})
  }
  return { seeded: rows.length, model:'Place' }
}

export default seedPlaces;
