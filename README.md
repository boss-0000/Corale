# Corale

Prototipo navigabile della piattaforma di gestione del personale.

Quattro schermate reali — accesso, panoramica, elenco dipendenti, scheda della
persona — costruite come **fondazione del prodotto**, non come mockup: routing
vero, design system vero, dati finti dietro un'interfaccia sostituibile.

---

## Avvio

```bash
npm install
npm run dev        # http://localhost:3000
```

Da `/login` si entra con qualsiasi credenziale (i campi sono precompilati).

## Percorsi

| Rotta | Contenuto |
|---|---|
| `/login` | Accesso, pannello editoriale |
| `/dashboard` | Indicatori, osservazioni automatiche, andamento presenze, reparti, attività, notifiche |
| `/employees` | Elenco con ricerca, filtri per reparto e stato, ordinamento |
| `/employees/[id]` | Anagrafica, contratto, obiettivi, storico punteggio, 90 giorni di presenze, calcolo retributivo |

Persone interessanti da aprire: `emp-013` (contratto in scadenza e presenza in
calo), `emp-007` (performance in discesa), `emp-002` (sopra la soglia del bonus
maggiorato).

---

## Architettura

```
src/
  lib/
    types.ts              # modello di dominio — il contratto fra UI e dati
    data/
      repository.ts       # CoraleRepository: l'unico punto di accesso ai dati
      mock.ts             # dati deterministici del prototipo
    format.ts             # formattazione it-IT centralizzata
  components/
    ui/primitives.tsx     # Card, StatusBadge, Avatar, Meter, Wordmark
    charts/               # Sparkline, TrendChart, BarList, AttendanceGrid
    InsightQuote.tsx      # l'elemento firma: osservazione come citazione editoriale
    StatTile.tsx
    AppShell.tsx          # navigazione, ruoli, fasi
  app/
    login/                # fuori dalla shell
    (app)/                # tutto ciò che richiede sessione
```

**Il punto architetturale.** Ogni schermata legge da `getRepository()` e da
nient'altro. Il prototipo monta `MockRepository`; la versione di produzione monta
un `ApiRepository` che chiama il backend NestJS con le stesse firme. Nessun
componente cambia. Tutti i metodi sono già asincroni proprio per questo: un mock
sincrono che poi diventa una chiamata di rete è il motivo per cui la maggior parte
dei prototipi va riscritta invece che portata avanti.

## Design

Il prototipo continua la direzione delle due schermate concept già approvate:
non è un'app bianca con un accento colorato, è un oggetto editoriale.

- **Palette** ivorio, bordeaux ed espresso, con l'ottone come accento tipografico
  (occhielli, filetti, la «a» del marchio). Tutto definito come token in
  `globals.css`: nessun colore scritto a mano nei componenti.
- **La barra laterale e il pannello insight sono espresso**, non bianchi. È la
  firma visiva del prodotto e il motivo per cui non somiglia a un gestionale.
- **Tipografia** Fraunces per i titoli e le citazioni, Inter per l'interfaccia.
  I numeri restano in Inter: una cifra in graziato su una metrica si legge come
  decorazione.
- **Grafici** una sola serie per grafico, marchi sottili, griglie recessive,
  etichetta diretta sul punto finale, tabella dei dati sempre raggiungibile.
  La palette è stata verificata su daltonismo e contrasto, non stimata a occhio:
  presenza `#9E5266`, permesso `#B07C2A`, assenza `#B03030` superano tutti i
  controlli sul fondo ivorio, e ogni stato porta comunque un glifo e una legenda,
  così l'identità non dipende mai dal solo colore.
- **Accessibilità** navigazione da tastiera sui grafici (frecce sul grafico di
  andamento), `aria-sort` sulle colonne ordinabili, contrasti verificati, rispetto
  di `prefers-reduced-motion`.

## Cosa non c'è ancora

Il prototipo copre la fondazione. Sono deliberatamente fuori scopo, e segnalati
nella navigazione con la fase di appartenenza:

- Fase 2 — modulo presenze completo (timbrature, richieste, approvazioni)
- Fase 3 — valutazioni, cicli di obiettivi, revisioni
- Fase 4 — elaborazione retributiva con simulatore e log immutabile
- Fase 5 — pannello analitico e modulo IA

Il calcolo retributivo mostrato nella scheda della persona è la resa grafica di
come si presenterà quel modulo: ogni voce accompagnata dalla regola che l'ha
prodotta.
