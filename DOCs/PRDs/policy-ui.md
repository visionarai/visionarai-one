Product Requirements Document: Policy Management UI
UI to create, edit, validate, and manage access-control policies from PolicyTypeSchema using shadcn, Tailwind, React Hook Form, Zod, and TypeScript.

### Functional Requirements

| Requirement ID | Description | User Story | Expected Behavior/Outcome |
| -------------- | ----------- | ---------- | ------------------------- |
| REQ-FN-001 | View list of policies | As an Admin, I want to see policies so that I can manage them | Table lists policies with name, createdBy, updatedAt; loads <2s |
| REQ-FN-002 | Search policies by name | As an Admin, I want search so that I can find a policy fast | Filter updates within 300ms; case-insensitive |
| REQ-FN-003 | Sort policies | As an Admin, I want sorting so that I can organize results | Click header toggles asc/desc; persisted in URL |
| REQ-FN-004 | Create new policy | As an Admin, I want to create a policy so that I can define access | Empty form rendered; unsaved state highlighted |
| REQ-FN-005 | Edit existing policy | As an Admin, I want to edit a policy so that I can update rules | Loads existing values; dirty fields tracked |
| REQ-FN-006 | Delete policy | As an Admin, I want to delete a policy so that I can remove obsolete ones | Confirm dialog; success removes row; undo 5s optional |
| REQ-FN-007 | Zod schema validation | As a Developer, I want schema validation so that data is correct | Invalid fields block submit; inline errors appear <200ms |
| REQ-FN-008 | Required fields enforced | As an Admin, I want required checks so that I don’t miss data | name, permissions required; submit disabled if missing |
| REQ-FN-009 | Created/updated timestamps handled | As a Developer, I want system fields controlled so that integrity holds | createdAt immutable; updatedAt auto-updates on save |
| REQ-FN-010 | createdBy auto-set | As a Developer, I want creator captured so that audit is possible | Field populated from session; not user-editable |
| REQ-FN-011 | Permission matrix builder | As an Admin, I want to add resource/action rules so that access is defined | Add resource row; nested actions with value type toggle |
| REQ-FN-012 | Boolean permission entry | As an Admin, I want simple allow flags so that I can mark access quickly | Toggle sets true/false; stored as boolean |
| REQ-FN-013 | Conditional permission entry | As an Admin, I want conditional rules so that access adapts | Selecting “Conditional” opens condition builder modal |
| REQ-FN-014 | Global conditions support | As an Admin, I want global conditions so that base constraints apply | Optional builder; stored under globalConditions |
| REQ-FN-015 | Condition builder AND/OR groups | As an Admin, I want logical groups so that complex logic works | UI adds group nodes; serialized to ConditionGroup structure |
| REQ-FN-016 | NOT operator support | As an Admin, I want NOT so that I can invert logic | Single-condition NOT node selectable |
| REQ-FN-017 | Field picker limited to subject fields | As an Admin, I want valid fields only so that errors are avoided | Dropdown lists subject._id, subject.currentWorkspaceId |
| REQ-FN-018 | Operation list filtered by value type | As an Admin, I want correct operations so that input is valid | Choosing typeOfValue narrows operation choices |
| REQ-FN-019 | Value input adapts to type | As an Admin, I want contextual inputs so that data entry is easy | TypeOfValue drives component (text, number, date, multi) |
| REQ-FN-020 | Array value entry UX | As an Admin, I want multi-value input so that I can supply lists | Chip/tokens input; add/remove items; validates non-empty |
| REQ-FN-021 | Date input supported | As an Admin, I want date pickers so that I can set temporal rules | Calendar component; stores ISO date; timezone neutral |
| REQ-FN-022 | Inline validation on blur/change | As a User, I want fast feedback so that I can correct mistakes | Field validates on blur/change; no full form re-run |
| REQ-FN-023 | Submit disabled while invalid | As a User, I want blocked submission so that bad data is not saved | Button disabled if formState.invalid or pending |
| REQ-FN-024 | Submit loading state | As a User, I want progress indication so that I know it’s saving | Button shows spinner; prevented double-submit |
| REQ-FN-025 | API error handling | As a User, I want clear errors so that I can retry | Non-field errors show alert banner with retry option |
| REQ-FN-026 | Optimistic update (edit) | As an Admin, I want fast feedback so that UX feels instant | Local list updates immediately; rollback on failure |
| REQ-FN-027 | Cancel edits | As a User, I want to cancel so that I can exit safely | Cancel resets dirty state after confirm if dirty |
| REQ-FN-028 | Unsaved change guard | As a User, I want a prompt so that I don’t lose work | Navigation triggers confirm when dirty |
| REQ-FN-029 | Accessibility compliance | As a User, I want accessible UI so that all can use it | WCAG 2.1 AA: labels, roles, focus ring, ARIA expanded |
| REQ-FN-030 | Keyboard navigation | As a User, I want keyboard support so that I can work faster | Tab order logical; Enter adds item; Esc closes modals |
| REQ-FN-031 | Responsive layout | As a User, I want mobile usability so that I can manage anywhere | Form usable at 360px width; no horizontal scroll |
| REQ-FN-032 | Theme support (dark/light) | As a User, I want theming so that I can prefer dark mode | All components follow existing theme tokens |
| REQ-FN-033 | Localization ready | As a User, I want localized labels so that I understand content | All strings via i18n keys; fallback en; no hardcoded text |
| REQ-FN-034 | Policy JSON preview | As an Admin, I want to preview JSON so that I can verify payload | Read-only panel updates live; copy button works |
| REQ-FN-035 | Duplicate policy action | As an Admin, I want to clone so that I can iterate faster | Duplicate creates new draft with name suffix “(copy)” |
| REQ-FN-036 | Audit log event emission | As an Auditor, I want events so that changes are traceable | create/update/delete emit structured event payload |
| REQ-FN-037 | Pagination / virtualization | As a User, I want scalable listing so that large sets load fast | Lists >50 items paginate or virtualize; page load <1s |
| REQ-FN-038 | Form state reset after save | As a User, I want clean state so that confusion is avoided | After success, formState.dirty = false |
| REQ-FN-039 | Retry failed save | As a User, I want retry so that transient errors recover | Retry button resubmits last payload |
| REQ-FN-040 | Copy existing condition node | As an Admin, I want to duplicate logic so that I save time | Clone action replicates subtree under same group |
| REQ-FN-041 | Remove empty groups auto-clean | As a User, I want cleanup so that noise is reduced | Group with 0 children auto-deleted on blur |
| REQ-FN-042 | Max depth constraint | As a Developer, I want depth limits so that performance holds | Reject add if depth > 8; show inline message |
| REQ-FN-043 | Permission key validation | As a Developer, I want consistent keys so that parsing is safe | Resource/action keys must match /^[a-z][a-z0-9-_]*$/ |
| REQ-FN-044 | Draft vs saved indicator | As a User, I want status clarity so that I know state | Unsaved shows “Draft” badge until persisted |
| REQ-FN-045 | Clear form action | As a User, I want reset so that I can start over | Clear sets fields to initial defaults after confirm |