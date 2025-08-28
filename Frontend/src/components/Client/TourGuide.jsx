import React, { useMemo, useState } from "react";
import "../../styles/TourGuide.css";

const GUIDES = [
  { id: 1, name: "Ramesh Thapa", languages: ["English", "Nepali"], photo: "/guides/ramesh.jpg", phone: "+9779801234567", email: "ramesh.guide@example.com" },
  { id: 2, name: "Sita Gurung",  languages: ["English"],             photo: "/guides/sita.jpg",   phone: "+9779812345678", email: "sita.gurung@example.com" },
  { id: 3, name: "Hari Chaudhary",languages: ["Nepali"],             photo: "/guides/hari.jpg",   phone: "+9779841111111", email: "hari.c@example.com" },
  { id: 4, name: "Mina Lama",     languages: ["English","Nepali"],   photo: "/guides/mina.jpg",   phone: "+9779852020202", email: "mina.lama@example.com" },
];

export default function TourGuides() {
  const [query, setQuery]   = useState("");
  const [langs, setLangs]   = useState([]); // ["English","Nepali"]

  const toggleLang = (lang) =>
    setLangs((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = [...GUIDES];
    if (q) out = out.filter((g) => g.name.toLowerCase().includes(q));
    if (langs.length) out = out.filter((g) => g.languages.some((L) => langs.includes(L)));
    return out;
  }, [query, langs]);

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
                  src={g.photo || "/guides/placeholder.jpg"}
                  alt={g.name}
                  onError={(e) => { e.currentTarget.src = "/guides/placeholder.jpg"; }}
                  loading="lazy"
                />
              </div>

              <div className="card__body">
                <h3 className="card__title">{g.name}</h3>

                <button className="card__cta" type="button">view guide...</button>

                <div className="card__info">
                  <div className="card__row"><strong>Language :</strong> {g.languages.join(", ")}</div>

                  <div className="card__actions">
                    <a className="btn btn--ghost" href={`tel:${g.phone}`}>Call</a>
                    <a className="btn btn--ghost" href={`mailto:${g.email}`}>Email</a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <div className="empty">No guides found. Try a different name or language.</div>
        )}
      </section>
    </main>
  );
}

