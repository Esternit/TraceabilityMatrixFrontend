class Requirement {
  constructor(name, initiator, description) {
    this.name = name;
    this.initiator = initiator;
    this.description = description;
    this.dependencies = [];
  }

  addDependency(requirement) {
    this.dependencies.push(requirement);
  }

  toString() {
    return `${this.name} (Initiator: ${this.initiator}, Importance: ${this.importance})`;
  }
}

export default Requirement;
