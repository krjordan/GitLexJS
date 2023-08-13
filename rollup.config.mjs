import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  external: [
    'tslib',
    'fs',
    'path',
    'util',
    'child_process',
    'os',
    'crypto',
    'isomorphic-git',
    'diff',
    'openai'
  ],
  plugins: [
    typescript({ exclude: 'node_modules' }),
    nodeResolve({ exportConditions: ['node'], preferBuiltins: false }),
    commonjs({ include: 'node_modules/**' }),
    json()
  ]
}
