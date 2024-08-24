import aboutData from '../content/about.json';
import projectsData from '../content/projects.json';
import contactData from '../content/contact.json';
import servicesData from '../content/services.json';

export const CommandHandler = (
  cmd: string,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>,
  setOutput: React.Dispatch<React.SetStateAction<string[]>>
): string[] => {
  const command = cmd.toLowerCase().trim();

  switch (command) {
    case 'help':
      return [
        'Available commands:',
        'about - Display information about me',
        'projects - Show my projects',
        'contact - Display contact information',
        'services - Show my services',
        'clear - Clear the screen',
      ];

    case 'about':
      return [aboutData.title, ...aboutData.content];

    case 'projects':
      return [
        projectsData.title,
        ...projectsData.projects.map(
          (project) => `${project.name}: ${project.description} - ${project.url}`
        )
      ];

    case 'contact':
      return [
        contactData.title,
        ...contactData.details.map((detail) => `${detail.type}: ${detail.value}`)
      ];

    case 'services':
      setCurrentForm('services');
      return [
        servicesData.title,
        ...servicesData.services.map(
          (service, index) => `${index + 1}. ${service.name}: ${service.description}`
        ),
        'Please enter the number of the service you\'re interested in:'
      ];

    case 'clear':
      setOutput([]);
      return [];

    default:
      return [`Command not recognized: ${cmd}`, 'Type "help" for available commands.'];
  }
};