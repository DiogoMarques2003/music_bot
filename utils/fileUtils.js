const fs = require('fs');

function searchByExtension(directory, extension = 'js') {
    let files = fs.readdirSync(directory);

    const accumulator = [];
    const currentDirFiles = [];

    for (const file of files) {
        if(file.split('.').length === 1) {
            const result = searchByExtension(`${directory}/${file}`, extension);
            accumulator.push(...result);
            continue;
        }

        if (file.split('.').pop() === extension) {
            currentDirFiles.push(`${directory}/${file}`);
        }
    }


    if(currentDirFiles.length > 0) {
        accumulator.push({
            directory: directory,
            files: currentDirFiles
        });
    }

    return accumulator;
}

module.exports.searchByExtension = searchByExtension;