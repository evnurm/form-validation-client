import React, { useState } from 'react';
import { INPUT_TYPES } from '../form-input-types';

function BasicField({ name, type, constraints, label, placeholder, onChange }) {
  const [value, setValue] = useState(null);

  // Convert string inputs to correct data type when necessary
  const fixInputType = (input) => {
    switch (type) {
      case INPUT_TYPES.NUMBER:
        if (typeof input === 'string') {
          return Number(input);
        }
        return input;
      default:
        return input;
    }
  };

  const handleChange = (event) => {
    const value = fixInputType(event.target.value);
    setValue(value);
    onChange(name, value);
  };

  return type !== INPUT_TYPES.GROUP ? (
    <>
      {label &&
        <label htmlFor={name}>{label}</label>
      }
      <input
        type={type}
        placeholder={placeholder}
        style={{ display: 'block' }}
        value={value}
        onChange={handleChange}
        id={name}
        {...constraints}
      />
    </>
  ) : null;
}

export default BasicField;
