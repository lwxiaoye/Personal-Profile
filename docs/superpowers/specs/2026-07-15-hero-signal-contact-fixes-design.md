# Hero Signal and Contact Alignment Fixes

## Scope

Apply three local corrections to the existing landing page without changing its visual system or unrelated content.

## Confirmed design

1. The cursor-following insight mask remains empty and decorative, with a `180–240px` diameter. It uses the site's own restrained proportions but restores a MiMo-inspired inverse treatment: the warm-white page becomes black inside the circle and the exact underlying hero text becomes white, with no additional copy inside the mask.
2. The execution signal no longer follows one independent full-loop animation. It follows only the currently highlighted red segment. Main-loop stages use the matching `runtimeSegments` path; Verify uses the Verify-to-Output path. Its `2.4s` duration matches the automatic stage cadence and restarts whenever the active stage changes.
3. Both contact actions occupy the full panel width and share the same three-column grid and border treatment. The button's user-agent border and intrinsic sizing are removed so the email and GitHub rows are symmetrical.
4. The stage reached by the red execution signal displays its original planet material instead of switching to a black fill. The numbered index remains readable; red remains exclusive to the active path and moving signal.
5. Active planet materials use the same scale and slow surface rotation as hover/focus. Reduced-motion keeps the material visible but stops the rotation.
6. The left hero uses a custom 28–32px hairline cursor ring with a 5–6px ink center dot. The large inverse circle follows the same pointer position but remains visually separate from the cursor.
7. When the page starts scrolling, the inverse circle stays fixed briefly while hero content moves beneath it, then scales down and fades before the hero exits. This reproduces MiMo's reveal principle without copying its layout or branding.

## Responsive and accessibility behavior

- The mask and custom cursor remain disabled by existing mobile rules.
- The execution signal remains hidden under `prefers-reduced-motion`.
- Reduced motion removes mask scaling/fading transitions and active-planet rotation.
- Contact actions retain their existing mobile stacked label/value layout and keyboard focus behavior.

## Verification

- Vitest assertions cover an empty/smaller inverse mask, custom cursor structure, scroll-progress state, active-segment signal path and cadence, rotating original-color active planets, and equal-width contact rows.
- Browser visual checks cover the hero hover and scroll states, star-map progression, contact symmetry, 1440px desktop, and 390px mobile.
