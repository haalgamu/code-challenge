const { Process } = require('./lib/process')
const fs = require('fs');
const readline = require('readline');

async function main() {
    const [, , path, keepExecution] = process.argv;
    const p = new Process;
    if (path) {
        const rl = readline.createInterface(
            fs.createReadStream(path)
        );

        for await (const line of rl) {
            console.log(p.executeLine(line))
        }
    }

    if (keepExecution && keepExecution == 'true') {
        /////////////////////////////////////////
        //If you want to execute the process on the shell and this stay executed
        p.shellProcess();
    }


}

main();