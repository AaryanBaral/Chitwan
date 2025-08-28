import fs from "fs";
import path from "path";

// Save uploaded files locally. Returns array of relative file paths.
// Using a separate util allows swapping storage backend in future.
export function saveImagesLocally(files = [], subDir = "") {
  const uploadRoot = path.join(process.cwd(), "Backend", "uploads");
  const targetDir = path.join(uploadRoot, subDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const saved = [];
  for (const file of files) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filepath = path.join(targetDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    saved.push(path.join(subDir, filename).replace(/\\/g, "/"));
  }
  return saved;
}

// Save uploaded videos locally. Returns array of relative file paths.
// Kept separate from images to allow different handling later (e.g., cloud bucket/presets).
export function saveVideosLocally(files = [], subDir = "") {
  const uploadRoot = path.join(process.cwd(), "Backend", "uploads");
  const targetDir = path.join(uploadRoot, subDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const saved = [];
  for (const file of files) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filepath = path.join(targetDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    saved.push(path.join(subDir, filename).replace(/\\/g, "/"));
  }
  return saved;
}
