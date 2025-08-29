export function toSlug(input = "") {
  const str = String(input || "").trim().toLowerCase();
  if (!str) return "";
  // Remove accents/diacritics
  const withoutMarks = str.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  // Replace non-alphanumeric with dashes
  let slug = withoutMarks.replace(/[^a-z0-9]+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
  return slug;
}

export async function buildUniqueSlug(base, existsFn, { maxLength = 200, excludeId } = {}) {
  let core = (base || "").slice(0, maxLength).replace(/-+$/g, "");
  if (!core) core = "item";
  let candidate = core;
  let n = 1;
  // If excludeId is used, existsFn should ignore that id
  while (await existsFn(candidate, excludeId)) {
    n += 1;
    const suffix = `-${n}`;
    const maxCore = maxLength - suffix.length;
    candidate = `${core.slice(0, Math.max(1, maxCore))}${suffix}`;
  }
  return candidate;
}

