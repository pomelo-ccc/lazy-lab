export interface RuntimeContext {
  readonly requestId: string;
  readonly source: string;
  readonly timestamp: string;
}

export function createRuntimeContext(source: string): RuntimeContext {
  return {
    requestId: buildRequestId(),
    source,
    timestamp: new Date().toISOString()
  };
}

function buildRequestId(): string {
  return `rt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
