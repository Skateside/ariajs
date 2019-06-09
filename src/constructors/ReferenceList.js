import List from "./List.js";
import AriaElement from "../AriaElement.js";
import {
    interpretString
} from "../util.js";

export default class ReferenceList extends List {

    write(value) {

        return super.write(value, (entry) => (
            AriaElement.isElement(entry)
            ? AriaElement.identify(entry)
            : interpretString(entry)
        ));

    }

    read(value) {
        return super.read(value).map(AriaElement.getById);
    }

}
