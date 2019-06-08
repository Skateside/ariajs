import State from "./State.js";
import {
    interpretLowerString
} from "../util.js";

export default class Tristate extends State {

    write(value) {

        let val = interpretLowerString(value);

        return (
            val === "mixed"
            ? val
            : super.write(val, true)
        );

    }

    read(value) {

        return (
            value === "mixed"
            ? value
            : super.read(value)
        );

    }

};
