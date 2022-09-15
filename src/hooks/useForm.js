import { useContext, useEffect, useMemo, useState } from 'react';
import { getChangeHandler } from '../utils/changeHandlers';
import { isFieldRequired, createField, createFieldsForGroupInstance } from '../utils/formTools';
import FormContext from '../FormContext';
import { INPUT_TYPES } from '../form-input-types';

const useForm = (name) => {
  const { forms, functions } = useContext(FormContext);
  const specification = forms[name];
  const [inputData, setInputData] = useState({});
  const [validities, setValidities] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldsRequired, setFieldsRequired] = useState({});
  const [groupFields, setGroupFields] = useState({});

  const fields = useMemo(() => specification.fields.map(fieldSpec => createField(fieldSpec, specification, functions)), [specification]);

  const addGroupInstance = (groupFieldName) => {
    const groupFieldSpecification = specification.fields.find(field => field.name === groupFieldName);
    if (!groupFieldSpecification || groupFieldSpecification.type !== INPUT_TYPES.GROUP)
      throw new Error(`Group field '${groupFieldName}' does not exist`);

    const groupField = groupFields[groupFieldName];
    const instanceFields = createFieldsForGroupInstance(groupFieldSpecification, specification, functions, groupField?.length ?? 0);
    const newGroupField = groupField ? [...groupField, instanceFields] : [instanceFields];
    const newGroupFields = {...groupFields, [groupFieldName]: newGroupField};
    setGroupFields(newGroupFields);
  };

  const simpleFieldChangeHandler = (field, value) => {
    const newValue = getChangeHandler(field.type)(value, inputData[field.name]);
    setFieldValue(field, newValue);
  };

  const getValueInGroupInstance = (groupName, instanceIndex, fieldName, data) => {
    const groupValue = data[groupName];
    if (!groupValue) return;

    const groupInstanceValue = groupValue[instanceIndex];
    if (!groupInstanceValue) return;

    const instanceFieldValue = groupInstanceValue[fieldName];
    if (!instanceFieldValue) return;

    return instanceFieldValue;
  };

  const getFieldValueInGroupInstance = (groupName, instanceIndex, fieldName) => getValueInGroupInstance(groupName, instanceIndex, fieldName, inputData);
  const getFieldValidityInGroupInstance = (groupName, instanceIndex, fieldName) => getValueInGroupInstance(groupName, instanceIndex, fieldName, validities);
  const getFieldErrorsInGroupInstance = (groupName, instanceIndex, fieldName) => getValueInGroupInstance(groupName, instanceIndex, fieldName, fieldErrors);

  const fieldData = useMemo(() => {
    const fieldCreator = fields => {
      return fields.map(field => ({
        ...field,
        constraints: {
          ...field.constraints,
          required: fieldsRequired[field.name]
        },
        value: field.group ? getFieldValueInGroupInstance(field.group, field.index, field.name) : inputData[field.name],
        validity: field.group ? getFieldValidityInGroupInstance(field.group, field.index, field.name) : validities[field.name],
        errors: field.group ? getFieldErrorsInGroupInstance(field.group, field.index, field.name) : fieldErrors[field.name],
        onChange: (value) => simpleFieldChangeHandler(field, value),
        addInstance: () => addGroupInstance(field.name),
        fields: groupFields[field.name] && groupFields[field.name].map(instance => fieldCreator(instance))
      })
    )};
    return fieldCreator(fields);
  }, [inputData, validities, fields, fieldErrors, fieldsRequired, groupFields]);

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

  const updateDependentFieldsRequired = (fieldName, inputValues) => {
    const dependentFields = fields.filter(field => field.dependencies.includes(fieldName));
    const dependentFieldRequired = dependentFields.map(field => evaluateRequiredConstraint(field, inputValues));

    const newRequiredValues = {};

    dependentFields.forEach((field, index) => newRequiredValues[field.name] = dependentFieldRequired[index]);
    setFieldsRequired({ ...fieldsRequired, ...newRequiredValues });
  };

  const updateDependentFieldsValidity = async (fieldName, inputValues, fieldValidities, errors) => {
    const dependentFields = fields.filter(field => field.dependencies.includes(fieldName));
    if (!dependentFields) return;

    const validityStates = (await Promise.allSettled(dependentFields.map(field => field.validator(inputValues)))).map(({ value }) => value);
    
    const newValidities = {...fieldValidities};
    const newErrors = {...errors};

    validityStates.forEach((validityState, index) => {
      newValidities[dependentFields[index].name] = validityState.validity;
      newErrors[dependentFields[index].name] = validityState.errors;
    });

    return { validities: newValidities, errors: newErrors };
  };

  const getFieldValue = (fieldName) => {
    return inputData[fieldName];
  };

  const setFieldValue = async (fieldObject, value) => {
    const fieldName = fieldObject.name;
    let field;
    
    if (!fieldObject.group && !fieldObject.index)
      field = fields.find(field => field.name === fieldName);
    else {
      field = groupFields[fieldObject.group][fieldObject.index].find(f => f.name === fieldName);
    }

    if (!field)
      throw new Error(`Cannot update non-existing field '${fieldName + (fieldObject.index ? ('@' + fieldObject.index) : '')}'`);
    
    let newInputData;

    // Handle group fields
    if (field.group && field.index !== undefined) {
      const inputDataGroupField = inputData[field.group] || [];
      if (!inputDataGroupField[field.index]) {
        inputDataGroupField[field.index] = {};
      }
      inputDataGroupField[field.index][fieldName] = value;
      newInputData = { ...inputData, [field.group]: inputDataGroupField };
    } else {
      newInputData = { ...inputData, [fieldName]: value }; // simple (non-group) field
    }

    const { validity, errors } = await field.validator(newInputData, { group: field.group, instanceIndex: field.index });
    
    let newFieldValidity = validity;

    if (field.group && field.index !== undefined) {
      newFieldValidity = validities[field.group] || [];
      if (!newFieldValidity[field.index]) {
        newFieldValidity[field.index] = {};
      }
      newFieldValidity[field.index][fieldName] = validity;
    }

    const newValidities = {
      ...validities,
      [field.group ?? fieldName]: newFieldValidity
    };

    let newErrors = {...fieldErrors, [fieldName]: errors };
    if (field.group && field.index !== undefined) {
      newErrors = {...fieldErrors, [field.group]: fieldErrors[field.group] || []};
      if (!newErrors[field.group][field.index]) {
        newErrors[field.group][field.index] = {};
      }
      newErrors[field.group][field.index][fieldName] = errors;
    }

    const { validities: updatedValidities, errors: updatedErrors} = await updateDependentFieldsValidity(fieldName, newInputData, newValidities, newErrors);

    updateDependentFieldsRequired(fieldName, newInputData);
    setInputData(newInputData);
    setValidities(updatedValidities);
    setFieldErrors(updatedErrors);
  };

  const getFieldValues = () => {
    return inputData;
  };

  const validate = async () => {
    const validityStates = (await Promise.allSettled(fields.map(field => field.validator(inputData)))).map(({ value }) => value);
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
    getFieldValue,
    setFieldValue,
    getFieldValues,
    validate
  };
};

export default useForm;
