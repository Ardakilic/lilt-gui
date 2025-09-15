const path = require('path');

module.exports = [
  // Main process
  {
    entry: './src/main/main.ts',
    target: 'electron-main',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ 
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.main.json'
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@main': path.resolve(__dirname, 'src/main'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist/main'),
      filename: 'main.js'
    },
    node: {
      __dirname: false,
      __filename: false
    }
  },
  // Preload script
  {
    entry: './src/renderer/preload.ts',
    target: 'electron-preload',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ 
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.main.json'
            }
          }]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    },
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'preload.js'
    },
    node: {
      __dirname: false,
      __filename: false
    }
  }
];
