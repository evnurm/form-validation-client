import React from 'react';

const INITIAL_STATE = {
  forms: [],
  functions: []
};

const FormContext = React.createContext(INITIAL_STATE);

export default FormContext;
