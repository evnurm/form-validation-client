import React from 'react';
import { INPUT_TYPES } from '../form-input-types';
import BasicField from './BasicField';
import RadioGroupField from './RadioGroupField';

function Field({ specification, onChange }) {

  const validateSpecification = () => {
    if (!specification.type) {
      throw new Error('Field specification must contain a type');
    }

    if (!specification.name)
      throw new Error('Field specification must contain a name');

    if (!Object.values(INPUT_TYPES).includes(specification.type))
      throw new Error(`Field type is invalid: type '${specification.type}' is not supported`);
  };

  validateSpecification();

  switch(specification.type) {
    case INPUT_TYPES.RADIO_GROUP:
      return <RadioGroupField specification={specification} onChange={onChange} />;
    default:
      return <BasicField specification={specification} onChange={onChange} />;
  }
}

export default Field;
