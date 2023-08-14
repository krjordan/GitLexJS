import * as git from 'isomorphic-git'
import * as fs from 'fs'
import * as nativeFs from 'fs/promises'
import { diffLines } from 'diff'

export async function findOidInTree(
  fs: any,
  dir: string,
  treeOid: string,
  filepath: string
): Promise<string | null> {
  try {
    const tree = await git.readTree({ fs, dir, oid: treeOid })
    for (const entry of tree.tree) {
      if (entry.path === filepath) {
        return entry.oid
      } else if (entry.type === 'tree') {
        const oid = await findOidInTree(fs, dir, entry.oid, filepath)
        if (oid) return oid
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error in findOidInTree for directory ${dir} and filepath ${filepath}:`,
        error.message
      )
    } else {
      // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
      console.error(
        `Error in findOidInTree for directory ${dir} and filepath ${filepath}:`,
        error
      )
    }
    // Here, we'll throw it so the calling function knows there was an error.
    throw error
  }

  return null
}

export async function getChangedFiles(repoPath: string): Promise<string[]> {
  const statusMatrix = await git.statusMatrix({ fs, dir: repoPath })
  const changedFiles = statusMatrix
    .filter(([, , workdirStatus]) => workdirStatus)
    .map(([filepath]) => filepath)
  return changedFiles
}

export async function getChangesInFile(
  repoPath: string,
  filepath: string,
  headCommit: git.ReadCommitResult
): Promise<string> {
  const headBlobOid = await findOidInTree(
    fs,
    repoPath,
    headCommit.commit.tree,
    filepath
  )

  if (headBlobOid) {
    const headBlob = await git.readBlob({
      fs,
      dir: repoPath,
      oid: headBlobOid
    })
    const workdirContent = await nativeFs.readFile(
      `${repoPath}/${filepath}`,
      'utf8'
    )
    const changes = diffLines(headBlob.blob.toString(), workdirContent)
    const addedLines = changes.filter((part) => part.added).length
    const removedLines = changes.filter((part) => part.removed).length

    return `Changes in ${filepath}: ${addedLines} lines added, ${removedLines} lines removed`
  }

  return ''
}

export async function getGitChanges(repoPath: string = '.'): Promise<string> {
  try {
    try {
      // console.log('Resolving ref...')
      const headCommitOid = await git.resolveRef({
        fs,
        dir: repoPath,
        ref: 'HEAD'
      })
      // console.log('Reading commit...')
      const headCommit = await git.readCommit({
        fs,
        dir: repoPath,
        oid: headCommitOid
      })

      // console.log('Getting changed files...')
      const changedFiles = await getChangedFiles(repoPath)
      if (changedFiles.length === 0) {
        return ''
      }

      // console.log('Getting changes in files...')
      let diffs = (
        await Promise.all(
          changedFiles.map(
            async (filepath) =>
              await getChangesInFile(repoPath, filepath, headCommit)
          )
        )
      ).filter((diff) => diff !== '')

      // console.log('Truncating diffs...')
      diffs = diffs.map((diff) => truncateDiff(diff))
      return diffs.join('\n')
    } catch (error) {
      console.error('An error occurred while fetching Git changes:', error)
      if (error instanceof Error) {
        console.error('Original error:', error.message)
        console.error('Error stack:', error.stack)
      }
      throw new Error('Failed to fetch Git changes.')
    }
  } catch (error) {
    console.error('An error occurred while fetching Git changes:', error)
    if (error instanceof Error) {
      console.error('Original error:', error.message)
      console.error('Error stack:', error.stack)
    }
    throw new Error('Failed to fetch Git changes.')
  }
}

export function truncateDiff(diff: string, maxSize: number = 4000): string {
  try {
    // Check for invalid inputs
    if (typeof diff !== 'string') {
      throw new Error('Provided diff is not a string.')
    }

    if (typeof maxSize !== 'number' || maxSize <= 0) {
      throw new Error('Invalid max_size value. It should be a positive number.')
    }

    if (diff.length <= maxSize) {
      return diff
    }

    const truncationPoint = diff.lastIndexOf('\n\n', maxSize)
    if (truncationPoint === -1) {
      return 'Large number of changes, please review.'
    }

    return diff.substring(0, truncationPoint) + '...\n'
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in truncateDiff:', error.message)
    }
    return 'Error processing the diff. Please check the provided input.'
  }
}
