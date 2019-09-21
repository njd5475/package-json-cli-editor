const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const syms = require('log-symbols');
const jsonfile = require('jsonfile');
var semver = require('semver');

const questions = {};

class PackageQuestioner {

  constructor() {

  }

  async whichPackage() {
    questions.name = 'packageFile';
    questions.type = 'input';
    questions.default = './package.json';
    questions.message = `Which package.json file ${this.isFound('./package.json')}`;
    questions.validate = this.something;
    const { packageFile } = await inquirer.prompt(questions);
    delete questions.default;
    this.packageFile = packageFile;
  }

  async scriptTag() {
    questions.name = 'scriptName';
    questions.type = 'input';
    const firstFive = await Object.keys(this.pkg.scripts).slice(0,5).join(', ');
    const ifScriptsGreaterThanFive = (await Object.keys(this.pkg.scripts)).length > 5 ? '...' : '';
    questions.message = `What is the name of the script? (${firstFive}${ifScriptsGreaterThanFive})`;
    delete questions.choices;
    const { scriptName } = await inquirer.prompt(questions);
    return scriptName;
  }

  async command(scriptName) {
    questions.name = 'command';
    questions.type = 'input';
    questions.message = `What command would you like for '${scriptName}'?`;
    const { command } = await inquirer.prompt(questions);
    return command;
  }

  async getKeywordsList() {
    questions.name = 'keywords';
		questions.type = 'input';
		questions.message = 'List of keywords separated by commas?';

    const { keywords } = await inquirer.prompt(questions);
    return keywords;
  }

  async setKeywordsList(keywords) {
		this.pkg.keywords = keywords.split(',').map(k => k.trim());
  }

  async chooseOptions() {
    questions.name = 'option';
    questions.type = 'list';
    questions.message = 'Choose an option below?';
    questions.validate = this.something;
    questions.choices = this.options;
    const { option } = await inquirer.prompt(questions);
    return option;
  }

  async addScriptTag(scriptName, command) {
    this.pkg.scripts = this.pkg.scripts || {};
    this.pkg.scripts[scriptName] = command;
    await this.save();
  }

  async bumpVersionPart(part) {
    this.pkg.version = semver.inc(this.pkg.version, part, '');
  }

  async listKeys() {
    questions.name = 'choice';
		questions.type = 'list';
		questions.choices = Object.keys(this.pkg);
    questions.validate = this.something;
    
    return await inquirer.prompt(questions);;
  }

  async viewKey(choice) {
		console.log(choice);
		console.log(chalk.blue(JSON.stringify({[choice]: this.pkg[choice]}, null, 3)));
  }

  async getKey() {
    questions.name = 'key';
    questions.type = 'input';
    questions.message = `What key would you like to remove?\n(maybe? ${Object.keys(this.pkg).join(',')})`;
    const { key } = await inquirer.prompt(questions);
    return key;
  }

  async getSemVerPart() {
		questions.name = 'part';
		questions.type = 'list';
		questions.message = 'Select semver part';
		questions.choices = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

    const { part } = await inquirer.prompt(questions);
    return part;
  }

  async removeKey(key) {
    delete this.pkg[key];
  }

  async save() {
    await jsonfile.writeFile(this.packageFile, this.pkg, { spaces: 3 });
  }

  async readPackageFile() {
    this.pkg = await jsonfile.readFile(this.packageFile);
  }

  something(v) {
    return v.length > 0 ? true : 'Please enter something!';
  } 


  isFound(path) {
    return fs.existsSync(path) ? chalk.green(` (${syms.success} found)`) : '';
  }

  get options() {
    return ['View Key','Add a script tag', 'Add keywords list','Bump version','Remove key from package.json','Quit'];
  }
}

module.exports = { PackageQuestioner };