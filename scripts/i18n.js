const path = require('path');
const fs = require('fs');
const bluebird = require('bluebird');

const { fileDisplay } = require('./lib/fs');

function getSapce(count) {
    let space = ''
    for (let i = 0; i < count; i++) {
        space += ' '
    }
    return space
}

function getJSONSring(json, space = 2) {
    const newKeys = Object.keys(json)
    const string = newKeys.reduce((string, item, index) => {
        let itemValue = json[item];
        if (typeof itemValue === 'object') {
            if (index === newKeys.length - 1) {
                return `${string}${getSapce(space)}"${item}": ${getJSONSring(itemValue, space + 2)}\n${getSapce(space - 2)}}`
            }
            return `${string}${getSapce(space)}"${item}": ${getJSONSring(itemValue, space + 2)},\n`
        } else {
            if (index === newKeys.length - 1) {
                return `${string}${getSapce(space)}"${item}": "${itemValue}"\n${getSapce(space - 2)}}`
            }
            return `${string}${getSapce(space)}"${item}": "${itemValue}",\n`
        }
    }, '{\n')
    return string
}

(async () => {
    const appPath = path.resolve(__dirname, '../src');
    const files = await fileDisplay(appPath, (filePath) => {
        return filePath.endsWith('.tsx') || filePath.endsWith('.ts')
    });
    const i18nArray = []
    await bluebird.map(files, async (filename) => {
        const file = fs.readFileSync(filename, "utf-8");
        let arr = file.match(/__i18n\((".*?")\)/g)
        if (arr) {
            i18nArray.push(...arr)
        }
    })
    const newI18nArray = i18nArray.map((item) => {
        const keyName = item.match(/".*"/)[0].replace(/\"/g, '')
        return keyName
    })
    const locales = await fileDisplay(path.resolve(__dirname, '../src/i18n'), (filePath) => {
        return filePath.endsWith('.json')
    });
    await bluebird.each(locales, async (filePath) => {
        const file = fs.readFileSync(filePath, "utf-8");
        const json = JSON.parse(file)
        const keys = Object.keys(json)
        newI18nArray.filter((item) => {
            if (!keys.includes(item)) {
                json[item] = item
            }
        })
        const jsonString = getJSONSring(json)
        fs.writeFileSync(filePath, jsonString)
    })
})()