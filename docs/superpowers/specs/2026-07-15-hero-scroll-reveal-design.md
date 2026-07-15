# Hero Pointer Cleanup and Section Reveal Design

## Scope

Correct the hero pointer behavior and add restrained entry transitions to the modules below the hero. Preserve the existing layout, content, star map, navigation, colors, typography, and responsive structure.

## Confirmed behavior

### Hero pointer feedback

- Remove the custom small ring-and-dot cursor completely.
- Keep the large inverse circle as the only pointer feedback.
- Show the inverse circle only while a fine pointer is inside the desktop left hero copy area and the page is at the hero start.
- Hide the inverse circle immediately when scrolling begins, when the pointer leaves the hero copy area, or when the pointer moves outside that area.
- Do not persist, shrink, fade, or restore the inverse circle during page scrolling.
- Keep the inverse circle disabled on mobile and coarse-pointer devices.

### Section reveal

- Apply a one-time reveal to Projects, About, Skills, Experience, and Contact.
- Use `IntersectionObserver` so each module becomes visible when it approaches the viewport.
- The reveal uses only a small upward translation and opacity transition. It introduces no scale, blur, rotation, or staggered child animation.
- Once revealed, a module remains visible and is unobserved.
- If `IntersectionObserver` is unavailable, modules remain visible rather than becoming inaccessible.
- Under `prefers-reduced-motion: reduce`, modules render immediately with no transition or displacement.

## Architecture

- Remove the cursor ref, cursor DOM, cursor position updates, and cursor CSS from `App.jsx` and `styles.css`.
- Remove the scroll-progress state and the scroll behavior that re-shows the inverse circle.
- Add one mount effect that decorates the existing `.section` and `.contact` elements with reveal classes, observes them, and cleans up the observer on unmount.
- Keep this behavior local to the existing page component; do not create a library, dependency, route, or new visual component.

## Testing

- Regression test: no ring-dot cursor is rendered or styled.
- Regression test: scrolling hides the inverse circle and never reopens it.
- Behavior test: observed modules receive the visible class and are unobserved.
- Fallback test: when `IntersectionObserver` is unavailable, modules are immediately visible.
- CSS test: reduced motion removes the reveal transition and transform.
- Browser checks: desktop pointer state, mid-scroll state, module entry, 390px mobile, console output, full tests, and production build.

## Acceptance criteria

- The hero contains no small ring-dot cursor.
- The black inverse circle cannot appear below the hero after scrolling.
- Lower modules fade and move upward subtly as they enter the viewport.
- Revealed content remains readable and stable.
- Mobile has no pointer-only artifacts or horizontal overflow.
- Reduced-motion users receive static content.
