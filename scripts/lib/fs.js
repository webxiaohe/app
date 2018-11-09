const fs = require('fs');
const path = require('path');

const bluebird = require('bluebird');

async function fileDisplay(filePath, fileter) {
    const array = []
    const files = fs.readdirSync(filePath)
    await bluebird.map(files, async (filename) => {
        var filedir = path.join(filePath, filename);
        const stats = fs.statSync(filedir)
        var isFile = stats.isFile();
        var isDir = stats.isDirectory();
        if (isFile) {
            if (fileter) {
                const result = fileter(filename)
                if (result) {
                    array.push(filedir)
                }
            } else {
                array.push(filedir)
            }
        } else if (isDir) {
            const newArray = await fileDisplay(filedir);
            array.push(...newArray)
        }
    })
    return array
}

module.exports = {
    fileDisplay
}