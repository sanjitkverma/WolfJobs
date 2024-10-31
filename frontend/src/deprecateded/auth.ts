import { toast } from "react-toastify";
import { getFormBody } from "./apiUtils";
import { loginURL, signupURL } from "../api/constants";
import axios from "axios";

export async function login(email: string, password: string, navigate: any) {
  const url = loginURL;
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: getFormBody({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem("token", data.data.token);
        navigate("/dashboard");
        return;
      }
      toast.error("Login Failed");
    });
}

export async function signup(
  email: string,
  password: string,
  confirmPassword: string,
  name: string,
  role: string,
  affiliation: string,
  skills: string[],
  navigate: any
) {
  const url = signupURL;

  try {
    const response = await axios.post(url, {
      email,
      password,
      confirm_password: confirmPassword,
      name,
      role,
      skills,
      affiliation,
    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      navigate("/dashboard");
    } else {
      toast.error("Sign up Failed");
    }
  } catch (error) {
    // Handle errors, could be network issues, etc.
    toast.error("Sign up Failed: Unknown error");
  }
}