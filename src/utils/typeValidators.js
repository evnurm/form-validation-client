import { INPUT_TYPES } from '../form-input-types';

const validateText = (value) => typeof value === 'string';

const validateNumber = (value) => typeof value === 'number';

const validateDate = (value) => !Number.isNaN(Date.parse(value));

const validateEmail = (value) => {
    const isString = validateText(value);
    
    // Regex source:  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return isString && emailRegex.test(value);
};    

const validateMonth = (value) => {
    if (!validateText(value)) return false;
    if (value[4] !== '-') return false;

    const year = Number(value.substring(0, 4));
    const month = Number(value.substring(5));

    return !Number.isNaN(year) && !Number.isNaN(month) && month >= 1 && month <= 12;
};

const validateWeek = (value) => {
    if (!validateText(value)) return false;
    if (value[4] !== '-' || value[5] !== 'W') return false;

    const year = Number(value.substring(0, 4));
    const week = Number(value.substring(6));

    return !Number.isNaN(year) && !Number.isNaN(week) && week >= 1 && week <= 52;
};

const validateURL = (value) => {
    try {
        new URL(value);
        return true;
    } catch (err) {
        return false;
    }
};

const validateColor = (value) => {
    if (value?.length != 7) return false;
    if (value[0] != '#') return false;
    
    return !Number.isNaN(Number('0x' + value.substring(1)));
};

const validateCheckboxGroup = (value) => Array.isArray(value) && value.every(entry => typeof entry === 'string');

// Ensure that the value is an array of objects ([{}, ..., {}])
const validateGroup = (value) => {
    return Array.isArray(value) && value.every(entry => typeof entry === 'object' && !Array.isArray(entry));
};

const validateTime = (value) => {
  if (!validateText(value) || value?.length !== 5 || value[2] !== ':') return false;

  const hour = Number(value.substring(0, 2));
  const minutes = Number(value.substring(3));
  const hourIsValid = hour >= 0 && hour <= 23;
  const minutesIsValid = minutes >= 0 && minutes <= 59; 

  return hourIsValid && minutesIsValid;
};

export default {
    [INPUT_TYPES.TEXT]: validateText,
    [INPUT_TYPES.TEXTAREA]: validateText,
    [INPUT_TYPES.NUMBER]: validateNumber,
    [INPUT_TYPES.DATE]: validateDate,
    [INPUT_TYPES.DATETIME_LOCAL]: validateDate,
    [INPUT_TYPES.MONTH]: validateMonth,
    [INPUT_TYPES.EMAIL]: validateEmail,
    [INPUT_TYPES.WEEK]: validateWeek,
    [INPUT_TYPES.URL]: validateURL,
    
    // No separate validation: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel
    [INPUT_TYPES.TEL]: validateText,
    [INPUT_TYPES.RADIO_GROUP]: () => true,
    [INPUT_TYPES.COLOR]: validateColor,
    [INPUT_TYPES.TIME]: validateTime,
    [INPUT_TYPES.PASSWORD]: validateText,
    [INPUT_TYPES.RANGE]: validateNumber,
    [INPUT_TYPES.SEARCH]: validateText,
    [INPUT_TYPES.HIDDEN]: () => true, // no limitations
    [INPUT_TYPES.GROUP]: validateGroup,
    [INPUT_TYPES.BUTTON]: () => true,
    [INPUT_TYPES.CHECKBOX_GROUP]: validateCheckboxGroup,
    [INPUT_TYPES.SELECT]: () => true
};
