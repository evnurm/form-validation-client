import React from 'react';
import { INPUT_TYPES } from '../form-input-types';
import BasicField from './BasicField';
import CheckboxGroupField from './CheckboxGroupField';
import GroupField from './GroupField';
import RadioGroupField from './RadioGroupField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';

function Field({ specification }) {
  const { name, type, label, placeholder, constraints, onChange, value } = specification;

  if (!Object.values(INPUT_TYPES).includes(type))
    throw new Error('Unsupported input type');

  switch(type) {
    case INPUT_TYPES.GROUP:
      return <GroupField fields={specification.fields} />;
    case INPUT_TYPES.CHECKBOX_GROUP:
      return <CheckboxGroupField name={name} type={type} label={label} constraints={constraints} onChange={onChange} value={value} />;
    case INPUT_TYPES.RADIO_GROUP:
      return <RadioGroupField name={name} type={type} label={label} constraints={constraints} onChange={onChange} value={value} />;
    case INPUT_TYPES.SELECT:
      return  <SelectField name={name} type={type} label={label} placeholder={placeholder} constraints={constraints} onChange={onChange} value={value} />;
    case INPUT_TYPES.TEXTAREA:
      return <TextAreaField name={name} label={label} placeholder={placeholder} constraints={constraints} onChange={onChange} value={value} />;
    default:
      return <BasicField name={name} type={type} label={label} placeholder={placeholder} constraints={constraints} onChange={onChange} value={value} />;
  }
}

export default Field;
