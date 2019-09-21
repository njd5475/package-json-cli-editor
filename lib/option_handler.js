
class OptionHandler {

  constructor(prompter) {
    this.prompter = prompter;    
  }

  get handlerByOption() {
    return {
      'Add a script tag': this.addScriptTag.bind(this),
      'Add keywords list': this.addKeywordsList.bind(this),
      'Bump version': this.bumpVersion.bind(this),
      'Remove key from package.json': this.removeKey.bind(this),
      'View Key': this.viewKey.bind(this),
    }
  }

  async addScriptTag() {
    const scriptName = await this.prompter.scriptTag();
    const command = await this.prompter.command(scriptName);

    console.log(`Scriptname: ${scriptName} $ ${command}`);
    await this.prompter.addScriptTag(scriptName, command)
    await this.prompter.save();
  }

  async addKeywordsList() {
    const keywords = await this.prompter.getKeywordsList();
    await this.prompter.setKeywordsList(keywords);
    console.log(chalk.red(this.prompter.pkg.keywords));
    await this.prompter.save();
  }

  async bumpVersion() {
    const part = await this.prompter.getSemVerPart();
    await this.prompter.bumpVersionPart(part);
    await this.prompter.save();
  }

  async removeKey() {
    const key = this.prompter.getKey();
    await this.prompter.removeKey(key);
    await this.prompter.save();
  }

  async viewKey() {
    const key = await this.prompter.getKey();
    await this.prompter.viewKey(key);
  }
}

module.exports = { OptionHandler }