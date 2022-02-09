const { MissingToneNumberError, UnrecognizedCharacterError } = require('./errors')

const PUNCT_MARKS = `.。,:;?!-–'`
const TONE_NUMBERS = '12345'

/**
 * @typedef {Object} options
 * @property {boolean} [allowUntoned=true] Allow words without explicit tone number (ex: "de" vs. "de5"). Default - true.
 * @property {boolean} [allowAnyChar=false] If an unrecognized character found - push it to the result as is. Default - false.
 * @property {boolean} [remark=false] If a tone marking is found, strip it and remark the pinyin with that tone. Default - false.
 */

/**
 * Parse Pinyin tone numbers.
 * @param {String} text Pinyin string with numbered tones like `Ni3 hao3 ma5?`.
 * @param {options} [options] Optional object with extra options.
 * @returns {Array<String>}
 * @throws {MissingToneNumberError} Found a word without explicit tone number.
 * @throws {UnrecognizedCharacterError} Found a character that is not in the "A-Za-z0-9.。,:;?!-–" set.
 */
function parse(text, options) {
    if (options && typeof options === 'object') {
        if (options.allowUntoned === undefined) {
            options = Object.assign(options, { allowUntoned: true })
        }

        if (options.allowAnyChar === undefined) {
            options = Object.assign(options, { allowAnyChar: false })
        }
    } else {
        options = {
            allowUntoned: true,
            allowAnyChar: false,
        }
    }

    const t = text.trim()

    const parsed = []
    let startIdx
    let preMarkedTone = false

    for (let i = 0, len = t.length; i < len; i++) {
        const c = t[i]

        if (isLetter(c)) {
            if (startIdx === undefined) {
                startIdx = i
                preMarkedTone = null
            }
            // The word was started - keep scanning
            preMarkedTone = preMarkedTone ?? getToneFromMarkedLetter(c)
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
        } else if (isSpace(c) || isPunctMark(c) || options.allowAnyChar === true) {
            // check if word was closed
            if (startIdx !== undefined) {
                let toneNum
                if (preMarkedTone) {
                    toneNum = options.remark ? preMarkedTone : null
                } else if (options.allowUntoned === true) {
                    toneNum = 5
                } else {
                    throw new MissingToneNumberError(t.slice(startIdx, i))
                }
                // close word
                const word = t.slice(startIdx, i)
                parsed.push([
                    options.remark ? replaceMarkedChars(word) : word,
                    toneNum
                ])
                startIdx = undefined
                preMarkedTone = false
            }
            parsed.push(c)
        } else {
            throw new UnrecognizedCharacterError(c)
        }
    }

    // check if the word is pushed
    if (startIdx !== undefined) {
        let toneNum
        if (preMarkedTone) {
            toneNum = preMarkedTone
        } else if (options.allowUntoned === true) {
            toneNum = 5
        } else {
            throw new MissingToneNumberError(t.slice(startIdx))
        }
        parsed.push([t.slice(startIdx), toneNum])
    }

    return parsed
}

const toneChars = 'āēīōūǖĀĒĪŌŪǕáéíóúǘÁÉÍÓÚǗǎěǐǒǔǚǍĚǏǑǓǙàèìòùǜÀÈÌÒÙǛ'
function isLetterWithTone(c) {
    return toneChars.includes(c)
}
function getToneFromMarkedLetter(c) {
    const idx = toneChars.indexOf(c)
    if (idx < 0) {
        return null
    }
    return 1 + Math.floor(idx / 12)
}
function getLetterWithoutTone(c) {
    if ('āĀáÁǎǍàÀ'.includes(c)) {
        return 'a'
    }
    if ('ēĒéÉěĚèÈ'.includes(c)) {
        return 'e'
    }
    if ('īĪíÍǐǏìÌ'.includes(c)) {
        return 'i'
    }
    if ('ōŌóÓǒǑòÒ'.includes(c)) {
        return 'o'
    }
    if ('ūŪúÚǔǓùÙ'.includes(c)) {
        return 'u'
    }
    if ('ǖǕǘǗǚǙǜǛ'.includes(c)) {
        return 'ü'
    }
    return c
}
function replaceMarkedChars(s) {
    const out = []
    for (const ch of s) {
        out.push(getLetterWithoutTone(ch))
    }
    return out.join('')
}


function isLetter(c) {
    const cc = c.charCodeAt()
    return (cc > 64 && cc < 123) || cc === 252 || cc === 220 || isLetterWithTone(c)
}

function isNumber(c) {
    return '1234567890'.indexOf(c) !== -1
}

function isTone(c) {
    return TONE_NUMBERS.indexOf(c) !== -1
}

function isSpace(c) {
    return ' \t\n\r\v'.indexOf(c) !== -1
}

function isPunctMark(c) {
    return PUNCT_MARKS.indexOf(c) !== -1
}


module.exports = parse
