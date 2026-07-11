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
      { name: 'Odoo (Expert)' },
      { name: 'SAP S/4HANA (SD, MM, FI)' },
      { name: 'UML' },
      { name: 'BPMN' },
      { name: 'User Stories' },
      { name: 'Agile' },
      { name: 'Power Automate' },
      { name: 'ABAP' },
    ],
  },
  {
    id: 'data-analytics',
    title: 'Data & Analytics',
    icon: '📊',
    skills: [
      { name: 'Python' },
      { name: 'SQL' },
      { name: 'Power BI' },
      { name: 'Machine Learning' },
      { name: 'PostgreSQL' },
      { name: 'MySQL' },
      { name: 'NoSQL' },
    ],
  },
  {
    id: 'web-cloud',
    title: 'Web & Cloud',
    icon: '💻',
    skills: [
      { name: 'ReactJS' },
      { name: 'Tailwind CSS' },
      { name: 'Node.js' },
      { name: 'Flask' },
      { name: 'Firebase' },
      { name: 'Express' },
      { name: 'AWS' },
      { name: 'Google Cloud' },
      { name: 'Huawei Cloud' },
    ],
  },
]
