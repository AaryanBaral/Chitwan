**Overview**
- Backend for a government web app with REST APIs for admins, guides, hotels, flora/fauna, blogs, notices, photos, and videos.
- Supports file uploads (images/videos) via Multer; stores files locally and saves relative paths in DB.
- Uses MySQL via Sequelize. Env and DB connection: `Backend/Connection/database.js`.

**Runbook**
- Install: `npm install` (from repo root or `Backend` as needed)
- Migrate: `npx sequelize-cli db:migrate --config Backend/config/config.cjs`
- Start: `node Backend/server.js`

**Auth**
- Login: `POST /api/v1/admin/login` → returns JWT. Use `Authorization: Bearer <token>`.
- Note: Most resource endpoints are public by default unless wrapped with auth in routes.

**Conventions**
- Pagination: `page` (1+), `pageSize` (1–100). Response lists: `{ items, total, page, pageSize }`.
- Sorting: `sortBy`, `sortOrder` (ASC|DESC); each resource documents allowed columns.
- Dates: ISO 8601 strings (e.g., `2025-08-27T00:00:00Z`).
- Upload fields:
  - Single file: `single` (guides, blogs, notices, photos, videos)
  - Multiple files: `files` (hotels, flora/fauna)
- File paths returned are relative (e.g., `hotels/<filename>`). Base folder: `Backend/Backend/uploads`.

**Error Shape**
- 400 Validation: `{ message: "Validation error", details: [...] }`
- 404 Not Found: `{ message: "<Resource> not found" }`
- 409 Conflict (unique): `{ message: "... already exists" }`
- 500 Server: `{ message: "Failed to <action> <resource>" }`

**Admins**
- Create: `POST /api/v1/admin` (email, password, isSuperAdmin)
- List: `GET /api/v1/admin?page=&pageSize=&q=`
- Get: `GET /api/v1/admin/:id`
- Update: `PATCH /api/v1/admin/:id` (email, password, isSuperAdmin)
- Delete: `DELETE /api/v1/admin/:id`
- Login: `POST /api/v1/admin/login` → `{ token, tokenType, admin }`

**Guides**
- List: `GET /api/v1/guide`
  - Filters: `q, status, gender, experienceMin, experienceMax, languages, specialization, dobFrom, dobTo, createdFrom, createdTo, sortBy (created_at|updated_at|full_name|experience_years), sortOrder`
- Get: `GET /api/v1/guide/:id`
- Create: `POST /api/v1/guide` (multipart)
  - Body: per `Backend/Validations/guide.validation.js`
  - File: `single` (optional single image). Saved under `uploads/guides`.
- Update: `PATCH /api/v1/guide/:id` (multipart) — same body fields; `single` to replace image.
- Delete: `DELETE /api/v1/guide/:id`
- Response item shape: `{ id, fullName, gender, dob, citizenshipNo, licenseNo, phone, email, address, languages[], specialization, experienceYears, status, image: string|null, createdAt, updatedAt }`

**Hotels**
- List: `GET /api/v1/hotel`
  - Filters: `q, status, city, state, country, createdFrom, createdTo, sortBy (created_at|updated_at|name), sortOrder`
- Get: `GET /api/v1/hotel/:id`
- Create: `POST /api/v1/hotel` (multipart)
  - Body: per `Backend/Validations/hotel.validation.js` (contact fields, address, status)
  - Files: `files` (multiple images). Stored under `uploads/hotels` and rows in `hotel_images`.
- Update: `PATCH /api/v1/hotel/:id` (multipart)
  - Body: updatable fields; `imagesToRemove[]` with existing relative paths to delete
  - Files: `files` to append new images
- Delete: `DELETE /api/v1/hotel/:id`
- Response item: `{ id, name, description, address, city, state, country, zip, contactName, contactEmail, contactPhone, images: string[], status, createdAt, updatedAt }`

**Flora & Fauna**
- List: `GET /api/v1/flora-fauna`
  - Filters: `q, type (flora|fauna), status, habitat, location, createdFrom, createdTo, sortBy (created_at|updated_at|common_name), sortOrder`
- Get: `GET /api/v1/flora-fauna/:id`
- Create: `POST /api/v1/flora-fauna` (multipart)
  - Body: per `Backend/Validations/floraFauna.validation.js`
  - Files: `files` (multiple images) → `uploads/flora_fauna` and `flora_fauna_images`
- Update: `PATCH /api/v1/flora-fauna/:id` (multipart)
  - Body: fields; `imagesToRemove[]` to delete by relative path; `files` to add
- Delete: `DELETE /api/v1/flora-fauna/:id`
- Response item: `{ id, type, commonName, scientificName, description, habitat, location, conservationStatus, status, approved?: boolean, images: string[], createdAt, updatedAt }`

**Blogs**
- List (cards/minimal): `GET /api/v1/blog`
  - Filters: `page, pageSize, q, status (draft|published|archived), sortBy (created_at|published_at|title), sortOrder`
  - Item: `{ id, title, slug, summary, image, publishedAt, createdAt }`
- Get (full by id or slug): `GET /api/v1/blog/:idOrSlug`
  - Item: `{ id, title, slug, summary, content, image, tags[], status, publishedAt, createdAt, updatedAt }`
- Create: `POST /api/v1/blog` (multipart `single` for cover image)
- Update: `PATCH /api/v1/blog/:id` (multipart to replace image)
- Delete: `DELETE /api/v1/blog/:id`

**Notices**
- List (cards/minimal): `GET /api/v1/notice`
  - Defaults to `status=published` unless overridden
  - Filters: `q, status, isPopup, activeNow, createdFrom/To, displayFrom/To, tags, sortBy (created_at|display_from|priority|title), sortOrder`
  - Item: `{ id, title, summary, attachment, isPopup, priority, createdAt, displayFrom, displayTo }`
- Popups (eligible now): `GET /api/v1/notice/popups?limit=10`
  - Returns `published` and `isPopup=true` with current time within display window
- Get (full): `GET /api/v1/notice/:id`
  - Item: `{ id, title, summary, body, status, isPopup, displayFrom, displayTo, priority, linkUrl, attachment, tags[], createdAt, updatedAt }`
- Create: `POST /api/v1/notice` (multipart `single` for attachment)
- Update: `PATCH /api/v1/notice/:id` (multipart to replace attachment)
- Delete: `DELETE /api/v1/notice/:id`

**Photos**
- List (cards): `GET /api/v1/photo` with `q, status, tags, sortBy (created_at|published_at), sortOrder`
  - Item: `{ id, image, publishedAt, createdAt }`
- Get (full): `GET /api/v1/photo/:id`
  - Item: `{ id, description, image, tags[], status, publishedAt, createdAt, updatedAt }`
- Create: `POST /api/v1/photo` (multipart `single` required for image)
- Update: `PATCH /api/v1/photo/:id` (multipart to replace image)
- Delete: `DELETE /api/v1/photo/:id`

**Videos**
- List (cards): `GET /api/v1/video` with `q, status, tags, sortBy (created_at|published_at), sortOrder`
  - Item: `{ id, video, publishedAt, createdAt }`
- Get (full): `GET /api/v1/video/:id`
  - Item: `{ id, description, video, tags[], status, publishedAt, createdAt, updatedAt }`
- Create: `POST /api/v1/video` (multipart `single` required for video)
- Update: `PATCH /api/v1/video/:id` (multipart to replace video)
- Delete: `DELETE /api/v1/video/:id`

**Uploads**
- Stored under `Backend/Backend/uploads/`:
  - Guides: `guides/`
  - Hotels: `hotels/`
  - Flora/Fauna: `flora_fauna/`
  - Blogs: `blogs/`
  - Notices: `notices/`
  - Photos: `photos/`
  - Videos: `videos/`
- Only relative paths are returned. If you need static serving, add in `Backend/server.js`:
  `app.use('/uploads', express.static(path.join(process.cwd(), 'Backend', 'uploads')))`

**API Reference (JSON Only)**

Note: File uploads are shown as simple JSON placeholders for readability. In the actual API, files are sent via multipart form using the field `single` (one file) or `files` (multiple). Keys and non-file fields match the JSON shown below.

Admin — Login
```json
{
  "endpoint": "POST /api/v1/admin/login",
  "payload": {
    "email": "admin@example.com",
    "password": "Password123!"
  },
  "response": {
    "token": "<JWT>",
    "tokenType": "Bearer",
    "admin": {
      "id": "uuid",
      "email": "admin@example.com",
      "isSuperAdmin": true,
      "createdAt": "2025-08-27T12:00:00.000Z",
      "updatedAt": "2025-08-27T12:00:00.000Z"
    }
  }
}
```

Admins — List
```json
{
  "endpoint": "GET /api/v1/admin",
  "query": { "page": 1, "pageSize": 20, "q": "search" },
  "response": {
    "items": [
      { "id": "uuid", "email": "admin@example.com", "isSuperAdmin": true, "createdAt": "...", "updatedAt": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Admin — Create
```json
{
  "endpoint": "POST /api/v1/admin",
  "payload": {
    "email": "new.admin@example.com",
    "password": "Password123!",
    "isSuperAdmin": false
  },
  "response": {
    "id": "uuid",
    "email": "new.admin@example.com",
    "isSuperAdmin": false,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Admin — Update
```json
{
  "endpoint": "PATCH /api/v1/admin/:id",
  "payload": { "password": "NewPassword123!" },
  "response": {
    "id": "uuid",
    "email": "new.admin@example.com",
    "isSuperAdmin": false,
    "updatedAt": "..."
  }
}
```

Admin — Delete
```json
{
  "endpoint": "DELETE /api/v1/admin/:id",
  "response": { "message": "Admin deleted" }
}
```

Guides — List
```json
{
  "endpoint": "GET /api/v1/guide",
  "query": {
    "page": 1,
    "pageSize": 20,
    "q": "search",
    "status": "active",
    "gender": "male",
    "experienceMin": 0,
    "experienceMax": 10,
    "languages": "English,Nepali",
    "specialization": "Jungle Safari",
    "sortBy": "created_at",
    "sortOrder": "DESC"
  },
  "response": {
    "items": [
      {
        "id": "uuid",
        "fullName": "Ram Bahadur",
        "gender": "male",
        "dob": "1990-01-01",
        "citizenshipNo": "123-45-6789",
        "licenseNo": "LIC-0001",
        "phone": "9800000000",
        "email": "ram@example.com",
        "address": "Bharatpur",
        "languages": ["English", "Nepali"],
        "specialization": "Jungle Safari",
        "experienceYears": 5,
        "status": "active",
        "image": "guides/portrait.jpg",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Guide — Create (single image)
```json
{
  "endpoint": "POST /api/v1/guide",
  "payload": {
    "fullName": "Ram Bahadur",
    "gender": "male",
    "dob": "1990-01-01",
    "citizenshipNo": "123-45-6789",
    "licenseNo": "LIC-0001",
    "phone": "9800000000",
    "email": "ram@example.com",
    "address": "Bharatpur",
    "languages": ["English", "Nepali"],
    "specialization": "Jungle Safari",
    "experienceYears": 5,
    "status": "active",
    "single": "<file:guides/portrait.jpg>"
  },
  "response": {
    "id": "uuid",
    "fullName": "Ram Bahadur",
    "image": "guides/portrait.jpg",
    "status": "active",
    "createdAt": "..."
  }
}
```

Guide — Update (replace image)
```json
{
  "endpoint": "PATCH /api/v1/guide/:id",
  "payload": {
    "phone": "9811111111",
    "languages": ["English", "Hindi"],
    "single": "<file:guides/new.jpg>"
  },
  "response": {
    "id": "uuid",
    "phone": "9811111111",
    "image": "guides/new.jpg",
    "updatedAt": "..."
  }
}
```

Hotels — List
```json
{
  "endpoint": "GET /api/v1/hotel",
  "query": {
    "page": 1,
    "pageSize": 20,
    "q": "search",
    "status": "active",
    "city": "Chitwan",
    "state": "Bagmati",
    "country": "Nepal",
    "sortBy": "created_at",
    "sortOrder": "DESC"
  },
  "response": {
    "items": [
      {
        "id": "uuid",
        "name": "Grand Inn",
        "description": null,
        "address": null,
        "city": "Chitwan",
        "state": null,
        "country": null,
        "zip": null,
        "contactName": null,
        "contactEmail": "info@grandinn.test",
        "contactPhone": null,
        "images": ["hotels/a.jpg", "hotels/b.jpg"],
        "status": "active",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Hotel — Create (multiple images)
```json
{
  "endpoint": "POST /api/v1/hotel",
  "payload": {
    "name": "Grand Inn",
    "description": null,
    "address": null,
    "city": "Chitwan",
    "contactEmail": "info@grandinn.test",
    "status": "active",
    "files": ["<file:hotels/a.jpg>", "<file:hotels/b.jpg>"]
  },
  "response": {
    "id": "uuid",
    "name": "Grand Inn",
    "city": "Chitwan",
    "images": ["hotels/a.jpg", "hotels/b.jpg"],
    "status": "active",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Hotel — Update (remove + add images)
```json
{
  "endpoint": "PATCH /api/v1/hotel/:id",
  "payload": {
    "imagesToRemove": ["hotels/old.jpg"],
    "files": ["<file:hotels/new.jpg>"]
  },
  "response": {
    "id": "uuid",
    "images": ["hotels/new.jpg"],
    "updatedAt": "..."
  }
}
```

Flora/Fauna — List
```json
{
  "endpoint": "GET /api/v1/flora-fauna",
  "query": {
    "page": 1,
    "pageSize": 20,
    "q": "search",
    "type": "flora",
    "status": "active",
    "habitat": "Terai",
    "location": "Chitwan",
    "sortBy": "created_at",
    "sortOrder": "DESC"
  },
  "response": {
    "items": [
      {
        "id": "uuid",
        "type": "flora",
        "commonName": "Sal Tree",
        "scientificName": "Shorea robusta",
        "description": "Native to the subcontinent",
        "habitat": "Terai",
        "location": "Chitwan",
        "conservationStatus": "Least Concern",
        "images": ["flora_fauna/img1.jpg"],
        "status": "active",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Flora/Fauna — Create (multiple images)
```json
{
  "endpoint": "POST /api/v1/flora-fauna",
  "payload": {
    "type": "flora",
    "commonName": "Sal Tree",
    "scientificName": "Shorea robusta",
    "description": "Native to the subcontinent",
    "habitat": "Terai",
    "location": "Chitwan",
    "conservationStatus": "Least Concern",
    "status": "active",
    "files": ["<file:flora_fauna/img1.jpg>", "<file:flora_fauna/img2.jpg>"]
  },
  "response": {
    "id": "uuid",
    "type": "flora",
    "commonName": "Sal Tree",
    "images": ["flora_fauna/img1.jpg", "flora_fauna/img2.jpg"],
    "status": "active",
    "createdAt": "..."
  }
}
```

Flora/Fauna — Update (remove + add images)
```json
{
  "endpoint": "PATCH /api/v1/flora-fauna/:id",
  "payload": {
    "imagesToRemove": ["flora_fauna/old.jpg"],
    "files": ["<file:flora_fauna/new1.jpg>"]
  },
  "response": {
    "id": "uuid",
    "images": ["flora_fauna/new1.jpg"],
    "updatedAt": "..."
  }
}
```

Blogs — List (cards)
```json
{
  "endpoint": "GET /api/v1/blog",
  "query": { "page": 1, "pageSize": 20, "q": "search", "status": "published", "sortBy": "created_at", "sortOrder": "DESC" },
  "response": {
    "items": [
      { "id": "uuid", "title": "Welcome to Chitwan", "slug": "welcome-to-chitwan", "summary": "Short intro", "image": "blogs/cover.jpg", "publishedAt": "...", "createdAt": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Blog — Get (full by id or slug)
```json
{
  "endpoint": "GET /api/v1/blog/:idOrSlug",
  "response": {
    "id": "uuid",
    "title": "Welcome to Chitwan",
    "slug": "welcome-to-chitwan",
    "summary": "Short intro",
    "content": "Full content here",
    "image": "blogs/cover.jpg",
    "tags": ["travel", "park"],
    "status": "published",
    "publishedAt": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Blog — Create (single cover image)
```json
{
  "endpoint": "POST /api/v1/blog",
  "payload": {
    "title": "Welcome to Chitwan",
    "slug": "welcome-to-chitwan",
    "summary": "Short intro",
    "content": "Full content here",
    "tags": ["travel", "park"],
    "status": "draft",
    "single": "<file:blogs/cover.jpg>"
  },
  "response": {
    "id": "uuid",
    "title": "Welcome to Chitwan",
    "slug": "welcome-to-chitwan",
    "summary": "Short intro",
    "content": "Full content here",
    "image": "blogs/cover.jpg",
    "status": "draft",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Notices — List (cards)
```json
{
  "endpoint": "GET /api/v1/notice",
  "query": { "page": 1, "pageSize": 20, "q": "search", "status": "published", "isPopup": true, "sortBy": "display_from", "sortOrder": "DESC" },
  "response": {
    "items": [
      { "id": "uuid", "title": "Holiday Notice", "summary": "...", "attachment": "notices/notice.pdf", "isPopup": true, "priority": 10, "createdAt": "...", "displayFrom": "...", "displayTo": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Notice — Popups (eligible now)
```json
{
  "endpoint": "GET /api/v1/notice/popups?limit=5",
  "response": {
    "items": [
      { "id": "uuid", "title": "Holiday Notice", "summary": "...", "attachment": "notices/notice.pdf", "isPopup": true, "priority": 10, "createdAt": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 5
  }
}
```

Notice — Create (single attachment)
```json
{
  "endpoint": "POST /api/v1/notice",
  "payload": {
    "title": "Holiday Notice",
    "summary": "Office closed on public holiday",
    "body": "Full text...",
    "status": "published",
    "isPopup": true,
    "displayFrom": "2025-09-01T00:00:00Z",
    "displayTo": "2025-09-05T23:59:59Z",
    "priority": 10,
    "linkUrl": "https://example.gov.np/notice/holiday",
    "tags": ["holiday"],
    "single": "<file:notices/notice.pdf>"
  },
  "response": {
    "id": "uuid",
    "title": "Holiday Notice",
    "status": "published",
    "isPopup": true,
    "attachment": "notices/notice.pdf",
    "displayFrom": "2025-09-01T00:00:00.000Z",
    "displayTo": "2025-09-05T23:59:59.000Z"
  }
}
```

Photos — List (cards)
```json
{
  "endpoint": "GET /api/v1/photo",
  "query": { "page": 1, "pageSize": 20, "q": "search", "status": "published", "sortBy": "created_at", "sortOrder": "DESC" },
  "response": {
    "items": [
      { "id": "uuid", "image": "photos/photo.jpg", "publishedAt": "...", "createdAt": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Photo — Get (full)
```json
{
  "endpoint": "GET /api/v1/photo/:id",
  "response": {
    "id": "uuid",
    "description": "Sunrise over Narayani",
    "image": "photos/photo.jpg",
    "tags": ["sunrise"],
    "status": "published",
    "publishedAt": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Photo — Create (single image)
```json
{
  "endpoint": "POST /api/v1/photo",
  "payload": {
    "description": "Sunrise over Narayani",
    "status": "published",
    "single": "<file:photos/photo.jpg>"
  },
  "response": {
    "id": "uuid",
    "description": "Sunrise over Narayani",
    "image": "photos/photo.jpg",
    "status": "published",
    "createdAt": "..."
  }
}
```

Videos — List (cards)
```json
{
  "endpoint": "GET /api/v1/video",
  "query": { "page": 1, "pageSize": 20, "q": "search", "status": "published", "sortBy": "created_at", "sortOrder": "DESC" },
  "response": {
    "items": [
      { "id": "uuid", "video": "videos/video.mp4", "publishedAt": "...", "createdAt": "..." }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 20
  }
}
```

Video — Get (full)
```json
{
  "endpoint": "GET /api/v1/video/:id",
  "response": {
    "id": "uuid",
    "description": "Park highlights",
    "video": "videos/video.mp4",
    "tags": ["highlights"],
    "status": "published",
    "publishedAt": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Video — Create (single video)
```json
{
  "endpoint": "POST /api/v1/video",
  "payload": {
    "description": "Park highlights",
    "status": "published",
    "single": "<file:videos/video.mp4>"
  },
  "response": {
    "id": "uuid",
    "description": "Park highlights",
    "video": "videos/video.mp4",
    "status": "published",
    "createdAt": "..."
  }
}
```

**Files & Code Pointers**
- Server: `Backend/server.js`
- DB Connection: `Backend/Connection/database.js`
- Multer: `Backend/Middleware/Multer.js` (fields: `single` or `files`)
- Storage utils: `Backend/Utils/fileStorage.js` (images/videos)
- Routes: `Backend/Routes/*.route.js`
- Services: `Backend/Services/*.service.js`
- Repositories: `Backend/Repository/*.repository.js`
- Validations: `Backend/Validations/*.validation.js`
