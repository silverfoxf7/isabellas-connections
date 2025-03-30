import {
  addDays,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
  startOfToday,
  startOfYesterday,
} from "date-fns";

import queryString from "query-string";
import { getPuzzleForDate } from "./data";

export const getToday = () => startOfToday();
export const getYesterday = () => startOfYesterday();

export const firstGameDate = startOfDay(new Date("2024-01-01"));
export const periodInDays = 1;

export const getNextGameDate = (date) => {
  return addDays(date, periodInDays);
};

export const getPreviousGameDate = (date) => {
  return addDays(date, -periodInDays);
};

export const getIsLatestGame = () => {
  const parsed = queryString.parse(window.location.search);
  return !parsed.d;
};

export const isValidGameDate = (date) => {
  if (date < firstGameDate || date > getToday()) {
    return false;
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0;
};

export const getIndex = (gameDate) => {
  let start = firstGameDate;
  let index = -1;
  console.log(firstGameDate);
  do {
    index++;
    start = addDays(start, periodInDays);
  } while (start <= gameDate);

  return index;
};

export const getPuzzleOfDay = async (index) => {
  if (index < 0) {
    throw new Error("Invalid index");
  }

  const date = addDays(firstGameDate, index * periodInDays);
  const puzzle = await getPuzzleForDate(date);
  return puzzle;
};

export const getSolution = async (gameDate) => {
  const nextGameDate = getNextGameDate(gameDate);
  const index = getIndex(gameDate);
  const puzzleOfTheDay = await getPuzzleOfDay(index);
  console.log("index for today: ", index);
  return {
    puzzleAnswers: puzzleOfTheDay,
    puzzleGameDate: gameDate,
    puzzleIndex: index,
    dateOfNextPuzzle: nextGameDate.valueOf(),
  };
};

export const getGameDate = () => {
  if (getIsLatestGame()) {
    return getToday();
  }

  const parsed = queryString.parse(window.location.search);
  try {
    const d = startOfDay(parseISO(parsed.d?.toString()));
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday());
    }
    return d;
  } catch (e) {
    console.log(e);
    return getToday();
  }
};

export const setGameDate = (d) => {
  try {
    if (d < getToday()) {
      window.location.href = "/?d=" + formatISO(d, { representation: "date" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  window.location.href = "/";
};

// Note: This will now be async and should be handled differently in components
export const getInitialSolution = async () => {
  const gameDate = getGameDate();
  return await getSolution(gameDate);
};
