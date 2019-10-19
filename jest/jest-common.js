/**
 * Creates a random number (float) between 0 and the given maximum number. This
 * is not cryptographically random.
 *
 * @param  {Number}  [max=Date.now()]
 *         Optional maximum number.
 * @param  {Boolean} [isInt=false]
 *         If true, the decimal will be dropped.
 * @return {Number}
 *         Random number (float).
 */
export let randomNumber = (max = Date.now(), isInt = false) => {

    let number = Math.random() * max;

    if (isInt) {
        number = Math.floor(number);
    }

    return number;

};

/**
 * Helper function for creating a random integer. This is not cryptographically
 * random.
 *
 * @see    randomNumber
 * @param  {Number}  [max=Date.now()]
 *         Optional maximum number.
 * @return {Number}
 *         Random integer.
 */
export let randomInteger = (max = Date.now()) => randomNumber(max, true);

/**
 * Creates a random string with the given length. The string only contains
 * upper and lower case letters. This is not cryptographically random.
 * 
 * @param  {Number} [length=10]
 *         Optional length of the random string to generate.
 * @return {String}
 *         Random string.
 */
export let randomString = (length = 10) => {

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let lettersLength = letters.length;
    let string = "";

    while (string.length < length) {
        string += letters[randomNumber(lettersLength, true)];
    }

    return string;

};
