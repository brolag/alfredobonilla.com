import aboutData from '../content/about.json';
import projectsData from '../content/projects.json';
import contactData from '../content/contact.json';
import servicesData from '../content/services.json';
import skillsData from '../content/skills.json';

interface SkillCategory {
  name: string;
  skills: string[];
}

export const CommandHandler = (
  cmd: string,
  setCurrentForm: React.Dispatch<React.SetStateAction<string | null>>,
  setOutput: React.Dispatch<React.SetStateAction<string[]>>
): string[] => {
  const command = cmd.toLowerCase().trim();

  switch (command) {
    case 'help':
      return [
        '=== AVAILABLE COMMANDS ===',
        '• about - Learn more about me and my background',
        '• skills - View my technical skills and expertise',
        '• projects - Browse my portfolio projects',
        '• contact - Get my contact information',
        '• services - Explore services I offer',
        '• clear - Clear the terminal screen',
        '',
        'Type any command to continue, or try combining commands.',
        'Example: "about skills" will show both my background and skills.'
      ];

    case 'about':
      return [
        '=== ABOUT ALFREDO BONILLA ===',
        ...aboutData.content,
        '',
        'Type "skills" to see my technical expertise or "projects" to view my work.'
      ];

    case 'skills':
      return [
        '=== TECHNICAL SKILLS ===',
        ...(skillsData.categories as SkillCategory[]).map(category => {
          return `${category.name}:\n${category.skills.join(', ')}`;
        }),
        '',
        'Type "projects" to see these skills in action.'
      ];

    case 'projects':
      return [
        '=== PORTFOLIO PROJECTS ===',
        ...projectsData.projects.map(
          (project, index) => `[${index + 1}] ${project.name}\n    ${project.description}\n    Link: ${project.url}`
        ),
        '',
        'Type "contact" if you\'d like to discuss any of these projects.'
      ];

    case 'contact':
      return [
        '=== CONTACT INFORMATION ===',
        ...contactData.details.map((detail) => `${detail.type}: ${detail.url}`),
        '',
        'I look forward to connecting with you!'
      ];

    case 'services':
      setCurrentForm('services');
      return [
        '=== SERVICES OFFERED ===',
        ...servicesData.services.map(
          (service, index) => `[${index + 1}] ${service.name}\n    ${service.description}`
        ),
        '',
        'Please enter the number of the service you\'re interested in to learn more:'
      ];

    case 'clear':
      setOutput([]);
      return [];

    // Handle combined commands
    default: {
      // Check for combined commands like "about skills"
      const parts = command.split(' ');
      
      if (parts.length > 1) {
        let results: string[] = [];
        
        for (const part of parts) {
          if (['about', 'skills', 'projects', 'contact', 'services'].includes(part)) {
            // Recursively call the handler for each valid command part
            const partResults = CommandHandler(part, setCurrentForm, setOutput);
            results = [...results, ...partResults, ''];
          }
        }
        
        if (results.length > 0) {
          return results;
        }
      }
      
      return [
        `Command not recognized: "${cmd}"`, 
        'Type "help" to see available commands.'
      ];
    }
  }
};