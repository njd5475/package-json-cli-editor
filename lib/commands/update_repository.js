
const BaseCommand = require('../base_command');

class UpdateRepository extends BaseCommand {

  inspectPackage(pkg) {
    this.repo = pkg.repository;
    return !!this.repo;
  }

  async handle(prompter) {
    const url = await prompter.getInput('Please provide a new url');
    prompter.setKey('repository', {
      ...this.repo,
      url,
    });
    await prompter.save();
  }

  get name() {
    return `Update repository (url=${this.repo.url})`;
  }
}

module.exports = UpdateRepository;