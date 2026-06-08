import { signup as apiSignup, login as apiLogin } from "./api";

export const signup = async (data) => {
  return apiSignup(data);
};

export const login = async (data) => {
  return apiLogin(data);
};