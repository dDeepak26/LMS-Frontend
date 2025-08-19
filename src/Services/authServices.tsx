import axios from "axios";

const BASE_URL = "http://localhost:8080/auth";

// login service
const userLoginService = async (values: any) => {
  const login = await axios
    .post(`${BASE_URL}/login`, values)
    .then((res) => res.data)
    .catch((err) => err.response.data.errMsg || err);

  return login;
};

// register service
const userRegisterService = async (values: any) => {
  const register = await axios
    .post(`${BASE_URL}/register`, values)
    .then((res) => res.data)
    .catch((err) => err.response.data.errMsg || err);

  return register;
};

export { userLoginService, userRegisterService };
