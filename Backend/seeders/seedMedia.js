import Photo from "../Models/photo.model.js";
import Video from "../Models/video.model.js";

export async function seedMedia(){
  const results = []
  if (await Photo.count() === 0) {
    const desc = [
      'Rhino in Chitwan','Sunset on Rapti','Jungle trail','Canoe ride','Bird in flight',
      'Elephant bathing','Community program','Cultural dance','Forest canopy','River bend'
    ]
    const rows = await Photo.bulkCreate(desc.map(d => ({ description:d, image:'photos/placeholder.svg', status:'published', publishedAt:new Date() })))
    results.push({ model:'Photo', seeded: rows.length })
  } else results.push({ model:'Photo', skipped:true })

  if (await Video.count() === 0) {
    const rowsV = await Video.bulkCreate([
      { description:'Canoe trip highlight', video:'videos/sample.mp4', status:'published', publishedAt:new Date() },
      { description:'Cultural program', video:'videos/sample.mp4', status:'published', publishedAt:new Date() },
      { description:'Ward awareness clip', video:'videos/sample.mp4', status:'published', publishedAt:new Date() },
    ])
    results.push({ model:'Video', seeded: rowsV.length })
  } else results.push({ model:'Video', skipped:true })

  return results
}

export default seedMedia;
