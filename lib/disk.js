const _ = require('lodash');

class Disk {
    spaceCharacters = '  ';
    rootDirectory = {
        subDirectories: {}
    };

    parsePath(path) {
        return path.split('/').map(e => e.trim());
    }

    findFolder(path) {
        const pathArr = this.parsePath(path);
        let parentDirectory = this.rootDirectory;
        let wrongDirectory = null;
        let directory = null;

        for (let i = 0; i < pathArr.length; i++) {
            const folder = pathArr[i];
            if (parentDirectory.subDirectories[folder]) {
                if (i == pathArr.length - 1) {
                    directory = parentDirectory.subDirectories[folder];
                }
                else {
                    parentDirectory = parentDirectory.subDirectories[folder];
                }
            }
            else {
                wrongDirectory = folder;
                break;
            }
        }
        return {
            directory,
            wrongDirectory,
            parentDirectory
        }
    }

    create(path) {
        const pathArr = this.parsePath(path);
        let directory = this.rootDirectory;

        for (const folder of pathArr) {
            if (!directory.subDirectories[folder]) {
                directory.subDirectories[folder] = {
                    name: folder,
                    subDirectories: {}
                }
            }
            directory = directory.subDirectories[folder];
        }
        return directory;
    }

    move(from, to) {
        let targetData = this.findFolder(from);
        if (targetData.directory) {
            let directory = this.create(to);

            directory.subDirectories[targetData.directory.name] = targetData.directory;
            delete targetData.parentDirectory.subDirectories[targetData.directory.name];
        }
    }

    delete(path) {
        let targetData = this.findFolder(path);
        if (targetData.directory) {
            delete targetData.parentDirectory.subDirectories[targetData.directory.name];
        }
        else {
            return `Cannot delete ${path} - ${targetData.wrongDirectory} does not exist`;
        }
    }

    list() {
        let strList = '';
        const processDirectory = (directories, spaces = 0) => {
            for (const directory of _.sortBy(Object.values(directories), ['name'])) {
                strList += ''.padStart(spaces * this.spaceCharacters.length, this.spaceCharacters) + directory.name + '\n';
                processDirectory(directory.subDirectories, spaces + 1);
            }
        }
        processDirectory(this.rootDirectory.subDirectories)
        return strList.trim();
    }
}

module.exports = {
    Disk
}