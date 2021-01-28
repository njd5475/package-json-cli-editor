const BaseCommand = require('../base_command');
const chalk = require('chalk');
const fs = require('fs');

class AddRepository extends BaseCommand {
  inspectPackage(pkg) {
    return pkg.bin === undefined;
  }

  buildArgsProcessor(args) {
    return args.command(
      'bin [name] [script]', 
      'Adds a binary name:script to the package file',
      (yargs) => {
        yargs.positional('name', {
          describe: 'The binary name',
          default: process.argv[1],
        }).positional('script', {
          describe: 'The script to run when binary is executed',
          default: 'index.js',
        });
      }, 
      (argv) => {
        //command to execute
        console.log(`Adding ${chalk.blue(argv.script)} script to execute for binary ${chalk.red(argv.name)}`)
      });
  }

  async handle(prompter) {
    let bin;
    const binary = await prompter.confirm('Do you have a name for your binary?', true);
    if(binary) {
      const name = await prompter.getInput('What is the command name for your binary?');
      const program = await prompter.getInput('What is the path to your binary?');

      await this.validate(program);

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
    const fileExists = async path => !!(await fs.promises.stat(path).catch(e => false));
    if(!fileExists(program)) {
      //TODO: Change this to ask the user if they want to add it anyway
      throw new Error(`Program not found at ${program}`);
    }
  }

  get name() {
    return `Add bin (missing)`;
  }
}

module.exports = AddRepository;