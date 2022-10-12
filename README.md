# form-validation-client

A declarative form validation library for React. It is intended to be used alongside [`form-validation-server`](https://github.com/evnurm/form-validation-server) to allow re-use of validation logic on client and server and thus avoid duplicating the code that performs form validation logic.

## Usage

The client-side form validation tool offers validation functionality by implementing and providing the `useForm` hook which returns a list of field objects that can be used in React components.

### Setting up the form validator

To set up `form-validation-client`, the application or the part of the application that uses forms must be wrapped in a `FormProvider`. The FormProvider is a wrapper that uses context to make form validation functionality available to any component using the `useForm` hook. It takes two props: `forms` and `functions`. The `forms` from is a list of imported JSON specifications. The `functions` prop is an object that maps custom validator names used in the specification to JS functions.

```javascript
import React from 'react';
import FormProvider from './components/FormProvider';

const forms = []; // list of form specifications (JSON)
const functions = {}; // { customValidatorName: function }

function App() {
  return (
    <FormProvider forms={forms} functions={functions}>
      {/* part of the application that uses forms */}
    </FormProvider>
  );
}

export default App;
```

### useForm

The provided `useForm` hook offers information on the state of the fields and functions that can be used to manipulate the states of the fields. 

```javascript
import React from 'react';
import useForm from './hooks/useForm';

const Form = () => {
  const form = useForm('formSpecName'); // name in form specification

  const {
    fields, // list of field objects
    getFieldValue, // get the value of a single field 
    getFieldvalues, // get all input values
    setFieldValue, // a function for setting the value of a field (also triggers validation of the field)
    validate // validates the whole form
   } = form;

  return (
    <form>
      {/* render form based on fields */}
    </form>
  );
};

export default Form;
```

The contents of an object in `fields` is the following:
  |Property| Explanation |
  |------|-------------------------------------------------|
  | name | the name of the field in the form specification |
  | type | the type of the field in the form specification |
  | label | the label defined in the html property of the field specification |
  | placeholder | the placeholder defined in the html property of the field specification |
  | constraints | the constraints defined in the field specification excluding custom validators. Required constraint is evaluated and returned as a Boolean |
  | validator | the validator function for the field |
  | group | the name of the group to which a field belongs (only applies to subfields of a group field) |
  | dependencies | a list of the fields on which the validity of a field depends |
  | index | the index of the instance of a group to which a group subfield belongs (only applies to subfields of a group field) |
  | onChange | change handler function for the field. Takes the new value of the field as its only argument |
  | value | the current value of the field |
  | validity | the current validity (boolean) of the field |
  | errors | an array of errors associated with the current state of the field |
  | addInstance | a function for creating a new instance of a group field (only applies to group fields)
  | fields | a list of subfields in a group field (only applies to group fields)

Other members of `form`:

- `getFieldValue(fieldName)` returns the current value of the field with the `fieldName`
- `getFieldValues()` returns the current value of the whole form, i.e. the values of all fields
- `setFieldValue(fieldObject, value)` sets the value of the field described by `fieldObject` (includes the name of the field and group-related information, e.g. group name, index of the instance of the group etc.)
- `validate()` asynchronously runs all fields' validators and returns the validity state of the whole form (validity and errors)

## Implementing a form

1. Form specification

```json
{
  "name": "person",
  "fields": [
    {
      "name": "firstName",
      "type": "text",
      "constraints": {
        "maxlength": 20,
        "required": true
      }
    },
    {
      "name": "lastName",
      "type": "text",
      "constraints": {
        "maxlength": 20,
        "required": true
      }
    },
    {
      "name": "age",
      "type": "number",
      "constraints": {
        "max": 125,
        "min": 0
      }
    },
    {
      "name": "ssn",
      "type": "text",
      "constraints": {
        "clientSideFunctions": ["validateSsn"]
      }
    }
  ]
}
```

2. Field component
```javascript
import React from 'react';

const Field = ({ spec }) => {
  return (
    <input type={spec.type} onChange={(e) => spec.onChange(e.target.value)} value={spec.value} {...constraints} />;
  );
};

export default Field;

```

3. Form component
```javascript
import React from 'react';
import useForm from './hooks/useForm';
import Field from 'path/to/Field';

const Form = () => {
  const form = useForm('person'); // Use the same name that is given in the form specification
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validityState = await form.validate();
    if (validityState.validate) {
      const formData = form.getFieldValues();
      // send formData to server
    }
  };

  return (
    <form>
      {form.fields.map(field => <Field key={field.name} spec={field} />)}
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default Form;

```

4. App component
```javascript
import React from 'react';
import FormProvider from './components/FormProvider';
import Form from 'path/to/Form';
import personForm from 'path/to/personForm.json';

const ssnValidator = (fieldValue, formValues) => {/* Implementation */};

const App = () => {
  return (
    <FormProvider forms={[personForm]} functions={{ validateSsn: ssnValidator }}>
      <Form />
    </FormProvider>
  );
};

export default App;

```



## Form specification

`formValidator` uses a JSON-based specification file to define the fields of the form. The form specification consists of the name of the form as well as a list of the form's field definitions. The field definitions contain the name, type and constraints of a field. The following is an example of a form specification that defines form with the name *personForm*, a text field for a person's name and a number field for a person's age. 

```json
{
  "name": "personForm",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "constraints": {
        "required": true,
        "maxlength": 50
      }
    },
    { 
      "name": "age",
      "type": "number",
      "constraints": {
        "min": 18,
        "max": 125,
        "required": true
      }
    }
  ]
}
````

A field definition must contain the `name` and `type` attributes. In addition to these fields, a `constraints` object can be provided to define constraints on the value of a field. The `required` constraint can be defined for any field type while other constraints can only be applied to certain field types (e.g. `max` can only be defined for fields that contain a numeric value).

### Field types

The specification supports the following HTML input types:
|HTML input type|Form specification type (JSON)|
|----|----|
|button|button|
|checkbox|checkbox|
|color|color|
|date|date|
|datetime-local|datetime-local|
|email|email|
|file|file|
|hidden|hidden|
|image|image|
|month|month|
|number|number|
|password|password|
|range|range|
|reset|reset|
|search|search|
|select|select|
|submit|submit|
|tel|tel|
|text|text|
|textarea|textarea|
|time|time|
|url|url|
|week|week|

In addition to HTML types, the specification supports groups of checkboxes and radio buttons as well as groups of simple fields:

|Input type|Form specification type (JSON)|
|----|---|
|checkbox group|checkbox-group|
|radio group|radio-group|
|group|group|

## Constraints

The validator supports the following constraints:

| Constraint | Explanation                                             | Input types | Type |
|------------|---------------------------------------------------------|-------------| ---- |
| maxlength  | The maximum length of a field             | text, textarea, email, password, search, tel, url, (group) | number
| minlength  | The minimum length of a field             | text, textarea, email, password, search, tel, url, (group) | number
| max        | The maximum value of a field              | number, date                                               | number
| min        | The minimum value of a field              | number, date                                               | number
| step       | The difference between allowed numeric values | number                                                 | number
| pattern    | A regular expression the value of a field must satisfy | text, email, password, search, tel, url       | regexp string
| values     | The set of allowed values for a field     | radio-group, select, checkbox-group                        | [values array](#values-constraint)
| required   | Indicates whether a field is required or not | all types                                               | [required constraint](#required-constraint)
| equals     | The value of the field must equal the given value | all types                                          | string, number, boolean


### Values constraint

The value of a `values` constraint is an array that contains objects that describe the labels and values of the available options. The labels are not relevant in server-side validation context as they are only used on client-side. The following is an example of a `values` object.

```json
[
  {
    "label": "Option 1",
    "value": 1
  },
  {
    "label": "Option 2",
    "value": 2
  }

]
```

### Required constraint

The required constraint value can be one of many options. These options are:
1. a boolean (true/false). If false, the required constraint may be omitted.
2. an array of condition objects.
3. a boolean expression in disjunctive normal form (DNF). These conditions can be expressed as an array of arrays of condition objects (option 2).

A condition object is a JSON object that contains 3 fields: the type of the condition, a value for the condition and the field that the condition applies to. The type must be one of the constraints (maxlength, minlength etc.). The value must be a valid value for the constraint/type. The field must be the name of one of the fields in the specification.
```json
{ 
  "field": "age",
  "type": "max",
  "value": 17
}
```

A DNF condition can be expressed as an array of arrays of condition object, i.e. `[[conditionObject1, conditionObject2], [conditionObject3]]`. This will be interpreted as `(conditionObject1 AND conditionObject2) OR conditionObject3`.

## Custom validators

The form validator supports custom validators to enable validation checks that are not possible with the basic validation constraints. Examples of this include comparing the value of an input field to the value of another field and asynchronous processes such as checking against a database.

### In form specification

Custom validators can be used to validate a field by including the name of a function in the `clientSideFunctions` constraint as demonstrated in the field specification below:

```json
{
  "name": "socialSecurityNumber",
  "type": "text",
  "constraints": {
    "clientSideFunctions": ["validateSocialSecurityNumber"]
  }
}
```

To make `formValidator` call this function, `formValidator` must be made aware of the function by registering a custom function with the name in the form specification. If a custom validator depends on other fields of the form, the dependencies must be added to the dependencies list in the field specification. In the example below, the function `validateTestField` depends on the field "testField2".

```json
{
  "name": "testField",
  "type": "text",
  "constraints": {
    "clientSideFunctions": ["validateTestField"]
  },
  "dependencies": ["testField2"]
}
```

### Implementation

Custom validators can be implemented freely as long as they take two arguments. The first argument is the field value and the second argument is an object that contains the current values of all fields in the form (including dependencies). The function should return a `boolean` value that indicates the validity of the field. A custom validator may be a synchronous or an asynchronous function (promise).

```javascript
const customValidator = (fieldValue, dependencies) => {...};
```

## Group fields

The form validator supports groups of fields that may be instantiated multiple times. For instance, this could be used when adding a person's children to a form or when adding the details of many passengers into a reservation form. These subforms are called group fields.

To create a group field, a field must have the type `group`. It must also contain the field definitions of the subfields of the group field. An example of such a field is shown below.

```json
{
  "name": "groupField",
  "type": "group",
  "fields": [
    {
      "name": "subfield1",
      "type": "text"
    },
    {
      "name": "subfield2",
      "type": "number"
    }
  ]
}
```

The normal constraints are supported also in group subfields, i.e. subfields can have the same constraints as normal fields. The group field itself does not currently support constraints on its values.

In terms of form input, a group field value should be structured as an array of objects that contain the values of the group's fields. For instance, the group field above would accept the following JSON:

```json
{
  "groupField": [
    {
      "subfield1": "Test",
      "subfield2": 1
    },
    {
      "subfield1": "Test",
      "subfield2": 2
    }
  ]
}
```
 W