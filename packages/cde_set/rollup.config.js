import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts', // path to your input file
  output: {
    dir: 'dist',
    format: 'cjs', // commonjs format
  },
  plugins: [
    typescript({
      exclude: ['**/*.test.ts'],
    }), // compiles TypeScript files
    resolve(), // finds @rollup/plugin-node-resolve in node_modules
    commonjs(), // converts @rollup/plugin-commonjs to ES modules
    json(), // converts .json files to ES modules
  ],
};
