const { Process } = require("../lib/process")

const input = `
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

const result = `CREATE fruits
CREATE vegetables
CREATE grains
CREATE fruits/apples
CREATE fruits/apples/fuji
LIST
fruits
  apples
    fuji
grains
vegetables
CREATE grains/squash
MOVE grains/squash vegetables
CREATE foods
MOVE grains foods
MOVE fruits foods
MOVE vegetables foods
LIST
foods
  fruits
    apples
      fuji
  grains
  vegetables
    squash
DELETE fruits/apples
Cannot delete fruits/apples - fruits does not exist
DELETE foods/fruits/apples
LIST
foods
  fruits
  grains
  vegetables
    squash`;

const executeLineOutput = `LIST
grains
  squash`;

describe('Process', () => {
  test('Parse Line', () => {
    const p = new Process;
    const r = p.parseLine('CREATE grains/squash');

    expect(r).toEqual({
      command: 'CREATE',
      parameters: ['grains/squash']
    });
  })

  test('Execute Line', () => {
    const p = new Process;
    p.executeLine('CREATE grains/squash')
    const r = p.executeLine('LIST');

    expect(r).toBe(executeLineOutput);
  })

  test('Execute instructions array', () => {
    const p = new Process;
    const r = p.executeInstructions(input);

    expect(r).toBe(result);
  })
})