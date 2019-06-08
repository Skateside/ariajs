export let interpretString = (string) => (
    (string === "" || string === null || string === undefined)
    ? string
    : String(string).trim()
);

export let interpretLowerString = (string) => (
    interpretString(string).toLowerCase()
);

let cache = {};

export let clearCache = (name = null) => {

    if (name === null) {

        clearCache("prefix");
        clearCache("unprefix");

    } else {
        cache[name] = Object.create(null);
    }

};

clearCache();

const PREFIX = "aria-";

export let prefix = (attribute) => {

    let cached = cache.prefix[attribute];

    if (typeof cached !== "string") {

        let attr = interpretLowerString(attribute);

        cached = (
            attr.substr(0, PREFIX.length) === PREFIX
            ? attr
            : (PREFIX + attr)
        );
        cache.prefix[attribute] = cached;

    }

    return cached;

};

export let unprefix = (attribute) => {

    let cached = cache.unprefix[attribute];

    if (typeof cached !== "string") {

        let attr = interpretLowerString(attribute);

        cached = (
            attr.substr(0, PREFIX.length) === PREFIX
            ? attr.substr(PREFIX.length)
            : attr
        );
        cache.unprefix[attribute] = cached;

    }

    return cached;

};

let translations = Object.create(null);

export let addTranslation = (raw, translated) => translations[raw] = translated;

addTranslation("aria-role", "role");

export let translate = (attribute) => translations[attribute] || attribute;
