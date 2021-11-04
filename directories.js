const readline = require('readline');
const { stdin, stdout } = require('process');

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
                break;
            }
        }
        return {
            directory,
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
    }

    list() {
        let strList = '';
        const processDirectory = (directories, spaces = 0) => {
            for (const directory of Object.values(directories)) {
                strList += ''.padStart(spaces * this.spaceCharacters.length, this.spaceCharacters) + directory.name + '\n';
                processDirectory(directory.subDirectories, spaces + 1);
            }
        }
        processDirectory(this.rootDirectory.subDirectories)
        return strList;
    }
}

class Process {
    VALID_COMMANDS = {};
    disk = new Disk;
    rl = undefined;

    constructor() {
        this.VALID_COMMANDS = {
            CREATE: {
                lengthParameters: 1,
                handler: path => this.disk.create(path)
            },
            MOVE: {
                lengthParameters: 2,
                handler: (from, to) => this.disk.move(from, to)
            },
            DELETE: {
                lengthParameters: 1,
                handler: path => this.disk.delete(path)
            },
            LIST: {
                lengthParameters: 0,
                handler: () => {
                    stdout.write(this.disk.list())
                }
            },
            END: {
                lengthParameters: 0,
                handler: () => {
                    process.exit();
                }
            }
        }
    }


    processCommand(command, parameters) {
        const commandData = this.VALID_COMMANDS[command];
        if (commandData && commandData.lengthParameters == parameters.length) {
            commandData.handler(...parameters);
        }
        else {
            console.error('Error: Command invalid')
        }
    }

    executeInstructions(instructions) {
        const parseLine = line => {
            const [command, ...parameters] = line.split(' ').map(e => e.trim()).filter(e => e.length > 0);
            return { command, parameters };
        }
        const lines = instructions.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        for (let line of lines) {
            const {command, parameters} = parseLine(line);
            console.log(line);
            this.processCommand(command, parameters);
        }
    }

    shellProcess() {
        stdin.setEncoding('utf-8');

        this.rl = readline.createInterface(
            stdin,
            stdout
        );

        this.rl.resume();
        this.rl.on('line', (data) => {
            const [command, ...parameters] = data.toString().split(' ').map(e => e.trim()).filter(e => e.length > 0);
            if (command) {
                this.processCommand(command, parameters);
            }
        });

    }


}

const p = new Process;

const instructions = `
CREATE fruits 
CREATE vegetables 
CREATE grains 
CREATE fruits/apples 
CREATE fruits/apples/fuji 
LIST 
CREATE grains/squash 
MOVE grains/squash vegetables 
CREATE foods 
MOVE grains foods 
MOVE fruits foods 
MOVE vegetables foods 
LIST 
DELETE fruits/apples 
DELETE foods/fruits/apples 
LIST 
`;

p.executeInstructions(instructions);

/////////////////////////////////////////
//If you want to execute the process on the shell and this stay executed 
p.shellProcess();