import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { toast } from "react-toastify";

import JobsListView from "../../components/Job/JobListView";
import JobDetailView from "../../components/Job/JobDetailView";
import { useJobStore } from "../../store/JobStore";
import { useApplicationStore } from "../../store/ApplicationStore";
// const userId = useUserStore((state) => state.id);

const Explore = () => {
  const naviagte = useNavigate();

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


  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );
  // const userId = useUserStore((state) => state.id);

  // const [displayList, setDisplayList] = useState<Job[]>([]);

  const updateEmail = useUserStore((state) => state.updateEmail);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);
  // const applicationList = useApplicationStore((state) => state.applicationList);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobList, setFilteredJobList] = useState<Job[]>([]);
  const [sortHighestPay, setSortHighestPay] = useState(false);
  const [sortAlphabeticallyByCity, setSortAlphabeticallyByCity] = useState(false);
  const [sortByEmploymentType, setSortByEmploymentType] = useState(false);
  const [showOpenJobs, setShowOpenJobs] = useState(true);  // true for open jobs, false for closed jobs
  const [filterLocation, setFilterLocation] = useState("");
  const [filterMinSalary, setFilterMinSalary] = useState("");
  const [filterMaxSalary, setFilterMaxSalary] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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

    if (filterLocation !== "") {

      updatedList = updatedList.filter((job) =>

        job.location.toLowerCase().includes(filterLocation.toLowerCase())

      );

    }
    //filter for max and min salary
    if (filterMinSalary !== "" || filterMaxSalary !== "") {

      updatedList = updatedList.filter((job) => {

        const jobPay = parseFloat(job.pay);

        const minSalary = parseFloat(filterMinSalary) || 0;

        const maxSalary = parseFloat(filterMaxSalary) || Infinity;

        return jobPay >= minSalary && jobPay <= maxSalary;

      });

    }

    updatedList = updatedList.filter(job => showOpenJobs ? job.status === "open" : job.status === "closed");

    setFilteredJobList(updatedList);
  }, [searchTerm, jobList, sortHighestPay, sortAlphabeticallyByCity, sortByEmploymentType, showOpenJobs, filterLocation, filterMinSalary,
    filterMaxSalary]);

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


          {/* Button container with flex layout */}

          <div className="flex flex-row space-x-2 mb-4">
            <button onClick={handleSortChange} className="p-2 ml-2 border">
              {sortHighestPay ? "Sort by High Pay : On" : "Sort by Highest Pay : Off"}
            </button>
            <button onClick={handleSortCityChange} className="p-2 ml-2 border">
              {sortAlphabeticallyByCity ? "Sort by City : On" : "Sort by City : Off"}
            </button>
            <button onClick={handleSortEmploymenyTypeChange} className="p-2 ml-2 border">
              {sortByEmploymentType ? "Sort by Employment Type : On" : "Sort by Employment Type : Off"}
            </button>
            <button onClick={toggleJobStatus} className="p-2 ml-2 border">
              {showOpenJobs ? "Show Closed Jobs" : "Show Open Jobs"}
            </button>
            {/* Filter Dropdown */}
            <div className="relative">

              <button

                onClick={() => setShowFilterDropdown(!showFilterDropdown)}

                className="p-2 border">

                Filters

              </button>

              {showFilterDropdown && (

                <div className="absolute mt-2 w-48 bg-white border shadow-lg p-4 z-10">

                  <div className="mb-2">

                    <label>Location:</label>

                    <input

                      type="text"

                      value={filterLocation}

                      onChange={(e) => setFilterLocation(e.target.value)}

                      className="w-full p-2 border"

                      placeholder="Enter location"

                    />

                  </div>
                  <div className="mb-2">

                    <label>Min Salary:</label>

                    <input

                      type="number"

                      value={filterMinSalary}

                      onChange={(e) => setFilterMinSalary(e.target.value)}

                      className="w-full p-2 border"

                      placeholder="Enter min salary"

                    />

                  </div>

                  <div className="mb-2">

                    <label>Max Salary:</label>

                    <input

                      type="number"

                      value={filterMaxSalary}

                      onChange={(e) => setFilterMaxSalary(e.target.value)}

                      className="w-full p-2 border"

                      placeholder="Enter max salary"

                    />

                  </div>

                </div>

              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <JobsListView jobsList={filteredJobList} />
          <JobDetailView />
        </div>
      </div>
    </>
  );
};

export default Explore;
