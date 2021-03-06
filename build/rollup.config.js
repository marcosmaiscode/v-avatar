import buble from '@rollup/plugin-buble'
import replace from '@rollup/plugin-replace'

import commonjs from 'rollup-plugin-commonjs'

import { terser } from 'rollup-plugin-terser'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))

const baseConfig = {
  input: 'src/build.js',
  plugins: {
    preVue: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      commonjs()
    ],
    postVue: [buble()]
  }
}

const external = []
const globals = {}

const buildFormats = []
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    external,
    output: {
      file: 'dist/v-avatar.esm.js',
      format: 'esm',
      exports: 'named'
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      ...baseConfig.plugins.postVue,
      terser({
        output: {
          ecma: 6
        }
      })
    ]
  }
  buildFormats.push(esConfig)
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/v-avatar.ssr.js',
      format: 'cjs',
      name: 'VAvatar',
      exports: 'named',
      globals
    },
    plugins: [...baseConfig.plugins.preVue, ...baseConfig.plugins.postVue]
  }
  buildFormats.push(umdConfig)
}

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/v-avatar.min.js',
      format: 'iife',
      name: 'VAvatar',
      exports: 'named',
      globals
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      ...baseConfig.plugins.postVue,
      terser({
        output: {
          ecma: 5
        }
      })
    ]
  }
  buildFormats.push(unpkgConfig)
}

// Export config
export default buildFormats
