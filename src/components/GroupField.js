import React from 'react';
import Field from './Field';

function GroupField({ fields, label, addInstance }) {
  const instances = fields;

  const renderInstance = (instance) => {
    return instance.map(field => <Field specification={field} />);
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div>{label}</div>
      {instances?.map(instance => renderInstance(instance))}
      <button onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addInstance();
      }}>
        Add
      </button>
    </div>
  );
}

export default GroupField;
