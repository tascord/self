const events = ['activate', 'resize', 'selected', 'meta_current'] as const;
type event = typeof events[number];

interface Stater {
    on(event: 'activate', listener: ((target: HTMLElement | false) => void)): void;
    on(event: 'resize', listener: () => void): void;
    on(event: 'selected', listener: ((target: any) => void)): void;
    on(event: 'meta_current', listener: ((key: string, value: any) => void)): void;
}

class Stater {

    listeners: { [event: string]: Function[] } = {};

    on(event: event, listener: Function): void {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(listener);
    }

    emit(event: event, ...args: any[]) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(listener => listener(...args));
    }

}

const stater = new Stater();
export default stater;