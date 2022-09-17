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

export const createFieldsForGroupInstance = (groupFieldSpec, formSpec, functions, index) => {
  if (!groupFieldSpec)
    throw new Error('Group field specification must be provided');

  const groupFieldName = groupFieldSpec.name;
  return groupFieldSpec.fields.map(fieldSpec => createField(fieldSpec, formSpec, functions, { group: groupFieldName, index }));
};

const getFieldValidatorForFieldSpec = (fieldSpec, formSpec, functions) => async (values, groupOptions) => {
  const errors = [];
  let fieldValue;
  if (groupOptions?.group && groupOptions?.instanceIndex !== undefined) {
    if (
      values[groupOptions.group] &&
      values[groupOptions.group][groupOptions.instanceIndex] &&
      values[groupOptions.group][groupOptions.instanceIndex][fieldSpec.name]
    ) {
      fieldValue = values[groupOptions.group][groupOptions.instanceIndex][fieldSpec.name];
    }
  } else
    fieldValue = values[fieldSpec.name];
  const fieldSpecWithGroupInformation = {...fieldSpec, group: groupOptions?.group, index: groupOptions?.instanceIndex};
  const requiredValidity = evaluateRequiredValidity(fieldSpecWithGroupInformation, formSpec, values, errors);
  
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

export const createField = (fieldSpec, formSpec, functions, options) => {
  const dependencies = getDependencyFieldNames(fieldSpec);

  // prevent forwarding non-HTML constraints to HTML elements
  const publishableConstraints = { ...fieldSpec.constraints };
  delete publishableConstraints.clientSideFunctions;

  return {
    name: fieldSpec.name,
    type: fieldSpec.type,
    label: fieldSpec.html?.label,
    placeholder: fieldSpec.html?.placeholder,
    constraints: publishableConstraints,
    validator: getFieldValidatorForFieldSpec(fieldSpec, formSpec, functions),
    dependencies,
    group: options?.group,
    index: options?.index,
    onChange: () => {}
  };
};
