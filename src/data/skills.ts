export interface SkillCategory {
  id: string
  title: string
  icon: string
  skills: Skill[]
}

export interface Skill {
  name: string
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'erp-business',
    title: 'ERP & Business',
    icon: '🏢',
    skills: [
      { name: 'SAP S/4HANA' },
      { name: 'Odoo' },
      { name: 'Power Automate' },
      { name: 'UML' },
      { name: 'BPMN' },
      { name: 'User Stories' },
      { name: 'Use Cases' },
    ],
  },
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    icon: '📊',
    skills: [
      { name: 'Python' },
      { name: 'Power BI' },
      { name: 'SQL' },
      { name: 'NoSQL' },
      { name: 'scikit-learn' },
      { name: 'Web Scraping' },
      { name: 'Data Visualization' },
    ],
  },
  {
    id: 'web-mobile',
    title: 'Web & Mobile',
    icon: '💻',
    skills: [
      { name: 'ReactJS' },
      { name: 'Tailwind CSS' },
      { name: 'TypeScript' },
      { name: 'React Native' },
      { name: 'Node.js' },
      { name: 'Firebase' },
      { name: 'Flask' },
    ],
  },
]
