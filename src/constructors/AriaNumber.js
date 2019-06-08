import Property from "./Property.js";

export default class AriaNumber extends Property {

    write(value) {

        return (
            Number.isNaN(value)
            ? ""
            : super.write(value)
        );

    }

    read(value) {
        return parseFoat(super.read(value));
    }

};
