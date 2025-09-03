import seedGuides from './seedGuides.js'
import seedHotels from './seedHotels.js'
import seedBlogs from './seedBlogs.js'
import seedNotices from './seedNotices.js'
import seedMedia from './seedMedia.js'
import seedFloraFauna from './seedFloraFauna.js'
import seedPlaces from './seedPlaces.js'
import seedTrainings from './seedTrainings.js'
import seedFeedback from './seedFeedback.js'

export async function seedAll(){
  const results = []
  results.push(await seedGuides())
  results.push(await seedHotels())
  results.push(await seedBlogs())
  results.push(await seedNotices())
  const media = await seedMedia(); results.push(...media)
  results.push(await seedFloraFauna())
  results.push(await seedPlaces())
  results.push(await seedTrainings())
  results.push(await seedFeedback())

  return results
}

export default seedAll
