class UntonedWordError extends Error {
    /**
     * Constructs the UntonedWordError class.
     * @param {string} word
     * @constructor
     */
    constructor(word) {
        super(`No tone mark found for "${word}".`)
        this.name = this.constructor.name
    }
}

class UnrecognizedCharacterError extends Error {
    /**
     * Constructs the UnrecognizedCharacterError class.
     * @param {string} word
     * @constructor
     */
    constructor(char) {
        super(`Character "${char}" is not recognized. Use "allowAnyChar: true" option to omit this error.`)
        this.name = this.constructor.name
    }
}

module.exports = { UntonedWordError }