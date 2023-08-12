/* eslint-disable no-import-assign */
import { findOidInTree } from './git-handler'
import * as git from 'isomorphic-git'

describe('findOidInTree', () => {
  const mockFs = {}
  const mockDir = '/mockDir'
  const mockFilepath = 'mockFilepath.ts'

  afterEach(() => {
    jest.clearAllMocks()
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
        }
      ]
    }
    const mockSubTree: git.ReadTreeResult = {
      oid: 'someOtherOid',
      tree: [
        {
          mode: '100644',
          path: 'mockFilepath.ts',
          oid: 'mockOid',
          type: 'blob'
        }
      ]
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
