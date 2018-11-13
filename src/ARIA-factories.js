/**
 * Collection of factories for creating WAI-ARIA libraries. The attribute key
 * should be the attribute suffixes (e.g. "label" for "aria-label" etc.)
 * @type {Object}
 */
ARIA.factories = Object.create(null);

/**
 * Gets the factory from {@link ARIA.factories} that matches either the given
 * attribute or the normalised version (see {@link ARIA.normalise}).
 *
 * @param  {String} attribute
 *         Attribute whose factory should be returned.
 * @return {Function}
 *         Factory for creating the attribute.
 */
ARIA.getFactory = function (attribute) {

    return (
        ARIA.factories[attribute]
        || ARIA.factories[ARIA.getSuffix(ARIA.normalise(attribute))]
    );

};

/**
 * Executes the factory for the given attribute, passing in given parameters.
 * See {@link ARIA.getFactory}.
 *
 * @param  {String} attribute
 *         Attribute whose factory should be executed.
 * @param  {Element} element
 *         Element that should be passed to the factory.
 * @return {ARIA.Property}
 *         Instance of {@link ARIA.Property} (or sub-class) created by the
 *         factory.
 * @throws {ReferenceError}
 *         There must be a factory for the given attribute.
 */
ARIA.runFactory = function (attribute, element) {

    var factory = ARIA.getFactory(attribute);

    if (!factory) {
        throw new ReferenceError(attribute + " is not a recognised factory");
    }

    return factory(element);

};

/**
 * Creates a factory that creates an aria property.
 *
 * @param  {String} attribute
 *         Normalised name of the attribute whose factory is created.
 * @param  {Function} Constructor
 *         Constructor for {@link ARIA.Property} (or sub-class) that will create
 *         the property.
 * @param  {Function} [modify]
 *         Optional function for modifying the {@link ARIA.Property} instance
 *         before it's returned.
 * @return {Function}
 *         A factory function that takes the element and returns the instance.
 */
ARIA.makeFactory = function (attribute, Constructor/*, modify*/) {

    return function (element) {

        var instance;
        var tokens = ARIA.tokens[attribute];

        if (!tokens) {

            tokens = [];
            ARIA.tokens[attribute] = tokens;

        }

        instance = new Constructor(element, attribute, tokens);

        // if (typeof modify === "function") {
        //     modify(instance);
        // }

        return instance;

    };

};

var factoryEntries = [
    [ARIA.Property, [
        "autocomplete",
        "current",
        "haspopup",
        "invalid",
        "keyshortcuts",
        "label",
        "live",
        "orientation",
        "placeholder",
        "roledescription",
        "sort",
        "valuetext"
    ]],
    [ARIA.Reference, [
        "activedescendant",
        "details",
        "errormessage"
    ]],
    [ARIA.ReferenceList, [
        "controls",
        "describedby",
        "flowto",
        "labelledby",
        "owns"
    ]],
    [ARIA.State, [
        "atomic",
        "busy",
        "disabled",
        "modal",
        "multiline",
        "multiselectable",
        "readonly",
        "required"
    ]],
    [ARIA.Tristate, [
        "checked",
        "pressed"
    ]],
    [ARIA.UndefinedState, [
        "expanded",
        "grabbed",
        "hidden",
        "selected"
    ]],
    [ARIA.Integer, [
        "colcount",
        "colindex",
        "colspan",
        "level",
        "posinset",
        "rowcount",
        "rowindex",
        "rowspan",
        "setsize"
    ]],
    [ARIA.Number, [
        "valuemax",
        "valuemin",
        "valuenow"
    ]],
    [ARIA.List, [
        "dropeffect",
        "relevant",
        "role"
    ]]
];

factoryEntries.forEach(function (entry) {

    entry[1].forEach(function (attribute) {

        ARIA.factories[attribute] = ARIA.makeFactory(
            ARIA.normalise(attribute),
            entry[0]
        );

    });

});

/**
 * Creates an alias of WAI-ARIA attributes.
 *
 * @param  {String} source
 *         Source attribute for the alias.
 * @param  {Array.<String>|String} aliases
 *         Either a single alias or an array of aliases.
 * @throws {ReferenceError}
 *         The source attribute must have a related factory.
 */
ARIA.addAlias = function (source, aliases) {

    var normalSource = ARIA.normalise(source).slice(5);

    if (!Array.isArray(aliases)) {
        aliases = [aliases];
    }

    if (!ARIA.getFactory(normalSource)) {

        throw new ReferenceError(
            "ARIA.factories."
            + normalSource
            + " does not exist"
        );

    }

    aliases.forEach(function (alias) {

        var normalAlias = ARIA.normalise(alias).slice(5);

        ARIA.translate[normalAlias] = normalSource;
        ARIA.factories[normalAlias] = ARIA.factories[normalSource];

    });

};

ARIA.addAlias("labelledby", "labeledby");
