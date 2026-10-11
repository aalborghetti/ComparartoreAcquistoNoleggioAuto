import { calculateMonthlyPayment, calculateCarTco } from '../src/utils/calculator.ts';

// Test 1: Financial Amortization Formula
console.log('--- TEST 1: Ammortamento Francese ---');
const principal = 20000;
const rate = 5.0; // 5% TAEG
const months = 36;
const pmt = calculateMonthlyPayment(principal, rate, months);
console.log(`Capitale: ${principal} €, Tasso: ${rate}%, Mesi: ${months}`);
console.log(`Rata mensile calcolata: ${pmt.toFixed(2)} € (attesa: ~599.42 €)`);
if (Math.abs(pmt - 599.42) > 1) {
  throw new Error(`Test 1 fallito: valore atteso ~599.42, ottenuto ${pmt}`);
}
console.log('✓ Test 1 superato!');

// Test 2: TCO e Calcolo Valore Residuo (Senza km eccedenti)
console.log('\n--- TEST 2: Calcolo TCO & Valore Residuo ---');
const inputs = {
  durataMesi: 36,
  kmAnnui: 10000,
  prezzoAuto: 30000,
  anticipoAcquisto: 5000,
  tassoTaeg: 6.0,
  assicurazioneAnnua: 1200,
  bolloAnnuo: 300,
  manutenzioneAnnua: 600,
  valoreResiduoPercentuale: 40, // 40% = 12.000 €
  anticipoNlt: 3000,
  canoneMensileNlt: 450,
  kmInclusiAnnuiNlt: 10000,
  costoKmEccedenteNlt: 0.05,
};

const result = calculateCarTco(inputs);
console.log(`Costo Totale NLT (senza eccedenze): ${result.summary.costoTotaleNlt} € (atteso: 19200 €)`);
if (result.summary.costoTotaleNlt !== 19200) {
  throw new Error(`Test 2 fallito su NLT: atteso 19200, ottenuto ${result.summary.costoTotaleNlt}`);
}

const residualExpected = 30000 * 0.40;
console.log(`Valore residuo calcolato: ${result.summary.valoreResiduoEuro} € (atteso: ${residualExpected} €)`);
if (result.summary.valoreResiduoEuro !== residualExpected) {
  throw new Error('Test 2 fallito su Valore Residuo');
}

const realTcoExpected = result.summary.costoTotaleEsborsoAcquisto - residualExpected;
console.log(`Costo Totale Reale Acquisto: ${result.summary.costoTotaleRealeAcquisto} € (atteso: ${realTcoExpected} €)`);
if (result.summary.costoTotaleRealeAcquisto !== realTcoExpected) {
  throw new Error('Test 2 fallito su TCO Reale Acquisto');
}
console.log('✓ Test 2 superato!');

// Test 3: Verifica Calcolo Km Eccedenti (5 centesimi a km)
console.log('\n--- TEST 3: Verifica Penale Km Eccedenti ---');
const inputsConEccedenza = {
  ...inputs,
  kmAnnui: 15000, // 5.000 km/anno eccedenti -> 15.000 km totali su 36 mesi
};
const resultEccedenza = calculateCarTco(inputsConEccedenza);
// 15.000 km * 0.05 € = 750 €
console.log(`Km eccedenti totali: ${resultEccedenza.summary.kmEccedentiTotaliNlt} (atteso: 15000)`);
console.log(`Penale totale stimata: ${resultEccedenza.summary.costoTotaleKmEccedentiNlt} € (atteso: 750 €)`);
console.log(`Costo Totale NLT con penale: ${resultEccedenza.summary.costoTotaleNlt} € (19200 + 750 = 19950 €)`);

if (resultEccedenza.summary.kmEccedentiTotaliNlt !== 15000) {
  throw new Error(`Test 3 fallito sui km eccedenti: atteso 15000, ottenuto ${resultEccedenza.summary.kmEccedentiTotaliNlt}`);
}
if (resultEccedenza.summary.costoTotaleKmEccedentiNlt !== 750) {
  throw new Error(`Test 3 fallito sulla penale: atteso 750, ottenuto ${resultEccedenza.summary.costoTotaleKmEccedentiNlt}`);
}
if (resultEccedenza.summary.costoTotaleNlt !== 19950) {
  throw new Error(`Test 3 fallito su costo NLT totale: atteso 19950, ottenuto ${resultEccedenza.summary.costoTotaleNlt}`);
}
console.log('✓ Test 3 superato!');

// Test 4: Calcolo Auto Usata
console.log('\n--- TEST 4: Calcolo Auto Usata (Costi acquisto inferiori, manutenzione superiore) ---');
console.log(`Costo Totale Reale Auto Usata: ${result.summary.usatoCostoTotaleReale} €`);
console.log(`Migliore opzione TCO: ${result.summary.migliorOpzioneNome}`);
if (!result.summary.usatoCostoTotaleReale || result.summary.usatoCostoTotaleReale <= 0) {
  throw new Error('Test 4 fallito su calcolo TCO Auto Usata');
}
console.log('✓ Test 4 superato!');

// Test 5: Array Mensili & Break-even
console.log('\n--- TEST 5: Array Mensili & Break-even ---');
console.log(`Lunghezza dati mensili: ${resultEccedenza.monthlyData.length} (atteso: 37 elementi da 0 a 36)`);
if (resultEccedenza.monthlyData.length !== 37) {
  throw new Error('Test 5 fallito: lunghezza array non corretta');
}

console.log('Break-even cassa rilevato:', resultEccedenza.summary.breakEvenCashflow?.descrizione || 'Nessuno');
console.log('Break-even TCO netto rilevato:', resultEccedenza.summary.breakEvenNetTco?.descrizione || 'Nessuno');
console.log('✓ Test 5 superato!');

// Test 6: Verifica Modalità "Tutto Subito" (senza finanziamento)
console.log('\n--- TEST 6: Verifica Modalità "Tutto Subito" ---');
const inputsTuttoSubito = {
  ...inputs,
  metodoPagamentoNuovo: 'tutto_subito',
  metodoPagamentoUsato: 'tutto_subito',
};
const resTuttoSubito = calculateCarTco(inputsTuttoSubito);

console.log(`Auto Nuova Tutto Subito - Importo finanziato: ${resTuttoSubito.summary.importoFinanziato} € (atteso: 0 €)`);
console.log(`Auto Nuova Tutto Subito - Rata mensile: ${resTuttoSubito.summary.rataFinanziamentoMensile} € (atteso: 0 €)`);
console.log(`Auto Nuova Tutto Subito - Interessi: ${resTuttoSubito.summary.totaleInteressiFinanziamento} € (atteso: 0 €)`);
console.log(`Auto Nuova Tutto Subito - Esborso Mese 0: ${resTuttoSubito.monthlyData[0].acquistoCumulato} € (atteso: 30000 €)`);

if (resTuttoSubito.summary.importoFinanziato !== 0 || resTuttoSubito.summary.totaleInteressiFinanziamento !== 0) {
  throw new Error('Test 6 fallito: importo finanziato o interessi diversi da 0 in Tutto Subito');
}
if (resTuttoSubito.monthlyData[0].acquistoCumulato !== 30000) {
  throw new Error('Test 6 fallito: esborso Mese 0 diverso dal prezzo intero');
}

// Esborso totale atteso = 30000 (prezzo) + (1200 + 300 + 600) * 3 = 30000 + 6300 = 36300
const attesoEsborsoNuovo = 30000 + ((1200 + 300 + 600) * 3);
if (resTuttoSubito.summary.costoTotaleEsborsoAcquisto !== attesoEsborsoNuovo) {
  throw new Error(`Test 6 fallito su esborso totale: atteso ${attesoEsborsoNuovo}, ottenuto ${resTuttoSubito.summary.costoTotaleEsborsoAcquisto}`);
}

// Costo reale atteso = 36300 - 12000 (residuo) = 24300 €
const attesoRealeNuovo = attesoEsborsoNuovo - 12000;
if (resTuttoSubito.summary.costoTotaleRealeAcquisto !== attesoRealeNuovo) {
  throw new Error(`Test 6 fallito su costo reale: atteso ${attesoRealeNuovo}, ottenuto ${resTuttoSubito.summary.costoTotaleRealeAcquisto}`);
}

// Verifica Usato Tutto Subito
if (resTuttoSubito.summary.usatoImportoFinanziato !== 0 || resTuttoSubito.summary.usatoTotaleInteressiFinanziamento !== 0) {
  throw new Error('Test 6 fallito su Usato: finanziamento o interessi diversi da 0');
}
console.log('✓ Test 6 superato!');

console.log('\n======================================================');
console.log('TUTTI I TEST (INCLUSO IL PAGAMENTO TUTTO SUBITO) HANNO AVUTO SUCCESSO!');
console.log('======================================================');
