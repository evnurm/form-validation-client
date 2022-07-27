import React from 'react';
import { INPUT_TYPES } from '../form-input-types';
import BasicField from './BasicField';
import RadioGroupField from './RadioGroupField';

function Field({ name, type, label, constraints, onChange }) {
  switch(type) {
    case INPUT_TYPES.RADIO_GROUP:
      return <RadioGroupField name={name} type={type} label={label} constraints={constraints} onChange={onChange} />;
    default:
      return <BasicField name={name} type={type} label={label} constraints={constraints} onChange={onChange} />;
  }
}

export default Field;
