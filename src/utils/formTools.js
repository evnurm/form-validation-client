import { getChangeHandler } from './changeHandlers';
import validators from './constraintValidators';
import {
  evaluateConstraintValidity,
  evaluateRequiredValidity,
  evaluateFunctionValidity,
  evaluateTypeValidity
} from './validationTools';


export const getFieldDependencies = (formSpec, fieldSpec, values) => {
  const dependencies = {};
  const dependentFieldNames = getDependencyFieldNames(fieldSpec);  
  dependentFieldNames.forEach(fieldName => dependencies[fieldName] = {
    value: values[fieldName],
    fieldType: formSpec.fields.find(field => field.name === fieldName).type
  });
  return dependencies;
};

const checkBooleanRequiredCondition = (constraintValue) => {
  return constraintValue;
};

const checkArrayRequiredCondition = (constraintValue, dependencies) => {
  const constraintValidities = constraintValue.map(constraint => {
    const { type, value, field } = constraint;
    const func = validators[type];
    const dependency = dependencies[field];
    return func({ value: dependency?.value, constraintValue: value, type: dependency.fieldType });
  });
  const allValid = constraintValidities.every(validity => validity);
  
  return allValid;
};

// DNF = disjunctive normal form
const checkDNFRequiredCondition = (constraintValue, dependencies) => {
  return constraintValue.map(constraintArray => checkArrayRequiredCondition(constraintArray, dependencies)).some(x => x);
};

export const isFieldRequired = ({ constraintValue, dependencies }) => {
  if (typeof constraintValue === 'boolean') {
    return checkBooleanRequiredCondition(constraintValue);
  }

  if (Array.isArray(constraintValue)) {
    const isDNFCondition = constraintValue.map(elem => Array.isArray(elem)).every(x => x);
    if (isDNFCondition) {
      return checkDNFRequiredCondition(constraintValue, dependencies);
    }
    return checkArrayRequiredCondition(constraintValue, dependencies);
  }
};

const getDependencyFieldNames = fieldSpec => {
  let dependentFieldNames = new Set(fieldSpec.dependencies || []);
  
  if (Array.isArray(fieldSpec.constraints?.required)) {
    fieldSpec.constraints.required.forEach(constraint => {
      if (Array.isArray(constraint)) {
        constraint.forEach(c => dependentFieldNames.add(c.field));
      } else {
        dependentFieldNames.add(constraint.field);
      }
    });
  }
  return [...dependentFieldNames];
};

export const createField = (fieldSpec, formSpec, functions) => {
  const dependencies = getDependencyFieldNames(fieldSpec);
  const fieldValidator = async (values) => {
    const errors = [];
    const fieldValue = values[fieldSpec.name];

    const requiredValidity = evaluateRequiredValidity(fieldSpec, formSpec, values, errors);
    if (requiredValidity && !fieldValue) {
      return { validity: true, errors };
    } else if (!requiredValidity) {
      return { validity: false, errors };
    }

    const typeValidity = evaluateTypeValidity(fieldSpec, fieldValue, errors);
    if (!typeValidity) {
      return { validity: false, errors };
    }

    const constraintValidity = evaluateConstraintValidity(fieldSpec, fieldValue, errors);
    if (!constraintValidity) {
      return { validity: false, errors };
    }

    const functionValidity = await evaluateFunctionValidity(fieldSpec, values, functions, errors);

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
