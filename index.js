require('./lib/setup-inquirer');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

clear();
console.log(
	chalk.yellow(
		figlet.textSync('Package Cli', { horizontalLayout: 'full' })
	)
);
const something = (v) => v.length > 0 ? true : 'Please enter something!';

const inquirer = require('inquirer');

const options = ['Add a script tag','Remove key from package.json'];

const questions = {};

const run = async() => {
  questions.name = 'packageFile';
  questions.type = 'input';
  questions.default = './package.json';
  questions.message = 'Which package.json file';
  questions.validate = something;
  const { packageFile } = await inquirer.prompt(questions);
  delete questions.default;
  
  questions.name = 'option';
  questions.type = 'list';
  questions.message = 'Enter your questions, answer here?';
  questions.validate = something;
  questions.choices = options;
  const { option } = await inquirer.prompt(questions);

  if(option == 'Add a script tag') {
    questions.name = 'scriptName';
    questions.type = 'input';
    questions.message = 'What is the name of the script?';
    delete questions.choices;
    const { scriptName } = await inquirer.prompt(questions);

    questions.name = 'command';
    questions.type = 'input';
    questions.message = `What command would you like to that '${scriptName}'?`;
    const { command } = await inquirer.prompt(questions);

    console.log(`Scriptname: ${scriptName} $ ${command}`);
    const pkgFile = await jsonfile.readFile(packageFile);
    pkgFile.scripts = pkgFile.scripts || {};
    pkgFile.scripts[scriptName] = command;
    await jsonfile.writeFile(packageFile, pkgFile, { spaces: 3 }, (err) => console.log(err));

  }else if(option == 'Remove key from package.json') {
    questions.name = 'key';
    questions.type = 'input';
    questions.message = 'What key would you like to remove?';
    const { key } = await inquirer.prompt(questions);

    const pkgFile = await jsonfile.readFile(packageFile);
    delete pkgFile[key];
    await jsonfile.writeFile(packageFile, pkgFile, { spaces: 3 });
  }

}

run();
