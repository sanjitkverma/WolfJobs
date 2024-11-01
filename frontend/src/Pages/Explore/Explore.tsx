import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

import JobsListView from "../../components/Job/JobListView";
import JobDetailView from "../../components/Job/JobDetailView";
import { useJobStore } from "../../store/JobStore";
import { useApplicationStore } from "../../store/ApplicationStore";

import { Select, MenuItem, SelectChangeEvent, InputLabel, FormControl, Autocomplete, TextField, Box } from "@mui/material"

const Explore = () => {
  const naviagte = useNavigate();

  const userSkills = useUserStore((state) => state.skills);
  const updateName = useUserStore((state) => state.updateName);
  const updateAddress = useUserStore((state) => state.updateAddress);
  const updateRole = useUserStore((state) => state.updateRole);
  const updateDob = useUserStore((state) => state.updateDob);
  const updateSkills = useUserStore((state) => state.updateSkills);
  const updatePhonenumber = useUserStore((state) => state.updatePhonenumber);
  const updateId = useUserStore((state) => state.updateId);
  const updateAvailability = useUserStore((state) => state.updateAvailability);
  const updateGender = useUserStore((state) => state.updateGender);
  const updateHours = useUserStore((state) => state.updateHours);
  const updateIsLoggedIn = useUserStore((state) => state.updateIsLoggedIn);
  const updateResume = useUserStore((state) => state.updateResume)
  const updateResumeId = useUserStore((state) => state.updateResumeId);

  const [affiliation, setAffiliation] = useState("");

  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );

  const updateEmail = useUserStore((state) => state.updateEmail);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobList, setFilteredJobList] = useState<Job[]>([]);
  const [sortHighestPay, setSortHighestPay] = useState(false);
  const [sortAlphabeticallyByCity, setSortAlphabeticallyByCity] = useState(false);
  const [sortByEmploymentType, setSortByEmploymentType] = useState(false);
  const [showOpenJobs, setShowOpenJobs] = useState(true);  // true for open jobs, false for closed jobs
  const [sortByScore, setSortByScore] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = () => {
    setSortHighestPay(!sortHighestPay);
  };

  const handleSortCityChange = () => {
    setSortAlphabeticallyByCity(!sortAlphabeticallyByCity);
  };

  const handleSortEmploymenyTypeChange = () => {
    setSortByEmploymentType(!sortByEmploymentType);
  };

  const toggleJobStatus = () => {
    setShowOpenJobs(!showOpenJobs);
  };

  const handleSortByScore = () => {
    setSortByScore(!sortByScore);
  }

  useEffect(() => {
    const token: string = localStorage.getItem("token")!;
    if (!!!token) {
      naviagte("/login");
    }
    if (!!token) {
      const tokenInfo = token.split(".");
      const userInfo = JSON.parse(atob(tokenInfo[1]));

      updateName(userInfo.name);
      updateEmail(userInfo.email);
      updateAddress(userInfo.address);
      updateRole(userInfo.role);
      updateDob(userInfo.dob);
      updateSkills(userInfo.skills);
      updatePhonenumber(userInfo.phonenumber);
      updateId(userInfo._id);
      updateAvailability(userInfo.availability);
      updateGender(userInfo.gender);
      updateHours(userInfo.hours);
      updateIsLoggedIn(true);
      updateResume(userInfo.resume);
      updateResumeId(userInfo.resumeId);
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/users/fetchapplications")
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching applications");
          return;
        }
        updateApplicationList(res.data.application as Application[]);
      });

    axios
      .get("http://localhost:8000/api/v1/users", {
        params: { page: 1, limit: 25 },
      })
      .then((res) => {
        if (res.status !== 200) {
          toast.error("Error fetching jobs");
          return;
        }
        updateJobList(res.data.jobs as Job[]);
      });
  }, []);

  useEffect(() => {
    let updatedList = jobList;

    if (searchTerm !== "") {
      updatedList = updatedList.filter((job) =>
        job.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortHighestPay) {
      updatedList = [...updatedList].sort((a, b) => parseFloat(b.pay) - parseFloat(a.pay));
    }

    if (sortAlphabeticallyByCity) {

      updatedList = [...updatedList].sort((a, b) => {
        return a.location.localeCompare(b.location)
      });
    }

    if (sortByEmploymentType) {

      updatedList = [...updatedList].sort((a, b) => {
        return a.type.localeCompare(b.type)
      });
    }

    if (affiliation !== "") {
      updatedList = [...updatedList].filter((job) => job.managerAffilication === affiliation)
    }

    if (selectedSkills.length) {
      updatedList = [...updatedList].filter((job) => {
        for (let i = 0; i < selectedSkills.length; i++) {
          if (job.requiredSkills.includes(selectedSkills[i])) {
            return true;
          }
        }
        return false;
      })
    }

    updatedList = updatedList.filter(job => showOpenJobs ? job.status === "open" : job.status === "closed");

    if (sortByScore) {
      updatedList = [...updatedList].sort((a, b) => {
        const requiredSkillsA = a.requiredSkills;
        const requiredSkillsB = b.requiredSkills;

        return userSkills.filter((skill) => requiredSkillsB.includes(skill)).length / requiredSkillsB.length -
          userSkills.filter((skill) => requiredSkillsA.includes(skill)).length / requiredSkillsA.length
      })
    }

    setFilteredJobList(updatedList);
  }, [searchTerm, jobList, sortHighestPay, sortAlphabeticallyByCity, sortByEmploymentType, showOpenJobs, affiliation, selectedSkills, sortByScore]);

  // fetch skills from backend
  useEffect(() => {
    axios.get("http://localhost:8000/api/v1/users/skills").then(
      (res) => {
        if (res.status != 200) {
          toast.error("Error fetching skills");
          return;
        }

        setSkills(res.data as string[]);
      }
    )
  }, []);

  const handleClearFilter = () => {
    setSearchTerm("");
    setAffiliation("");
    setShowOpenJobs(true);
    setSortAlphabeticallyByCity(false);
    setSortHighestPay(false);
    setSortAlphabeticallyByCity(false);
    setSortByScore(false);
    setSortByEmploymentType(false);
    setSelectedSkills([]);
  };

  return (
    <>
      <div className="content bg-slate-50">
        <div className="flex flex-col">
          <div className="p-4 search-bar-container">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full p-2"
            />
          </div>
          <div>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <button onClick={handleSortChange} className="p-2 ml-2 border">
                {sortHighestPay ? "Sort by High Pay : On" : "Sort by Highest Pay : Off"}
              </button>
              <button onClick={handleSortCityChange} className="p-2 ml-2 border">
                {sortAlphabeticallyByCity ? "Sort by City : On" : "Sort by City : Off"}
              </button>
              <button onClick={handleSortEmploymenyTypeChange} className="p-2 ml-2 border">
                {sortByEmploymentType ? "Sort by Employment Type : On" : "Sort by Employment Type : Off"}
              </button>
              <button onClick={toggleJobStatus} className="p-2 ml-2 mr-2 border">
                {showOpenJobs ? "Show Closed Jobs" : "Show Open Jobs"}
              </button>
              <button onClick={handleSortByScore} className="p-2 ml-2 mr-2 border">
                {sortByScore ? "Sort By Score: On" : "Sort By Score: Off"}
              </button>
              <FormControl className="border" style={{ minWidth: 200 }}>
                <InputLabel id="affiliation-id">Select Affiliation</InputLabel>
                <Select
                  value={affiliation}
                  labelId="affiliation-id"
                  label="Role"
                  id="role"
                  onChange={(e: SelectChangeEvent) => {
                    setAffiliation(e.target.value);
                  }}
                >
                  <MenuItem value="" selected disabled>
                    Select Affiliation
                  </MenuItem>
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
              <Autocomplete
                multiple
                options={skills}
                value={selectedSkills}
                onChange={(_, newValue) => setSelectedSkills(newValue)}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Skills" variant="outlined" />
                )}
                style={{ minWidth: 200 }}
                className="border rounded p-2 ml-2"
              />
              <button className="bg-red-500 text-white px-4 py-2 rounded p-2 ml-2 border" onClick={handleClearFilter}>Reset</button>
            </Box>
          </div>
        </div>
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <JobsListView jobsList={filteredJobList} />
          <JobDetailView />
        </div>
      </div >
    </>
  );
};

export default Explore;
