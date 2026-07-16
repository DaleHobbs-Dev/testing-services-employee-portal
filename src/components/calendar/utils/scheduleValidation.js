const MAX_CONTINUOUS_MINUTES = 5 * 60;
const REQUIRED_BREAK_MINUTES = 60;

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const validateEmployeeBreakRule = (blocks = []) => {
  const timeBlocks = blocks
    .filter((block) => block.startTime && block.endTime && !block.customLabel)
    .map((block) => ({
      start: timeToMinutes(block.startTime),
      end: timeToMinutes(block.endTime),
    }))
    .sort((a, b) => a.start - b.start);

  if (timeBlocks.length === 0) {
    return { isValid: true, message: "" };
  }

  let stretchStart = timeBlocks[0].start;
  let stretchEnd = timeBlocks[0].end;

  for (let index = 1; index < timeBlocks.length; index += 1) {
    const block = timeBlocks[index];
    const breakMinutes = block.start - stretchEnd;

    if (breakMinutes < REQUIRED_BREAK_MINUTES) {
      stretchEnd = Math.max(stretchEnd, block.end);
    } else {
      stretchStart = block.start;
      stretchEnd = block.end;
    }

    if (stretchEnd - stretchStart > MAX_CONTINUOUS_MINUTES) {
      return {
        isValid: false,
        message: "Employee blocks cannot exceed 5 consecutive hours without a 60 minute break.",
      };
    }
  }

  if (stretchEnd - stretchStart > MAX_CONTINUOUS_MINUTES) {
    return {
      isValid: false,
      message: "Employee blocks cannot exceed 5 consecutive hours without a 60 minute break.",
    };
  }

  return { isValid: true, message: "" };
};
