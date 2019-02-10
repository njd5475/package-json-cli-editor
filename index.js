#!/usr/bin/env node

require('./lib/setup-inquirer');
const jsonfile = require('jsonfile');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const syms = require('log-symbols');
const fs = require('fs');

clear();
console.log(
	chalk.yellow(
		figlet.textSync('Package Cli', { horizontalLayout: 'full' })
	)
);
const something = (v) => v.length > 0 ? true : 'Please enter something!';

const inquirer = require('inquirer');

const options = ['View Key','Add a script tag','Bump version','Remove key from package.json','Quit'];

const questions = {};

const isFound = (path) => { return fs.existsSync(path) ? chalk.green(` (${syms.success} found)`) : ''; }

const run = async() => {
  questions.name = 'packageFile';
  questions.type = 'input';
  questions.default = './package.json';
  questions.message = `Which package.json file ${isFound('./package.json')}`;
  questions.validate = something;
  const { packageFile } = await inquirer.prompt(questions);
  delete questions.default;

  questions.name = 'option';
  questions.type = 'list';
  questions.message = 'Enter your questions, answer here?';
  questions.validate = something;
  questions.choices = options;
  const { option } = await inquirer.prompt(questions);
	const pkgFile = await jsonfile.readFile(packageFile);

  if(option == 'Add a script tag') {
    questions.name = 'scriptName';
    questions.type = 'input';
    questions.message = `What is the name of the script? (${Object.keys(pkgFile.scripts).slice(0,5).join(', ')}${Object.keys(pkgFile.scripts).length > 5 ? '...' : ''})`;
    delete questions.choices;
    const { scriptName } = await inquirer.prompt(questions);

    questions.name = 'command';
    questions.type = 'input';
    questions.message = `What command would you like to that '${scriptName}'?`;
    const { command } = await inquirer.prompt(questions);

    console.log(`Scriptname: ${scriptName} $ ${command}`);
    pkgFile.scripts = pkgFile.scripts || {};
    pkgFile.scripts[scriptName] = command;
    await jsonfile.writeFile(packageFile, pkgFile, { spaces: 3 }, (err) => console.log(err));

	}else if(option == 'Bump version') {
		var semver = require('semver');
		questions.name = 'part';
		questions.type = 'list';
		questions.message = 'Select semver part';
		questions.choices = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

		const { part } = await inquirer.prompt(questions);
		pkgFile.version = semver.inc(pkgFile.version, part, '');
		await jsonfile.writeFile(packageFile, pkgFile, { spaces: 3 });
  }else if(option == 'Remove key from package.json') {
    questions.name = 'key';
    questions.type = 'input';
    questions.message = `What key would you like to remove?\n(maybe? ${Object.keys(pkgFile).join(',')})`;
    const { key } = await inquirer.prompt(questions);

    delete pkgFile[key];
    await jsonfile.writeFile(packageFile, pkgFile, { spaces: 3 });
  }else if(option == 'quit') {
		process.exit(0);
	}else if(option == 'View Key') {
		questions.name = 'choice';
		questions.type = 'list';
		questions.choices = Object.keys(pkgFile);
		questions.validate = something;

		const { choice } = await inquirer.prompt(questions);
		console.log(choice);
		console.log(chalk.blue(JSON.stringify({[choice]: pkgFile[choice]}, null, 3)));
	}

}

run();
