const PUNCT_MARKS = '.。,:;?!-'
const TONE_NUMBERS = '12345'

/**
 * @typedef 
 */

/**
 * Parse Pinyin tone numbers
 * @param {String} Text
 * @param {Object} options
 */
function parse(text, options) {
    const t = text.trim()

    const parsed = []
    let startIdx

    for (let i = 0, len = t.length; i < len; i++) {
        const c = t[i]

        if (isLetter(c)) {
            if (startIdx === undefined) {
                startIdx = i
            }
            // The word was started - keep scanning
        } else if (isNumber(c)) {
            // Check if the number is right after the letter
            if (startIdx !== undefined && isTone(c) && isLetter(t[i - 1])) {
                // tone detected - split and save the word + tone
                parsed.push([t.slice(startIdx, i), Number.parseInt(c)])
                startIdx = undefined
            } else {
                // just a number
                parsed.push(c)
            }
        } else if (isSpace(c)) {
            // check if word was closed
            if (startIdx !== undefined) {
                if (options.allowUntoned) {
                    // close word
                    parsed.push([t.slice(startIdx, i), 5])
                    startIdx = undefined
                } else {
                    throw new Error('UntonedWordFoundError')
                }
            }
            parsed.push(' ')
        } else if (isPunctMark(c)) {
            parsed.push(c)
        } else {
            // unrecognized character
            parsed.push(c)
        }
    }

    return parsed
}

function isLetter(c) {
    const cc = c.charCodeAt()
    return (cc > 64 && cc < 123) || cc === 252 || cc === 220
}

function isNumber(c) {
    return '1234567890'.indexOf(c) !== -1
}

function isTone(c) {
    return TONE_NUMBERS.indexOf(c) !== -1
}

function isSpace(c) {
    return c === ' '
}

function isPunctMark(c) {
    return PUNCT_MARKS.indexOf(c) !== -1
}

module.exports = parse
