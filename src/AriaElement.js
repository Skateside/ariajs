import {
    unprefix,
    interpretString
} from "./util.js";

let identifyCount = 0;

/**
 * 1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/set#Return_value
 */

export default class AriaElement {

    constructor(element, factory = AriaElement.factory) {

        this.element = element;
        this.instances = Object.create(null);
        this.factory = factory;

        this.readAttributes();
        this.observeAttributes();

        return this.activateTraps();

    }

    getInstance(attribute) {

        let {
            instances,
            factory
        } = this;
        let instance = instances[attribute];

        if (!instance && factory.get(attribute)) {

            instance = factory.run(attribute, this.element);
            instances[attribute] = instance;

        }

        return instance;

    }

    readAttributes() {

        [...this.element.attribute].forEach(({ name, value }) => {

            let instance = (
                value
                ? this.getInstance(name)
                : undefined
            );

            if (instance) {
                instance.set(value);
            }

        });

    }

    observeAttributes() {

        let {
            factory,
            element
        } = this;
        let flags = Object.create(null);
        let observer = new MutationObserver((mutations) => {

            mutations.forEach(({ attributeName, type }) => {

                let attribute = attributeName || "";
                let suffix = unprefix(attribute);

                if (
                    type === "attribute"
                    && !flags[suffix]
                    && factory.get(suffix)
                ) {

                    flag[suffix] = true;

                    if (AriaElement.hasAttribute(element, attribute)) {

                        this[suffix] = interpretString(
                            AriaElement.getAttribute(element, attribute)
                        );

                    } else {
                        this[suffix] = "";
                    }

                    requestAnimationFrame(() => delete flag[suffix]);

                }

            });

        });

        observer.observe({
            attributes: true,
            attributeOldValue: true
        });

        this.observer = observer;

    }

    activateTraps() {

        return new Proxy(this, {

            get(target, name) {

                let value = target[name];
                let instance = target.getInstance(name);

                if (instance) {
                    value = instance.get();
                }

                return value;

            },

            set(target, name, value) {

                let instance = target.getInstance(name);

                if (instance) {
                    instance.set(value);
                } else {
                    target[name] = value;
                }

                return true; /* [1] */

            },

            deleteProperty(target, name) {

                let instance = target.getInstance(name);

                if (instance) {
                    instance.set("");
                } else {
                    delete target[name];
                }

                return true;

            }

        });

    }

    static setAttribute(element, attribute, value) {
        element.setAttribute(attribute, value);
    }

    static getAttribute(element, attribute) {

        return (
            AriaElement.hasAttribute(element, attribute)
            ? element.getAttribute(attribute)
            : null
        );

    }

    static hasAttribute(element, attribute) {
        return element.hasAttribute(attribute);
    }

    static removeAttribute(element, attribute) {
        element.removeAttribute(attribute);
    }

    static identify(element) {

        let id = AriaElement.getAttribute(element, "id");

        if (!id) {

            do {

                id = AriaElement.identifyPrefix + identifyCount;
                identifyCount += 1;

            } while (AriaElement.getById(id));

            AriaElement.setAttribute(element, "id", id);

        }

        return id;

    }

    static getById(id) {
        return document.getElementById(id);
    }

    static isElement(element) {
        return element instanceof Element;
    }

}

AriaElement.identifyPrefix = "anonymous-element-";
