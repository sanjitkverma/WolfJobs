import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUserStore } from "../../store/UserStore";
import { useNavigate } from "react-router-dom";
import { login } from "../../deprecateded/auth";

type FormValues = {
  name: string;
  email: string;
  password: string;
  address: string;
  role: string;
  skills: string[];
  phonenumber: string;
  availability: string;
  gender: string;
  hours: string;
};

const ProfileEdit = ({ props }: { props: any }) => {
  const {
    name,
    email,
    address,
    role,
    skills,
    phonenumber,
    availability,
    gender,
    hours,
  } = props;

  const form = useForm<FormValues>({
    defaultValues: {
      name: name,
      email: email,
      address: address,
      role,
      skills: skills,
      phonenumber: phonenumber,
      availability: availability,
      gender: gender,
      hours: hours,
    },
  });

  const [availabilityDrop, setAvailabilityDtop] = useState(availability);
  const [skillsDB, setSkillsDB] = useState<string[]>([]); // For fetched skills

  const userId = useUserStore((state) => state.id);
  const password = useUserStore((state) => state.password);

  const navigate = useNavigate();

  const { register, handleSubmit, formState, setValue } = form;
  const { errors } = formState;

  const handleSaveProfile = (data: FormValues) => {
    const url = "http://localhost:8000/api/v1/users/edit";
    const body = {
      id: userId,
      name: data.name,
      role,
      email,
      password,
      address: data.address,
      availability: availabilityDrop,
      hours: data.hours,
      gender: data.gender,
      skills: data.skills,
      phonenumber: data.phonenumber,
    };

    axios.post(url, body).then((res) => {
      if (res.status !== 200) {
        toast.error("Failed to save profile");
        return;
      }
      toast.success("Saved profile");
      login(email, password, navigate);
    });
  };
  
  // Fetch skills from backend
  useEffect(() => {
    const fetchSkills = async () => {
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
        // Optionally set a fallback or show error message
        setSkillsDB([]);
      }
    };
    fetchSkills();
  }, []);

  return (
    <>
      <div className="my-2">
        <form onSubmit={handleSubmit(handleSaveProfile)} noValidate>
          <Stack spacing={2} width={"620px"}>
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
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
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
              disabled
              value={email}
            />
            <TextField
              label="Role"
              type="text"
              {...register("role", {
                required: "Role is required",
              })}
              error={!!errors.role}
              helperText={errors.role?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
                "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                "& fieldset": {
                  paddingLeft: (theme) => theme.spacing(1.5),
                  borderRadius: "10px",
                },
              }}
              disabled
              value={role}
            />
            <TextField
              label="Address"
              type="text"
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
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
            <TextField
              label="Phone number"
              type="text"
              {...register("phonenumber")}
              error={!!errors.phonenumber}
              helperText={errors.phonenumber?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
                "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                "& fieldset": {
                  paddingLeft: (theme) => theme.spacing(1.5),
                  borderRadius: "10px",
                },
              }}
            />
            {/* <TextField
              label="Availability"
              type="text"
              {...register("availability")}
              error={!!errors.availability}
              helperText={errors.availability?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
                "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                "& fieldset": {
                  paddingLeft: (theme) => theme.spacing(1.5),
                  borderRadius: "10px",
                },
              }}
            /> */}
            <FormControl>
              <InputLabel id="available-id">Availability</InputLabel>
              <Select
                value={availabilityDrop}
                labelId="available-id"
                label="Availability"
                id="available-id-1"
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(1) },
                  "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(1.0),
                    borderRadius: "10px",
                  },
                }}
                onChange={(e: SelectChangeEvent) => {
                  // setRole(e.target.value);
                  setAvailabilityDtop(e.target.value);
                }}
              >
                {/* <MenuItem value={"0 Hours"}>0 Hours</MenuItem> */}
                <MenuItem value={"4 Hours"}>4 Hours</MenuItem>
                <MenuItem value={"8 Hours"}>8 Hours</MenuItem>
                <MenuItem value={"12 Hours"}>12 Hours</MenuItem>
                <MenuItem value={"16 Hours"}>16 Hours</MenuItem>
                <MenuItem value={"20 Hours"}>20 Hours</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Gender"
              type="text"
              {...register("gender")}
              error={!!errors.gender}
              helperText={errors.gender?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
                "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                "& fieldset": {
                  paddingLeft: (theme) => theme.spacing(1.5),
                  borderRadius: "10px",
                },
              }}
            />
            {/* <TextField
              label="Hours"
              type="text"
              {...register("hours")}
              error={!!errors.hours}
              helperText={errors.hours?.message}
              sx={{
                "& label": { paddingLeft: (theme) => theme.spacing(1) },
                "& input": { paddingLeft: (theme) => theme.spacing(2.5) },
                "& fieldset": {
                  paddingLeft: (theme) => theme.spacing(1.5),
                  borderRadius: "10px",
                },
              }}
            /> */}
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
              Save Profile
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default ProfileEdit;
