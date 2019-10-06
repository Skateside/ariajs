export let randomNumber = (max = Date.now(), isInt = false) => {

    let number = Math.random() * max;

    if (isInt) {
        number = Math.floor(number);
    }

    return number;

};

export let randomString = (length = 10) => {

    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let lettersLength = letters.length;
    let string = "";

    while (string.length < length) {
        string += letters[randomNumber(lettersLength, true)];
    }

    return string;

};
