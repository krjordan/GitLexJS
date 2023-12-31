import typescript from '@rollup/plugin-typescript'
import pkg from './package.json' assert { type: 'json' }
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    banner: '#!/usr/bin/env node'
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
    json(),
    replace({
      VERSION: JSON.stringify(pkg.version)
    })
  ]
}
