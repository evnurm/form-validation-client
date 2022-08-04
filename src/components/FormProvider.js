import React from 'react';
import FormContext from '../FormContext';

function FormProvider({ children, forms, functions }) {
  
  const formsAsObject = {};
  forms.forEach(form => formsAsObject[form.name] = form);

  const contextValue = { 
    forms: formsAsObject,
    functions
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  )
}

export default FormProvider;
