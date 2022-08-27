import { getFieldDependencies } from './formTools';
import constraintValidatorFunctions from '../utils/constraintValidators';
import typeValidators from './typeValidators';

export const getFunctionValidators = (fieldSpec, functions) => {
  return fieldSpec.constraints?.clientSideFunctions?.map(functionName => functions[functionName]) || [];
};

const getConstraintValidators = (constraintKeys) => {
  return constraintKeys
    .map(constraint => {
      const validator = constraintValidatorFunctions[constraint];
      if (!validator) console.error(`Unsupported constraint '${constraint}'`);
      return validator;
    });
};

export const evaluateRequiredValidity = (fieldSpec, formSpec, values, errors) => {
  const fieldValue = values[fieldSpec.name];
  const requiredCondition = fieldSpec.constraints?.required;
  const requiredValidator = constraintValidatorFunctions.required;

  if (requiredCondition && !requiredValidator({ value: fieldValue, constraintValue: requiredCondition, dependencies: getFieldDependencies(formSpec, fieldSpec, values) })) {
    errors.push('required');
    return false;
  }
  return true;
};

export const evaluateTypeValidity = (fieldSpec, fieldValue, errors) => {
  const typeValidator = typeValidators[fieldSpec.type];
  if (!typeValidator(fieldValue)) {
    errors.push('type');
    return false;
  }
  return true;
};

export const evaluateConstraintValidity = (fieldSpec, fieldValue, errors) => {
  const constraintKeys = Object
    .keys(fieldSpec.constraints || {})
    ?.filter(constraint => !['clientSideFunctions', 'serverSideFunctions', 'required'].includes(constraint));

  const constraintValues = constraintKeys.map(key => fieldSpec.constraints[key]);

  const constraintValidators = getConstraintValidators(constraintKeys);
  const constraintValidities = constraintValidators.map((validator, index) => {
    const validationResult = validator({ value: fieldValue, constraintValue: constraintValues[index], type: fieldSpec.type });
    if (!validationResult)
      errors.push(constraintKeys[index]);
    return validationResult;
  });
  return constraintValidities.every(isValid => isValid);
};

export const evaluateFunctionValidity = async (fieldSpec, fieldValues, functions, errors) => {
  const functionValidators = getFunctionValidators(fieldSpec, functions);
  const functionValidities = (
    await Promise.allSettled(
      functionValidators.map(func => Promise.resolve(func(fieldValues[fieldSpec.name], fieldValues)))
    )
  ).map(({ value }) => value);
 
  let isValid = true;
  functionValidities.forEach((validity, index) => {
    if (!validity) {
      errors.push(fieldSpec.constraints.clientSideFunctions[index]);
      isValid = false;
    }
  });

  return isValid;
};
