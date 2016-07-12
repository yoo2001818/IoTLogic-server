module.exports = {
  stdout: 'dev',
  access: {
    directory: 'log',
    filename: 'access.log',
    format: 'combined'
  }
  // We don't need error log anyway (for now)
};
