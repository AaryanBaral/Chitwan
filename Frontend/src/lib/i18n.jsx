import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const LanguageContext = createContext({ lang: 'ne', setLang: () => {} })

const STORAGE_KEY = 'app_lang'
const CACHE_KEY = 'i18n_cache_v1'

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY || ''
const googleApi = GOOGLE_KEY
  ? axios.create({ baseURL: 'https://translation.googleapis.com' })
  : null

function loadCache(){
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') } catch { return {} }
}
function saveCache(cache){
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)) } catch {}
}

const dict = {
  Home: { ne: 'गृह', en: 'Home' },
  About: { ne: 'हाम्रो बारेमा', en: 'About' },
  'Flora & Fauna': { ne: 'वनस्पति र जनावर', en: 'Flora & Fauna' },
  Blogs: { ne: 'ब्लग', en: 'Blogs' },
  Guides: { ne: 'गाइड', en: 'Guides' },
  Hotels: { ne: 'होटल', en: 'Hotels' },
  Notices: { ne: 'सूचनाहरू', en: 'Notices' },
  Training: { ne: 'तालिम', en: 'Training' },
  Forms: { ne: 'फारम', en: 'Forms' },
  Gallery: { ne: 'ग्यालरी', en: 'Gallery' },
  Photos: { ne: 'तस्बिरहरू', en: 'Photos' },
  Videos: { ne: 'भिडियाहरू', en: 'Videos' },
  Contact: { ne: 'सम्पर्क', en: 'Contact' },
  FAQ: { ne: 'प्रश्नोत्तर', en: 'FAQ' },
  Feedback: { ne: 'प्रतिक्रिया', en: 'Feedback' },
  Complain: { ne: 'गुनासो', en: 'Complain' },
  'Monitoring form list': { ne: 'सम्पर्क/अनुगमन फारम सूची', en: 'Monitoring form list' },
  Search: { ne: 'खोज्नुहोस्', en: 'Search' },
  Newest: { ne: 'नयाँ', en: 'Newest' },
  'Newest first': { ne: 'नयाँ पहिले', en: 'Newest first' },
  Oldest: { ne: 'पुरानो', en: 'Oldest' },
  'Oldest first': { ne: 'पुरानो पहिले', en: 'Oldest first' },
  'Title A–Z': { ne: 'शीर्षक A–Z', en: 'Title A–Z' },
  Loading: { ne: 'लोड हुँदैछ…', en: 'Loading…' },
  Prev: { ne: 'अघिल्लो', en: 'Prev' },
  Next: { ne: 'अर्को', en: 'Next' },
  Page: { ne: 'पृष्ठ', en: 'Page' },
}

export function LanguageProvider({ children }){
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ne')
  useEffect(() => { localStorage.setItem(STORAGE_KEY, lang) }, [lang])
  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(){
  return useContext(LanguageContext)
}

export function useTranslate(){
  const { lang } = useLanguage()
  const t = (key) => {
    if (!key) return ''
    const d = dict[key]
    if (!d) return key
    return d[lang] || key
  }
  return t
}

export async function translateTexts(texts = [], target = 'ne'){
  if (!texts.length) return []
  if (!googleApi || !GOOGLE_KEY || target === 'en') return texts
  const cache = loadCache()
  const out = new Array(texts.length)
  const missing = []
  texts.forEach((txt, i) => {
    const key = `${target}:${txt}`
    if (cache[key]) out[i] = cache[key]
    else missing.push([i, txt])
  })
  if (missing.length) {
    const qs = new URLSearchParams({ key: GOOGLE_KEY, target })
    const params = qs.toString()
    const body = new URLSearchParams()
    for (const [, txt] of missing) body.append('q', txt)
    body.append('format', 'text')
    const res = await googleApi.post(`/language/translate/v2?${params}`, body)
    const translations = res.data?.data?.translations || []
    translations.forEach((tr, idx) => {
      const [origIndex, origText] = missing[idx]
      out[origIndex] = tr.translatedText
      cache[`${target}:${origText}`] = tr.translatedText
    })
    saveCache(cache)
  }
  return out
}

export async function translateFields(items = [], fields = [], target = 'ne'){
  if (!items.length || !fields.length || target === 'en') return items
  const texts = []
  const pointers = []
  items.forEach((it, idx) => {
    fields.forEach((f) => {
      if (it && it[f]) { texts.push(String(it[f])); pointers.push([idx, f]) }
    })
  })
  const translated = await translateTexts(texts, target)
  const out = items.map((it) => ({ ...it }))
  translated.forEach((val, i) => {
    const [idx, f] = pointers[i]
    out[idx][f] = val
  })
  return out
}

