const BaseCommand = require('../base_command');

class AddRepository extends BaseCommand {
  inspectPackage(pkg) {
    return pkg.bin === undefined;
  }

  async handle(prompter) {
    let bin;
    const binary = await prompter.confirm('Do you have a name for your binary?');
    if(binary) {
      const name = await prompter.getInput('What is the command name for your binary?');
      const program = await prompter.getInput('What is the path to your binary?');

      await validate(program);

      bin = {
        [name]: program
      }
    }else{
      const program = await prompter.getInput('What is the path to your binary?');
      bin = program;
    }
    await prompter.setKey('bin', bin);
    await prompter.save();
  }

  validate(program) {
    const path = require('path');
    if(!path.existsSync(program)) {
      //TODO: Change this to ask the user if they want to add it anyway
      throw new Error(`Program not found at ${program}`);
    }
  }

  get name() {
    return `Add Respository to package.json`;
  }
}

module.exports = AddRepository;