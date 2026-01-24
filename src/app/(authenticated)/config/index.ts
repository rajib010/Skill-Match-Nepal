export const userTableHeaders = [
  { key: "sn", label: "SN", classname: "text-center" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "profile.phone", label: "Contact" },
  { key: "profile.location", label: "Address" },
  { key: "image", label: "Image", classname: "text-center" },
  {
    key: "_count.applications",
    label: "Applications",
    classname: "text-center",
  },
  { key: "actions", label: "Actions", classname: "text-center" },
];

export const categoryTableHeaders = [
  { key: "sn", label: "SN", classname: "text-center" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "_count.jobs",
    label: "Jobs",
    classname: "text-center",
  },
  { key: "actions", label: "Actions", classname: "text-center" },
];

export const applicationTableHeaders = [
  { key: "sn", label: "SN", classname: "text-center" },
  { key: "user.name", label: "User" },
  {
    key: "job.title",
    label: "Title",
    classname: "max-w-[100px] overflow-x-scroll",
  },
  {
    key: "job.company",
    label: "Company",
    classname: "max-w-[100px] overflow-x-scroll",
  },
  { key: "job.jobType", label: "Job Type" },
  { key: "matchScore", label: "Match Score" },

  { key: "actions", label: "Actions", classname: "text-center" },
];

export const contactTableHeaders = [
  { key: "sn", label: "SN", classname: "max-w-[25px] text-center" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "message", label: "Message", classname: "max-w-[250px]" },
  { key: "actions", label: "Actions" },
];