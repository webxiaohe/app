module.exports = {
  getTransformModulePath() {
    return require.resolve('./config/transformers.js')
  },
  getSourceExts() {
    return ['ts', 'tsx']
  },
}
