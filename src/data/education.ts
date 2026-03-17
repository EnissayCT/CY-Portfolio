export interface Education {
  id: string
  institution: string
  program: string
  period: string
  description: string
}

export const education: Education[] = [
  {
    id: 'inpt',
    institution: 'INPT',
    program: 'AMOA Program — Digital Transformation & IT Consulting',
    period: '2023 – 2026',
    description:
      'Engineering degree in Business Analysis (AMOA) at Institut National des Postes et Télécommunications, Rabat. Also completed SAP S/4HANA ERP Bootcamp (40h) covering SD, MM, FI modules.',
  },
  {
    id: 'cpge',
    institution: 'CPGE — Mohammedia',
    program: 'Preparatory Classes (Mathematics & IT)',
    period: '2021 – 2023',
    description:
      'Two-year intensive program focusing on Mathematics, Physics, and IT in preparation for national engineering school entrance exams.',
  },
  {
    id: 'high-school',
    institution: 'Al Khawarizmi',
    program: 'High School — Mechanical Technologies',
    period: '2018 – 2021',
    description:
      'Baccalaureate in Sciences & Mechanical Technologies, building a strong foundation in engineering principles.',
  },
]
