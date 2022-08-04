import React, { useCallback, useMemo, useState } from 'react';
import useForm from '../hooks/useForm';
import Field from './Field';

function Form() {
  const [data, setData] = useState({});
  const form = useForm('person');
  const onClick = () => console.log('form.validate()', form.validate());

  const handleFieldChange = useCallback((fieldName, value) => {
    form.setFieldValue(fieldName, value);
    setData({ ...data, [fieldName]: value });
  }, [data, form]);      
  const fields = useMemo(() => form.fields.map(field => <Field name={field.name} type={field.type} placeholder={field.placeholder} label={field.label} constraints={field.constraints} onChange={handleFieldChange} />), [handleFieldChange]);

  const submitForm = async () => {
    const formValidityState = form.validate();

    if (formValidityState.validity) {
      const formData =  form.getFieldValues();
      const result = await fetch('http://localhost:3001/form', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(result);
    } else {
      console.log('Form invalid');
    }
  };

  return (
    <>
    <form method="POST" action="http://localhost:3001/form">
      {fields}
    </form>
    <button onClick={submitForm}>Submit form</button>
    <button onClick={onClick}>Validate form</button>
    </>
  );
}

export default Form;
