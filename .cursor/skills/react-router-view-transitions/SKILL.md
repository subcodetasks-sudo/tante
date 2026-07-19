---
name: react-router-view-transitions
description: >-
  Requires viewTransition={true} on every React Router Link/NavLink and keeps
  header/nav outside the page view transition via layout Outlet + CSS
  view-transition-name. Use when adding or editing routes, links, navigation,
  headers, layouts, or view transitions in this React Router app.
---

# React Router view transitions

## Rules

1. **Every** `Link` and `NavLink` must set `viewTransition={true}`.
2. Never use plain `<a href>` for in-app routes when a React Router link exists.
3. Keep header/nav **out of the page transition** — shared chrome must not cross-fade with route content.

## Link pattern

```tsx
import { Link, NavLink } from 'react-router-dom'

<Link to="/menu" viewTransition={true}>Menu</Link>

<NavLink to="/" viewTransition={true} end>
  Home
</NavLink>
```

Also pass `viewTransition: true` when navigating imperatively:

```tsx
navigate('/menu', { viewTransition: true })
```

## Separate header/nav from the transition

### 1. Root layout with Outlet

Put header/nav in a layout route. Only `<Outlet />` swaps page content:

```tsx
// src/layout/RootLayout.tsx
import { Outlet } from 'react-router-dom'
import { SiteHeader } from '@/components/SiteHeader'

export default function RootLayout() {
  return (
    <>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
    </>
  )
}
```

```tsx
// src/router/index.tsx
createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'menu', element: <MenuPage /> },
    ],
  },
])
```

Do **not** duplicate the header inside each page.

### 2. CSS: name the chrome so it stays put

Give the header/nav a stable `view-transition-name` so the browser treats it as shared UI and it does not participate in the default root cross-fade:

```css
/* e.g. in src/index.css */
.site-header {
  view-transition-name: site-header;
}

/* Optional: animate only page content, not the named header */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}
```

Use one unique name per persistent chrome element (`site-header`, `site-nav`, etc.). Do not put `view-transition-name` on elements that should fully morph away with the page.

### 3. Checklist when touching navigation

- [ ] All `Link` / `NavLink` use `viewTransition={true}`
- [ ] Imperative `navigate(...)` uses `{ viewTransition: true }` when applicable
- [ ] Header/nav lives in a layout outside `<Outlet />`
- [ ] Header/nav has a stable `view-transition-name` in CSS
- [ ] Pages render only page content (no repeated site header)
