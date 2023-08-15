import * as git from 'isomorphic-git'
import * as fs from 'fs'
import * as nativeFs from 'fs/promises'
import { diff_match_patch } from 'diff-match-patch'
// eslint-disable-next-line new-cap
const dmp = new diff_match_patch()

const MAX_SIZE = 4000

export async function findOidInTree(
  fs: any,
  dir: string,
  treeOid: string,
  filepath: string,
  currentDir: string = ''
): Promise<string | null> {
  try {
    const tree = await git.readTree({ fs, dir, oid: treeOid })
    for (const entry of tree.tree) {
      const fullPath = currentDir ? `${currentDir}/${entry.path}` : entry.path
      if (fullPath === filepath) {
        return entry.oid
      } else if (entry.type === 'tree') {
        const oid = await findOidInTree(fs, dir, entry.oid, filepath, fullPath)
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
  const FILE = 0
  const WORKDIR = 2
  const STAGE = 3
  const changedFiles = (await git.statusMatrix({ fs, dir: repoPath }))
    .filter((row: any[]) => row[WORKDIR] !== row[STAGE] || row[WORKDIR] === 0)
    .map((row: any[]) => row[FILE])

  return changedFiles
}

export async function getChangesInFile(
  repoPath: string,
  filepath: string,
  headCommit: git.ReadCommitResult
): Promise<string[]> {
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

    // Convert the Uint8Array to a string
    const blobContentAsString = new TextDecoder('utf-8').decode(headBlob.blob)

    const workdirContent = await nativeFs.readFile(
      `${repoPath}/${filepath}`,
      'utf8'
    )

    const diffs = dmp.diff_main(blobContentAsString, workdirContent)
    dmp.diff_cleanupSemantic(diffs)

    const lineChanges: string[] = []

    diffs.forEach((diff, idx) => {
      const operation = diff[0]
      const text = diff[1]
      const lines = text.split('\n')
      for (const line of lines) {
        if (line.trim().length === 0) continue
        if (operation === 1) {
          lineChanges.push(`+${String(line)}`)
        } else if (operation === -1) {
          lineChanges.push(`-${String(line)}`)
        }
      }
      if (operation === 1 || operation - 1) {
        const context = getContextLines(blobContentAsString, idx)
        lineChanges.push(`Context: ${context.join('\n')}`)
      }
    })

    return lineChanges
  }
  return []
}

export function getContextLines(
  content: string,
  lineNum: number,
  context: number = 3
): string[] {
  const lines = content.split('\n')
  const start = Math.max(0, lineNum - context)
  const end = Math.min(lines.length, lineNum + context)
  return lines.slice(start, end)
}

export async function getGitChanges(repoPath: string = '.'): Promise<string> {
  try {
    try {
      const headCommitOid = await git.resolveRef({
        fs,
        dir: repoPath,
        ref: 'HEAD'
      })
      const headCommit = await git.readCommit({
        fs,
        dir: repoPath,
        oid: headCommitOid
      })

      const changedFiles = await getChangedFiles(repoPath)
      if (changedFiles.length === 0) {
        return ''
      }

      // console.log('Getting changes in files...')
      const diffs = await Promise.all(
        changedFiles.map(async (filepath) => {
          const changes = await getChangesInFile(repoPath, filepath, headCommit)
          return changes.filter((change) => change !== '').join('\n')
        })
      )
      if (diffs.join('\n').trim() === '') {
        console.log('No changes have been made.')
        return 'No changes have been made.'
      }
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

export function truncateDiff(diff: string, maxSize: number = MAX_SIZE): string {
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
