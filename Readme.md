# Pinyin Tone Parse

[![Build Status](https://travis-ci.org/oleglegun/pinyin-tone-parse.svg?branch=master)](https://travis-ci.org/oleglegun/pinyin-tone-parse)
[![Coverage Status](https://coveralls.io/repos/github/oleglegun/pinyin-tone-parse/badge.svg?branch=master)](https://coveralls.io/github/oleglegun/pinyin-tone-parse?branch=master)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Easily parse pinyin tone numbers.

## Installation

`npm install pinyin-tone-parse`

## Usage

```js
const toneParse = require('pinyin-tone-parse')

toneParse('Ni3 hao3 ma5?')
// [[ 'Ni', 3 ], ' ', [ 'hao', 3 ], ' ',[ 'ma', 5 ], '?']

// Composite words
toneParse('Zhong1guo2ren2 hai2shi5 e2guo2ren2?')
// [['Zhong', 1], ['guo', 2], ['ren', 2], ' ', ['hai', 2], ['shi', 5], ' ', ['e', 2], ['guo', 2], ['ren', 2], '?']
```

## Options

| Option         | Default value | Description                                                                                                                                                                                             |
| -------------- | :-----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowUntoned` | true          | Set to `false` to throw `MissingToneNumberError` on each untoned word. Helps manually validate input.                                                                                                   |
| `allowAnyChar` | false         | By default throws `UnrecognizedCharacterError` on any character that is not in the `A-Za-z0-9.。,:;?!-–` set. Set to `true` to omit this error. Correct parsing results in this case are not guaranteed. |


```js
// Check for untoned words
toneParse('Ni3 hao3 ma?')
// [[ 'Ni', 3 ], ' ', [ 'hao', 3 ], ' ', [ 'ma', 5 ], '?']
toneParse('Ni3 hao3 ma?', { allowUntoned: false }) // throws MissingToneNumberError for word "ma"

// Allow any characters
toneParse('Ni3 & wo3.') // throws UnrecognizedCharacterError for `&` character
toneParse('Ni3 & wo3.', { allowAnyChar: true })
// [[ 'Ni', 3 ], ' ', '&', ' ', [ 'wo', 3 ], '.']
```

## Tests

`npm test`

## License

MIT.
