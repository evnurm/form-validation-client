const INPUT_TYPES = {
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  CHECKBOX_GROUP: 'checkbox-group',
  COLOR: 'color',
  DATE: 'date',
  DATETIME_LOCAL: 'datetime-local',
  EMAIL: 'email',
  FILE: 'file',
  GROUP: 'group',
  HIDDEN: 'hidden',
  IMAGE: 'image',
  MONTH: 'month',
  NUMBER: 'number',
  PASSWORD: 'password',
  RADIO_GROUP: 'radio-group',
  RANGE: 'range',
  RESET: 'reset',
  SEARCH: 'search',
  SUBMIT: 'submit',
  TEL: 'tel',
  TEXT: 'text',
  TIME: 'time',
  URL: 'url',
  WEEK: 'week'
};

const ATTRIBUTES = {
  [INPUT_TYPES.BUTTON]: [
    'value'
  ],
  [INPUT_TYPES.CHECKBOX]: [
    'checked',
    'value'
  ],
  [INPUT_TYPES.COLOR]: [
    'value'
  ],
  [INPUT_TYPES.DATE]: [
    'value',
    'max',
    'min',
    'step'
  ],
  [INPUT_TYPES.DATETIME_LOCAL]: [
    'value',
    'max',
    'min',
    'step'
  ],
  [INPUT_TYPES.EMAIL]: [
    'list',
    'maxlength',
    'minlength',
    'multiple',
    'pattern',
    'placeholder',
    'readonly',
    'size'
  ],
  [INPUT_TYPES.FILE]: [
    'accept',
    'capture',
    'multiple',
  ],
  [INPUT_TYPES.HIDDEN]: [
    'value',
    'name'
  ],
  [INPUT_TYPES.IMAGE]: [
    'value',
    'alt',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget',
    'height',
    'src',
    'width'
  ],
  [INPUT_TYPES.MONTH]: [
    'value',
    'list',
    'max',
    'min',
    'readonly',
    'step'
  ],
  [INPUT_TYPES.NUMBER]: [
    'list',
    'max',
    'min',
    'placeholder',
    'readonly',
    'step'
  ],
  [INPUT_TYPES.PASSWORD]: [
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'size'
  ],
  [INPUT_TYPES.RADIO]: [
    'value',
    'checked'
  ],
  [INPUT_TYPES.RANGE]: [
    'value',
    'list',
    'max',
    'min',
    'step'
  ],
  [INPUT_TYPES.RESET]: [
    'value'
  ],
  [INPUT_TYPES.SEARCH]: [
    'value',
    'list',
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'size',
    'spellcheck'
  ],
  [INPUT_TYPES.SUBMIT]: [
    'value',
    'formaction',
    'formenctype',
    'formmethod',
    'formnovalidate',
    'formtarget'
  ],
  [INPUT_TYPES.TEL]: [
    'value',
    'list',
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'size'
  ],
  [INPUT_TYPES.TEXT]: [
    'list',
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'size',
    'spellcheck'
  ],
  [INPUT_TYPES.TIME]: [
    'value',
    'list',
    'max',
    'min',
    'readonly',
    'step'
  ],
  [INPUT_TYPES.URL]: [
    'value',
    'list',
    'maxlength',
    'minlength',
    'pattern',
    'placeholder',
    'readonly',
    'size',
    'spellcheck'
  ],
  [INPUT_TYPES.WEEK]: [
    'value',
    'max',
    'min',
    'readonly',
    'step'
  ]
};

module.exports = { INPUT_TYPES, ATTRIBUTES };
