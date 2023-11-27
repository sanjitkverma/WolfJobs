import axios from "axios";

import { useState, useEffect } from "react";
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

  const updateApplicationList = useApplicationStore(
    (state) => state.updateApplicationList
  );
  // const userId = useUserStore((state) => state.id);

  // const [displayList, setDisplayList] = useState<Job[]>([]);

  const updateEmail = useUserStore((state) => state.updateEmail);

  const updateJobList = useJobStore((state) => state.updateJobList);
  const jobList: Job[] = useJobStore((state) => state.jobList);
  // const applicationList = useApplicationStore((state) => state.applicationList);

  // New state for search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('pay_asc');
  const [isLoading, setIsLoading] = useState(true);

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
    }
  }, []);

  // Updated useEffect for fetching jobs with search and sort
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const applicationsResponse = await axios.get("http://localhost:8000/api/v1/users/fetchapplications");
        if (applicationsResponse.status === 200) {
          updateApplicationList(applicationsResponse.data.application);
        } else {
          toast.error("Error fetching applications");
        }

        const jobsResponse = await axios.get("http://localhost:8000/api/v1/users", {
          params: { search: searchTerm, sort: sortCriteria, page: 1, limit: 25 }
        });
        if (jobsResponse.status === 200) {
          updateJobList(jobsResponse.data.jobs);
        } else {
          toast.error("Error fetching jobs");
        }
      } catch (error) {
        toast.error("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, sortCriteria]);

  return (
    <>
      <div className="content bg-slate-50">
        <div className="flex flex-row" style={{ height: "calc(100vh - 72px)" }}>
          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs..."
            />
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
            >
              <option value="pay_asc">Pay: Low to High</option>
              <option value="pay_desc">Pay: High to Low</option>
            </select>
          </div>
          <JobsListView jobsList={useJobStore((state) => state.jobList)} />
          <JobDetailView />
        </div>
      </div>
    </>
  );
};

export default Explore;
