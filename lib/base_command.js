
class BaseCommand {

  constructor() {

  }

  inspectPackage(pkg) {
    
  }

  buildArgsProcessor(args) {
    return args;
  }

  async handle(prompter) {
    
  }

  get name() {
    return "BaseCommand";
  }
}

module.exports = BaseCommand