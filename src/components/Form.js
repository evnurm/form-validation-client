import React, { useMemo } from 'react';
import useForm from '../hooks/useForm';
import Field from './Field';

function Form() {
  const form = useForm('person');
  const onValidateClick = async () => console.log('form.validate()',  await form.validate());

  const fields = useMemo(() => form.fields.map(field => <Field key={field.name} specification={field} />), [form.fields]);

  const submitForm = async (e) => {
    e.preventDefault();
    const formValidityState = await form.validate();

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
      <form>
        {fields}
      </form>
      <button onClick={submitForm}>Submit form</button>
      <button onClick={onValidateClick}>Validate form</button>
    </>
  );
}

export default Form;
