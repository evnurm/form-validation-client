import React, { useMemo } from 'react';
import Field from './Field';

function Form({ specification }) {
  if (!specification.fields)
    throw new Error('Specification must contain fields');

  const fields = useMemo(() => specification.fields.map(fieldSpec => <Field specification={fieldSpec} key={fieldSpec.name} />), [specification]);

  return (
    <form>
      {fields}
    </form>
  );
}

export default Form;