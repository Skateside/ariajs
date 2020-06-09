function randomNumber(max) {

    if (max === undefined) {
        max = 1;
    }

    return Math.random() * max;

}

function randomInteger(max) {
    return Math.floor(randomNumber(max));
}

function randomString(length, prefix) {

    var start = (
        prefix === undefined
        ? ""
        : String(prefix)
    );
    var size = (
        length === undefined
        ? 10
        : (Number(length) || 0)
    );
    var characters = (
        "abcdefghijklmnopqrstuvwxyz" +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "1234567890"
    );
    var random = "";

    while (size > 0) {

        random += characters[randomInteger(characters.length)];
        size -= 1;

    }

    return random;

}
