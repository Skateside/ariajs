export default class Mediator {

    constructor({ type, attribute, reference }) {

        this.type = type;
        this.attribute = attribute;
        this.reference = reference
        this.element = reference.element();

        type.observe(() => this.updateFromType());
        reference.observe(attribute.name(), () => this.updateFromAttribute());

        if (attribute.exists(this.element)) {
            this.updateFromAttribute();
        }

    }

    write(value) {

        this.type.write(value);
        this.updateFromType();

    }

    read() {
        return this.type.read();
    }

    clear() {
        return this.type.clear();
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

    static isMediator(object) {
        return object instanceof this;
    }

}
