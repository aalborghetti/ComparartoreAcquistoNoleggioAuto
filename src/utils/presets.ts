import type { PresetScenario } from '../types/calculator';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'crossover-family',
    name: 'SUV Compatto / Crossover (es. Puma / Captur)',
    category: 'Medio',
    description: 'Auto da 28.000 € nuova vs 14.500 € usata con manutenzione maggiorata, 36 mesi.',
    inputs: {
      durataMesi: 36,
      kmAnnui: 15000,

      // Auto Nuova
      metodoPagamentoNuovo: 'finanziamento',
      prezzoAuto: 28000,
      anticipoAcquisto: 5000,
      tassoTaeg: 6.5,
      assicurazioneAnnua: 1100,
      bolloAnnuo: 240,
      manutenzioneAnnua: 450,
      valoreResiduoPercentuale: 45,

      // Auto Usata (acquisto più basso, manutenzione più alta per usura)
      metodoPagamentoUsato: 'finanziamento',
      usatoPrezzoAuto: 14500,
      usatoAnticipoAcquisto: 2500,
      usatoTassoTaeg: 7.5,
      usatoAssicurazioneAnnua: 850,
      usatoBolloAnnuo: 240,
      usatoManutenzioneAnnua: 1050,
      usatoValoreResiduoPercentuale: 35,

      // Noleggio NLT
      anticipoNlt: 3500,
      canoneMensileNlt: 380,
      kmInclusiAnnuiNlt: 10000,
      costoKmEccedenteNlt: 0.05,
    },
  },
  {
    id: 'citycar-economy',
    name: 'Citycar Compatta (es. Panda / 500 / Clio)',
    category: 'Economico',
    description: 'Auto utilitaria da 17.500 € nuova vs 8.500 € usata di 4 anni, 48 mesi.',
    inputs: {
      durataMesi: 48,
      kmAnnui: 12000,

      // Auto Nuova
      metodoPagamentoNuovo: 'finanziamento',
      prezzoAuto: 17500,
      anticipoAcquisto: 2500,
      tassoTaeg: 5.9,
      assicurazioneAnnua: 750,
      bolloAnnuo: 180,
      manutenzioneAnnua: 320,
      valoreResiduoPercentuale: 38,

      // Auto Usata
      metodoPagamentoUsato: 'finanziamento',
      usatoPrezzoAuto: 8500,
      usatoAnticipoAcquisto: 1500,
      usatoTassoTaeg: 7.0,
      usatoAssicurazioneAnnua: 600,
      usatoBolloAnnuo: 180,
      usatoManutenzioneAnnua: 780,
      usatoValoreResiduoPercentuale: 28,

      // Noleggio NLT
      anticipoNlt: 2000,
      canoneMensileNlt: 260,
      kmInclusiAnnuiNlt: 10000,
      costoKmEccedenteNlt: 0.05,
    },
  },
  {
    id: 'premium-ev',
    name: 'Berlina Premium / Elettrica (es. Model 3 / BMW Serie 3)',
    category: 'Premium',
    description: 'Segmento premium: 46.000 € nuovo vs 24.000 € usato con tagliandi e parti di ricambio, 36 mesi.',
    inputs: {
      durataMesi: 36,
      kmAnnui: 20000,

      // Auto Nuova
      metodoPagamentoNuovo: 'finanziamento',
      prezzoAuto: 46000,
      anticipoAcquisto: 8000,
      tassoTaeg: 5.5,
      assicurazioneAnnua: 1650,
      bolloAnnuo: 0,
      manutenzioneAnnua: 400,
      valoreResiduoPercentuale: 50,

      // Auto Usata
      metodoPagamentoUsato: 'finanziamento',
      usatoPrezzoAuto: 24000,
      usatoAnticipoAcquisto: 5000,
      usatoTassoTaeg: 6.9,
      usatoAssicurazioneAnnua: 1300,
      usatoBolloAnnuo: 0,
      usatoManutenzioneAnnua: 1250,
      usatoValoreResiduoPercentuale: 38,

      // Noleggio NLT
      anticipoNlt: 5000,
      canoneMensileNlt: 590,
      kmInclusiAnnuiNlt: 10000,
      costoKmEccedenteNlt: 0.05,
    },
  },
];

export const DEFAULT_INPUTS = PRESET_SCENARIOS[0].inputs;
