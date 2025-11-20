export const WORKFLOW_GUIDE = {
  overview: 'Så kopplas dataflödena mellan Regeringen och Riksdagen samman.',
  steps: [
    {
      name: 'Regeringen skriver proposition',
      description:
        'Propositioner publiceras först i regeringskansliets system (regeringskansliet_propositioner) och därefter överlämnas till Riksdagen (riksdagen_dokument med doktyp prop).',
    },
    {
      name: 'Utskottsarbete',
      description:
        'Utskotten analyserar propositioner och ger ut betänkanden (riksdagen_betankanden) som sammanfattar förslag och tillstyrker/avstyrker.',
    },
    {
      name: 'Kammarbehandling',
      description:
        'Betänkanden debatteras i kammaren (riksdagen_anforanden) och leder till voteringar (riksdagen_voteringar/riksdagen_votering_ledamoter).',
    },
    {
      name: 'Frågor och interpellationer',
      description:
        'Frågor (riksdagen_fragor) och interpellationer (riksdagen_interpellationer) är verktyg för ledamöter att begära svar från regeringen; svar återfinns också i riksdagen_dokument.',
    },
  ],
  glossary: [
    { term: 'Betänkande', description: 'Utskottets rapport med rekommendation till riksdagen (doktyp bet).' },
    { term: 'Interpellation', description: 'Skriftlig fråga till statsråd med krav på debatt.' },
    { term: 'Motion', description: 'Förslag från en eller flera riksdagsledamöter.' },
    { term: 'Proposition', description: 'Regeringens förslag till riksdagen.' },
  ],
};
