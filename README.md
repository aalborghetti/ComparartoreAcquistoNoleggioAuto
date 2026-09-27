# AutoCalc - Comparatore Acquisto vs Noleggio a Lungo Termine (NLT)

Single Page Application (SPA) reattiva e moderna per il calcolo del **Total Cost of Ownership (TCO)** e il confronto finanziario in tempo reale tra **Acquisto di un'automobile** (con o senza finanziamento) e **Noleggio a Lungo Termine (NLT)**.

## 🚀 Stack Tecnologico
- **React 19 + TypeScript + Vite**
- **Tailwind CSS v3** con supporto tema Chiaro/Scuro (Dark Mode)
- **Recharts** per la visualizzazione grafica interattiva delle curve di costo cumulativo e del punto di pareggio (Break-Even Point)
- **Lucide-React** per icone moderne e intuitive
- **Client-Side Pure Math**: Nessun backend, 100% privacy, calcolo istantaneo reattivo, perfetto per deploy su Netlify / Vercel / GitHub Pages.

---

## 📊 Metodologia e Formule Finanziarie

### 1. Noleggio a Lungo Termine (NLT)
Formula tutto compreso con conguaglio chilometrico:
$$\text{Costo Cumulato NLT}(m) = \text{Anticipo NLT} + (\text{Canone Mensile} \times m) + (\text{Quota Mensile Km Eccedenti} \times m)$$
dove la penale km eccedenti totale è:
$$\text{Penale Km} = \max(0, \text{Km Totali Percorsi} - \text{Km Inclusi da Contratto}) \times \text{Costo al Km Eccedente (es. 0,05 €/km)}$$

### 2. Acquisto con Finanziamento
- Ammortamento a rate costanti (Ammortamento alla Francese):
  $$\text{Rata Mensile} = (\text{Prezzo} - \text{Anticipo}) \times \frac{r(1+r)^n}{(1+r)^n - 1}$$
  dove $r = \frac{\text{TAEG}}{12 \times 100}$ e $n = \text{Durata (mesi)}$.
- Costi operativi mensili:
  $$\text{Costo Gestione Mensile} = \frac{\text{Assicurazione Annua} + \text{Bollo Annuo} + \text{Manutenzione Annua}}{12}$$
- Esborso cumulativo di cassa:
  $$\text{Esborso}(m) = \text{Anticipo} + (\text{Rata Mensile} \times m) + (\text{Costo Gestione Mensile} \times m)$$
- **Costo Totale Reale (Net TCO a fine periodo)**:
  $$\text{Costo Totale Reale} = \text{Esborso Totale} - \text{Valore Residuo Stimato}$$

### 3. Break-Even Point (Punto di Pareggio)
Intersezione esatta tra le due curve per individuare dopo quanti mesi una soluzione diventa economicamente più vantaggiosa dell'altra.

---

## 🛠️ Comandi

```bash
# Installazione dipendenze
npm install

# Build di produzione
npm run build

# Test matematici di verifica TCO
node --experimental-strip-types scripts/verify-calculations.mjs

# Avvio server di sviluppo locale
npm run dev
```
