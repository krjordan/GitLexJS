"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateDiff = exports.getGitChanges = void 0;
const git = require("isomorphic-git");
const fs = require("fs");
const nativeFs = require("fs/promises");
const diff_1 = require("diff");
function findOidInTree(fs, dir, treeOid, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tree = yield git.readTree({ fs, dir, oid: treeOid });
            for (const entry of tree.tree) {
                if (entry.path === filepath) {
                    return entry.oid;
                }
                else if (entry.type === 'tree') {
                    const oid = yield findOidInTree(fs, dir, entry.oid, filepath);
                    if (oid)
                        return oid;
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(`Error in findOidInTree for directory ${dir} and filepath ${filepath}:`, error.message);
            }
            else {
                // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
                console.error(`Error in findOidInTree for directory ${dir} and filepath ${filepath}:`, error);
            }
            // Here, we'll throw it so the calling function knows there was an error.
            throw error;
        }
        return null;
    });
}
function getGitChanges(repoPath = '.') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const statusMatrix = yield git.statusMatrix({ fs, dir: repoPath });
            const diffs = [];
            const headCommitOid = yield git.resolveRef({
                fs,
                dir: repoPath,
                ref: 'HEAD'
            });
            const headCommit = yield git.readCommit({
                fs,
                dir: repoPath,
                oid: headCommitOid
            });
            for (const [filepath, , workdirStatus] of statusMatrix) {
                if (workdirStatus) {
                    const headBlobOid = yield findOidInTree(fs, repoPath, headCommit.commit.tree, filepath);
                    if (headBlobOid) {
                        const headBlob = yield git.readBlob({
                            fs,
                            dir: repoPath,
                            oid: headBlobOid
                        });
                        const workdirContent = yield nativeFs.readFile(`${repoPath}/${filepath}`, 'utf8');
                        const changes = (0, diff_1.diffLines)(headBlob.blob.toString(), workdirContent);
                        let formattedDiff = `Changes in ${filepath}:\n---\n`;
                        changes.forEach((part) => {
                            const symbol = part.added ? '+ ' : part.removed ? '- ' : '  ';
                            let value = '';
                            if (part.removed) {
                                const numberArray = part.value.split(',').map(Number);
                                const chars = [];
                                for (const num of numberArray) {
                                    chars.push(String.fromCharCode(num));
                                }
                                value = chars.join('');
                            }
                            else {
                                value = part.value;
                            }
                            formattedDiff += `${symbol}${value}\n`;
                        });
                        formattedDiff += '+++\n';
                        diffs.push(formattedDiff);
                    }
                }
            }
            return diffs.join('\n');
        }
        catch (error) {
            console.error('An error occurred while fetching Git changes:', error);
            throw new Error('Failed to fetch Git changes.');
        }
    });
}
exports.getGitChanges = getGitChanges;
function truncateDiff(diff, maxSize = 4000) {
    try {
        // Check for invalid inputs
        if (typeof diff !== 'string') {
            throw new Error('Provided diff is not a string.');
        }
        if (typeof maxSize !== 'number' || maxSize <= 0) {
            throw new Error('Invalid max_size value. It should be a positive number.');
        }
        if (diff.length <= maxSize) {
            return diff;
        }
        const truncationPoint = diff.lastIndexOf('\n\n', maxSize);
        if (truncationPoint === -1) {
            return 'Large number of changes, please review.';
        }
        return diff.substring(0, truncationPoint) + '...\n';
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error in truncateDiff:', error.message);
        }
        return 'Error processing the diff. Please check the provided input.';
    }
}
exports.truncateDiff = truncateDiff;
