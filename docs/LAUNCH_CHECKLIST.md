# ConnectPi Support — Production Launch Checklist

This checklist contains all necessary steps and configuration values for the project owner to launch `https://support.connectpi.in` in production.

---

## 1. Hosting & Domain Setup (Vercel & DNS)

### Vercel Deployment
1. Import the Git repository into [Vercel](https://vercel.com).
2. Framework Preset: **Next.js** (auto-detected).
3. Root Directory: `./` (or `connectpi-support` if deploying from monorepo).
4. Build Command: `npm run build` (runs `build:search` + `next build`).
5. Output Directory: `.next`.

### DNS Configuration for `support.connectpi.in`
In your domain registrar / Cloudflare DNS settings for `connectpi.in`:
| Type | Name | Content / Target | Proxy Status |
|---|---|---|---|
| **CNAME** | `support` | `cname.vercel-dns.com.` | DNS only (or Proxied via Cloudflare) |

> [!NOTE]
> If proxying via Cloudflare, ensure SSL/TLS encryption mode is set to **Full (strict)**. Our rate limiting and logging code is preconfigured to read `cf-connecting-ip` to resolve client IPs accurately.

---

## 2. Resend Email Setup (Contact Ticket Delivery)

1. Create an account at [Resend](https://resend.com).
2. Navigate to **Domains** -> **Add Domain** -> `connectpi.in`.
3. Add the provided DNS verification records to your DNS provider:
   - **SPF:** `TXT` record `v=spf1 include:amazonses.com ~all`
   - **DKIM:** `CNAME` records provided by Resend
   - **DMARC:** `TXT` record `v=DMARC1; p=none;` at `_dmarc.connectpi.in`
4. Generate an API Key under **API Keys** with `Sending access`.
5. Verify that `SUPPORT_TO_EMAIL` receives mail forwarded to your support agents or ticketing system (e.g. `support@connectpi.in`).

---

## 3. Cloudflare Turnstile Bot Protection

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Turnstile**.
2. Click **Add Site**.
   - **Site Name:** ConnectPi Support
   - **Domain:** `support.connectpi.in` (and `localhost` for testing)
   - **Widget Mode:** Managed (recommended) or Non-interactive
3. Copy the **Site Key** and **Secret Key**.

---

## 4. Upstash Redis (Distributed Rate Limiting)

1. Sign up at [Upstash](https://upstash.com).
2. Create a new **Redis Database**:
   - **Name:** `connectpi-support-ratelimit`
   - **Region:** Closest to your users (e.g., `ap-south-1` Mumbai or `auto-replicated`)
   - **Eviction:** `volatile-lru`
3. In database details, copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## 5. Sentry Error Tracking

1. Log in to [Sentry.io](https://sentry.io).
2. Create a project: **Next.js**.
3. Copy the Client & Server DSN: `SENTRY_DSN`.

---

## 6. Privacy Analytics (Cookieless)

1. Choose a cookieless analytics provider:
   - **Plausible Analytics:** domain `support.connectpi.in`
   - or **Vercel Analytics:** 1-click enable in Vercel project settings
2. If using Plausible, set `NEXT_PUBLIC_ANALYTICS_ID=support.connectpi.in`.

---

## 7. Production Environment Variables (Copy & Paste for Vercel)

Add these in **Vercel Project Settings** -> **Environment Variables**:

```dotenv
# App & Canonical Domain
NEXT_PUBLIC_SITE_URL=https://support.connectpi.in
NODE_ENV=production
STRICT_CONTENT=false

# Contact Form & Resend Email Delivery
RESEND_API_KEY=re_your_live_resend_api_key_here
SUPPORT_FROM_EMAIL=ConnectPi Support <support@connectpi.in>
SUPPORT_TO_EMAIL=support@connectpi.in

# Cloudflare Turnstile Anti-Bot
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAx...site_key_here
TURNSTILE_SECRET_KEY=0x4AAAAAAAx...secret_key_here

# Upstash Redis Distributed Rate Limiting
UPSTASH_REDIS_REST_URL=https://your-db-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token_here

# Sentry Error Reporting (Optional)
SENTRY_DSN=https://your-dsn-hash@o0.ingest.sentry.io/0
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn-hash@o0.ingest.sentry.io/0

# Cookieless Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=support.connectpi.in
```

---

## 8. Content & Legal Finalization

1. **Review Placeholders:**
   Run `npm run audit:placeholders` to view all `[PLACEHOLDER: ...]` tags in `docs/PLACEHOLDER_AUDIT.md`. Replace them with final product text and screenshots.
2. **Set STRICT_CONTENT Flag:**
   Once all placeholders are replaced, change `STRICT_CONTENT=true` in Vercel environment variables so CI/CD fails if an unfinished draft or placeholder is accidentally published.
3. **Verify Legal Links:**
   Confirm that terms and privacy links in `content/site.json` match your company's official legal URLs (`https://connectpi.in/privacy`, etc.).

---

## 9. Post-Deploy Sanity Checks

- [ ] Visit `https://support.connectpi.in` and confirm 200 OK.
- [ ] Visit `https://support.connectpi.in/api/health` -> verify JSON status `ok`.
- [ ] Test Search: type `login` and confirm keyboard arrows and selection work.
- [ ] Submit a test ticket on `/contact` with valid inputs -> verify email arrives in `support@connectpi.in`.
- [ ] Rate limit test: submit contact form 5+ times from the same IP -> verify HTTP 429 is returned.
- [ ] Run `npm run test:e2e` against production URL to verify all device layouts (mobile, tablet, desktop).
