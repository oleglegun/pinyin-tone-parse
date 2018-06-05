const tap = require('tap')
const parse = require('../lib/pinyin-tone-parse')
const { MissingToneNumberError, UnrecognizedCharacterError } = require('../lib/errors')

/*-----------------------------------------------------------------------------
 *  Tests for parsing pinyin tone numbers
 *----------------------------------------------------------------------------*/

const testCasesValid = [
    {
        options: {},
        text: 'Wo3, ni3, ta1.',
        result: [['Wo', 3], ',', ' ', ['ni', 3], ',', ' ', ['ta', 1], '.'],
    },
    {
        options: {},
        text: `Zhong1guo2ren2 ai4 he1 cha2 hai2shi5 ka1fei1?`,
        result: [
            ['Zhong', 1],
            ['guo', 2],
            ['ren', 2],
            ' ',
            ['ai', 4],
            ' ',
            ['he', 1],
            ' ',
            ['cha', 2],
            ' ',
            ['hai', 2],
            ['shi', 5],
            ' ',
            ['ka', 1],
            ['fei', 1],
            '?',
        ],
    },
    {
        options: {},
        text: 'Zhong1guo2ren2 dou1 ai4 he1 lü4 cha2.',
        result: [
            ['Zhong', 1],
            ['guo', 2],
            ['ren', 2],
            ' ',
            ['dou', 1],
            ' ',
            ['ai', 4],
            ' ',
            ['he', 1],
            ' ',
            ['lü', 4],
            ' ',
            ['cha', 2],
            '.',
        ],
    },
    {
        options: { allowAnyChar: true },
        text: 'ni3 & wo3',
        result: [['ni', 3], ' ', '&', ' ', ['wo', 3]],
    },
    {
        options: {},
        text: 'wo3de',
        result: [['wo', 3], ['de', 5]],
    },
    {
        options: {},
        text: 'Ni3 ne?',
        result: [['Ni', 3], ' ', ['ne', 5], '?'],
    },
]

testCasesValid.forEach(test => {
    tap.same(parse(test.text, test.options), test.result)
})

/*-----------------------------------------------------------------------------
 *  Tests that throw errors
 *----------------------------------------------------------------------------*/

const testCasesError = [
    {
        options: {},
        text: 'wo3 ~ ni3',
        error: UnrecognizedCharacterError,
    },
    {
        options: { allowUntoned: false },
        text: 'wo3de',
        error: MissingToneNumberError,
    },
]

testCasesError.forEach(test => {
    tap.throws(function() {
        parse(test.text, test.options)
    }, test.error)
})
