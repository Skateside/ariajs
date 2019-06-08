import Property from "./Property.js";

let identifyCount = 0;
let prefix = "anonymous-element-";

export default class Reference extends Property {

    static get prefix() {
        return prefix;
    }

    static set prefix(pre) {
        prefix = pre;
    }

    static identify(element) {

        let id = Property.getAttribute(element, "id");

        if (!id) {

            do {

                id = Reference.prefix + identifyCount;
                identifyCount += 1;

            } while (Reference.getById(id));

            Property.setAttribute(element, "id", id);

        }

        return id;

    }

    static getById(id) {
        return document.getElementById(id);
    }

    static isElement(element) {
        return element instanceof Element;
    }

    write(value) {

        if (Reference.isElement(value)) {
            value = Reference.identify(value);
        }

        return super.write(value);

    }

    read(value) {
        return Reference.getById(super.read(value));
    }

};
