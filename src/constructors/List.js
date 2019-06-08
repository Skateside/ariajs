import Property from "./Property.js";
import {
    interpretString
} from "../util.js";

export default class List extends Property {

    write(value, map = interpretString) {

        if (Array.isArray(value)) {
            value = value.map(map).join(" ");
        }

        return super.write(value.replace(/\s+/g, " "));

    }

    read(value) {

        let string = interpretString(super.read(value));

        return (
            string === ""
            ? []
            : string.split(/\s+/)
        );

    }

};
