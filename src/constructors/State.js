import Property from "./Property.js";
import {
    interpretLowerString
} from "../util.js";

export default class State extends Property {

    write(value, ignoreInterpret = false) {

        let val = (
            ignoreInterpret
            ? value
            : interpretLowerString(value)
        );

        return (
            (val === "true" || val === "false")
            ? super.write(val)
            : ""
        );

    }

    read(value) {
        return super.read(value === "true");
    }

};
