export const COMPONENT_ID = {
  runtimeTable: 'runtime-table',
  runtimeToolbar: 'runtime-toolbar',
  runtimeButton: 'runtime-button',
  userProfileCard: 'user-profile-card'
} as const;

export type ComponentId = (typeof COMPONENT_ID)[keyof typeof COMPONENT_ID];

export const ALL_COMPONENT_IDS = [
  COMPONENT_ID.runtimeTable,
  COMPONENT_ID.runtimeToolbar,
  COMPONENT_ID.runtimeButton,
  COMPONENT_ID.userProfileCard
] as const;
