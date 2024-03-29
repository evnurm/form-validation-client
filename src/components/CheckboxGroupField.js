import React from 'react';

function CheckboxGroupField({ name, label, constraints, onChange, value: chosenValues }) {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      {constraints.values.map(({ value, label }, index) => (
        <span key={name + '-option-' + value}>
          <input
            type="checkbox"
            name={name}
            value={value}
            id={`${name}-option-${index}`}
            onChange={() =>  onChange(value)}
            checked={chosenValues?.includes(value)}
 
          />
          <label htmlFor={`${name}-option-${index}`}>{label}</label>
        </span>
      ))}
    </div>
  );
}

export default CheckboxGroupField;
