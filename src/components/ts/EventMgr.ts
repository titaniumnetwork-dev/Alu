class EventMgr {
    static listen(name: string, listener: EventListener, target?: EventTarget, opts: AddEventListenerOptions = {}) {
        window.Pyrus.eventList[name] = listener;
        (target || document).addEventListener(name, listener, opts);

        return {
            name: name,
            listener: listener
        };
    }

    static remove(event: { name: string, listener: EventListener }, target?: EventTarget) {
        (target || document).removeEventListener(event.name, event.listener);
    }

    static dispatch(name: string, detail?: any, target?: EventTarget) {
        (target || document).dispatchEvent(new CustomEvent(name, { detail: detail }));
    }
}

export default EventMgr;