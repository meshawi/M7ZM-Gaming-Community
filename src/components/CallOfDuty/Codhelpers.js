import {
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";

export const fetchGamesFromAPI = async () => {
  const response = await fetch("https://api.aleshawi.me/api/cod", {
    headers: {
      Authorization:
        "Bearer 2|FGsWttTyB9YNk3XqhWrFrDV4rLLqkyqlh9vt3M0d3da3a308",
    },
  });
  const data = await response.json();
  return data;
};

export const getSeries = (name) => {
  const modernWarfareSeries = [
    "Call of Duty 4: Modern Warfare",
    "Call of Duty: Modern Warfare 2",
    "Call of Duty: Modern Warfare 3",
    "Call of Duty: Modern Warfare",
    "Call of Duty: Modern Warfare II",
    "Call of Duty: Modern Warfare III",
  ];
  const blackOpsSeries = [
    "Call of Duty: Black Ops",
    "Call of Duty: Black Ops II",
    "Call of Duty: Black Ops III",
    "Call of Duty: Black Ops 4",
    "Call of Duty: Black Ops Cold War",
  ];
  const othersSeries = [
    "Call of Duty",
    "Call of Duty 2",
    "Call of Duty 3",
    "Call of Duty: Ghosts",
    "Call of Duty: Advanced Warfare",
    "Call of Duty: Infinite Warfare",
    "Call of Duty: WWII",
    "Call of Duty: Mobile",
    "Call of Duty: Vanguard",
  ];

  if (modernWarfareSeries.includes(name)) return "Modern Warfare";
  if (blackOpsSeries.includes(name)) return "Black Ops";
  if (othersSeries.includes(name)) return "Others";
  return "Others";
};

export const getTimeSinceRelease = (releaseDate) => {
  const now = new Date();
  const release = new Date(releaseDate);
  const years = differenceInYears(now, release);
  const months = differenceInMonths(now, release) % 12;
  const days = Math.floor(differenceInDays(now, release) % (365.25 / 12));
  return `${years} years, ${months} months, and ${days} days`;
};
