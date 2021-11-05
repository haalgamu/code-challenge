const { Disk } = require('../lib/disk');
const DiskMockups = require('./mockups/disk.mockups');


const operations = {
    create_first_directory: {
        path: DiskMockups.NEW_DIRECTORIES.FIRST_DIRECTORY.name
    },
    create_second_directory: {
        path: `${DiskMockups.NEW_DIRECTORIES.FIRST_DIRECTORY.name}/${DiskMockups.NEW_DIRECTORIES.SECOND_DIRECTORY.name}`
    },
    create_third_directory: {
        path: DiskMockups.NEW_DIRECTORIES.THIRD_DIRECTORY.name
    }
};

const moveResult = `${DiskMockups.NEW_DIRECTORIES.THIRD_DIRECTORY.name}
  ${DiskMockups.NEW_DIRECTORIES.FIRST_DIRECTORY.name}
    ${DiskMockups.NEW_DIRECTORIES.SECOND_DIRECTORY.name}`;

const deleteResult = DiskMockups.NEW_DIRECTORIES.FIRST_DIRECTORY.name;

describe('Disk', () => {
    test('Create', () => {
        const disk = new Disk();
        const result = disk.create(operations.create_first_directory.path);
        expect(result).toEqual(DiskMockups.NEW_DIRECTORIES.FIRST_DIRECTORY);
    })

    test('Move', () => {
        const disk = new Disk();
        disk.create(operations.create_first_directory.path);
        disk.create(operations.create_second_directory.path);
        disk.move(operations.create_first_directory.path, operations.create_third_directory.path);
        const list = disk.list();
        expect(list).toBe(moveResult);
    })

    test('Delete', () => {
        const disk = new Disk();
        disk.create(operations.create_second_directory.path);
        disk.delete(operations.create_second_directory.path);
        const list = disk.list();
        expect(list).toBe(deleteResult)
    })
})