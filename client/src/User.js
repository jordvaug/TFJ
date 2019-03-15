class User {
  constructor() {
    this.name = "";
    this.email = "";
    this.setName = this.setName.bind(this);
    this.setEmail = this.setEmail.bind(this);
  }

  setName(name) {
    this.name = name;
  }
  setEmail(email) {
    this.email = email;
  }
}
const user = new User();

export default user;
