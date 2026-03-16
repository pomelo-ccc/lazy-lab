# lazy-lab

Angular 21 + ng-zorro lazy-loading lab for dynamic component migration testing.

## What is included

- 5 route-level lazy pages (`/page-1` ... `/page-5`).
- 1 runtime pilot page (`/runtime-demo`) for `table -> toolbar -> p-button` lazy resolution.
- Each page exposes 3 dynamic component keys.
- `registerEagerComponent` eager registration compatibility.
- `registerNewComLazy` + `resolveComponent` stream-based lazy resolve.
- `resolveComponentSync` compatibility path + `ComponentNotPreloadedError`.
- Manual lazy manifest governance (`component-ids` + split manifests + startup validation).
- Minimal `type/core/render` runtime layering for id-driven component and event loading.
- Toolbar button events resolved from a lazy-loaded event module and its methods.
- `p-button` as the only public button entry, with internal type-based lazy loading for text/icon button files.
- Separate runtime modules for `table`, `toolbar`, `button`, and `events`.

## Key files

- Registry and APIs:
  - `src/app/core/decorator/dpp-new-event.ts`
- `src/app/core/decorator/new-com.loaders.ts`
- Runtime pilot:
  - `src/app/runtime/type/*`
  - `src/app/runtime/core/*`
  - `src/app/runtime/render/*`
  - `src/app/runtime/modules/table/*`
  - `src/app/runtime/modules/toolbar/*`
  - `src/app/runtime/modules/button/*`
  - `src/app/runtime/modules/events/*`
  - `src/app/pages/runtime-demo/runtime-demo.component.ts`
- Manual manifests:
  - `src/app/shared/component-ids.ts`
  - `src/app/core/decorator/manifests/*.manifest.ts`
- Bootstrap registration:
  - `src/app/core/decorator/component-bootstrap.ts`
- Dynamic test surface:
  - `src/app/shared/dynamic-playground/dynamic-playground.component.ts`
- Pages:
  - `src/app/pages/page-one/page-one.component.ts`
  - `src/app/pages/page-two/page-two.component.ts`
  - `src/app/pages/page-three/page-three.component.ts`
  - `src/app/pages/page-four/page-four.component.ts`
  - `src/app/pages/page-five/page-five.component.ts`

## Run

```bash
pnpm install
pnpm start
```

Open `http://127.0.0.1:4300` and switch between page routes.
Open `/runtime-demo` to see the simplified runtime prototype.

## How to test lazy behavior

1. Open browser devtools Network tab.
2. Navigate to any page (route chunk loads).
3. Click `流式解析` on one widget:
   - First click loads component chunk via dynamic import.
   - Repeated clicks hit cache.
4. Click `同步解析` on a lazy-only widget:
   - It fails with `ComponentNotPreloadedError` and migration guidance.
5. Click `同步加载预加载组件` in compat card:
   - It succeeds because `eager-health` is registered during bootstrap.

## Manual maintenance flow

1. Add new id in `src/app/shared/component-ids.ts`.
2. Add component label in `src/app/shared/component-labels.ts`.
3. Add loader entry in one business manifest under `src/app/core/decorator/manifests/`.
4. Optional: add bootstrap `registerEagerComponent(...)` when you need sync compatibility.

Startup validation will fail fast on:
- duplicate ids in manifests
- unknown ids not declared in `LAZY_COMPONENT_IDS`
- missing ids that are declared but not wired with a loader

## Tests

```bash
pnpm exec ng test --watch=false
```

Covered cases:

- eager decorator behavior
- lazy register without eager load
- concurrent resolve single loader call
- failure retry
- sync compatibility for lazy-only
- action-handle stream/sync integration
