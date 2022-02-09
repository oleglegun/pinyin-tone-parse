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
    {
        options: {},
        text: 'Yě kěyǐ.',
        result: [['Yě', null], ' ', ['kěyǐ', null], '.'],
    },
    {
        options: {},
        text: 'Nǐ yao4 bu4yào wǒ de gou3?',
        result: [
            ['Nǐ', null], ' ', ['yao', 4], ' ', ['bu', 4], ['yào', null], ' ',
            ['wǒ', null], ' ', ['de', 5], ' ', ['gou', 3], '?'],
    },
    {
        options: { allowAnyChar: true },
        text: 'nǐ hǎo！',
        result: [['nǐ', null], ' ', ['hǎo', null], '！']
    },
    {
        options: { remark: true },
        text: 'Yě kěyǐ.',
        result: [['Ye', 3], ' ', ['keyi', 3], '.'],
    },
    {
        options: { remark: true },
        text: 'Nǐ yao4 bu4yào wǒ de gou3?',
        result: [
            ['Ni', 3], ' ', ['yao', 4], ' ', ['bu', 4], ['yao', 4], ' ',
            ['wo', 3], ' ', ['de', 5], ' ', ['gou', 3], '?'],
    },
    {
        options: { allowAnyChar: true, remark: true },
        text: 'nǐ hǎo！',
        result: [['ni', 3], ' ', ['hao', 3], '！']
    },
    {
        options: { allowAnyChar: true },
        text: 'ni3hao3。 yi1，er2，san1！',
        result: [['ni', 3], ['hao', 3], '。', ' ', ['yi', 1], '，', ['er', 2], '，', ['san', 1], '！'],
    }
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
