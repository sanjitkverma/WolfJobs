import { useEffect } from "react";
import JobListTile from "./JobListTile";
import { useApplicationStore } from "../../store/ApplicationStore";
import { useUserStore } from "../../store/UserStore";

const JobsListView = (props: any) => {
  const { jobsList, title } = props;

  const applicationList = useApplicationStore((state) => state.applicationList);
  const userId = useUserStore((state) => state.id);

  useEffect(() => {
    // list of all open jobs
    console.log("jobsList: " + jobsList);
  }, [jobsList]);


  return (
    <>
      <div className="w-4/12 bg-white/60 overflow-y-scroll overflow-x-hidden pt-2 px-9">
        <div className="text-2xl py-4">{title || "All jobs"}</div>
        {jobsList?.map((job: Job) => {
          const application = applicationList?.find((item) => item.jobid == job._id && item.applicantid == userId)
          return !application ? <JobListTile data={job} key={job._id} /> : <></>;
        })}
      </div>
    </>
  );
};

export default JobsListView;
