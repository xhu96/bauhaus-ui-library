# Bauhaus product and home refinement

The requested changes cover the release dependency blocker, a stronger Bauhaus Settings composition,
more coherent dog anatomy, and the return of the original geometric board/strip as an alternating home scene.

## Settings visual contract

The generated full-screen reference uses a cream paper surface, white form panel, black 3px rules,
primary red/blue/yellow geometry, square controls and a hard offset shadow. The existing Space Grotesk
and Archivo font tokens remain the typography system. The heading is deliberately large and split
across two lines. The desktop sidebar occupies one quarter of the content width; the functional form
occupies the remaining space. At 760px and below, tabs become a horizontal row with their matching
keyboard orientation. Decorative geometry never contains interactive content or contributes to names.

Reference: `exec-6eca03e1-8d9c-426f-89b7-98eef09acd7b.png`, generated with the built-in Imagegen tool
for visual planning; it is not shipped as a raster interface. Its circle, square and triangle are
implemented with deterministic CSS, consistent with the existing vector-based design system.

Allowed visible copy comes from the existing Settings page: brand/navigation, heading/description,
Profile/Notifications/Team, form labels/hints, team data, validation and save/discard feedback.
Decorative section numbers are hidden from assistive technology. No product claims or fake metrics
are introduced. Existing uppercase control labels remain the library convention; the desktop tab
labels use mixed case as in the reference.

The same visual system applies to loading, recovery, notifications and team search. Existing async
adapters, abort behavior, draft retention, focus restoration and save/error feedback remain intact.
Dark mode uses the established token inversion and retains primary fills. Compact density remains
an explicit control sizing preference rather than shrinking all text.

## Verification ledger

- Compare title scale, two-line composition and navigation hierarchy with the reference.
- Compare primary geometric arrangement, cream/white surfaces, borders and hard shadow.
- Compare sidebar/form width ratio and spacing at the native reference size.
- Verify current viewport and 390px/320px layouts for wrapping, focus visibility and clipping.
- Exercise edit, tab persistence, save, discard and member-search recovery.
- Re-run the full built browser suites after compiler migration, not against stale output.

Automated and visual results are recorded in `docs/release-verification.md` after verification.

## Completed visual comparison

The reference and latest browser screenshot were inspected with `view_image` in the same QA pass.
The working page was inspected through the in-app browser at the normal viewport and at 320/390px;
the reference layout was also checked at 1496×1051. The final saved Settings screenshot is 897×900
because the background tab retained its own viewport when the foreground home tab was resized.

| Comparison  | Delivered result                                                                                          |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| Hierarchy   | Two-line oversized heading, separate description, numbered sidebar and form heading.                      |
| Layout      | Desktop sidebar occupies 25% of the available width; mobile uses one column and horizontal tabs.          |
| Palette     | Existing cream/white/black and primary red/blue/yellow tokens; dark mode inverts surfaces and ink.        |
| Geometry    | Circle, square and triangle preserve the reference arrangement using crisp CSS shapes.                    |
| Borders     | 3px rules, square form panel and 7px desktop hard shadow; smaller shadow on mobile.                       |
| Typography  | Space Grotesk display and Archivo body; original library uppercase labels/buttons intentionally retained. |
| Copy        | Existing title, navigation, form labels/hints and actions preserved; no added claims or filler metrics.   |
| Interaction | Save/recovery/discard, keyboard tabs, team search and density/theme behavior pass built browser checks.   |

Intentional deviations from the raster concept: original library control typography and accessible
44px control sizing are retained; the concept's incidental raster texture is omitted from the
code-native flat geometry. Responsive layouts shrink decorative art before reducing usable form
space. The original anonymous neutral styling and mobile toolbar wrapping were repaired. No
remaining material visual mismatch was found against this practical reference and existing-component
contract.
