/**
 * Excludes weekends (Saturdays and Sundays) from a date range.
 * Optionally exclude holidays if a holiday array is provided.
 */
export function calculateWorkingDays(startDate: Date, endDate: Date, holidays: Date[] = []): number {
  let count = 0;
  const curDate = new Date(startDate);
  
  // Normalize time to midnight for accurate day calculation
  curDate.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  if (curDate > end) return 0;

  const holidayTimes = holidays.map(h => {
    const d = new Date(h);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });

  while (curDate <= end) {
    const dayOfWeek = curDate.getDay();
    // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      if (!holidayTimes.includes(curDate.getTime())) {
        count++;
      }
    }
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

/**
 * Dynamically calculates Earned Leave based on months elapsed since joining date.
 * Employee earns 2 days per full month worked.
 */
export function calculateAccumulatedEarnedLeave(joiningDate: Date, targetDate: Date = new Date()): number {
  if (joiningDate > targetDate) return 0;

  let months = (targetDate.getFullYear() - joiningDate.getFullYear()) * 12;
  months -= joiningDate.getMonth();
  months += targetDate.getMonth();
  
  // If we haven't reached the exact day of the month yet, subtract one month
  if (targetDate.getDate() < joiningDate.getDate()) {
    months--;
  }

  // Ensure months is never negative
  if (months < 0) months = 0;

  return months * 2;
}

/**
 * Policy limits configuration
 */
export const LEAVE_POLICY = {
  ANNUAL_ALLOCATION: 24,
  CASUAL_ALLOCATION: 12,
  SICK_ALLOCATION: 12,
  EARNED_PER_MONTH: 2,
  MAX_CARRY_FORWARD: 30
};
