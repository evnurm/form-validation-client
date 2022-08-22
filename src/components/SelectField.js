import React from 'react';

function SelectField({ name, constraints, label, onChange, value: selectedValue }) {
  return (
    <div>
      <label htmlFor={name} style={{display: 'block'}}>{label}</label>
      <select name={name} id={name} onChange={(event) => onChange(event.target.value)} value={selectedValue}>
        <option value="">Choose {name}</option>
        {constraints.values.map(({ label, value }) => 
          <option value={value}>{label}</option>
        )}
      </select>
    </div>
  );
}

export default SelectField;
