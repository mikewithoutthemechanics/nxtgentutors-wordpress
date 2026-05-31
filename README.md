# NextGen Tutors Frontend

Next.js frontend for the NextGen Tutors platform.

## Getting Started

1. Create `.env.local` from `.env.local.example`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open `http://localhost:3000`

## Deployment

```bash
vercel link
vercel deploy --prod
```

## WordPress REST Backend

1. Install WordPress with Amelia and FluentCRM.
2. Upload `wp-plugin/nextgen-tutors-api.php` to `wp-content/plugins/nextgen-tutors-api/`.
3. Activate **NextGen Tutors API** in WordPress.
4. Set `NEXT_PUBLIC_WORDPRESS_API_URL` in `.env.local` to your WordPress REST root, e.g.:
   `https://your-wordpress-site.com/wp-json/ngt/v1`
5. Rebuild/redeploy the Next.js app.

API routes used:
- `GET /stats`
- `GET /tutors/search?subject=...`
- `GET /tutors/:id`
- `POST /auth/login`
- `POST /auth/register`
- `GET /dashboard?role=student|tutor|admin`
