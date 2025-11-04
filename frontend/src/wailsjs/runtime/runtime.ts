// Mock Wails runtime for development
export function EventsOn(_eventName: string, _callback: (data: any) => void): () => void {
  // Mock implementation
  return () => {};
}

export function EventsOff(_eventName: string): void {
  // Mock implementation
}

export function EventsEmit(_eventName: string, _data?: any): void {
  // Mock implementation
}
