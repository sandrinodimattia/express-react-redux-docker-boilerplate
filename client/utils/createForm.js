import { reduxForm } from 'redux-form';

const defaultOptions = { };

export default function createForm(name, component) {
  return reduxForm({
    form: name,
    fields: component.formFields,
    ...(component.formOptions || defaultOptions)
  })(component);
}
