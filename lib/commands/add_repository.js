
class AddRepository {
  inspectPackage(pkg) {
    return pkg.repository === undefined;
  }

  async handle(prompter) {
    const type = prompter.getInput('What type of version control system?');
    const url = prompter.getInput('What is the repository url?');
    await prompter.setKey('repository', {
      type, url,
    });
    await prompter.save();
  }

  get name() {
    return `Add Respository to package.json`;
  }
}

module.exports = AddRepository;