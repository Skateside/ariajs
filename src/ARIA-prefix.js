/**
 * Memoises a function so that the cached values are returned if they exist.
 *
 * @param  {Function} func
 *         Function to cache,
 * @param  {Function} [keyMaker]
 *         Optional function to create the cache's key.
 * @param  {Object} [cache]
 *         Optional cache for the function.
 * @return {Function}
 *         Memoised function.
 */
ARIA.memoize = function (func, keyMaker, cache) {

    var context = this;

    if (cache === undefined) {
        cache = Object.create(null);
    }

    if (keyMaker === undefined) {
        keyMaker = stringifyArguments;
    }

    return function () {

        var args = slice(arguments);
        var key = keyMaker.apply(context, args);
        var response = cache[key];

        if (!owns(cache, key)) {

            response = func.apply(context, args);
            cache[key] = response;

        }

        return response;

    };

};

/**
 * The cache for {@link ARIA.addPrefix}. See also {@link ARIA.translate}.
 * @type {Object}
 */
ARIA.prefixCache = Object.create(null);

/**
 * The cache for {@link ARIA.removePrefix}.
 * @type {Object}
 */
ARIA.suffixCache = Object.create(null);

/**
 * Translations for after the {@link ARIA.addPrefix} process has happened.
 * Unlike {@link ARIA.prefixCache}, this map translates values that have already
 * been processed (trimmed and converted into lower-case). As such, it's
 * probably easier to modify this map than the cache.
 * @type {Object}
 */
ARIA.translate = objectAssign(Object.create(null), {
    "labeledby": "aria-labelledby",
    "role": "role"
});

/**
 * Translations for afgter the {@link ARIA.removePrefix} process has happened.
 * Unlike {@link ARIA.suffixCache}, this map translates values that have already
 * been process (trimmed and converted into lower-case). As such, it's probably
 * easier to modify this map than the cache.
 * @type {Object}
 */
ARIA.untranslate = Object.create(null);

/**
 * The regular expression used to match the WAI-ARIA prefix.
 * @type {RegExp}
 */
ARIA.PREFIX_REGEXP = (/^(aria\-)?/);

/**
 * Adds the WAI-ARIA prefix to the given attribute if it doesn't already have
 * it.
 *
 * @function
 * @param    {String} attribute
 *           Attribute that should be prefixed with "aria-", if it isn't
 *           already.
 */
ARIA.addPrefix = ARIA.memoize(
    function (attribute) {

        var removed = ARIA.removePrefix(attribute);

        return ARIA.translate[removed] || ("aria-" + removed);

    },
    identity,
    ARIA.prefixCache
);

/**
 * Removes the WAI-ARIA prefix from the given attribute if it has it.
 *
 * @function
 * @param    {String} attribute
 *           Attribute that should have the "aria-" prefix removed.
 */
ARIA.removePrefix = ARIA.memoize(
    function (attribute) {

        var normalised = interpretLowerString(attribute);

        return (
            ARIA.untranslate(normalised)
            || normalised.replace(ARIA.PREFIX_REGEXP, "")
        );

    },
    identity,
    ARIA.suffixCache
);
