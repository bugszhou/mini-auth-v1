import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from '@joseph184/rollup-plugin-node-builtins';
import { terser } from "rollup-plugin-terser";

export default {
  external: ['hash.js', 'miniapp-auth', 'promise'],
  input: 'src/entry/index.js',
  output: [
    // umd，第三方依赖未打包
    {
      name: 'mini-auth-v1',
      file: 'dist/mini-auth-v1.js',
      format: 'umd',
      sourcemap: true,
      strict: true,
      noConflict: true,
    },
    // umd压缩后，第三方依赖未打包
    {
      name: 'mini-auth-v1',
      file: 'dist/mini-auth-v1.common.js',
      format: 'umd',
      sourcemap: true,
      strict: true,
      noConflict: true,
      plugins: [terser()],
    },
    // 使用es6 import语法
    {
      file: 'dist/mini-auth-v1.esm.js',
      format: 'es',
      sourcemap: true,
      strict: true,
    },
  ],
  plugins: [
    json(),
    resolve(),
    builtins(),
    babel({
      configFile: path.resolve(__dirname, './src/entry/.babelrc'),
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs(),
  ],
  watch: {
    clearScreen: true,
    include: 'src/**',
  },
};
