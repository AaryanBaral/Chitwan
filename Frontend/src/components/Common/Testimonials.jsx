import { useEffect, useRef, useState, useId } from "react";
import { motion, useAnimation } from "framer-motion";
import "../../styles/Testimonials.css";
export default function Testimonials({
  items = [],
  autoplay = false,
  loop = true,
  interval = 5000,
  ariaLabel = "Testimonials",
}) {
  const [center, setCenter] = useState(0);
  const [dir, setDir] = useState(0); // -1 right, 1 left
  const [cardWidth, setCardWidth] = useState(0);
  const [fixedHeight, setFixedHeight] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(true);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const liveRef = useRef(null);
  const regionId = useId();
  const controls = useAnimation();
  const initialsOf = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  // measure width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setCardWidth(containerRef.current.offsetWidth / 3);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  // announce active slide
  useEffect(() => {
    const item = items[center];
    if (item && liveRef.current) {
      const roleCompany = [item.role, item.company].filter(Boolean).join(", ");
      liveRef.current.textContent = `${item.name} — ${roleCompany}`;
    }
  }, [center, items]);
  const slideDuration = 0.45; // seconds
  const detailsFade = 0.5; // seconds
  const detailsAppearDelay = 100; // ms delay to let new center mount before showing
  const move = (d) => {
    if (items.length <= 1) return;
    if (dir !== 0) return; // ignore while animating
    if (!detailsVisible) return; // waiting for details to hide
    // hide details first to avoid overlap, then slide
    setDetailsVisible(false);
    setTimeout(() => setDir(d), detailsFade * 1000);
  };
  const goNext = () => move(1); // right arrow
  const goPrev = () => move(-1); // left arrow
  // autoplay
  useEffect(() => {
    if (!autoplay || isPaused || items.length <= 1) return;
    const id = setInterval(goNext, interval);
    return () => clearInterval(id);
  }, [autoplay, isPaused, items.length, interval]);
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  };
  const handlePause = () => setPaused(true);
  const handleResume = () => setPaused(false);
  const get = (i) => items[(i + items.length) % items.length] || {};
  const buffer = [
    get(center - 2),
    get(center - 1),
    get(center),
    get(center + 1),
    get(center + 2),
  ];
  const showArrows = loop && items.length > 1;

  // run slide animation using a single track to avoid duplication/overlap
  useEffect(() => {
    if (dir === 0 || cardWidth === 0) return;
    let cancelled = false;
    let timer;
    (async () => {
      await controls.start({ x: -cardWidth - dir * cardWidth, transition: { duration: slideDuration, ease: "easeInOut" } });
      if (cancelled) return;
      setCenter((c) => (c + dir + items.length) % items.length);
      // instantly reset position without animation
      controls.set({ x: -cardWidth });
      setDir(0);
      // show details for the new center after a brief delay so the new
      // center mounts with hidden state and can animate upward smoothly
      timer = setTimeout(() => !cancelled && setDetailsVisible(true), detailsAppearDelay);
    })();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [dir, cardWidth, items.length, controls]);

  // failsafe: ensure details become visible shortly after center updates
  useEffect(() => {
    if (dir !== 0) return; // wait until slide completes
    const t = setTimeout(() => setDetailsVisible(true), detailsAppearDelay);
    return () => clearTimeout(t);
  }, [center, dir]);

  // keep base offset centered on the middle card whenever width changes
  useEffect(() => {
    if (cardWidth > 0 && dir === 0) {
      controls.set({ x: -cardWidth });
    }
  }, [cardWidth, dir, controls]);

  // lock container height to the tallest seen center card (prevents jump/shrink)
  useEffect(() => {
    const measureHeight = () => {
      const centerEl = cardsRef.current?.[2];
      if (!centerEl) return;
      const next = centerEl.scrollHeight || centerEl.offsetHeight || 0;
      if (!next) return;
      setFixedHeight((prev) => (prev === 0 ? next : Math.max(prev, next)));
    };
    // measure after render/resize/center change
    measureHeight();
    const ro = new ResizeObserver(measureHeight);
    const centerEl = cardsRef.current?.[2];
    if (centerEl) ro.observe(centerEl);
    return () => ro.disconnect();
  }, [center, cardWidth]);
  return (
    <section
      id={regionId}
      ref={containerRef}
      className="tc-window"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      onFocus={handlePause}
      onBlur={handleResume}
      style={{ "--cardW": cardWidth + "px", "--fixedH": fixedHeight ? fixedHeight + "px" : undefined }}
    >
      <motion.div className="tc-track" animate={controls} initial={{ x: -cardWidth }}>
        <div className="tc-row">
          {buffer.map((item, i) => (
            <div
              className={`tc-card ${i === 2 ? "is-center" : ""}`}
              key={`${regionId}-${i}-${item.id || item.name}`}
              ref={(el) => (cardsRef.current[i] = el)}
            >
              <motion.div
                className="tc-head"
                initial={{ y: i === 2 ? (detailsVisible ? -10 : 10) : (detailsVisible ? 0 : 6) }}
                animate={i === 2 ? (detailsVisible ? { y: -10 } : { y: 10 }) : (detailsVisible ? { y: 0 } : { y: 6 }) }
                transition={{ duration: detailsFade, ease: "easeInOut" }}
              >
                {item.imageUrl ? (
                  <img
                    className="tc-avatar"
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="tc-avatar fallback" aria-hidden="true">
                    {initialsOf(item.name)}
                  </div>
                )}
                <div className="tc-name">{item.name}</div>
              </motion.div>
              {i === 2 && (
                <motion.div
                  className="tc-details"
                  initial={detailsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                  animate={detailsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: detailsFade, ease: "easeOut" }}
                >
                  {(item.role || item.company) && (
                    <div className="tc-role">
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </div>
                  )}
                  {item.text && <p className="tc-text">{item.text}</p>}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
      {showArrows && (
        <>
          <button
            className="tc-nav left"
            onClick={goPrev}
            disabled={dir !== 0}
            aria-label="Previous testimonial"
            aria-controls={regionId}
          >
            ‹
          </button>
          <button
            className="tc-nav right"
            onClick={goNext}
            disabled={dir !== 0}
            aria-label="Next testimonial"
            aria-controls={regionId}
          >
            ›
          </button>
        </>
      )}
      <span ref={liveRef} className="visually-hidden" aria-live="polite" />
    </section>
  );
}
