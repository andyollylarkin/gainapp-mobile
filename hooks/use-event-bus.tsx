import { EventEmitter as internalEmitter } from "eventemitter3";

export type EventEmitter<T extends string, P> = {
  emit: (event: T, payload: P) => void;
  on: (event: T, callback: (payload: P) => void) => void;
  off: (event: T, callback: (payload: P) => void) => void;
};

const eventBus = new internalEmitter();

export default function useEventBus<T extends string, P>() {
  return {
    emit: (event: T, payload: P) => eventBus.emit(event, payload),
    on: (event: T, callback: (payload: P) => void) =>
      eventBus.on(event, callback),
    off: (event: T, callback: (payload: P) => void) =>
      eventBus.off(event, callback),
  } as EventEmitter<T, P>;
}
