import { INPUT_TYPES } from "../form-input-types";

const addValue = (value, values) => [...values, value];
const removeValue = (value, values) => values.filter(x => x !== value);

const replaceValue = (value) => value;
const toggleValue = (value, values) => values.includes(value) ? removeValue(value, values) : addValue(value, values);

export const getChangeHandler = (inputType) =>  {
  switch (inputType) {
    case INPUT_TYPES.CHECKBOX_GROUP:
      return toggleValue;
    default:
      return replaceValue;
  };
};
