# API Integration Guide

---

## Current Integrations

| Service            | Type                | Used In                                               | Config                           |
| ------------------ | ------------------- | ----------------------------------------------------- | -------------------------------- |
| Web3Forms          | Contact form POST   | `AContact.vue`                                        | `VITE_WEB3FORMS_KEY` env var     |
| Google Analytics 4 | Event tracking      | `main.ts` (init), `AbCard`, `AbTextModel`, `AContact` | `VITE_GA_MEASUREMENT_ID` env var |
| Google Fonts       | CSS font            | `index.html`                                          | Static `<link>`                  |
| unhead             | Head/SEO management | `App.vue`, `main.ts`                                  | via `createHead()`               |

---

## Environment Variables

All external API keys must be stored in `.env` at the project root.

```env
# .env (never commit this file)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_WEB3FORMS_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Rules:**

- All client-side env vars must be prefixed with `VITE_`
- Never hardcode an API key in a component
- Provide a `.env.example` with placeholder values for onboarding

---

## Adding a New External Integration

### Step 1: Add the env var

Add to `.env`:

```env
VITE_MY_SERVICE_KEY=your-key
```

Add placeholder to `.env.example`:

```env
VITE_MY_SERVICE_KEY=
```

### Step 2: Type the env var

Add to `src/env.d.ts`:

```ts
interface ImportMetaEnv {
  readonly VITE_GA_MEASUREMENT_ID: string;
  readonly VITE_WEB3FORMS_KEY: string;
  readonly VITE_MY_SERVICE_KEY: string; // ← add here
}
```

### Step 3: Create a composable wrapper

Never call an external API directly in a component. Create a composable:

```ts
// src/composables/useMyService.ts
export function useMyService() {
  async function callEndpoint(payload: MyPayload): Promise<MyResponse> {
    const res = await fetch("https://api.myservice.com/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: import.meta.env.VITE_MY_SERVICE_KEY,
        ...payload,
      }),
    });
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  }

  return { callEndpoint };
}
```

### Step 4: Use it in a component

```ts
// In a component <script setup>
import { useMyService } from "@/composables/useMyService";
const { callEndpoint } = useMyService();
```

### Step 5: Document the integration

Add a row to the integrations table at the top of this file.

---

## Web3Forms Integration (Contact Form)

**Endpoint:** `https://api.web3forms.com/submit`  
**Method:** POST  
**Auth:** `access_key` in request body (domain-restricted, safe to expose in client bundle)

**Payload:**

```json
{
  "access_key": "YOUR_KEY",
  "name": "...",
  "email": "...",
  "message": "..."
}
```

**Response:**

```json
{ "success": true }
// or
{ "success": false, "message": "Error description" }
```

**TODO:** Move `access_key` to `import.meta.env.VITE_WEB3FORMS_KEY` — currently hardcoded as placeholder.

---

## Google Analytics 4 Integration

Initialized in `main.ts`:

```ts
app.use(
  VueGtag,
  { config: { id: import.meta.env.VITE_GA_MEASUREMENT_ID } },
  router,
);
```

**Adding a new event:**

1. Add a new method to `src/composables/useAnalytics.ts`:

```ts
function trackNewEvent(label: string): void {
  event("my_event_name", {
    event_category: "category",
    event_label: label,
  });
}
```

2. Export it from `useAnalytics`
3. Call it in the relevant component

**Standard event naming:** `snake_case` verb-noun (e.g. `portfolio_card_click`, `hire_me_click`, `generate_lead`)

---

## SEO / Head Management

Managed via `unhead`. Two-step setup:

1. **`main.ts`** — installs the instance: `useMainHeadMeta(app)`
2. **`App.vue`** — sets global meta: `useGlobalHeadMeta(title, description, keywords)`

To update site title or description, edit the call in `App.vue`:

```ts
useGlobalHeadMeta(
  "Abanoub George — Front-End Developer & Vue.js Specialist",
  "Portfolio of Abanoub George...",
  "keywords, here",
);
```

To update the OG image, edit `SITE_URL` and `OG_IMAGE` in `src/composables/useHead/useGlobalHeadMeta.ts`.

> ⚠️ `OG_IMAGE` currently points to `/img/profile.png` — this path does not exist in `public/`. Update to a real image path.
