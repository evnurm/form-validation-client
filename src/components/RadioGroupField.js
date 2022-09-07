import React from 'react';

function RadioGroupField({ name, label, constraints, onChange, value: chosenValue }) {
  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      {constraints.values.map(({ value, label }, index) => (
        <span key={name + '-option-' + value}>
          <label htmlFor={`${name}-option-${index}`}>{label}</label>
          <input
            type="radio"
            name={name}
            value={value}
            id={`${name}-option-${index}`}
            onChange={() => onChange(value)}
            checked={chosenValue === value}
          />
        </span>
      ))}
    </div>
  );
}

export default RadioGroupField;
