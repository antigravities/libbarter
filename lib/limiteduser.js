module.exports = class LimitedUser {
  constructor(id, name, libbarter, others = {}) {
    this._libbarter = libbarter;

    this.id = id;
    this.name = name;

    Object.keys(others).forEach(i => {
      this[i] = others[i];
    });
  }

  async getFullUser() {
    return await this._libbarter.getUser(this.id);
  }

  toString() {
    return this._libbarter._he.decode(this.name);
  }
}
