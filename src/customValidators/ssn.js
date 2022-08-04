const checkMarks = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y'];

export const validateSsn = (ssn) => {
  if (ssn.length != 11) return false;
  if (!['+', '-', 'A'].includes(ssn[6])) return false;

  const day = Number(ssn.substring(0, 2));
  const month = Number(ssn.substring(2, 4));
  if (day < 1 || day > 31 || month < 1 || month > 12) return false;

  const number = Number(ssn.substring(0, 6) + ssn.substring(7, 10));
  if (checkMarks[number % 31] !== ssn[10]) return false;
  return true;
};
