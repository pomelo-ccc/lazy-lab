import { COMPONENT_ID } from './component-id';
import {
  RuntimeButtonInput,
  RuntimeTableConfig,
  RuntimeToolbarInput
} from './runtime-table-config';

export interface ComponentInputMap {
  [COMPONENT_ID.runtimeTable]: {
    config: RuntimeTableConfig;
  };
  [COMPONENT_ID.runtimeToolbar]: RuntimeToolbarInput;
  [COMPONENT_ID.runtimeButton]: RuntimeButtonInput;
  [COMPONENT_ID.userProfileCard]: {
    userId: string;
  };
}
