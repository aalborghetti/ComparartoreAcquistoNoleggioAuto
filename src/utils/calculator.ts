import type { CarCalculatorInputs, MonthlyDataPoint, CalculatorSummary, BreakEvenPoint } from '../types/calculator';

/**
 * Calcola la rata mensile di un piano di ammortamento a rate costanti (Ammortamento alla Francese)
 */
export function calculateMonthlyPayment(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRatePercent <= 0) return principal / months;

  const monthlyRate = (annualRatePercent / 100) / 12;
  const factor = Math.pow(1 + monthlyRate, months);
  
  if (!isFinite(factor) || factor === 1) {
    return principal / months;
  }

  return principal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Trova il punto di intersezione (break-even) tra due serie numeriche
 */
function findIntersection(
  data: Array<{ mese: number; val1: number; val2: number }>,
  tipo: 'esborso' | 'netto',
  customDesc?: string
): BreakEvenPoint | null {
  if (data.length < 2) return null;

  for (let i = 0; i < data.length - 1; i++) {
    const p1 = data[i];
    const p2 = data[i + 1];

    const diff1 = p1.val1 - p1.val2;
    const diff2 = p2.val1 - p2.val2;

    // Se hanno segni opposti, c'è un incrocio
    if ((diff1 <= 0 && diff2 > 0) || (diff1 >= 0 && diff2 < 0)) {
      const slope1 = p2.val1 - p1.val1;
      const slope2 = p2.val2 - p1.val2;
      const deltaSlope = slope1 - slope2;

      let exactMonth = p1.mese;
      let exactValue = p1.val1;

      if (deltaSlope !== 0) {
        const fraction = -diff1 / deltaSlope;
        exactMonth = Number((p1.mese + fraction).toFixed(1));
        exactValue = Math.round(p1.val1 + slope1 * fraction);
      }

      return {
        mese: exactMonth,
        valore: exactValue,
        tipo,
        esiste: true,
        descrizione: customDesc || `Punto di pareggio ${tipo === 'esborso' ? 'di cassa' : 'netto TCO'} a circa ${Math.round(exactMonth)} mesi (${exactValue} €)`
      };
    }
  }

  return null;
}

/**
 * Esegue il calcolo completo del Total Cost of Ownership (TCO) per Nuovo, Usato e NLT
 */
export function calculateCarTco(inputs: CarCalculatorInputs): {
  monthlyData: MonthlyDataPoint[];
  summary: CalculatorSummary;
} {
  const {
    durataMesi,
    kmAnnui,

    // Auto Nuova
    prezzoAuto,
    anticipoAcquisto,
    tassoTaeg,
    assicurazioneAnnua,
    bolloAnnuo,
    manutenzioneAnnua,
    valoreResiduoPercentuale,

    // Auto Usata
    usatoPrezzoAuto,
    usatoAnticipoAcquisto,
    usatoTassoTaeg,
    usatoAssicurazioneAnnua,
    usatoBolloAnnuo,
    usatoManutenzioneAnnua,
    usatoValoreResiduoPercentuale,

    // NLT
    anticipoNlt,
    canoneMensileNlt,
    kmInclusiAnnuiNlt,
    costoKmEccedenteNlt,
  } = inputs;

  const validDurata = Math.max(1, Math.round(durataMesi));
  const validKmAnnui = Math.max(0, kmAnnui);
  const kmTotali = (validKmAnnui / 12) * validDurata;

  // --- 1. Calcoli NLT (Inclusi km eccedenti) ---
  const validKmInclusiAnnui = Math.max(0, kmInclusiAnnuiNlt || 10000);
  const kmInclusiTotaliNlt = Math.round((validKmInclusiAnnui / 12) * validDurata);
  const kmEccedentiTotaliNlt = Math.max(0, Math.round(kmTotali - kmInclusiTotaliNlt));
  const validCostoKmEccedente = Math.max(0, costoKmEccedenteNlt ?? 0.05);
  const costoTotaleKmEccedentiNlt = Math.round(kmEccedentiTotaliNlt * validCostoKmEccedente);
  const quotaMeseKmEccedenti = costoTotaleKmEccedentiNlt / validDurata;

  // --- 2. Calcoli Auto Nuova ---
  const importoDaFinanziare = Math.max(0, prezzoAuto - anticipoAcquisto);
  const rataFinanziamento = calculateMonthlyPayment(importoDaFinanziare, tassoTaeg, validDurata);
  const totaleInteressi = Math.max(0, (rataFinanziamento * validDurata) - importoDaFinanziare);
  const costiGestioneAnnui = assicurazioneAnnua + bolloAnnuo + manutenzioneAnnua;
  const quotaGestioneMensile = costiGestioneAnnui / 12;
  const costiGestioneTotali = quotaGestioneMensile * validDurata;
  const valoreResiduoEuro = prezzoAuto * (Math.max(0, valoreResiduoPercentuale) / 100);
  const svalutazioneMensile = (prezzoAuto - valoreResiduoEuro) / validDurata;

  // --- 3. Calcoli Auto Usata ---
  const validUsatoPrezzo = Math.max(0, usatoPrezzoAuto || 14500);
  const validUsatoAnticipo = Math.max(0, usatoAnticipoAcquisto || 2500);
  const usatoImportoDaFinanziare = Math.max(0, validUsatoPrezzo - validUsatoAnticipo);
  const usatoRataFinanziamento = calculateMonthlyPayment(usatoImportoDaFinanziare, usatoTassoTaeg || 7.5, validDurata);
  const usatoTotaleInteressi = Math.max(0, (usatoRataFinanziamento * validDurata) - usatoImportoDaFinanziare);
  const usatoCostiGestioneAnnui = (usatoAssicurazioneAnnua || 850) + (usatoBolloAnnuo || 240) + (usatoManutenzioneAnnua || 1050);
  const usatoQuotaGestioneMensile = usatoCostiGestioneAnnui / 12;
  const usatoCostiGestioneTotali = usatoQuotaGestioneMensile * validDurata;
  const usatoValoreResiduoEuro = validUsatoPrezzo * (Math.max(0, usatoValoreResiduoPercentuale || 35) / 100);
  const usatoSvalutazioneMensile = (validUsatoPrezzo - usatoValoreResiduoEuro) / validDurata;

  // --- Generazione array mensile ---
  const monthlyData: MonthlyDataPoint[] = [];

  // Mese 0 (Anticipi iniziali)
  monthlyData.push({
    mese: 0,
    label: 'Mese 0',
    nltCumulato: Math.round(anticipoNlt),
    acquistoCumulato: Math.round(anticipoAcquisto),
    valoreAutoStimato: Math.round(prezzoAuto),
    acquistoNetto: Math.round(anticipoAcquisto - prezzoAuto),
    usatoCumulato: Math.round(validUsatoAnticipo),
    usatoValoreAutoStimato: Math.round(validUsatoPrezzo),
    usatoNetto: Math.round(validUsatoAnticipo - validUsatoPrezzo),
    differenzaCumulata: Math.round(anticipoAcquisto - anticipoNlt),
  });

  for (let m = 1; m <= validDurata; m++) {
    // NLT
    const nltCum = anticipoNlt + (canoneMensileNlt * m) + (quotaMeseKmEccedenti * m);

    // Auto Nuova
    const acquistoCum = anticipoAcquisto + (rataFinanziamento * m) + (quotaGestioneMensile * m);
    const valoreAutoMese = Math.max(0, prezzoAuto - (svalutazioneMensile * m));
    const acquistoNetto = acquistoCum - valoreAutoMese;

    // Auto Usata
    const usatoCum = validUsatoAnticipo + (usatoRataFinanziamento * m) + (usatoQuotaGestioneMensile * m);
    const usatoValoreMese = Math.max(0, validUsatoPrezzo - (usatoSvalutazioneMensile * m));
    const usatoNetto = usatoCum - usatoValoreMese;

    monthlyData.push({
      mese: m,
      label: m % 12 === 0 ? `Anno ${m / 12} (Mese ${m})` : `Mese ${m}`,
      nltCumulato: Math.round(nltCum),
      acquistoCumulato: Math.round(acquistoCum),
      valoreAutoStimato: Math.round(valoreAutoMese),
      acquistoNetto: Math.round(acquistoNetto),
      usatoCumulato: Math.round(usatoCum),
      usatoValoreAutoStimato: Math.round(usatoValoreMese),
      usatoNetto: Math.round(usatoNetto),
      differenzaCumulata: Math.round(acquistoCum - nltCum),
    });
  }

  // --- Totali a fine periodo ---
  // NLT
  const costoTotaleNlt = anticipoNlt + (canoneMensileNlt * validDurata) + costoTotaleKmEccedentiNlt;
  const costoMensileMedioNlt = costoTotaleNlt / validDurata;
  const costoAlKmNlt = kmTotali > 0 ? costoTotaleNlt / kmTotali : 0;

  // Auto Nuova
  const costoTotaleEsborsoAcquisto = anticipoAcquisto + (rataFinanziamento * validDurata) + costiGestioneTotali;
  const costoTotaleRealeAcquisto = costoTotaleEsborsoAcquisto - valoreResiduoEuro;
  const costoMensileMedioAcquisto = costoTotaleRealeAcquisto / validDurata;
  const costoAlKmAcquisto = kmTotali > 0 ? costoTotaleRealeAcquisto / kmTotali : 0;

  // Auto Usata
  const usatoCostoTotaleEsborso = validUsatoAnticipo + (usatoRataFinanziamento * validDurata) + usatoCostiGestioneTotali;
  const usatoCostoTotaleReale = usatoCostoTotaleEsborso - usatoValoreResiduoEuro;
  const usatoCostoMensileMedio = usatoCostoTotaleReale / validDurata;
  const usatoCostoAlKm = kmTotali > 0 ? usatoCostoTotaleReale / kmTotali : 0;

  // --- Confronto e Vincitore TCO ---
  const options = [
    { key: 'acquisto' as const, name: 'Auto Nuova', cost: costoTotaleRealeAcquisto },
    { key: 'usato' as const, name: 'Auto Usata', cost: usatoCostoTotaleReale },
    { key: 'nlt' as const, name: 'Noleggio (NLT)', cost: costoTotaleNlt },
  ].sort((a, b) => a.cost - b.cost);

  const bestOption = options[0];
  const worstOption = options[options.length - 1];
  const risparmioRispettoAlPeggiorCaso = Math.round(worstOption.cost - bestOption.cost);
  const risparmioPercentuale = worstOption.cost > 0 ? Number(((risparmioRispettoAlPeggiorCaso / worstOption.cost) * 100).toFixed(1)) : 0;

  let opzionePiuConveniente: 'acquisto' | 'usato' | 'nlt' | 'equivalente' = bestOption.key;
  if (Math.abs(options[1].cost - options[0].cost) < 50) {
    opzionePiuConveniente = 'equivalente';
  }

  const differenzaTotaleReale = costoTotaleNlt - costoTotaleRealeAcquisto;

  // --- Break-Even Points ---
  // 1. Nuovo vs NLT (Cashflow)
  const esborsoPoints = monthlyData.slice(1).map(d => ({
    mese: d.mese,
    val1: d.acquistoCumulato,
    val2: d.nltCumulato,
  }));
  const breakEvenCashflow = findIntersection(esborsoPoints, 'esborso');

  // 2. Nuovo vs NLT (Net TCO)
  const nettoPoints = monthlyData.slice(1).map(d => ({
    mese: d.mese,
    val1: d.acquistoNetto,
    val2: d.nltCumulato,
  }));
  const breakEvenNetTco = findIntersection(nettoPoints, 'netto');

  // 3. Usato vs NLT (Net TCO)
  const usatoNettoPoints = monthlyData.slice(1).map(d => ({
    mese: d.mese,
    val1: d.usatoNetto,
    val2: d.nltCumulato,
  }));
  const breakEvenUsatoVsNlt = findIntersection(usatoNettoPoints, 'netto', 'Pareggio Usato vs NLT');

  const summary: CalculatorSummary = {
    // NLT
    costoTotaleNlt: Math.round(costoTotaleNlt),
    costoMensileMedioNlt: Math.round(costoMensileMedioNlt),
    costoAlKmNlt: Number(costoAlKmNlt.toFixed(3)),
    kmInclusiTotaliNlt,
    kmEccedentiTotaliNlt,
    costoTotaleKmEccedentiNlt,

    // Auto Nuova
    importoFinanziato: Math.round(importoDaFinanziare),
    rataFinanziamentoMensile: Math.round(rataFinanziamento),
    totaleInteressiFinanziamento: Math.round(totaleInteressi),
    costiGestioneTotali: Math.round(costiGestioneTotali),
    costoTotaleEsborsoAcquisto: Math.round(costoTotaleEsborsoAcquisto),
    valoreResiduoEuro: Math.round(valoreResiduoEuro),
    costoTotaleRealeAcquisto: Math.round(costoTotaleRealeAcquisto),
    costoMensileMedioAcquisto: Math.round(costoMensileMedioAcquisto),
    costoAlKmAcquisto: Number(costoAlKmAcquisto.toFixed(3)),

    // Auto Usata
    usatoImportoFinanziato: Math.round(usatoImportoDaFinanziare),
    usatoRataFinanziamentoMensile: Math.round(usatoRataFinanziamento),
    usatoTotaleInteressiFinanziamento: Math.round(usatoTotaleInteressi),
    usatoCostiGestioneTotali: Math.round(usatoCostiGestioneTotali),
    usatoCostoTotaleEsborso: Math.round(usatoCostoTotaleEsborso),
    usatoValoreResiduoEuro: Math.round(usatoValoreResiduoEuro),
    usatoCostoTotaleReale: Math.round(usatoCostoTotaleReale),
    usatoCostoMensileMedio: Math.round(usatoCostoMensileMedio),
    usatoCostoAlKm: Number(usatoCostoAlKm.toFixed(3)),

    // Confronto
    differenzaTotaleReale: Math.round(differenzaTotaleReale),
    opzionePiuConveniente,
    risparmioPercentuale,
    migliorOpzioneNome: bestOption.name,
    risparmioRispettoAlPeggiorCaso,

    breakEvenCashflow,
    breakEvenNetTco,
    breakEvenUsatoVsNlt,
  };

  return { monthlyData, summary };
}
