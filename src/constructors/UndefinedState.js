import State from "./State.js";

export default class UndefinedState extends State {

    write(value) {

        if (value === undefined) {
            value = "undefined";
        }

        return super.write(value);

    }

    read(value) {

        return (
            value === "undefined"
            ? undefined
            : super.read(value)
        );

    }

};
