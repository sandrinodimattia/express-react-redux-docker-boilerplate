import path from 'path';

export default {
  root: path.resolve(__dirname, '..'),
  client: path.resolve(__dirname, '../client'),
  clientEntryPoint: path.resolve(__dirname, '../client/index.jsx'),
  output: path.resolve(__dirname, '../dist')
};
