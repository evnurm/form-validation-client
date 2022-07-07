import React, { useState } from 'react';

function RadioGroupField({ specification, onChange }) {
  const [chosenValue, setChosenValue] = useState(undefined);

  const handleChange = (event, value) => {
    event.preventDefault();
    setChosenValue(value);
    onChange(specification.name, value);
  };

  return (
    <div>
      <div>
        <label>{specification.html?.label}</label>
      </div>
      {specification.constraints.values.map(({ value, label }, index) => (
        <>
          <label htmlFor={`${specification.name}-option-${index}`}>{label}</label>
          <input
            type="radio"
            name={specification.name}
            value={value}
            id={`${specification.name}-option-${index}`}
            onChange={(event) => handleChange(event, value)}
            checked={chosenValue === value}
          />
        </>
      ))}
    </div>
  );
}

export default RadioGroupField;
