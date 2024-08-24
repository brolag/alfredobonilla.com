import servicesData from '../content/services.json';

export const FormHandler = async (
  input: string,
  currentForm: string | null,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>
): Promise<string[]> => {
  if (!currentForm) {
    return ['No active form.'];
  }

  switch (currentForm) {
    case 'contact':
      return handleContactForm(input, setCurrentForm);
    case 'project':
      return handleProjectForm(input, setCurrentForm);
    case 'services':
      return handleServicesForm(input, setCurrentForm);
    default:
      setCurrentForm(null);
      return ['Unknown form type.'];
  }
};

const handleContactForm = (
  input: string,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>
): string[] => {
  // Implement contact form logic here
  // For now, just return a placeholder message
  setCurrentForm(null);
  return ['Thank you for your message. We will get back to you soon.'];
};

const handleProjectForm = (
  input: string,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>
): string[] => {
  // Implement project form logic here
  // For now, just return a placeholder message
  setCurrentForm(null);
  return ['Thank you for submitting your project.'];
};

const handleServicesForm = (
  input: string,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>
): string[] => {
  const serviceIndex = Number.parseInt(input) - 1;
  if (Number.isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex >= servicesData.services.length) {
    return ['Invalid selection. Please enter a valid number.'];
  }

  const selectedService = servicesData.services[serviceIndex];
  setCurrentForm(null);
  return [
    `You've selected: ${selectedService.name}`,
    `Description: ${selectedService.description}`,
    `To proceed, please visit: ${selectedService.link}`
  ];
};