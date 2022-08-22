import { getChangeHandler } from './changeHandlers';
import validators from './constraintValidators';
import {
  evaluateConstraintValidity,
  evaluateRequiredValidity,
  evaluateFunctionValidity,
  evaluateTypeValidity
} from './validationTools';

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

export const createField = (fieldSpec, formSpec, functions) => {
  const dependencies = Array.isArray(fieldSpec.constraints?.required) ? fieldSpec.constraints.required.map(({ field }) => field) : [];
  const fieldValidator = (values) => {
    const errors = [];
    const fieldValue = values[fieldSpec.name];

    const requiredValidity = evaluateRequiredValidity(fieldSpec, formSpec, values, errors);
    if (requiredValidity && !fieldValue) {
      return { validity: true, errors };
    } else if (!requiredValidity) {
      return { validity: false, errors };
    }

    const typeValidity = evaluateTypeValidity(fieldSpec, fieldValue);
    if (!typeValidity) {
      return { validity: false, errors };
    }

    const constraintValidity = evaluateConstraintValidity(fieldSpec, fieldValue, errors);
    if (!constraintValidity) {
      return { validity: false, errors };
    }

    const functionValidity = evaluateFunctionValidity(fieldSpec, fieldValue, functions, errors);

    if (!functionValidity) return { validity: false, errors };
    return { validity: true, errors };
  };

  return {
    name: fieldSpec.name,
    type: fieldSpec.type,
    label: fieldSpec.html?.label,
    placeholder: fieldSpec.html?.placeholder,
    constraints: { ...fieldSpec.constraints },
    validator: fieldValidator,
    dependencies,
    fields: fieldSpec.fields?.map(field => createField(field)),
    onChange: getChangeHandler(fieldSpec.type)
  };
};
