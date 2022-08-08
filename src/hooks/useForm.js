import { useContext, useEffect, useMemo, useState } from 'react';
import typeValidators from '../utils/typeValidators';
import constraintValidatorFunctions from '../utils/constraintValidators';
import { getChangeHandler } from '../utils/changeHandlers';
import { getFieldDependencies, isFieldRequired } from '../utils/formTools';
import FormContext from '../FormContext';

const createField = (fieldSpec, formSpec, functions) => {

  const constraintKeys = Object.keys(fieldSpec.constraints || {})?.filter(constraint => !['functions', 'required'].includes(constraint));
  const constraintValues = constraintKeys.map(key => fieldSpec.constraints[key]);

  const dependencies = Array.isArray(fieldSpec.constraints?.required) ? fieldSpec.constraints.required.map(({ field }) => field) : [];

  const typeValidator = typeValidators[fieldSpec.type];
  const constraintValidators = constraintKeys
    .map(constraint => {
      const validator = constraintValidatorFunctions[constraint];
      if (!validator) console.error(`Unsupported constraint '${constraint}'`);
      return validator;
    });

  const functionValidators = fieldSpec.constraints?.functions?.map(functionName => functions[functionName]) || [];
  const requiredValidator = constraintValidatorFunctions.required;

  const fieldValidator = (values) => {
    const errors = [];
    const fieldValue = values[fieldSpec.name];

    if (fieldSpec.constraints?.required && !requiredValidator({ value: fieldValue, constraintValue: fieldSpec.constraints.required, dependencies: getFieldDependencies(formSpec, fieldSpec, values) })) {
      errors.push('required');
      return { validity: false, errors };
    }

    // If required constraint passed and the field has no value, the field is valid
    if (!fieldValue)
      return { validity: true, errors };

    if (!typeValidator(fieldValue)) {
      errors.push('type');
      return { validity: false, errors };
    }

    const constraintValidities = constraintValidators.map((validator, index) => {
      const validationResult = validator({ value: fieldValue, constraintValue: constraintValues[index], type: fieldSpec.type });
      if (!validationResult) 
        errors.push(constraintKeys[index]);
      return validationResult;
    });

    const functionValidity = functionValidators.map((func, index) => {
      const validity = func(fieldValue);
      if (!validity)
        errors.push(fieldSpec.constraints.functions[index]);
      return validity;
    }).every(validity => validity);

    if (!functionValidity) return false;
    return { validity: constraintValidities.every(isValid => isValid), errors };
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
    onChange: () => {}
  };
};

const useForm = (name) => {
  const { forms, functions } = useContext(FormContext);
  const specification = forms[name];
  const [inputData, setInputData] = useState({});
  const [validities, setValidities] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldsRequired, setFieldsRequired] = useState({});

  const fields = useMemo(() => specification.fields.map(fieldSpec => createField(fieldSpec, specification, functions)), [specification]);
  const fieldData = useMemo(() => {
    return fields.map(field => ({
      ...field,
      constraints: {
        ...field.constraints,
        required: fieldsRequired[field.name]
      },
      value: inputData[field.name],
      errors: fieldErrors[field.name],
      onChange: (value) => {
        const newValue = getChangeHandler(field.type)(value, inputData[field.name]);
        setFieldValue(field.name, newValue);
      }
    }));
  
  }, [inputData, validities, fields, fieldsRequired]);

  const evaluateRequiredConstraint = (field, inputValues) => {
    if (!field.constraints?.required)
      return false;

    const fieldNames = fields.map(field => field.name);

    let dependencies = fieldNames.map(fieldName => ({ value: inputValues ? inputValues[fieldName] : inputData[fieldName], fieldType: fields.find(field => field.name === fieldName).type }));
    let deps = {};

    fieldNames.forEach((name, index) => { deps[name] = dependencies[index] });
    return isFieldRequired({
      constraintValue: field.constraints.required,
      dependencies: deps
    });
  };

  const getFields = () => {
    return fields.map(field => ({
      ...field,
      constraints: field.constraints,
      required: fieldsRequired[field.name]
    }));
  };

  const updateDependentFieldsRequired = (fieldName, inputValues) => {
    const dependentFields = fields.filter(field => field.dependencies.includes(fieldName));
    const dependentFieldRequired = dependentFields.map(field => evaluateRequiredConstraint(field, inputValues));

    const newRequiredValues = {};

    dependentFields.forEach((field, index) => newRequiredValues[field.name] = dependentFieldRequired[index]);
    setFieldsRequired({ ...fieldsRequired, ...newRequiredValues });
  };

  const getFieldValue = (fieldName) => {
    return inputData[fieldName];
  };

  const setFieldValue = (fieldName, value) => {
    const field = fields.find(field => field.name === fieldName);
    if (!field)
      throw new Error(`Cannot update non-existing field '${fieldName}'`);

    const newInputData = { ...inputData, [fieldName]: value };
    const { validity, errors } = field.validator(newInputData);

    setValidities({
      ...validities,
      [fieldName]: validity
    });

    setFieldErrors({ ...fieldErrors, [fieldName]: errors });
    updateDependentFieldsRequired(fieldName, newInputData);

    setInputData(newInputData);
  };

  const getFieldValues = () => {
    return inputData;
  };

  const validate = () => {
    const validityStates = fields.map(field => field.validator(inputData));
    const result = { validity: validityStates.every(validityState => validityState.validity), errors: {} };

    validityStates.forEach((validityState, index) => result.errors[fields[index].name] = validityState.errors);
    return result;
  };

  useEffect(() => {
    const requiredStatuses = {};
    fields.forEach(field => requiredStatuses[field.name] = evaluateRequiredConstraint(field, inputData));
    setFieldsRequired(requiredStatuses);
  }, []);

  return {
    fields: fieldData,
    getFields,
    getFieldValue,
    setFieldValue,
    getFieldValues,
    validate
  };
};

export default useForm;
