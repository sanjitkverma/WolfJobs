import { useNavigate } from "react-router-dom";
import { signup } from "../../deprecateded/auth";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Autocomplete } from "@mui/material";

import {
  Button,
  Stack,
  TextField,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  skills: string[];
};

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Applicant");
  const [affilation, setAffiliation] = useState("nc-state-dining");
  const [skillsDB, setSkillsDB] = useState<string[]>([]); // For fetched skills

  // Fetch skills from backend
  useEffect(() => {
    const fetchSkillsDB = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/users/skills");
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched skills:", data);
        setSkillsDB(data);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setSkillsDB([]);
      }
    };
    fetchSkillsDB();
  }, []);

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      skills: [],
    },
  });

  const { register, handleSubmit, formState, watch, setValue } = form;
  const { errors } = formState;

  const onSubmit = (data: FormValues) => {
    console.log("form submitted");
    console.log(data);
    signup(
      data.email,
      data.password,
      data.confirmPassword,
      data.name,
      role,
      role === "Manager" ? affilation : "",
      data.skills,
      navigate
    );
  };

  return (
    <>
      <div className="mx-auto bg-slate-50 content flex flex-col justify-center items-center">
        <div className=" p-4  border rounded bg-white">
          <div className="text-xl justify-center text-black mb-4 ">
            Create New Account
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} width={400}>
              <TextField
                label="Name"
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />

              <TextField
                label="Email Id"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <TextField
                label="Confirm password"
                type="password"
                {...register("confirmPassword", {
                  required: "Password is required",
                  validate: (val: string) => {
                    if (watch("password") !== val) {
                      return "Passwords don't match";
                    }
                  },
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{
                  "& label": {
                    paddingLeft: (theme) => theme.spacing(1),
                  },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.5),
                    borderRadius: "10px",
                  },
                }}
              />
              <Autocomplete
              multiple
              options={skillsDB}
              onChange={(_, value) => setValue("skills", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  error={!!errors.skills}
                  helperText={errors.skills?.message}
                  sx={{
                    "& label": { paddingLeft: (theme) => theme.spacing(1) },
                    "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                    "& fieldset": {
                      paddingLeft: (theme) => theme.spacing(1.5),
                      borderRadius: "10px",
                    },
                  }}
                />
              )}
            />
              <FormControl>
                <InputLabel id="role-id">Role</InputLabel>
                <Select
                  value={role}
                  labelId="role-id"
                  label="Role"
                  id="role"
                  onChange={(e: SelectChangeEvent) => {
                    setRole(e.target.value);
                  }}
                >
                  <MenuItem value={"Manager"}>Manager</MenuItem>
                  <MenuItem value={"Applicant"}>Applicant</MenuItem>
                </Select>
              </FormControl>
              {role === "Manager" && (
                <FormControl>
                  <InputLabel id="affiliation-id">Role</InputLabel>
                  <Select
                    value={affilation}
                    labelId="affiliation-id"
                    label="Role"
                    id="role"
                    onChange={(e: SelectChangeEvent) => {
                      setAffiliation(e.target.value);
                    }}
                  >
                    <MenuItem value={"nc-state-dining"}>
                      NC State Dining
                    </MenuItem>
                    <MenuItem value={"campus-enterprises"}>
                      Campus Enterprises
                    </MenuItem>
                    <MenuItem value={"wolfpack-outfitters"}>
                      Wolfpack Outfitters
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{
                  background: "#FF5353",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: "16px",
                }}
              >
                Sign up
              </Button>
            </Stack>
          </form>
          <div className="mx-auto"></div>
          <br />
          <div className="mv-1 border-t mx-16" />
          <div className="flex justify-center">
            <p className="-mt-3 bg-white px-3 text-[#CCCCCC]">OR</p>
          </div>
          <br />
          <p
            className="text-[#656565] text-center"
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have an Account? Login Here
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;
