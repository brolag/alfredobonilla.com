---
project: alfredobonilla.com
created: 2026-10-03
status: in-progress
modified:
  - app/components/world/WorldScene.ts
  - app/components/world/WorldExperience.tsx
  - app/components/world/WorldInteriors.ts
  - app/components/world/roomActivities.ts
  - app/styles/world.css
  - package.json
  - package-lock.json
commits:
  - 78469fb
  - d04d6ef
agents: []
related:
  back: []
  forward: []
---

# More interactive solarpunk world

## Context and evidence

- Branch: `feat/solarpunk-world`, PR #2, clean at planning start; HEAD `4d15de8`.
- The current exterior is a procedural Three.js scene in `app/components/world/WorldScene.ts`. First-person movement, map travel, six buildings, and proximity prompts work.
- Entering any place calls `openPlace` in `WorldExperience.tsx`, teleports to its facade, and opens a content drawer. The only progress action is opening that drawer. This is the main gap between the navigable world and a game-like experience.
- Existing shrub and grass meshes already use `InstancedMesh`; tree, lamp, and architectural props are individual meshes. The renderer caps pixel ratio but has no measured adaptive quality setting.
- Baseline `npm run build` passed at HEAD on 2026-10-03 (Next.js 14.2.6; `/` 14.7 kB route JS, 102 kB first load JS). Browser checks covered desktop, tablet, and 320px mobile in the prior change; new interactions need fresh checks. The user can test on a real phone after local verification.

## Decisions

1. Keep the exterior, six places, map, and `/paper` route. Make the interactive path richer without making the portfolio content hard to reach.
2. Each place opens an authored interior scene with at least one object that must be inspected or used. The Projects workshop has four distinct inspectable exhibits. The other five places have a different short interaction tied to their content.
3. A place counts as discovered after its action, not merely after map travel. Completing all six presents a short final scene and an explicit path back to the town or contact.
4. The map remains an instant travel option. Keyboard, tap, and single-tap alternatives remain available for essential actions; dragging and pointer lock are optional enhancements.
5. Preserve an accessible text route to content via labels, buttons, and `/paper`. Reduced-motion preference disables optional camera and prop animation.
6. Measure frame time and scene draw calls in a production build before and after optimization. The user's real-phone test is the final device check; local emulation alone is not proof of physical-device performance.

## Signatures and ownership

- `app/components/world/places.ts` [keep]: stable `PlaceId` and place metadata without changing IDs.
- `app/components/world/roomActivities.ts` [new]: typed room prompts, objects, actions, and completion rules for the six places.
- `app/components/world/WorldScene.ts` [adapt]: `WorldController.enterRoom(id)`, `exitRoom()`, `interactRoom()`, `turnBy()` and look/movement methods; `WorldEvents.onRoomObject` reports object selection. Outdoor and interior camera positions remain encapsulated here.
- `app/components/world/WorldInteriors.ts` [new]: creates and disposes six authored room groups plus interactive object anchors.
- `app/components/world/WorldExperience.tsx` [adapt]: manages town / room / artifact / finale UI states and discovery progress. Drawer content remains available as the artifact detail view.
- `app/styles/world.css` [adapt]: room controls, onboarding, wayfinding, mobile turn controls, and completion UI.

## Invariants

- `@invariant` CWE-20: only known `PlaceId` and artifact IDs can select content; no user-controlled HTML insertion for new labels.
- `@invariant` CWE-79: visible artifact copy is rendered through React text, not `innerHTML`.
- `@invariant` CWE-400: dispose room geometry/materials/listeners and cap renderer resolution; avoid unbounded mesh or animation creation per visit.
- `@invariant` CWE-862: no auth, private data, or external mutation is introduced by world interaction. Existing external project/contact links remain explicit user actions.

## Global acceptance

- **AC-001:** When entering Proyectos from its doorway, map, or label, requires an authored workshop with four individually selectable 3D exhibits; ensures each exhibit opens its matching project detail and the visitor can return to the room and town. Verify with `npm run build` and browser checks of all four actions.
- **AC-002:** When entering each of the other five places, requires a distinct short interaction in that place; ensures finishing it reveals the corresponding portfolio content and records one discovery. Verify with browser checks of all six places and progress transitions.
- **AC-003:** When all six actions have been completed, requires a visible completion scene or message with routes to town and contact; ensures a map jump alone cannot complete the route. Verify with browser checks of incomplete and complete states.
- **AC-004:** When navigating by keyboard, mouse, or touch, requires signs, brief onboarding, and mobile turn buttons; ensures essential movement and selection can be performed without dragging. Verify at 320, 375, 768, and desktop widths with browser interaction checks and no horizontal overflow.
- **AC-005:** When running the 3D world, requires a bounded quality budget and reuse of repeated geometry; ensures no steady growth in scene object count or listeners across room visits. Verify with production build, browser frame/draw-call measurements, and repeated enter/exit cycle.
- **AC-006:** When the user tests the finished preview on a real phone, requires device model and observation of smoothness/heat to be recorded; ensures any reported regression is addressed before claiming device verification. Local browser emulation remains a separate evidence level.
- **AC-007:** When the implementation is complete, requires `npm run build`, `git diff --check`, no browser console errors, and a clean feature branch after commit/push; ensures PR #2 describes the actual shipped behavior.

## Execution tasks

1. **S1 [done] Contract and baseline.** Production build passed at HEAD; the stable room data, controller events, and completion rules are in `roomActivities.ts`, `WorldScene.ts`, and this plan. The pre-optimization scene sample was collected after room implementation, so it is a valid local draw-call comparison, not an untouched-HEAD frame baseline.
2. **S2 [done] Interior world.** Reusable room geometry, six visual treatments, four Projects exhibits, camera, object selection, and disposal are implemented in `WorldInteriors.ts` and `WorldScene.ts`.
3. **S3 [done] Interaction content and progression.** All six actions, object details, discovery rules, and finale are implemented. Browser interaction checks covered all four Projects pieces and all five other locations.
4. **S4 [done] Wayfinding and mobile controls.** Room signs, onboarding, tap alternatives, turn buttons, responsive layout, and reduced-motion handling are implemented. Keyboard `E` and `Escape` paths were verified in the browser. A follow-up adds a fixed camera nudge on each short tap, while holding continues to turn.
5. **S5 [done locally] Performance and integration.** Static exterior geometry is batched, repeated room geometry is shared, and frame-time sampling can lower pixel ratio. Local browser checks found no horizontal overflow at 320, 375, or 768px, no console errors, and stable room object/label counts after three revisits.
6. **S6 [in progress] Delivery.** Deliver the feature branch through draft PR #2, present a preview for the user's real-phone test, and record its result. The physical-device check remains open until the user supplies it.

## Execution evidence

- Production `npm run build` passed after the final visual refinements (Next.js 14.2.6, `/` 16.9 kB route JS, 104 kB first load JS). The final staged diff check is part of delivery.
- In the local 375px browser, the pre-batching populated world measured 504 draw calls, 20,966 triangles, and 605 scene objects at a reported 120 fps. After batching it measured 217 draw calls, 37,666 triangles, and 190 scene objects at a reported 120 fps. The triangle count rose because the combined static meshes cull as groups; this remains a modest geometry count. These are local browser samples, not phone benchmarks.
- The Projects room measured 37 draw calls, 852 triangles, and 56 scene objects at a reported 120 fps. After three exit/entry cycles it still had four object labels and the same scene object count.
- Browser navigation verified all four Projects detail links, the three About memories, three Agents nodes, one Academy path, one Services idea, and coffee action. Completion appeared only after those six place rules were satisfied. Map travel alone left progress at zero in a fresh session.
- Local browser at 320 and 375px showed the room control panel and touch controls without horizontal overflow. At 768px the DOM width matched the viewport. The desktop scene and keyboard room selection/exit were verified after optimization. No browser console errors were observed in those checks.

## Dependency, conflict, and scheduling read

| Edge | Type | Required output |
| --- | --- | --- |
| S1 → S2 | contract | Room/artifact data and controller decisions |
| S2 → S3 | implementation | Room scene and selection events |
| S3 → S4 | implementation | Stable room UI states |
| S4 → S5 | implementation | Complete interaction and control paths |
| S5 → S6 | verification | Passing build and browser evidence |

The tasks form one serial critical path. S2–S5 share `WorldScene.ts`, `WorldExperience.tsx`, or `world.css`; parallel edits would conflict. S6 owns external PR state and the physical-device handoff. No task is delegated.

## Verification strategy

- Baseline and final production build: `npm run build`.
- Static diff hygiene: `git diff --check`.
- Browser checks on local production server: enter/exit each room, all four Projects exhibits, progress and finale, keyboard/touch alternatives, viewport overflow, console errors, frame-time/draw-call samples, and repeated visits.
- Real-device check: user-provided mobile test. Record model and observations; compare against local metrics and fix any reported issue.

## Rollout and rollback

- Work only on `feat/solarpunk-world`. Preserve the original exterior and text route while the new interior path is built.
- Revert the upgrade commit(s) on the feature branch if the new rooms fail the acceptance checks; no database or deployment migration is involved.

## Out of scope

- Accounts, leaderboards, timed challenges, procedural quests, multiplayer, audio autoplay, and external asset copying.
- Deploying or merging PR #2.

## Open questions

- Physical-device performance awaits the user's test after a preview is ready. The user confirmed they can perform it.

## Notes and amend log

- 2026-10-03: Initial plan from the user's request to plan and execute the previously recommended improvements; expanded by their request for more interaction in different parts of the world.
- 2026-10-04: Reconciled signatures with the shipped room architecture and added a short-tap camera nudge after mobile verification exposed a control gap.
