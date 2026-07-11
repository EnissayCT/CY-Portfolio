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
    institution: 'INPT — Institut National des Postes et Télécommunications',
    program: 'Engineering Degree in AMOA (Assistance à la Maîtrise d’Ouvrage)',
    period: '2023 – Jul 2026',
    description:
      'Graduated with an engineering degree in AMOA at INPT, Rabat. Completed SAP S/4HANA ERP Bootcamp (40h) covering SD, MM, and FI modules.',
  },
  {
    id: 'cpge',
    institution: 'Preparatory Classes for Engineering Schools (CPGE)',
    program: 'Mathematics and Computer Science',
    period: '2021 – 2023',
    description:
      'Two-year intensive preparatory program in Mathematics and Computer Science, Casablanca, in preparation for national engineering school entrance exams.',
  },
]
