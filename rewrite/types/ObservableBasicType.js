import BasicType from "./BasicType.js";

export default class ObservableBasicType extends BasicType {

    static get EVENT_UPDATED() {
        return "updated";
    }

    setObserver(observer) {
        this.observer = observer;
    }

    write(value) {

        let written = super.write(value);

        this.announceUpdate();

        return written;

    }

    announceUpdate() {

        if (!this.observer) {
            return;
        }

        this.observer.dispatchEvent(this.constructor.EVENT_UPDATED, {
            type: this
        });

    }

    observe(listener) {

        if (!this.observer) {
            return;
        }

        this.observer.addEventListener(this.constructor.EVENT_UPDATED, (e) => {
            this.dispatchListener(e, listener);
        });

    }

    dispatchListener(event, listener) {

        if (event.detail.type === this) {
            listener(event);
        }

    }

}
