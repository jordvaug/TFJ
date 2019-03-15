class Auth {
  constructor() {
    this.getToken = this.getToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  isAuthenticated() {
    if (this.getToken()) return true;
    return false;
  }
  getToken() {
    return localStorage.getItem("TFJtoken");
  }
  setToken(token) {
    this.token = token;
  }
  signOut() {
    localStorage.removeItem("TFJtoken");
  }
}

const auth = new Auth();

export default auth;
