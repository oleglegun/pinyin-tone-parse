const tap = require('tap')
const parse = require('../lib/pinyin-tone-parse')

const allowUntonedRestrictOptions = { allowUntoned: false }

const testCases = [
    {
        options: {},
        text: 'Wo3, ni3, ta1.',
        result: [['Wo', 3], ',', ' ', ['ni', 3], ',', ' ', ['ta', 1], '.'],
    },

    {
        options: {},
        text: 'Zhong1guo2ren2 ai4 he1 cha2 hai2shi5 ka1fei1?',
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
]

testCases.forEach(test => {
    tap.same(parse(test.text), test.result)
})
