import BasicType from "./types/BasicType.js";

export default class Mediator {

    constructor({ type, attribute, element }) {

        this.type = type;
        this.attribute = attribute;
        this.element = element;

        this.type.addEventListener(
            BasicType.EVENT_UPDATED,
            () => this.updateFromType()
        );

        // NOTE:
        // it would be good to listen for attribute changes here.

    }

    write(value) {

        this.type.write(value);
        this.update();

    }

    updateFromType() {

        let {
            type,
            attribute,
            element
        } = this;

        if (type.isEmpty()) {
            return attribute.clear(element);
        }

        return attribute.write(element, type.toString());

    }

    updateFromAttribute() {

        let {
            type,
            attribute,
            element
        } = this;

        if (attribute.isEmpty(element)) {

            type.clear();
            return true;

        }

        return type.write(attribute.read(element));

    }

    read() {
        return this.type.read();
    }

    clear() {
        return this.type.clear();
    }

    static isMediator(object) {
        return object instanceof this;
    }

}
