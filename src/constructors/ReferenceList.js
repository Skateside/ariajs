import List from "./List.js";
import Reference from "./Reference.js";
import {
    interpretString
} from "../util.js";

export default class ReferenceList extends List {

    write(value) {

        return super.write(value, (entry) => (
            Reference.isElement(entry)
            ? Reference.identify(entry)
            : interpretString(entry)
        ));

    }

    read(value) {
        return super.read(value).map(Reference.getById);
    }

}
