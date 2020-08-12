#!/usr/bin/env node

/**
 * Some helpful shortcut prompts for modifying your package json. 
 * See docs for package.json details: https://docs.npmjs.com/files/package.json
 */

require('./lib/setup-inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

clear();
console.log(
	chalk.yellow(
		figlet.textSync('Package Cli', { horizontalLayout: 'full' })
	)
);

const { PackagePrompter } = require('./lib/package_prompter');
const questioner = new PackagePrompter();
const { OptionHandler } = require('./lib/option_handler');
const handler = new OptionHandler(questioner);

(async() => {
  try {
    await questioner.whichPackage();
    await questioner.readPackageFile();
    
    do {
      option = await questioner.chooseOptions();

      const handleFunc = handler.handlerByOption[option];

      if(handleFunc.handle) {
        await handleFunc.handle(questioner);
      }else if(handleFunc) {
        await handleFunc();
      }

    }while(option !== 'Quit');
  }catch(err) {
    console.log(err);
  }
})();
