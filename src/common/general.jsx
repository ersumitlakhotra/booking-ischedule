
export const updateField = (key, value,setForm) => {
    setForm((prev) => ({
        ...prev,
        [key]: value,
    }));
};

export const getByKey = (list = [], key = "id", value) => {
  if (value === 0 || value === null) {
    const base = list?.[0] || {};

    const emptyClone = Object.keys(base).reduce((acc, k) => {
      acc[k] = "";
      return acc;
    }, {});

    return {
      ...emptyClone,
      [key]: 0, // keep id as 0 for "new"
    };
  }

  return list.find((item) => String(item?.[key]) === String(value));
};

export const encryptId = (id) => {
    try {
        return btoa(String(id));
    } catch (error) {
        console.error("Error encrypting ID:", error);
        return null;
    }
};

export const decryptId = (encryptedId) => {
    try {
        if(encryptedId)
        return atob(encryptedId);
    else
        return null
    } catch (error) {
        console.error("Error decrypting ID:", error);
        return null;
    }
};
export const openMaps = (address) => {
    if (!address) return;

    const encodedAddress = encodeURIComponent(address);

    window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank"
    );
};
export const getDateRangeStatus = (startDate, endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (today < start) return "Upcoming";
    if (today >= start && today <= end) return "Live";

    return "Past";
};

export const getWeekDates = (date) => {
    const [year, month, day] = date.split("-").map(Number);

    // Create local date
    const selected = new Date(year, month - 1, day);

    // Calculate Monday as the first day of the week
    const monday = new Date(selected);
    const diff = selected.getDay() === 0 ? -6 : 1 - selected.getDay();
    monday.setDate(selected.getDate() + diff);

    return Array.from({ length: 7 }, (_, index) => {
        const current = new Date(monday);
        current.setDate(monday.getDate() + index);

        return {
            weekday_short: current.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            weekday_long: current.toLocaleDateString("en-US", {
                weekday: "long",
            }).toLowerCase(),
            date: `${current.getFullYear()}-${String(
                current.getMonth() + 1
            ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`,
            day: String(current.getDate()).padStart(2, "0"),
        };
    });
};
export const getNextDays = (date,days) => {
    const [year, month, day] = date.split("-").map(Number);

    const selected = new Date(year, month - 1, day);

    return Array.from({ length: days }, (_, index) => {
        const current = new Date(selected);
        current.setDate(selected.getDate() + index);

        return {
            weekday_short: current.toLocaleDateString("en-US", {
                weekday: "short",
            }),

            weekday_long: current
                .toLocaleDateString("en-US", {
                    weekday: "long",
                })
                .toLowerCase(),

            date: `${current.getFullYear()}-${String(
                current.getMonth() + 1
            ).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`,
            day: current.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
        };
    });
};
export const getWeekOfMonth = (date) => {
    const [year, month, day] = date.split("-").map(Number);

    const current = new Date(year, month - 1, day);

    // Sunday of the current week
    const weekStart = new Date(current);
    weekStart.setDate(current.getDate() - current.getDay());

    // First day of the month
    const firstDay = new Date(year, month - 1, 1);

    // Sunday of the first week of the month
    const firstWeekStart = new Date(firstDay);
    firstWeekStart.setDate(firstDay.getDate() - firstDay.getDay());

    return Math.floor((weekStart - firstWeekStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
};
export const getWeekLabel = (date) => {
    const week = getWeekOfMonth(date);

    const suffix =
        week === 1 ? "st" :
        week === 2 ? "nd" :
        week === 3 ? "rd" : "th";

    const [, month] = date.split("-");

    const monthName = new Date(2000, Number(month) - 1, 1).toLocaleString("en-US", {
        month: "long",
    });

    return `${week}${suffix} week of ${monthName}`;
};
export const getWeekday = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);

    // Create local date (avoid UTC issue)
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
    });
};
export const getTimeDifference = (shiftStart, checkIn) => {
    const [startH, startM] = shiftStart.split(":").map(Number);
    const [checkH, checkM] = checkIn.split(":").map(Number);

    const startMinutes = startH * 60 + startM;
    const checkMinutes = checkH * 60 + checkM;

    const diffMinutes = checkMinutes - startMinutes;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;

    return {
        minutes: diffMinutes,
        hours: hours,
        remainingMinutes: minutes,
        text: `${hours > 0 ? `${hours} hour ` : ""}${minutes} minutes`,
        short: `${hours > 0 ? `${hours}h ` : ""}${minutes}m`,
    };
};
export const getTimingInfo = (timinginfo, date) => {
    if (!timinginfo?.length) return null;

    const schedule =
        typeof timinginfo[0] === "string"
            ? JSON.parse(timinginfo[0])
            : timinginfo[0];

    const [year, month, dayNum] = date.split("-").map(Number);
    const localDate = new Date(year, month - 1, dayNum);

    const day = localDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

    const [starttime, endtime, open] = schedule?.[day] || [];

    return {
        open,
        starttime,
        endtime,
    };
};
export const getMonthRange = (date) => {
    const d = new Date(date);

    const first = new Date(d.getFullYear(), d.getMonth(), 1);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    return {
        first: first.toISOString().split("T")[0],
        last: last.toISOString().split("T")[0],
    };
};
export const usStates = [
  { name: "Alabama", code: "AL" },
  { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" },
  { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" },
  { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" },
  { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" },
  { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" },
  { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" },
  { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" },
  { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" },
  { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" },
  { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" },
  { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" },
  { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" },
  { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" },
  { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" },
  { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" },
  { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" },
  { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" },
  { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" },
  { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" },
  { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" },
  { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" },
  { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" },
  { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" },
  { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" },
  { name: "Wyoming", code: "WY" },
  { name: "Washington DC", code: "DC" }
];
export const canadaRegions = [
  { name: "Alberta", code: "AB", tax: 5 },
  { name: "British Columbia", code: "BC", tax: 5 },
  { name: "Manitoba", code: "MB", tax: 5 },
  { name: "New Brunswick", code: "NB", tax: 15 },
  { name: "Newfoundland and Labrador", code: "NL", tax: 15 },
  { name: "Nova Scotia", code: "NS", tax: 15 },
  { name: "Ontario", code: "ON", tax: 13 },
  { name: "Prince Edward Island", code: "PE", tax: 15 },
  { name: "Quebec", code: "QC", tax: 5 },
  { name: "Saskatchewan", code: "SK", tax: 5 },
  { name: "Northwest Territories", code: "NT", tax: 5 },
  { name: "Nunavut", code: "NU", tax: 5 },
  { name: "Yukon", code: "YT", tax: 5 }
];
export const getTax=(province) =>{
 const region = canadaRegions.find(
        item => item.code === province?.toUpperCase()
    );

    return region ? region :  { name: "Exempt", code: province, tax: 0 };
}

 export const getAttendanceDisplay = (status, worktime, isLate, isEarly) => {
    switch (status) {
      case "Present":
      case "Half Day":
        return {
          title: worktime,
          color: isLate || isEarly ? "yellow" : "green",
        };

      case "Absent":
        return {
          title: "Absent",
          color: "red",
        };

      case "Leave":
        return {
          title: "Leave",
          color: "violet",
        };

      case "Holiday":
        return {
          title: "Holiday",
          color: "gray",
        };

      default:
        return {
          title: "",
          color: "gray",
        };
    }
  };


  export const getExperience = (joiningDate) => {
    if (!joiningDate) return "< 1 year";

    const start = new Date(joiningDate);
    const today = new Date();

    let years = today.getFullYear() - start.getFullYear();

    const anniversaryPassed =
        today.getMonth() > start.getMonth() ||
        (
            today.getMonth() === start.getMonth() &&
            today.getDate() >= start.getDate()
        );

    if (!anniversaryPassed) {
        years--;
    }

    return years < 1 ? "< 1 year" : `${years}+`;
};









