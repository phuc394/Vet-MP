# Reset Password Web

Standalone Vite app for the password reset link sent by AuthService.

## Vercel settings

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: `reset-password-web` if deploying from the monorepo root

## Environment variables

Set this in Vercel:

```env
VITE_API_BASE_URL=https://your-api-domain.example.com
```

Use the API gateway origin only, without `/api/v1` at the end. The app calls:

```txt
POST /api/v1/auth/reset-password
```

AuthService must also have `CLIENT_URL` set to this Vercel app URL so email links point here:

```env
CLIENT_URL=https://reset-password-web-livid.vercel.app
```

## Local run

```bash
npm install
npm run dev
```
