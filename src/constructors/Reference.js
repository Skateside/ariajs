import Property from "./Property.js";
import AriaElement from "../AriaElement.js";

export default class Reference extends Property {

    write(value) {

        if (AriaElement.isElement(value)) {
            value = AriaElement.identify(value);
        }

        return super.write(value);

    }

    read(value) {
        return AriaElement.getById(super.read(value));
    }

};
