# Directories

Directories is a script to solve the code challenge of ENDP-ENG position.

## Usage
On the shell, write this command:

```bash
node directories.js PATH KEEP_EXECUTION
```
PATH: Path of file
KEEP_EXECUTION: If you want keep the execution of script.

After that, you can copy and paste the commands those you want to execute or just write them on the shell. Remember just these commands are valid: CREATE, MOVE, DELETE, LIST and END.

CREATE command:
```bash
CREATE ANY_PATH
```

MOVE command: If the first path (EXISTING_PATH) doesn't exist the process do nothing.
```bash

MOVE EXISTING_PATH ANY_PATH
```

DELETE command: If the EXISTING_PATH doesn't exist the process do nothing.
```bash
DELETE EXISTING_PATH
```

LIST command: Print the folder tree on the shell
```bash
LIST
```

END command: Exit the program.
```bash
END
```
The process remains running in the console. If you want to disable this feature just comment out the last line of the script: p.shellProcess();
## License
[MIT](https://choosealicense.com/licenses/mit/)