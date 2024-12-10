import BaseService from "./BaseService";

class UserService extends BaseService {
  constructor() {
    super("user");
  }

  async login(credentials) {
    const response = await this.api.post(`${this.endPoint}/login`, credentials);
    return response.data;
  }

  async register(user) {
    const response = this.api.post(`${this.endPoint}`, user);
    return response.data;
  }

  async emailCodeValidation(email, code) {
    const response = await this.api.get(
      `${this.endPoint}/email-validation/${email}/${code}`
    );
    return response.data;
  }

  async recoverSendEmail(email) {

    const response = await this.api.post(
      `${this.endPoint}/recover-email`,{email}
    );
    return response.data;
  }

  async recoverVerifyCode(validationCode) {

    const response = await this.api.post(
      `${this.endPoint}/recover-code`,{validationCode}
    );
    return response.data;
  }

  async recoverChangePassword(user) {

    console.log(user);
    const response = await this.api.post(
      `${this.endPoint}/recover-change`,user
    );
    return response.data;
  }

  async getUserRole(siape) {
    const response = await this.api.get(`${this.endPoint}/getUserRole`, {
      params: { siape },
    });
    return response.data;
  }
}
export default UserService;
