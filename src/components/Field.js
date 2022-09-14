import React from 'react';
import { INPUT_TYPES } from '../form-input-types';
import BasicField from './BasicField';
import CheckboxGroupField from './CheckboxGroupField';
import GroupField from './GroupField';
import RadioGroupField from './RadioGroupField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';

function Field({ specification }) {
  const { type } = specification;
  
  if (!Object.values(INPUT_TYPES).includes(type))
    throw new Error(`Unsupported input type '${type}'`);

  switch(type) {
    case INPUT_TYPES.GROUP:
      return <GroupField {...specification} />;
    case INPUT_TYPES.CHECKBOX_GROUP:
      return <CheckboxGroupField {...specification} />;
    case INPUT_TYPES.RADIO_GROUP:
      return <RadioGroupField {...specification} />;
    case INPUT_TYPES.SELECT:
      return <SelectField {...specification} />;
    case INPUT_TYPES.TEXTAREA:
      return <TextAreaField {...specification} />;
    default:
      return <BasicField {...specification} />;
  }
}

export default Field;
