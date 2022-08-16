import typeValidators from './typeValidators';

describe('typeValidators', () => {
  describe('text', () => {
    it('validates text correctly', () => {
      const textValidator = typeValidators['text'];
      expect(textValidator('test')).toBe(true);
      expect(textValidator(3)).toBe(false);
      expect(textValidator()).toBe(false);
      expect(textValidator({})).toBe(false);
      expect(textValidator(() => { })).toBe(false);
    });
  });

  describe('number', () => {
    it('validates number correctly', () => {
      const numberValidator = typeValidators['number'];
      expect(numberValidator(3)).toBe(true);
      expect(numberValidator(3.14)).toBe(true);
      expect(numberValidator('test')).toBe(false);
      expect(numberValidator()).toBe(false);
      expect(numberValidator({})).toBe(false);
      expect(numberValidator(() => {})).toBe(false);
    });
  });

  describe('date', () => {
    it('validates date correctly', () => {
      const dateValidator = typeValidators['date'];
      expect(dateValidator('2022-06-03T15:19:00.176Z')).toBe(true);
      expect(dateValidator('non-date string')).toBe(false);
      expect(dateValidator(3)).toBe(true);
      expect(dateValidator()).toBe(false);
      expect(dateValidator({})).toBe(false);
      expect(dateValidator(() => {})).toBe(false);
    });
  });

  describe('datetime-local', () => {
    it('validates datetime-local correctly', () => {
      const dateValidator = typeValidators['datetime-local'];
      expect(dateValidator('2022-06-03T15:19:00.176Z')).toBe(true);
      expect(dateValidator('non-date string')).toBe(false);
      expect(dateValidator(3)).toBe(true);
      expect(dateValidator()).toBe(false);
      expect(dateValidator({})).toBe(false);
      expect(dateValidator(() => {})).toBe(false);
    });
  });

  describe('month', () => {
    it('validates month correctly', () => {
      const monthValidator = typeValidators['month'];
      expect(monthValidator('2022-00')).toBe(false);
      expect(monthValidator('2022-01')).toBe(true);
      expect(monthValidator('2022-12')).toBe(true);
      expect(monthValidator('2022-13')).toBe(false);
      expect(monthValidator('non-month string')).toBe(false);
      expect(monthValidator(3)).toBe(false);
      expect(monthValidator()).toBe(false);
      expect(monthValidator({})).toBe(false);
      expect(monthValidator(() => {})).toBe(false);
    });
  });

  describe('email', () => {
    it('validates email correctly', () => {
      const emailValidator = typeValidators['email'];
      expect(emailValidator('form.validator@email.com')).toBe(true);
      expect(emailValidator('form@email.com')).toBe(true);
      expect(emailValidator('@email.com')).toBe(false);
      expect(emailValidator('email.com')).toBe(false);
      expect(emailValidator('')).toBe(false);
    });
  });

  describe('week', () => {
    it('validates week correctly', () => {
      const weekValidator = typeValidators['week'];
      expect(weekValidator('2022-W00')).toBe(false);
      expect(weekValidator('2022-W01')).toBe(true);
      expect(weekValidator('2022-W52')).toBe(true);
      expect(weekValidator('2022-W53')).toBe(false);
      expect(weekValidator('non-week string')).toBe(false);
      expect(weekValidator('')).toBe(false);
    });
  });

  describe('url', () => {
    it('validates url correctly', () => {
      const urlValidator = typeValidators['url'];
      expect(urlValidator('http://google.com')).toBe(true);
      expect(urlValidator('http://google.com?arg1=2&arg2=5')).toBe(true);
      expect(urlValidator('http://google.com#fragment?arg1=2&arg2=5')).toBe(true);
      expect(urlValidator('google.com')).toBe(false);
    });
  });

  describe('tel', () => {
    it('validates tel correctly', () => {
      const telValidator = typeValidators['tel'];
      expect(telValidator('string')).toBe(true);
      expect(telValidator(3)).toBe(false);
    });
  });

  describe('color', () => {
    it('validates color correctly', () => {
      const colorValidator = typeValidators['color'];
      expect(colorValidator('')).toBe(false);
      expect(colorValidator('123456')).toBe(false); // too short
      expect(colorValidator('1234567')).toBe(false); // correct length, incorrect format
      expect(colorValidator('12345678')).toBe(false); // too long
      
      expect(colorValidator('#123456')).toBe(true); // valid RGB string with only numbers
      expect(colorValidator('#c0ffee')).toBe(true); // valid alphanumeric RGB string
      expect(colorValidator('#ef14fg')).toBe(false); // invalid RGB string
    });
  });

  describe('time', () => {
    it('validates time correctly', () => {
      const timeValidator = typeValidators['time'];
      expect(timeValidator()).toBe(false);
      expect(timeValidator({})).toBe(false);
      expect(timeValidator('')).toBe(false);
      expect(timeValidator('a')).toBe(false);
      expect(timeValidator('aa:aa')).toBe(false);
      expect(timeValidator('1')).toBe(false);
      expect(timeValidator('1:0')).toBe(false);
      expect(timeValidator('11:0')).toBe(false);
      expect(timeValidator('11:00')).toBe(true);
      
      expect(timeValidator('00:00')).toBe(true);
      expect(timeValidator('23:59')).toBe(true);
      expect(timeValidator('23:60')).toBe(false);
      expect(timeValidator('24:00')).toBe(false);
    });
  });

  describe('password', () => {
    it('validates password correctly', () => {
      const passwordValidator = typeValidators['password'];
      expect(passwordValidator('test')).toBe(true);
      expect(passwordValidator(3)).toBe(false);
      expect(passwordValidator()).toBe(false);
      expect(passwordValidator({})).toBe(false);
      expect(passwordValidator(() => { })).toBe(false);
    });
  });

  describe('range', () => {
    it('validates range correctly', () => {
      const rangeValidator = typeValidators['range'];
      expect(rangeValidator(3)).toBe(true);
      expect(rangeValidator(3.14)).toBe(true);
      expect(rangeValidator('test')).toBe(false);
      expect(rangeValidator()).toBe(false);
      expect(rangeValidator({})).toBe(false);
      expect(rangeValidator(() => {})).toBe(false);
    });
  });

  describe('group', () => {
    it('validates group correctly', () => {
      const groupValidator = typeValidators['group'];
      expect(groupValidator()).toBe(false);
      expect(groupValidator(null)).toBe(false);
      expect(groupValidator('a')).toBe(false);
      expect(groupValidator({})).toBe(false);
      expect(groupValidator([])).toBe(true);
      expect(groupValidator([1, 2, 3])).toBe(false);
      expect(groupValidator(['a', 'b', 'c'])).toBe(false);
      expect(groupValidator([{}, {}])).toBe(true);
    });
  });

  describe('checkbox group', () => {
    it('validates checkbox group correctly', () => {
      const checkboxGroupValidator = typeValidators['checkbox-group'];
      expect(checkboxGroupValidator()).toBe(false);
      expect(checkboxGroupValidator(null)).toBe(false);
      expect(checkboxGroupValidator('a')).toBe(false);
      expect(checkboxGroupValidator({})).toBe(false);
      expect(checkboxGroupValidator([])).toBe(true);
      expect(checkboxGroupValidator(['a', 'b', 'c'])).toBe(true);
      expect(checkboxGroupValidator([{}, {}])).toBe(false);
    });
  });
});
