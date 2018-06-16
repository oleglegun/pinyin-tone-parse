class MissingToneNumberError extends Error {
    /**
     * @param {string} word
     * @constructor
     */
    constructor(word) {
        super(`Missing tone number for word "${word}".`)
        this.name = this.constructor.name
    }
}

class UnrecognizedCharacterError extends Error {
    /**
     * @param {string} char
     * @constructor
     */
    constructor(char) {
        super(`Character "${char}" is not recognized. Use option "allowAnyChar: true" to omit this error.`)
        this.name = this.constructor.name
    }
}

module.exports = { MissingToneNumberError, UnrecognizedCharacterError }