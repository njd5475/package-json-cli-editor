#!/usr/bin/env node

require('./lib/setup-inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

clear();
console.log(
	chalk.yellow(
		figlet.textSync('Package Cli', { horizontalLayout: 'full' })
	)
);

const { PackageQuestioner } = require('./lib/package_questioner');
const questioner = new PackageQuestioner();

(async() => {
  try {
    await questioner.whichPackage();
    await questioner.readPackageFile();
    option = await questioner.chooseOptions();

    if(option == 'Add a script tag') {
      const scriptName = await questioner.scriptTag();
      const command = await questioner.command(scriptName);

      console.log(`Scriptname: ${scriptName} $ ${command}`);
      await questioner.addScriptTag(scriptName, command)
      await questioner.save();
    }else if(option == 'Add keywords list') {
      const keywords = questioner.getKeywordsList();
      await questioner.setKeywordsList(keywords);
      console.log(chalk.red(pkgFile.keywords));
      await questioner.save();
    }else if(option == 'Bump version') {
      const { part, semver } =  questioner.getSemVerPart();
      questioner.bumpVersionPart(part);
      await questioner.save();
    }else if(option == 'Remove key from package.json') {
      const key = questioner.getKey();
      await questioner.removeKey(key);
      await questioner.save();
    }else if(option == 'quit') {
      process.exit(0);
    }else if(option == 'View Key') {
      const key = await questioner.getKey();
      await questioner.viewKey(key);
    }else{
      console.log(`Unknown option ${option}`);
    }
  }catch(err) {
    console.log(err);
  }
})();
