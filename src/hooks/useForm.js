import { useEffect, useMemo, useState } from 'react';
import typeValidators from '../utils/typeValidators';
import constraintValidatorFunctions from '../utils/constraintValidators';
import { getFieldDependencies, isFieldRequired } from '../utils/formTools';

const createField = (fieldSpec, formSpec) => {

  const constraintKeys = Object.keys(fieldSpec.constraints || {})?.filter(constraint => constraint !== 'required');
  const constraintValues = constraintKeys.map(key => fieldSpec.constraints[key]);

  const dependencies = Array.isArray(fieldSpec.constraints?.required) ? fieldSpec.constraints.required.map(({field}) => field) : [];

  const typeValidator = typeValidators[fieldSpec.type];
  const constraintValidators = constraintKeys
    .map(constraint => {
      const validator = constraintValidatorFunctions[constraint];
      if (!validator) console.error(`Unsupported constraint '${constraint}'`);
      return validator;
    });

  const requiredValidator = constraintValidatorFunctions.required;

  const fieldValidator = (values) => {
    const fieldValue = values[fieldSpec.name];

    if (fieldSpec.constraints?.required && !requiredValidator({ value: fieldValue, constraintValue: fieldSpec.constraints.required, dependencies: getFieldDependencies(formSpec, fieldSpec, values) })) {
      return false;
    }

    if (!typeValidator(fieldValue)) {
      return false;
    }

    const constraintValidities = constraintValidators.map((validator, index) => 
      validator({ value: fieldValue, constraintValue: constraintValues[index], type: fieldSpec.type
    }));

    return constraintValidities.every(isValid => isValid);
  };

  return {
    name: fieldSpec.name,
    type: fieldSpec.type,
    label: fieldSpec.html?.label,
    placeholder: fieldSpec.html?.placeholder,
    constraints: {...fieldSpec.constraints},
    validator: fieldValidator,
    dependencies
  };
};

const useForm = (specification) => {
  const [inputData, setInputData] = useState({});
  const fields = useMemo(() => specification.fields.map(fieldSpec => createField(fieldSpec, specification)), [specification]);
  const [validities, setValidities] = useState({});
  const [fieldsRequired, setFieldsRequired] = useState({});
  
  const fieldData = useMemo(() => {
    return fields.map(field => ({...field, constraints: { ...field.constraints, required: fieldsRequired[field.name] }, value: inputData[field.name]}));
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
    setValidities({
      ...validities,
      [fieldName]: field.validator(newInputData)
    });
    
    updateDependentFieldsRequired(fieldName, newInputData);

    setInputData(newInputData);
  };

  useEffect(() => {
    const requiredStatuses = {};
    fields.forEach(field => requiredStatuses[field.name] = evaluateRequiredConstraint(field, inputData));
    setFieldsRequired(requiredStatuses);
  }, []);

  return { fields: fieldData, getFields, getFieldValue, setFieldValue };
};

export default useForm;
