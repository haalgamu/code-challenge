const readline = require('readline');
const { stdin, stdout } = require('process');
const { Disk } = require('./disk');

class Process {
    VALID_COMMANDS = {};
    disk = new Disk;
    rl = undefined;

    constructor() {
        this.VALID_COMMANDS = {
            CREATE: {
                lengthParameters: 1,
                handler: path => {
                    this.disk.create(path)
                }
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
                handler: () => this.disk.list()
            },
            END: {
                lengthParameters: 0,
                handler: () => {
                    process.exit();
                }
            }
        }
    }

    parseLine(line) {
        const [command, ...parameters] = line.split(' ').map(e => e.trim()).filter(e => e.length > 0);
        return { command, parameters };
    }


    processCommand(command, parameters) {
        const commandData = this.VALID_COMMANDS[command];
        if (commandData && commandData.lengthParameters == parameters.length) {
            return commandData.handler(...parameters);
        }
        else {
            console.error('Error: Command invalid')
        }
    }

    executeLine(line) {
        const { command, parameters } = this.parseLine(line);
        const commandResult = this.processCommand(command, parameters);

        let result = `${line}\n`;
        if (commandResult) {
            result += `${commandResult}\n`;
        }
        return result.trim()
    }

    executeInstructions(instructions) {
        let result = '';
        const lines = instructions.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
        for (let line of lines) {
            result += this.executeLine(line) + '\n';
        }
        stdout.write(result.trim());
        return result.trim();
    }

    shellProcess() {
        stdin.setEncoding('utf-8');

        this.rl = readline.createInterface(
            stdin,
            stdout
        );

        this.rl.resume();
        this.rl.on('line', (line) => {
            const [, ...results] = this.executeLine(line).split('\n');
            if (results && results.length > 0) {
                console.log(results.join('\n'));
            }
        });

    }


}

module.exports = { Process }