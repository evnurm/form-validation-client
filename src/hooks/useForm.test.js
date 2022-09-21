import { act, renderHook } from '@testing-library/react';
import useForm from './useForm';

const formSpec = {
  name: 'testForm',
  fields: [
    {
      name: 'field1',
      type: 'text'
    },
    {
      name: 'field2',
      type: 'number'
    },
    {
      name: 'field3',
      type: 'text'
    }
  ]
};

describe('useForm', () => {
  it('should create correct fields', () => {
    const { result } = renderHook(() => useForm(formSpec));
    const form = result.current;
    
    expect(form.fields.length).toBe(3);

    expect(form.fields[0].name).toBe('field1');
    expect(form.fields[0].type).toBe('text');

    expect(form.fields[1].name).toBe('field2');
    expect(form.fields[1].type).toBe('number');

    expect(form.fields[2].name).toBe('field3');
    expect(form.fields[2].type).toBe('text');
  });

  it('should update the values of the fields', async () => {
    const { result } = renderHook(() => useForm(formSpec));
    
    await act(() => result.current.setFieldValue(result.current.fields[0], 'testField1'));
    expect(result.current.fields[0].value).toBe('testField1');

    await act(() => result.current.setFieldValue(result.current.fields[1], 3));
    expect(result.current.fields[1].value).toBe(3);

    await act(() => result.current.setFieldValue(result.current.fields[2], 'testField2'));
    expect(result.current.fields[2].value).toBe('testField2');
  });

  it('should provide an onChange function for all fields', async () => {
    const { result } = renderHook(() => useForm(formSpec));
    expect(result.current.fields.every(field => typeof field.onChange === 'function')).toBe(true);
    
    await act(() => result.current.fields[0].onChange('test1'));
    expect(result.current.fields[0].value).toBe('test1');

    await act(() => result.current.fields[1].onChange(3));
    expect(result.current.fields[1].value).toBe(3);

    await act(() => result.current.fields[2].onChange('test2'));
    expect(result.current.fields[2].value).toBe('test2');
  });

  it('validates a field when its value is set', async () => {
    const customizedFormSpec = {
      ...formSpec,
       fields: [
        {
          ...formSpec.fields[0],
          constraints: {
            maxlength: 5
          }
        }
      ]
    };
    
    const { result } = renderHook(() => useForm(customizedFormSpec));
    
    await act(() => result.current.setFieldValue(result.current.fields[0], 'aaaa'));
    expect(result.current.fields[0].validity).toBe(true);
    expect(result.current.fields[0].errors.length).toBe(0);

    await act(() => result.current.setFieldValue(result.current.fields[0], 'aaaaa'));
    expect(result.current.fields[0].validity).toBe(true);
    expect(result.current.fields[0].errors.length).toBe(0);

    await act(() => result.current.setFieldValue(result.current.fields[0], 'aaaaaa'));
    expect(result.current.fields[0].validity).toBe(false);
    expect(result.current.fields[0].errors.length).toBe(1);
    expect(result.current.fields[0].errors[0]).toBe('maxlength');
  });

  it('evaluates the required constraints of the fields correctly', async () => {
    const formSpec = {
      name: 'testForm',
      fields: [
        {
          name: 'notRequired',
          type: 'text',
          constraints: {
            required: false
          }
        },
        {
          name: 'required',
          type: 'number',
          constraints: {
            required: true
          }
        },
        {
          name: 'complexRequired',
          type: 'text',
          constraints: {
            required: [
              { 
                type: 'max',
                field: 'required',
                value: 17
              }
            ]
          }
        }
      ]
    };

    const { result } = renderHook(() => useForm(formSpec));
    expect(result.current.fields[0].constraints.required).toBe(false);
    expect(result.current.fields[1].constraints.required).toBe(true);
    expect(result.current.fields[2].constraints.required).toBe(false);

    await act(() => result.current.setFieldValue(result.current.fields[1], 16));
    expect(result.current.fields[2].constraints.required).toBe(true);
    await act(() => result.current.setFieldValue(result.current.fields[1], 17));
    expect(result.current.fields[2].constraints.required).toBe(true);
    await act(() => result.current.setFieldValue(result.current.fields[1], 18));
    expect(result.current.fields[2].constraints.required).toBe(false);
  });

  it('evaluates the validity of dependent fields when a field is changed', async () => {
    const formSpec = {
      name: 'testForm',
      fields: [
        {
          name: 'field1',
          type: 'text'
        },
        {
          name: 'field2',
          type: 'text',
          constraints: {
            clientSideFunctions: [
              'validateField2'
            ]
          },
          dependencies: ['field1']
        }
      ]
    };

    const validateField2 = (fieldValue, inputs) => inputs.field1 === fieldValue;
    const { result } = renderHook(() => useForm(formSpec, { validateField2 }));

    await act(() => result.current.setFieldValue(result.current.fields[0], 'a'));
    await act(() => result.current.setFieldValue(result.current.fields[1], 'b'));
    expect(result.current.fields[1].validity).toBe(false);

    await act(() => result.current.setFieldValue(result.current.fields[0], 'b'));
    expect(result.current.fields[1].validity).toBe(true);
  });

  it('evaluates group field validity correctly', async () => {
    const formSpec = {
      name: 'groupTestForm',
      fields: [
        { 
          name: 'groupTest',
          type: 'group',
          fields: [
            {
              name: 'groupSubField1',
              type: 'text',
              constraints: { maxlength: 5 }
            },
            {
              name: 'groupSubField2',
              type: 'number',
              constraints: {
                equals: 10
              }
            }
          ]
        }
      ]
    };

    const { result } = renderHook(() => useForm(formSpec));
    act(() => result.current.fields[0].addInstance());
 
    let subfields = result.current.fields[0].fields;

    await act(() => result.current.setFieldValue(subfields[0][0], 'aaaa'));
    expect(result.current.fields[0].fields[0][0].validity).toBe(true);

    await act(() => result.current.setFieldValue(subfields[0][0], 'aaaaa'));
    expect(result.current.fields[0].fields[0][0].validity).toBe(true);

    await act(() => result.current.setFieldValue(subfields[0][0], 'aaaaaa'));
    expect(result.current.fields[0].fields[0][0].validity).toBe(false);

    await act(() => result.current.setFieldValue(subfields[0][1], 5));
    expect(result.current.fields[0].fields[0][1].validity).toBe(false);
    
    await act(() => result.current.setFieldValue(subfields[0][1], 10));
    expect(result.current.fields[0].fields[0][1].validity).toBe(true);

    act(() => result.current.fields[0].addInstance());
    expect(result.current.fields[0].fields.length).toBe(2);

    subfields = result.current.fields[0].fields;
    
    // Ensure that editing second instance does not affect first instance
    await act(() => result.current.setFieldValue(subfields[1][0], 'bbbb'));
    expect(result.current.fields[0].fields[0][0].validity).toBe(false);
    expect(result.current.fields[0].fields[1][0].validity).toBe(true);
  });
});
