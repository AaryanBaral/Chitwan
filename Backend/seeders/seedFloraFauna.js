import FloraFauna from "../Models/floraFauna.model.js";

export async function seedFloraFauna(){
  const count = await FloraFauna.count();
  // if (count > 0) return { skipped: true, model: 'FloraFauna' };
  const rows = await FloraFauna.bulkCreate([
    { type:'fauna', commonName:'One-horned Rhinoceros', scientificName:'Rhinoceros unicornis', status:'active' },
    { type:'flora', commonName:'Sal Tree', scientificName:'Shorea robusta', status:'active' },
    { type:'fauna', commonName:'Bengal Tiger', scientificName:'Panthera tigris tigris', status:'active' },
    { type:'fauna', commonName:'Gharial', scientificName:'Gavialis gangeticus', status:'active' },
    { type:'fauna', commonName:'Asian Elephant', scientificName:'Elephas maximus', status:'active' },
    { type:'flora', commonName:'Bamboo', scientificName:'Bambusoideae', status:'active' },
    { type:'flora', commonName:'Peepal', scientificName:'Ficus religiosa', status:'active' },
    { type:'fauna', commonName:'Spotted Deer', scientificName:'Axis axis', status:'active' },
    { type:'fauna', commonName:'Kingfisher', scientificName:'Alcedinidae', status:'active' },
    { type:'flora', commonName:'Indian Rosewood', scientificName:'Dalbergia sissoo', status:'active' },
  ]);
  // attach placeholder images
  const { default: FloraFaunaImage } = await import("../Models/floraFaunaImage.model.js")
  for (const it of rows) {
    await FloraFaunaImage.create({ floraFaunaId: it.id, path: 'flora-fauna/placeholder.svg', altText: it.commonName }).catch(()=>{})
  }
  return { seeded: rows.length, model: 'FloraFauna' };
}

export default seedFloraFauna;
