import React from 'react';

function TextAreaField({ name, label, placeholder, constraints, onChange, value }) {
  const handleChange = (event) => onChange(event.target.value);

  return (
    <div>
      <label htmlFor={name} style={{ display: 'block' }}>{label}</label>
      <textarea name={name} id={name} onChange={handleChange} placeholder={placeholder} {...constraints}>
        {value}
      </textarea>
    </div>
  )
}

export default TextAreaField;
