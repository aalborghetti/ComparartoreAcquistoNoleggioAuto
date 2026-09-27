export interface CarCalculatorInputs {
  // Parametri Generali
  durataMesi: number;
  kmAnnui: number;

  // Acquisto Auto Nuova
  prezzoAuto: number;
  anticipoAcquisto: number;
  tassoTaeg: number; // %
  assicurazioneAnnua: number;
  bolloAnnuo: number;
  manutenzioneAnnua: number;
  valoreResiduoPercentuale: number; // %

  // Acquisto Auto Usata (Costi acquisto più bassi, manutenzione più elevata)
  usatoPrezzoAuto: number;
  usatoAnticipoAcquisto: number;
  usatoTassoTaeg: number;
  usatoAssicurazioneAnnua: number;
  usatoBolloAnnuo: number;
  usatoManutenzioneAnnua: number;
  usatoValoreResiduoPercentuale: number;

  // Noleggio a Lungo Termine (NLT)
  anticipoNlt: number;
  canoneMensileNlt: number; // IVA inclusa
  kmInclusiAnnuiNlt: number; // default: 10000 km/anno
  costoKmEccedenteNlt: number; // default: 0.05 €/km (5 cent/km)
}

export interface MonthlyDataPoint {
  mese: number;
  label: string; // es. "Mese 1", "Anno 1"
  nltCumulato: number;
  acquistoCumulato: number; // Esborso cumulativo cassa Nuovo
  valoreAutoStimato: number; // Valore auto Nuova
  acquistoNetto: number; // TCO Netto Nuovo
  usatoCumulato: number; // Esborso cumulativo cassa Usato
  usatoValoreAutoStimato: number; // Valore auto Usata
  usatoNetto: number; // TCO Netto Usato
  differenzaCumulata: number; // acquistoCumulato - nltCumulato
}

export interface BreakEvenPoint {
  mese: number;
  valore: number;
  tipo: 'esborso' | 'netto';
  esiste: boolean;
  descrizione: string;
}

export interface PurchaseMetrics {
  importoFinanziato: number;
  rataFinanziamentoMensile: number;
  totaleInteressiFinanziamento: number;
  costiGestioneTotali: number;
  costoTotaleEsborso: number;
  valoreResiduoEuro: number;
  costoTotaleReale: number;
  costoMensileMedio: number;
  costoAlKm: number;
}

export interface CalculatorSummary {
  // NLT
  costoTotaleNlt: number;
  costoMensileMedioNlt: number;
  costoAlKmNlt: number;
  kmInclusiTotaliNlt: number;
  kmEccedentiTotaliNlt: number;
  costoTotaleKmEccedentiNlt: number;

  // Acquisto Auto Nuova
  importoFinanziato: number;
  rataFinanziamentoMensile: number;
  totaleInteressiFinanziamento: number;
  costiGestioneTotali: number;
  costoTotaleEsborsoAcquisto: number;
  valoreResiduoEuro: number;
  costoTotaleRealeAcquisto: number;
  costoMensileMedioAcquisto: number;
  costoAlKmAcquisto: number;

  // Acquisto Auto Usata
  usatoImportoFinanziato: number;
  usatoRataFinanziamentoMensile: number;
  usatoTotaleInteressiFinanziamento: number;
  usatoCostiGestioneTotali: number;
  usatoCostoTotaleEsborso: number;
  usatoValoreResiduoEuro: number;
  usatoCostoTotaleReale: number;
  usatoCostoMensileMedio: number;
  usatoCostoAlKm: number;

  // Confronto
  differenzaTotaleReale: number; // NLT - Acquisto Nuovo
  opzionePiuConveniente: 'acquisto' | 'usato' | 'nlt' | 'equivalente';
  risparmioPercentuale: number;
  migliorOpzioneNome: string;
  risparmioRispettoAlPeggiorCaso: number;

  breakEvenCashflow: BreakEvenPoint | null;
  breakEvenNetTco: BreakEvenPoint | null;
  breakEvenUsatoVsNlt: BreakEvenPoint | null;
}

export interface PresetScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  inputs: CarCalculatorInputs;
}
