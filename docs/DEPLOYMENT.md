# Make My Yatra Deployment Guide

## Backend

Use the backend Dockerfile:

```bash
docker build -f server/Dockerfile -t make-my-yatra-api .
docker run --env-file .env -p 2345:2345 make-my-yatra-api
```

For local services:

```bash
docker compose up --build
```

## Render or Railway

1. Create a Node service from this repository.
2. Build command: `npm ci --omit=dev`
3. Start command: `node server/index.js`
4. Add the environment variables from `.env.example`.
5. Use MongoDB Atlas for `MONGO_URI`.
6. Use a managed Redis provider for `REDIS_URL` when enabling cache/jobs.

## Frontend

Deploy the React app to Vercel or any static host:

```bash
npm run build
```

Set:

```env
REACT_APP_API_BASE_URL=https://your-api.example.com
REACT_APP_AUTH_API_BASE_URL=https://your-api.example.com
REACT_APP_RAZORPAY_KEY_ID=rzp_live_or_test_public_key
```

## MongoDB Atlas

1. Create a cluster.
2. Add a database user.
3. Allow your backend host IP or private networking.
4. Set `MONGO_URI`.

## Redis

Use Upstash, Redis Cloud, Render Redis, Railway Redis, or another managed Redis provider.

```env
REDIS_ENABLED=true
JOBS_ENABLED=true
REDIS_URL=redis://...
```

## Brevo

1. Create a Brevo API key.
2. Verify your sender domain/email.
3. Set `EMAIL_PROVIDER=brevo`, `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and `BREVO_SENDER_NAME`.

## Razorpay

1. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to backend env.
2. Add only `REACT_APP_RAZORPAY_KEY_ID` to frontend env.
3. Create a webhook pointing to `/api/v1/payments/webhook`.
4. Set `RAZORPAY_WEBHOOK_SECRET`.

## Health Checks

Use:

```text
/api/v1/health
/api/v1/health/db
/api/v1/health/email
/api/v1/health/payment
/api/v1/health/redis
/api/v1/health/metrics
```
