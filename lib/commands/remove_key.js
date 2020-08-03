
const BaseCommand = require('../base_command');

class RemoveKey extends BaseCommand {
  inspectPackage(pkg) {
    this.keys = Object.keys(pkg);
  }

  async handle(prompter) {
    const key = prompter.getKey();
    await prompter.removeKey(key);
    await prompter.save();
  }

  get name() {
    return "Remove key from package.json " + this.keys.slice(0,5).join(", ");
  }
}

module.exports = RemoveKey;