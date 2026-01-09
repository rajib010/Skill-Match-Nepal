
export const getToday = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
    .toISOString()
    .split("T")[0];
};

export const utcToLocalDate = (utcDate: string | Date): string => {
  const date = new Date(utcDate);
  return date.toLocaleDateString("en-CA"); // Returns YYYY-MM-DD in local timezone
};

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  // Display in local timezone
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

export const formatDateForCalender = (
  date: string | Date | null | undefined
): string => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? new Date(date) : date;

  //handle invalid dates gracefully

  if (isNaN(parsedDate.getTime())) return "";

  return parsedDate.toISOString().split("T")[0];
};

export const areDatesDifferent = (
  a: string | Date | null | undefined,
  b: string | Date | null | undefined
) => {
  if (!a && !b) return false; //both null
  if (!a || !b) return false; // one null

  return new Date(a).getTime() !== new Date(b).getTime();
};

export function getStartOfDayUTC(date: string | Date): Date {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
  }
  const d = new Date(date);
  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
  );
}

export function getEndOfDayUTC(date: string | Date): Date {
  if (typeof date === "string") {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  }

  const d = new Date(date);

  return new Date(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)
  );
}

export const calculateAgeFromDob = (dob: Date | string) => {
  if (!dob) return undefined;

  const birthDate = typeof dob === "string" ? new Date(dob) : dob;
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  //if this year birthday hasnot come,
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

//extract values for table headers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValue(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

export const handleNumberScroll: React.WheelEventHandler<HTMLInputElement> = (
  e
) => {
  // Prevent value from changing on scroll
  e.currentTarget.blur();
};

export function preventDecimalKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if ([".", "e", "E", "+", "-"].includes(e.key)) {
    e.preventDefault();
  }
}

export function preventNumberKeys(e: React.KeyboardEvent<HTMLInputElement>) {
  if (/\d/.test(e.key)) {
    e.preventDefault();
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "LOW":
      return "text-green-600 bg-green-50";
    case "MEDIUM":
      return "text-yellow-600 bg-yellow-50";
    case "HIGH":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

export function getUserInitials(name: string): string {
  if (!name || name.trim() === "") return "NP";

  const parts = name.trim().split(/\s+/);

  const first = parts[0].charAt(0).toUpperCase();

  //if first and last name
  if (parts.length > 1) {
    return first + parts[parts.length - 1].charAt(0).toUpperCase();
  }

  // if first name only
  return first + (parts[0].charAt(1)?.toUpperCase() ?? "");
}
