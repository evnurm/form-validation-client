import validators from './constraintValidators';

describe('validators', () => {
  describe('maxlength', () => {
    const maxLenValidator = validators['maxlength'];

    it('should validate text maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'text' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'text' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'text' })).toBe(false);
    });

    it('should validate textarea maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'textarea' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'textarea' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'textarea' })).toBe(false);
    });

    it('should validate email maxlength correctly', () => {
      expect(maxLenValidator({ value: 'a.b@email.com', constraintValue: 14, type: 'email' })).toBe(true);
      expect(maxLenValidator({ value: 'ab.c@email.com', constraintValue: 14, type: 'email' })).toBe(true);
      expect(maxLenValidator({ value: 'abc.d@email.com', constraintValue: 14, type: 'email' })).toBe(false);
    });

    it('should validate password maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'password' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'password' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'password' })).toBe(false);
    });

    it('should validate search maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'search' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'search' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'search' })).toBe(false);
    });

    it('should validate tel maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'tel' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'tel' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'tel' })).toBe(false);
    });

    it('should validate url maxlength correctly', () => {
      expect(maxLenValidator({ value: 'aaaa', constraintValue: 5, type: 'url' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'url' })).toBe(true);
      expect(maxLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'url' })).toBe(false);
    });
  });

  describe('minlength', () => {
    const minLenValidator = validators['minlength'];
    
    it('should validate text minlength correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'text' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'text' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'text' })).toBe(true);
    });

    it('should validate textarea minlength correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'textarea' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'textarea' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'textarea' })).toBe(true);
    });

    it('should validate email minlength correctly', () => {
      expect(minLenValidator({ value: 'a.b@email.com', constraintValue: 14, type: 'email' })).toBe(false);
      expect(minLenValidator({ value: 'ab.c@email.com', constraintValue: 14, type: 'email' })).toBe(true);
      expect(minLenValidator({ value: 'abc.d@email.com', constraintValue: 14, type: 'email' })).toBe(true);
    });

    it('should validate text search correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'search' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'search' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'search' })).toBe(true);
    });


    it('should validate password minlength correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'password' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'password' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'password' })).toBe(true);
    });

    it('should validate tel minlength correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'tel' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'tel' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'tel' })).toBe(true);
    });
    
    it('should validate url minlength correctly', () => {
      expect(minLenValidator({ value: 'aaaa', constraintValue: 5, type: 'url' })).toBe(false);
      expect(minLenValidator({ value: 'aaaaa', constraintValue: 5, type: 'url' })).toBe(true);
      expect(minLenValidator({ value: 'aaaaaa', constraintValue: 5, type: 'url' })).toBe(true);
    });
  });

  describe('max', () => {
    const maxValidator = validators['max'];

    it('should validate number max correctly', () => {
      expect(maxValidator({ value: 4, constraintValue: 5, type: 'number'})).toBe(true);
      expect(maxValidator({ value: 5, constraintValue: 5, type: 'number'})).toBe(true);
      expect(maxValidator({ value: 6, constraintValue: 5, type: 'number'})).toBe(false);
    });

    it('should validate date max correctly', () => {
      expect(maxValidator({ value: '2022-06-03T15:19:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(true);
      expect(maxValidator({ value: '2022-06-03T15:20:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(true);
      expect(maxValidator({ value: '2022-06-03T15:21:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(false);
    });
  });

  describe('min', () => {
    const minValidator = validators['min'];
    
    it('should validate number min correctly', () => {
      expect(minValidator({ value: 4, constraintValue: 5, type: 'number'})).toBe(false);
      expect(minValidator({ value: 5, constraintValue: 5, type: 'number'})).toBe(true);
      expect(minValidator({ value: 6, constraintValue: 5, type: 'number'})).toBe(true);
    });

    it('should validate date min correctly', () => {
      expect(minValidator({ value: '2022-06-03T15:19:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(false);
      expect(minValidator({ value: '2022-06-03T15:20:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(true);
      expect(minValidator({ value: '2022-06-03T15:21:00.176Z', constraintValue: '2022-06-03T15:20:00.176Z', type: 'date'})).toBe(true);
    });
  });

  describe('step', () => {
    const stepValidator = validators['step'];

    it('should validate number step correctly', () => {
      expect(stepValidator({ value: 10, constraintValue: 2, type: 'number'})).toBe(true);
      expect(stepValidator({ value: 10, constraintValue: 3, type: 'number'})).toBe(false);

      expect(stepValidator({ value: 10, constraintValue: 2, min: 2, type: 'number'})).toBe(true);
      expect(stepValidator({ value: 10, constraintValue: 2, min: 5, type: 'number'})).toBe(false);
    });
  });

  describe('pattern', () => {
    const patternValidator = validators['pattern'];
    it('should correctly compare a string to a regular expression', () => {
      const regexString = '[a-zA-Z]\d';
      expect(patternValidator({ value: 'A5034', constraintValue: regexString, type: 'text' })).toBe(new RegExp(regexString).test('A5034'));
    });
  });

  describe('values', () => {
    const valuesValidator = validators['values'];

    it('should correctly validate a radio group', () => {
      const constraintValue = [{ label: 'Option 1', value: 'option1'}, { label: 'Option 2', value: 'option2'}];
      expect(valuesValidator({ value: 'a', constraintValue, type: 'radio-group'})).toBe(false); // invalid option
      expect(valuesValidator({ value: 'option1', constraintValue, type: 'radio-group'})).toBe(true); // valid option

      expect(valuesValidator({ value: ['option1', 'option2'], constraintValue, type: 'radio-group'})).toBe(false) // invalid - multiple "valid" options
    });

    it('should correctly validate a checkbox group', () => {
      const constraintValue = [{ label: 'Option 1', value: 'option1'}, { label: 'Option 2', value: 'option2'}];
      expect(valuesValidator({ value: ['test'], constraintValue, type: 'checkbox-group'})).toBe(false); // invalid option
      expect(valuesValidator({ value: ['option1'], constraintValue, type: 'checkbox-group'})).toBe(true); // valid option
      expect(valuesValidator({ value: ['option1', 'option2'], constraintValue, type: 'checkbox-group'})).toBe(true); // multiple valid options
    });

    it('should correctly validate a select element', () => {
      const constraintValue = [{ label: 'Option 1', value: 'option1'}, { label: 'Option 2', value: 'option2'}];
      expect(valuesValidator({ value: 'test', constraintValue, type: 'select'})).toBe(false); // invalid option
      expect(valuesValidator({ value: 'option1', constraintValue, type: 'select'})).toBe(true); // valid option
      expect(valuesValidator({ value: 'option2', constraintValue, type: 'select'})).toBe(true); // valid option
      expect(valuesValidator({ value: ['option1', 'option2'], constraintValue, type: 'select'})).toBe(false); // multiple valid options
    })
  });
});
