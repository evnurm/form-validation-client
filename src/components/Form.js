import React, { useCallback, useMemo, useState } from 'react';
import useForm from '../hooks/useForm';
import Field from './Field';

function Form({ specification }) {
  const [data, setData] = useState({});
  const form = useForm(specification);

  if (!specification.fields)
    throw new Error('Specification must contain fields');

  const handleFieldChange = useCallback((fieldName, value) => {
    form.setFieldValue(fieldName, value);
    setData({ ...data, [fieldName]: value });
  }, [data, form]);      
  const fields = useMemo(() => form.fields.map(field => <Field name={field.name} type={field.type} placeholder={field.placeholder} label={field.label} constraints={field.constraints} onChange={handleFieldChange} />), [specification, handleFieldChange]);

  return (
    <form method="POST" action="http://localhost:3001/form">
      {fields}
    </form>
  );
}

export default Form;
