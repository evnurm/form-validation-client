import {
  evaluateConstraintValidity,
  evaluateFunctionValidity,
  evaluateTypeValidity,
  evaluateRequiredValidity
} from './validationTools';

import typeValidators from './typeValidators';

describe('validationTools', () => {
  describe('evaluateConstraintValidity', () => {
    const singleConstraintFieldSpec = {
      type: 'text',
      constraints: {
        maxlength: 5
      }
    };
    
    const multipleConstraintFieldSpec = {
      type: 'text',
      constraints: {
        maxlength: 5,
        minlength: 3
      }
    };

    it('validates a single constraint correctly', () => {
      const shorterResult = evaluateConstraintValidity(singleConstraintFieldSpec, 'aaaa', []);
      expect(shorterResult).toBe(true);

      const equalResult = evaluateConstraintValidity(singleConstraintFieldSpec, 'aaaaa', []);
      expect(equalResult).toBe(true);

      const longerResult = evaluateConstraintValidity(singleConstraintFieldSpec, 'aaaaaa', []);
      expect(longerResult).toBe(false);
    });

    it('validates multiple constraints correctly', () => {
      const tooShortResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aa', []);
      expect(tooShortResult).toBe(false);

      const minLengthResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aaa', []);
      expect(minLengthResult).toBe(true);

      const sufficientlyLongResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aaaa', []);
      expect(sufficientlyLongResult).toBe(true);

      const sufficientlyShortResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aaaa', []);
      expect(sufficientlyShortResult).toBe(true);

      const maxLengthResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aaaaa', []);
      expect(maxLengthResult).toBe(true);

      const tooLongResult = evaluateConstraintValidity(multipleConstraintFieldSpec, 'aaaaaa', []);
      expect(tooLongResult).toBe(false);
    });

    it('does not evaluate required constraints', () => {
      const fieldSpec = { 
        type: 'text',
        constraints: {
          required: true
        }
      };

      const validationResult = evaluateConstraintValidity(fieldSpec, undefined , []);
      expect(validationResult).toBe(true);
    });

    it('does not evaluate function constraints', () => {
      const fieldSpec = { 
        type: 'text',
        constraints: {
          functions: ['customValidator']
        }
      };
      
      const validationResult = evaluateConstraintValidity(fieldSpec, undefined , []);
      expect(validationResult).toBe(true);
    });
  });

  describe('evaluateFunctionValidity', () => {;
    const textStartsWithX = x => x.startsWith('X');
    const textEndsWithY = x => x.endsWith('Y');
    const functions = { textStartsWithX, textEndsWithY };

    it('evaluates one function constraint correctly', () => {
      const fieldSpec = {
        name: 'testField',
        type: 'text',
        constraints: {
          functions: [
            'textStartsWithX'
          ]
        }
      };

      expect(evaluateFunctionValidity(fieldSpec, { testField: 'X' }, functions, [])).toBe(true);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'X1' }, functions, [])).toBe(true);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'invalid string' }, functions, [])).toBe(false);
    });

    it('evaluates multiple function constraints correctly', () => {
      const fieldSpec = {
        name: 'testField',
        type: 'text',
        constraints: {
          functions: [
            'textStartsWithX',
            'textEndsWithY'
          ]
        }
      };

      expect(evaluateFunctionValidity(fieldSpec, { testField: 'invalid string' }, functions, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'X' }, functions, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'Y' }, functions, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'X1' }, functions, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField: '1Y' }, functions, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'XY' }, functions, [])).toBe(true);
      expect(evaluateFunctionValidity(fieldSpec, { testField: 'XsomethingY' }, functions, [])).toBe(true);
    });

    it('evaluates form-level function constraints correctly', () => {
      const validator = (_, form) => form.testField1 > form.testField2;

      const fieldSpec = {
        name: 'testField1',
        type: 'number',
        constraints: {
          functions: [
            'validator'
          ]
        }
      };

      expect(evaluateFunctionValidity(fieldSpec, { testField1: 6, testField2: 5 }, { validator }, [])).toBe(true);
      expect(evaluateFunctionValidity(fieldSpec, { testField1: 5, testField2: 5 }, { validator }, [])).toBe(false);
      expect(evaluateFunctionValidity(fieldSpec, { testField1: 4, testField2: 5 }, { validator }, [])).toBe(false);
    });
  });

  describe('evaluateTypeValidity', () => {
    const validatedTypes = Object.keys(typeValidators);
    const validators = validatedTypes.map(type => jest.spyOn(typeValidators, type));

    // Correct behaviour of type validators has been tested in typeValidators.test.js
    // This tests that the correct validator is called
    it('calls correct validators', () => {
      validatedTypes.forEach((type, index) => {
        evaluateTypeValidity({ type }, '', []);
        expect(validators[index]).toHaveBeenCalled();
      });
    });
  });

  describe('evaluateRequiredValidity', () => {
    it('requires a value if required = true', () => {
      const fieldSpec = {
        type: 'text',
        name: 'testField',
        constraints: {
          required: true
        }
      };

      const formSpec = { fields: [ fieldSpec ] };
      expect(evaluateRequiredValidity(fieldSpec, formSpec, {}, [])).toBe(false);
      expect(evaluateRequiredValidity(fieldSpec, formSpec, { testField: 'value' }, [])).toBe(true);
    });

    it('does not require a value if required = true', () => {
      const fieldSpec = {
        type: 'text',
        name: 'testField',
        constraints: {
          required: false
        }
      };

      const formSpec = { fields: [ fieldSpec ] };
      expect(evaluateRequiredValidity(fieldSpec, formSpec, {}, [])).toBe(true);
      expect(evaluateRequiredValidity(fieldSpec, formSpec, { testField: 'value' }, [])).toBe(true);
    });

    it('does not require a value if required constraint has not been specified', () => {
      const fieldSpec = {
        type: 'text',
        name: 'testField',
        constraints: {}
      };

      const formSpec = { fields: [ fieldSpec ] };
      expect(evaluateRequiredValidity(fieldSpec, formSpec, {}, [])).toBe(true);
      expect(evaluateRequiredValidity(fieldSpec, formSpec, { testField: 'value' }, [])).toBe(true);
    });
  });

  it('evaluates array of conditions correctly ', () => {
    const fieldSpecs = [
      {
        type: 'text',
        name: 'testField',
        constraints: {
          required: [
            {
              type: 'max',
              field: 'dependency',
              value: 17
            }
          ]
        }
      }, 
      {
        type: 'number',
        name: 'dependency' 
      }
    ];

    const formSpec = { fields: fieldSpecs };

    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 16 }, [])).toBe(false);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 17 }, [])).toBe(false);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 18 }, [])).toBe(true);

    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 16, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 17, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency: 18, testField: 'value' }, [])).toBe(true);
  });

  it('evaluates array of conditions correctly ', () => {
    const fieldSpecs = [
      {
        type: 'text',
        name: 'testField',
        constraints: {
          required: [
            {
              type: 'max',
              field: 'dependency1',
              value: 17
            }, {
              type: 'min',
              field: 'dependency2',
              value: 80
            }
          ]
        }
      },
      {
        type: 'number',
        name: 'dependency1' 
      }, 
      {
        type: 'number',
        name: 'dependency2' 
      }
    ];

    const formSpec = { fields: fieldSpecs };
    
    // No value for testField
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 79}, [])).toBe(true); // both conditions invalid
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 80}, [])).toBe(false); // dep1 valid, dep2 valid 
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 81}, [])).toBe(false); // dep1 valid, dep2 valid

    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 79 }, [])).toBe(true); // dep1 valid, dep2 invalid
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 80 }, [])).toBe(false); // both conditions valid
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 81 }, [])).toBe(false); // both conditions valid
    
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 79 }, [])).toBe(true); // both conditions invalid
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 80 }, [])).toBe(true); // dep1 invalid, dep2 valid
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 81 }, [])).toBe(true);  // dep1 invalid, dep2 valid

    // Value given for testField - should always be true
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 79, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 80, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 16, dependency2: 81, testField: 'value' }, [])).toBe(true);

    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 79, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 80, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 17, dependency2: 81, testField: 'value' }, [])).toBe(true);

    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 79, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 80, testField: 'value' }, [])).toBe(true);
    expect(evaluateRequiredValidity(fieldSpecs[0], formSpec, { dependency1: 18, dependency2: 81, testField: 'value' }, [])).toBe(true);
  });
});
