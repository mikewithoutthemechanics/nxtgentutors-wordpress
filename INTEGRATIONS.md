# NextGen Tutors Integrations

This document covers integrating the WordPress plugin with Amelia and FluentCRM.

## 1. WordPress Setup

1. Install WordPress (recommended: Ubuntu 22.04 + Nginx/Apache).
2. Install required plugins:
   - **Amelia** (Lite or Enterprise) — bookings/scheduling
   - **FluentCRM** — CRM + email automation
   - **NextGen Tutors API** — from this repo: `wp-plugin/nextgen-tutors-api.php`
3. Activate all three plugins.
4. Confirm plugin is active by visiting:
   `https://your-site.com/wp-json/ngt/v1/stats`

## 2. NextGen Tutors API Endpoints

All endpoints live under `/wp-json/ngt/v1`.

- `GET /stats`
- `GET /tutors/search?subject=...`
- `GET /tutors/:id`
- `POST /auth/login`
- `POST /auth/register`
- `GET /dashboard?role=student|tutor|admin`

Set `NEXT_PUBLIC_WORDPRESS_API_URL` in your Next.js env to the base:
`https://your-site.com/wp-json/ngt/v1`

## 3. Amelia + FluentCRM Credit Gate (Key Integration)

The WordPress plugin must verify credits before Amelia allows a booking.

Required data:
- Each FluentCRM contact has custom field `credits_remaining`
- Each Amelia service encodes its credit cost at the end of its name:
  - `Grade 10 Mathematics — 1 credit`
  - `University Calculus — 2 credits`

Flow:
1. Customer attempts booking in Amelia.
2. Hook into Amelia pre-booking validation.
3. Look up contact by email in FluentCRM.
4. Compare `credits_remaining` against service credit cost.
5. If insufficient: block booking and return error.
6. If sufficient: allow booking and decrement `credits_remaining`.
7. If booking fails later: refund credits.

Optional hooks for subscriptions:
- `ngt_subscription_activated`
- `ngt_subscription_renewed`
- `ngt_subscription_cancelled`

These should set/update:
- `credits_remaining`
- `credits_expiry`
- `plan_name`

## 4. Tutor Verification & Dashboards

Use WordPress user roles to control access:
- `student`
- `tutor`
- `administrator`

Amelia providers map to tutors. FluentCRM tags/lists map to student segments.

## 5. Payments (PayFast / Stripe)

- Use WooCommerce + PayFast or Stripe plugin.
- `POST /api/checkout` and related payment routes in Next.js should call
  `NEXT_PUBLIC_WORDPRESS_API_URL` once payment webhooks are implemented on WP side.
- Store orders as custom post type or WooCommerce orders.

## 6. Email Notifications

FluentCRM handles all outbound email:
- Welcome series
- Session reminders
- Rating requests
- Payout summaries

Use FluentCRM REST or built-in automation to trigger after WordPress events.

## 7. Testing Checklist

- [ ] `GET /wp-json/ngt/v1/stats` returns JSON
- [ ] `POST /wp-json/ngt/v1/auth/register` creates WordPress user
- [ ] `POST /wp-json/ngt/v1/auth/login` returns user + role
- [ ] Tutor search returns filtered results by subject
- [ ] Amelia booking is blocked when `credits_remaining < cost`
- [ ] Successful booking decrements `credits_remaining`
- [ ] Failed booking refunds `credits_remaining`
- [ ] FluentCRM contact updates on registration/booking
- [ ] Email campaigns trigger on key events

## 8. Production Checklist

- [ ] WordPress HTTPS enforced
- [ ] WordPress salts strong/unique
- [ ] Amelia + FluentCRM configured with real data
- [ ] `NEXT_PUBLIC_WORDPRESS_API_URL` set in Vercel env
- [ ] Vercel project redeployed after env change
- [ ] Error logs monitored for REST 4xx/5xx spikes
