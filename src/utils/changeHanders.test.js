import { INPUT_TYPES } from '../form-input-types';
import { getChangeHandler } from './changeHandlers';

describe('changeHandlers', () => {
  it('toggles the value of an option in a checkbox group', () => {
    const changeHandler = getChangeHandler(INPUT_TYPES.CHECKBOX_GROUP);
    let values = [];
    
    values = changeHandler('option', values);
    expect(values.length).toBe(1);
    expect(values[0]).toBe('option');

    values = changeHandler('option', values);
    expect(values.length).toBe(0);
  });

  it('replaces the value of a field other than a checkbox group', () => {
    const inputTypes = Object.values(INPUT_TYPES).filter(type => ![INPUT_TYPES.CHECKBOX_GROUP].includes(type));
    for (const inputType of inputTypes) {
      const changeHandler = getChangeHandler(inputType);
      let value = changeHandler('value1');
      expect(value).toBe('value1');

      value = changeHandler('value2');
      expect(value).toBe('value2');
    }
  });
});
