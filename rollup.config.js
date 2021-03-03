import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'

import builtins from 'builtin-modules'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      strict: false,
    },
  ],
  plugins: [
    typescript(),
    alias(),
  ],
  external: [
    ...builtins,

    // modules to install
    'discord.js',
  ],
}
