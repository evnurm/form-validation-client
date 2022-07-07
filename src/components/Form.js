import React, { useCallback, useMemo, useState } from 'react';
import Field from './Field';

function Form({ specification }) {
  const [data, setData] = useState({});

  if (!specification.fields)
    throw new Error('Specification must contain fields');

  const handleFieldChange = useCallback((fieldName, value) => setData({ ...data, [fieldName]: value }), [data]);

  const fields = useMemo(() => specification.fields.map(fieldSpec => <Field specification={fieldSpec} key={fieldSpec.name} onChange={handleFieldChange} />), [specification, handleFieldChange]);

  return (
    <form method="POST" action="http://localhost:3001/form">
      {fields}
    </form>
  );
}

export default Form;
