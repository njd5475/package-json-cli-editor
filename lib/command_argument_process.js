
function loadArgumentProcessor(folder, args) {
  const dir = require('path').resolve(__dirname, folder);
  const files =  require('fs').readdirSync(dir);
  for(let file of files) {
    if(file.endsWith('.js') || file.endsWith('.ts')) {
      const command = require(require('path').resolve(__dirname, folder, file));
      const cmdInst = new command();
      if(cmdInst.buildArgsProcessor) {
        args = cmdInst.buildArgsProcessor(args);
      }
    }
  }
  return args;
}

module.exports = loadArgumentProcessor