import { EventId, ToolbarEventId } from './event-id';

export interface RuntimeTableColumn {
  readonly key: string;
  readonly label: string;
}

export type RuntimeTableCellValue = string | number;

export interface RuntimeTableRow {
  readonly id: string;
  readonly cells: Readonly<Record<string, RuntimeTableCellValue>>;
}

export type RuntimeIconName = 'reload' | 'download' | 'inbox';

interface RuntimeToolbarButtonConfigBase {
  readonly id: string;
  readonly label: string;
  readonly eventId: ToolbarEventId;
  readonly buttonType?: 'primary' | 'default' | 'dashed';
}

export interface RuntimeTextToolbarButtonConfig extends RuntimeToolbarButtonConfigBase {
  readonly kind?: 'text';
}

export interface RuntimeIconToolbarButtonConfig extends RuntimeToolbarButtonConfigBase {
  readonly kind: 'icon';
  readonly icon: RuntimeIconName;
}

export type RuntimeToolbarButtonConfig =
  | RuntimeTextToolbarButtonConfig
  | RuntimeIconToolbarButtonConfig;

export interface RuntimeToolbarConfig {
  readonly title: string;
  readonly buttons: readonly RuntimeToolbarButtonConfig[];
}

export interface RuntimeTableConfig {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly columns: readonly RuntimeTableColumn[];
  readonly rows: readonly RuntimeTableRow[];
  readonly toolbar?: RuntimeToolbarConfig | null;
}

export interface RuntimeTableMeta {
  readonly id: string;
  readonly title: string;
  readonly rowCount: number;
}

export interface RuntimeTableEventPayload {
  readonly tableId: string;
  readonly tableTitle: string;
  readonly buttonId: string;
  readonly buttonLabel: string;
  readonly rowCount: number;
}

export interface RuntimeTableEventResult {
  readonly auditId: string;
  readonly handledAt: string;
  readonly methodName: string;
  readonly message: string;
}

export interface RuntimeToolbarActionRecord extends RuntimeTableEventResult {
  readonly eventId: EventId;
  readonly buttonLabel: string;
}

export type RuntimeActionHandled = (entry: RuntimeToolbarActionRecord) => void;

export interface RuntimeToolbarInput {
  readonly config: RuntimeToolbarConfig;
  readonly table: RuntimeTableMeta;
  readonly onActionHandled: RuntimeActionHandled;
}

export interface RuntimeButtonInput {
  readonly config: RuntimeToolbarButtonConfig;
  readonly table: RuntimeTableMeta;
  readonly onActionHandled: RuntimeActionHandled;
}

export function isIconToolbarButtonConfig(
  button: RuntimeToolbarButtonConfig
): button is RuntimeIconToolbarButtonConfig {
  return button.kind === 'icon';
}

export function isTextToolbarButtonConfig(
  button: RuntimeToolbarButtonConfig
): button is RuntimeTextToolbarButtonConfig {
  return button.kind !== 'icon';
}
