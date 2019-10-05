import BasicType from "./BasicType.js";

export default class ObservableBasicType extends BasicType {

    static get EVENT_UPDATED() {
        return "updated";
    }

    write(value) {

        let written = super.write(value);

        this.announceUpdate();

        return written;

    }

    announceUpdate() {

        this.dispatchEvent(this.constructor.EVENT_UPDATED, {
            type: this
        });

    }

    observe(listener) {

        this.addEventListener(this.constructor.EVENT_UPDATED, (e) => {
            this.dispatchListener(e, listener);
        });

    }

    dispatchListener(event, listener) {

        if (event.detail.type === this) {
            listener(event);
        }

    }

}
