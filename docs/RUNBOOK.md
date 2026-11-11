# ConnectPi Support Operations & Incident Runbook

This runbook guides operators on maintaining `support.connectpi.in`, troubleshooting issues, and responding to production incidents.

---

## 1. Quick Reference & Endpoints

| Resource | Value / Endpoint |
|---|---|
| **Production Domain** | `https://support.connectpi.in` |
| **Health Check API** | `GET https://support.connectpi.in/api/health` |
| **Hosting Platform** | Vercel (Edge & Node.js Runtime) |
| **Email Delivery** | Resend (`support@connectpi.in`) |
| **Bot Protection** | Cloudflare Turnstile |
| **Rate Limiter** | Upstash Redis (Fallback: In-memory LRU) |
| **Error Monitoring** | Sentry (`NEXT_PUBLIC_SENTRY_DSN`) |

---

## 2. Severity Classification & Triage

| Severity | Definition | Response Target | Example |
|---|---|---|---|
| **P1 - Critical** | Entire site down or returning 500 across all routes | < 15 minutes | DNS failure, bad build deployment |
| **P2 - Major** | Contact form failing, search returning 500, or bot attack | < 1 hour | Resend API failure, Turnstile lockout |
| **P3 - Minor** | Content typo, broken link, minor styling glitch | Next business day | MDX broken anchor, outdated screenshot |

---

## 3. Incident Scenarios & Remediation

### Scenario A: Contact Form Returns 502 / Provider Down
- **Symptom:** User submits contact form and sees: *"Our support ticketing service is temporarily unavailable..."*
- **Root Cause:** Resend API key expired, domain unverified, or Resend outage.
- **Triage Steps:**
  1. Check Vercel runtime logs for `[Contact API] Delivery failed:`.
  2. Verify `RESEND_API_KEY` in Vercel Project Settings -> Environment Variables.
  3. Verify DNS records (SPF, DKIM, DMARC) for `connectpi.in` in Resend dashboard.
  4. The API is programmed to gracefully return HTTP 502 with direct mailto fallback link to `support@connectpi.in` so users are never blocked.

### Scenario B: Legitimate Users Getting 429 "Too Many Requests"
- **Symptom:** Users report rate limit errors when attempting to submit feedback or contact forms.
- **Root Cause:** IP proxy misconfiguration or rate limit threshold exceeded.
- **Verification:**
  - Our system resolves IP via `lib/support/ip.ts`, checking `cf-connecting-ip` first, then `x-real-ip`, then `x-forwarded-for`.
  - Rate limit is 5 submissions per hour per client IP.
- **Remediation:**
  1. Check Upstash Redis keys: `contact:ratelimit:<ip>` and `feedback:ratelimit:<ip>`.
  2. To clear a temporary block on a specific IP in Upstash Redis CLI:
     ```redis
     DEL contact:ratelimit:<masked_ip>
     ```
  3. If Upstash is unreachable, the system automatically falls back to an in-memory cache, keeping the service alive.

### Scenario C: Cloudflare Turnstile Challenge Fails
- **Symptom:** Form shows Turnstile challenge error or validation returns 400.
- **Remediation:**
  1. Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` match in Vercel environment variables.
  2. In Cloudflare Dashboard -> Turnstile, ensure `support.connectpi.in` is in the list of allowed domains.
  3. In development environments (`NODE_ENV === "development"`), Turnstile verification is automatically mocked.

---

## 4. Rollback Procedures

### Instant Vercel Rollback:
1. Open the [Vercel Dashboard](https://vercel.com).
2. Navigate to the `connectpi-support` project.
3. Go to **Deployments**.
4. Locate the last known good deployment.
5. Click **...** -> **Instant Rollback**.
6. Deployment activates within seconds.

### Git Revert:
```bash
git log --oneline -n 5
git revert <faulty-commit-sha>
git push origin main
```

---

## 5. Routine Maintenance

### Updating or Adding Content
```bash
# 1. Edit or add MDX file in content/en/<product>/<category>/
# 2. Validate content schemas
npm run validate:content

# 3. Check internal links
npm run check:links

# 4. Rebuild static search index
npm run build:search

# 5. Commit and push to trigger Vercel deployment
git commit -m "docs(content): update account recovery guide"
git push origin main
```

### Rotating Secrets
When rotating `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, or `UPSTASH_REDIS_REST_TOKEN`:
1. Add the new value in Vercel Dashboard -> Environment Variables.
2. Trigger a redeploy:
   ```bash
   vercel --prod
   ```
3. Test `/api/health` and submit a test contact inquiry to verify.
