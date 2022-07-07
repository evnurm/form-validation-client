import React, { useState } from 'react';
import { INPUT_TYPES } from '../form-input-types';

const getHtmlId = (specification) => {
  return specification.name;
};

function BasicField({ specification, onChange }) {  
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(specification.name, event.target.value);
  };

  return specification.type !== INPUT_TYPES.GROUP ? (
    <>
      {specification.html?.label &&
        <label htmlFor={getHtmlId(specification)}>{specification.html.label}</label>
      }
      <input
        type={specification.type}
        placeholder={specification.html?.placeholder}
        style={{ display: 'block' }}
        value={value} onChange={handleChange}
        {...specification.constraints}
      />
    </>
  ) : null;
}

export default BasicField;
