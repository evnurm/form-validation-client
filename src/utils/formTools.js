import validators from './constraintValidators';

export const isFieldRequired = ({ constraintValue, dependencies }) => {
  // Handle boolean values
  if (typeof constraintValue === 'boolean') {
    return constraintValue;
  }

  // Handle array of conditions for a field being required
  const constraintValidities = constraintValue.map(constraint => {
    const { type, value, field } = constraint;
    const func = validators[type];
    const dependency = dependencies[field];
    return func({ value: dependency?.value, constraintValue: value, type: dependency.fieldType });
  });
  const allValid = constraintValidities.every(validity => validity);

  return allValid;
};

export const getFieldDependencies = (formSpec, fieldSpec, values) => {
  if (typeof fieldSpec.constraints?.required === 'boolean') return [];
  const dependencies = {};
  const dependentFieldNames = fieldSpec.constraints.required?.map(constraint => constraint.field) || [];
  dependentFieldNames.forEach(fieldName => dependencies[fieldName] = {
    value: values[fieldName],
    fieldType: formSpec.fields.find(field => field.name === fieldName).type
  });
  return dependencies;
};
