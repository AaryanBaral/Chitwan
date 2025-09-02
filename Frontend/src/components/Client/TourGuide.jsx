import React, { useState, useEffect } from "react";
import "../../styles/TourGuide.css";
import { guidesApi, uploadsUrl } from "../../lib/api.js";

export default function TourGuides() {
  const [query, setQuery]   = useState("");
  const [langs, setLangs]   = useState([]); 
  const [data, setData]     = useState({ items: [], total: 0, page: 1, pageSize: 12 });
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const toggleLang = (lang) =>
    setLangs((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));

  // fetch from backend whenever filters change
  useEffect(() => {
    let cancelled = false
    async function run(){
      setLoading(true)
      setError("")
      try{
        const res = await guidesApi.list({ q: query || undefined, languages: langs, page: 1, pageSize: 20 })
        if (cancelled) return
        setData(res)
      }catch(err){
        if (cancelled) return
        setError("Failed to load guides")
      }finally{
        if (!cancelled) setLoading(false)
      }
    }
    const t = setTimeout(run, 200) // small debounce for typing
    return () => { cancelled = true; clearTimeout(t) }
  }, [query, langs])

  const list = data.items || []

  return (
    <main className="tg">
      {/* LEFT FILTER */}
      <aside className="tg__filter">
        <h2 className="tg__filterTitle">Filter Tour Guides</h2>

        <div className="form__group">
          <input
            className="input"
            placeholder="eg. name, location, city etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn--accent btn--full" type="button">search guides »</button>
        </div>

        <div className="form__group">
          <div className="label">Tour Guide Language</div>

          <label className="check">
            <input
              type="checkbox"
              checked={langs.includes("English")}
              onChange={() => toggleLang("English")}
            />
            <span>English</span>
          </label>

          <label className="check">
            <input
              type="checkbox"
              checked={langs.includes("Nepali")}
              onChange={() => toggleLang("Nepali")}
            />
            <span>Nepali</span>
          </label>
        </div>
      </aside>

      {/* RIGHT GRID */}
      <section className="tg__content">
        <div className="tg__grid">
          {list.map((g) => (
            <article key={g.id} className="card">
              <div className="card__imgWrap">
                <img
                  src={uploadsUrl(g.image) || "/guides/placeholder.svg"}
                  alt={g.fullName || "Guide"}
                  onError={(e) => { e.currentTarget.src = "/guides/placeholder.svg"; }}
                  loading="lazy"
                />
              </div>

              <div className="card__body">
                <h3 className="card__title">{g.fullName || "Unnamed"}</h3>

                <div className="tags">
                  {g.specialization && <span className="tag">{g.specialization}</span>}
                  {typeof g.experienceYears === 'number' && <span className="tag">{g.experienceYears} yrs exp</span>}
                  {g.status && <span className="tag">{g.status}</span>}
                </div>

                <div className="facts">
                  {g.phone ? (
                    <div className="fact"><span className="k">Phone</span><span className="v"><a href={`tel:${g.phone}`}>{g.phone}</a></span></div>
                  ) : null}
                  {g.email ? (
                    <div className="fact"><span className="k">Email</span><span className="v"><a href={`mailto:${g.email}`}>{g.email}</a></span></div>
                  ) : null}
                  {g.languages?.length ? (
                    <div className="fact"><span className="k">Languages</span><span className="v">{g.languages.join(', ')}</span></div>
                  ) : null}
                  {g.licenseNo ? (<div className="fact"><span className="k">License</span><span className="v">{g.licenseNo}</span></div>) : null}
                  {g.address ? (<div className="fact"><span className="k">Address</span><span className="v">{g.address}</span></div>) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
        {loading && <div className="empty">Loading guides…</div>}
        {!loading && error && <div className="empty">{error}</div>}
        {!loading && !error && list.length === 0 && (
          <div className="empty">No guides found. Try a different name or language.</div>
        )}
      </section>
    </main>
  );
}
