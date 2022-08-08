import React, { useMemo } from 'react';
import useForm from '../hooks/useForm';
import Field from './Field';

function Form() {
  const form = useForm('person');
  const onValidateClick = () => console.log('form.validate()', form.validate());

  const fields = useMemo(() => form.fields.map(field => <Field specification={field} />), [form.fields]);

  const submitForm = async () => {
    const formValidityState = form.validate();

    if (formValidityState.validity) {
      const formData = form.getFieldValues();
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
    <button onClick={onValidateClick}>Validate form</button>
    </>
  );
}

export default Form;
