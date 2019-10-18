
class RemoveKey {
  constructor() {

  }

  async inspectPackage(pkg) {
    this.keys = Object.keys(pkg);
  }

  async handle(prompter) {
    const key = prompter.getKey();
    await prompter.removeKey(key);
    await prompter.save();
  }

  get name() {
    return "Remove key from package.json " + this.keys.join(", ");
  }
}

module.exports = RemoveKey;