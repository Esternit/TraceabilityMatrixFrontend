class Requirement {
  constructor(name, initiator, importance, initiatorType) {
    this.name = name;
    this.initiator = initiator;
    this.initiatorType = initiatorType;
    this.importance = importance;
    this.dependencies = [];
  }

  setImportance(value) {
    this.importance = Math.max(0, Math.min(value, 10));
  }

  addDependency(requirement) {
    this.dependencies.push(requirement);
  }

  toString() {
    return `${this.name} (Initiator: ${this.initiator}, Importance: ${this.importance})`;
  }
}

export default Requirement;
