/* eslint-disable no-import-assign */
import * as gitHandler from '../../src/git/git-handler'
import * as git from 'isomorphic-git'
import * as nativeFs from 'fs/promises'
import {
  getGitChanges,
  findOidInTree,
  getChangedFiles,
  getChangesInFile,
  truncateDiff
} from '../../src/git/git-handler'

describe('findOidInTree', () => {
  const mockFs = {}
  const mockDir = '/mockDir'
  const mockFilepath = 'mockFilepath.ts'

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should successfully find the OID in the tree', async () => {
    const mockTreeOid = 'mockTreeOid'
    const mockTree: git.ReadTreeResult = {
      oid: 'someOid',
      tree: [
        {
          mode: '100644',
          path: 'mockFilepath.ts',
          oid: 'mockOid',
          type: 'blob'
        }
      ]
    }

    jest.spyOn(git, 'readTree').mockResolvedValue(mockTree)

    const result = await findOidInTree(
      mockFs,
      mockDir,
      mockTreeOid,
      mockFilepath
    )
    expect(result).toBe('mockOid')
  })

  test('should return null if the OID is not found in the tree', async () => {
    const mockTreeOid = 'mockTreeOid'
    const mockTree: git.ReadTreeResult = {
      oid: 'someOid',
      tree: []
    }

    jest.spyOn(git, 'readTree').mockResolvedValue(mockTree)

    const result = await findOidInTree(
      mockFs,
      mockDir,
      mockTreeOid,
      mockFilepath
    )
    expect(result).toBe(null)
  })

  test('should throw an error if there is an issue reading the tree', async () => {
    const mockTreeOid = 'mockTreeOid'
    const mockError = new Error('mockError')

    jest.spyOn(git, 'readTree').mockRejectedValue(mockError)
    jest.spyOn(console, 'error').mockImplementation()

    await expect(
      findOidInTree(mockFs, mockDir, mockTreeOid, mockFilepath)
    ).rejects.toThrow(mockError)
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  test('should recursively find the OID in a sub-tree', async () => {
    const mockTreeOid = 'mockTreeOid'
    const mockTree: git.ReadTreeResult = {
      oid: 'someOid',
      tree: [
        {
          mode: '040000',
          path: 'mockDir',
          oid: 'mockDirOid',
          type: 'tree'
        },
        {
          mode: '100644',
          path: 'mockFilepath.ts',
          oid: 'mockOid',
          type: 'blob'
        }
      ]
    }
    const mockSubTree: git.ReadTreeResult = {
      oid: 'someOtherOid',
      tree: []
    }

    jest
      .spyOn(git, 'readTree')
      .mockResolvedValueOnce(mockTree)
      .mockResolvedValueOnce(mockSubTree)

    const result = await findOidInTree(
      mockFs,
      mockDir,
      mockTreeOid,
      mockFilepath
    )
    expect(result).toBe('mockOid')
  })
})
describe('getChangedFiles', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('should return changed files', async () => {
    // Mock git.statusMatrix to return a predefined status matrix
    jest.spyOn(git, 'statusMatrix').mockResolvedValue([
      ['file1', 1, 2, 0],
      ['file2', 1, 2, 0],
      ['file3', 1, 0, 0]
    ])

    const changedFiles = await getChangedFiles('.')

    expect(changedFiles).toEqual(['file1', 'file2', 'file3'])
  })
})

describe('truncateDiff', () => {
  test('should truncate diff', () => {
    const diff = 'a'.repeat(5000)

    const truncatedDiff = truncateDiff(diff)

    expect(truncatedDiff.length).toBeLessThan(4000)
  })
})

describe('getContextLines', () => {
  test('should return context lines', () => {
    const content = 'line1\nline2\nline3\nline4\nline5\nline6\nline7'
    const lineNum = 3
    const context = 2

    const result = gitHandler.getContextLines(content, lineNum, context)

    expect(result).toEqual(['line2', 'line3', 'line4', 'line5'])
  })
})
