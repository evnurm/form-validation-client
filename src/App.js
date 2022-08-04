import Form from './components/Form';
import form from './form.json';
import FormProvider from './components/FormProvider';
import { validateSsn } from './customValidators/ssn';

function App() {
  return (
    <FormProvider forms={[form]} functions={{ validateSsn }}>
      <Form specification={form} />
    </FormProvider>
  );
}

export default App;
