import React, { useState } from 'react';

function RadioGroupField({ name, label, constraints, onChange }) {
  const [chosenValue, setChosenValue] = useState(undefined);

  const handleChange = (event, value) => {
    event.preventDefault();
    setChosenValue(value);
    onChange(name, value);
  };

  return (
    <div>
      <div>
        <label>{label}</label>
      </div>
      {constraints.values.map(({ value, label }, index) => (
        <>
          <label htmlFor={`${name}-option-${index}`}>{label}</label>
          <input
            type="radio"
            name={name}
            value={value}
            id={`${name}-option-${index}`}
            onChange={(event) => handleChange(event, value)}
            checked={chosenValue === value}
          />
        </>
      ))}
    </div>
  );
}

export default RadioGroupField;
