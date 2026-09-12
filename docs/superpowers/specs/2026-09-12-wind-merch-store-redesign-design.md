# windMerchStore Redesign Design

## Goal

Transform the single-page merch storefront into a polished, responsive, accessible static shopping experience while preserving the existing brand name and primary navigation labels.

## Design read

Reading this as a playful merchandise storefront for design-conscious shoppers, using a contemporary editorial retail aesthetic with a raspberry accent, near-black ink, and cool off-white surfaces.

## Scope

The refactor replaces the template-like visual layout and duplicated markup with a focused storefront. It retains the `index.html` route, the `windMerchStore` wordmark, and the Home, Store, and Contact navigation labels. It does not add a checkout backend, analytics, external UI framework, or a build step.

## Current-state audit

### Brand and content

- Existing brand: `windMerchStore`, pink accent, bold sans-serif wordmark.
- Existing content: hero, video showcase, generic collection cards, product grid, footer, newsletter.
- Current brand assets and content are mostly placeholders, including repeated product names and imagery, dummy contact information, and an unrelated stock video.

### Interaction and accessibility

- Desktop navigation uses nested `nav` elements and hover-only store navigation.
- The mobile menu and submenu use visual symbols without accessible expanded state.
- Cart actions do not expose cart quantity or feedback.
- The carousel indicator update queries broad layout classes, so unrelated buttons can be overwritten.
- Newsletter input has no associated label or client-side feedback.

### Visual and technical debt

- The hero is a large pink-purple gradient without a product visual.
- Repeated equal-sized cards, placeholder images, heavy shadows, and entrance animations obscure hierarchy.
- Tailwind's full CDN compiler is checked into the repository and runs in the browser, which is not appropriate for production.
- Custom styles are effectively unused, while behavior is embedded in the page.

## Chosen experience

### Visual system

- Theme: light only, using cool off-white surfaces, ink text, muted gray borders, and a consistent raspberry accent.
- Typography: system sans-serif stack for fast loading, with fluid display sizing and tight but legible headings.
- Shape system: 16px rounded content surfaces and fully rounded interactive controls.
- Design dials: `DESIGN_VARIANCE: 6`, `MOTION_INTENSITY: 3`, `VISUAL_DENSITY: 4`.
- Images: product-specific remote photography sourced from stable `picsum.photos` seeds, with descriptive alt text and explicit aspect ratios.

### Page structure

1. Sticky header with accessible desktop and mobile navigation, a labeled cart button, and controlled store menu.
2. Asymmetric hero with concise value proposition, clear primary action, and a real product image.
3. Curated categories shown as an asymmetric three-item editorial grid.
4. Featured products rendered from one JavaScript product array, each with price and add-to-cart action.
5. Value proposition section that replaces generic cards with a concise visual list.
6. Newsletter section with labeled email input and inline success or validation feedback.
7. Compact footer with real-purpose links and no dummy personal information.

### Interactions

- Header navigation links scroll to stable section IDs on the same page.
- Store menus use buttons with `aria-expanded` and close with Escape or outside clicks.
- Mobile navigation is keyboard accessible and closes after a navigation selection.
- Product actions increment the cart counter and announce the update through an `aria-live` region.
- Newsletter validates the supplied email address and displays inline feedback without submitting data.
- Motion is limited to hover, focus, and transform/opacity transitions. A reduced-motion media query disables transitions.

## Code architecture

- `index.html`: semantic page skeleton, accessible controls, templates, and section IDs.
- `assets/css/style.css`: semantic design tokens, layout, responsive rules, focus states, and reduced-motion behavior.
- `assets/js/app.js`: product data plus isolated menu, cart, and newsletter behavior.
- Remove the local Tailwind runtime and Animate.css from the page. No production dependency remains.

## Constraints

- Keep `index.html`, the root route, the `windMerchStore` name, and the Home, Store, Contact labels.
- Use no external JavaScript libraries and no inline event handlers.
- Do not use em-dash characters in page copy.
- All controls must have visible focus styles, valid accessible names, and a keyboard-operable path.
- Every multi-column section must collapse to a single column below 768px.
- Reserve image dimensions or aspect ratios to prevent layout shift.

## Testing and verification

- Automated static-page tests will assert page structure, required section IDs, labels, accessible names, and no inline event handlers.
- Automated JavaScript tests will cover email validation, cart counter updates, menu state, and Escape-key closure.
- Run HTML validation and inspect the page at desktop and 390px mobile widths.
- Confirm the final page has no console errors and that keyboard navigation exposes every interaction.
