const STEPS = [
  { label: "Anagrafica", num: 1 },
  { label: "Gestione", num: 2 },
  { label: "Sicurezza", num: 3 },
  { label: "Struttura", num: 4 },
  { label: "Personale", num: 5 },
  { label: "Documento", num: 6 },
];

let currentStep = 1;

// Build progress bar
const stepsRow = document.getElementById('stepsRow');
STEPS.forEach(s => {
  const el = document.createElement('div');
  el.className = 'step-item' + (s.num === 1 ? ' active' : '');
  el.id = `step_${s.num}`;
  el.addEventListener('click', function(){ goTo(s.num); });
  el.innerHTML = `<div class="step-num">${s.num}</div><div class="step-label">${s.label}</div>`;
  stepsRow.appendChild(el);
});

function goTo(n) {
  if (n < 1 || n > 6) return;
  document.getElementById(`s${currentStep}`).classList.remove('active');
  document.getElementById(`step_${currentStep}`).classList.remove('active');
  if (currentStep < n) document.getElementById(`step_${currentStep}`).classList.add('done');
  currentStep = n;
  document.getElementById(`s${currentStep}`).classList.add('active');
  document.getElementById(`step_${currentStep}`).classList.add('active');
  document.getElementById(`step_${currentStep}`).classList.remove('done');
  document.getElementById('navText').textContent = `Sezione ${currentStep} di 6`;
  document.getElementById('btnBack').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  document.getElementById('btnNext').textContent = currentStep === 6 ? '✔ Chiudi' : 'Avanti →';
  document.getElementById('btnNext').className = currentStep === 6 ? 'btn btn-secondary' : 'btn btn-gold';
  if (currentStep === 6) {
    generateOutput();
    // Mostra banner iOS solo su Safari/iPhone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const banner = document.getElementById('iosBanner');
    if (banner) banner.style.display = (isIOS || isSafari) ? 'block' : 'none';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigate(dir) {
  if (dir === 1 && currentStep === 6) return;
  goTo(currentStep + dir);
}

function toggleCheck(id) {
  const el = document.getElementById(id);
  const cb = el.querySelector('input[type="checkbox"]');
  el.classList.toggle('checked', cb.checked);
}

function val(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  return el.value || '';
}
function checked(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  return el.checked;
}

function generateOutput() {
  const ora = new Date().toLocaleDateString('it-IT', { day:'2-digit', month:'long', year:'numeric' });

  const sections = [];

  // Sezione 1
  sections.push({
    title: '1. DATI IDENTIFICATIVI DELLA STRUTTURA',
    rows: [
      ['Denominazione', val('denominazione') || '—'],
      ['Titolare / Legale Rappresentante', val('titolare') || '—'],
      ['Codice Fiscale / P.IVA', val('piva') || '—'],
      ['Indirizzo', `${val('indirizzo')}, ${val('comune')} (${val('provincia')}) – ${val('cap')}`],
      ['ASP di riferimento', val('asp') || '—'],
      ['Telefono', val('telefono') || '—'],
      ['PEC / E-mail', val('email') || '—'],
      ['Direttore Tecnico', val('direttore') || '—'],
      ['Iscrizione Albo Odontoiatri', val('albo') || '—'],
      ['Ordine Provinciale', val('ordine') || '—'],
    ]
  });

  // Sezione 2
  const evidenze2 = [
    [checked('gdpr'), 'Procedure GDPR e sicurezza dati adottate (D.lgs 196/2003 / GDPR 679/2016)'],
    [checked('backup'), 'Sistema di backup dati attivo'],
    [checked('tracciamento'), 'Procedure raccolta, conservazione e tracciamento dati'],
    [checked('reclami'), 'Procedura reclami/suggerimenti formalmente adottata (referente designato)'],
    [checked('piani_miglio'), 'Piani di miglioramento documentati con indicatori di monitoraggio'],
    [checked('carta'), 'Carta dei Servizi adottata, accessibile e periodicamente rivalutata'],
  ];
  sections.push({
    title: '2. SISTEMA INFORMATIVO, GESTIONE QUALITÀ E COMUNICAZIONE (Criterio 1A.01)',
    software: val('software'),
    qualita: val('qualita'),
    checklist: evidenze2
  });

  // Sezione 3
  const evidenze3 = [
    [checked('proc_ero'), 'Procedura erogazione assistenza (prenotazione, accesso, urgenze, continuità)'],
    [checked('urgenze_proc'), 'Procedura gestione urgenze cliniche e tecnico-organizzative'],
    [checked('continuita'), 'Protocolli/linee guida percorso assistenziale paziente'],
    [checked('piano_emerg'), 'Piano per la gestione delle emergenze – noto al personale'],
    [checked('isolamento'), 'Protocollo isolamento pazienti con patologie contagiose'],
    [checked('doc_san'), 'Procedura gestione documentazione sanitaria (GDPR, accesso, referti)'],
    [checked('dvr'), 'DVR (D.lgs 81/2008) adottato e aggiornato'],
    [checked('proc_bio'), 'Procedure protezione materiale biologico e sanificazione ambienti'],
    [checked('rischio_clinico'), 'Sistema gestione rischio clinico con LG, checklist, raccolta eventi avversi'],
  ];
  sections.push({
    title: '3. PRESTAZIONI, CONTINUITÀ ASSISTENZIALE E SICUREZZA CLINICA (Criteri 1A.02 / 1A.06)',
    rischio: val('rischio'),
    checklist: evidenze3
  });

  // Sezione 4
  const evidenze4 = [
    [checked('n1'), 'Caratteristiche ambientali e accessibilità'],
    [checked('n2'), 'Protezione antincendio'],
    [checked('n3'), 'Protezione acustica'],
    [checked('n4'), 'Sicurezza elettrica e continuità elettrica'],
    [checked('n5'), 'Sicurezza antinfortunistica'],
    [checked('n6'), 'Protezione da radiazioni ionizzanti'],
    [checked('n7'), 'Eliminazione barriere architettoniche'],
    [checked('n8'), 'Smaltimento rifiuti sanitari'],
    [checked('n9'), 'Condizioni microclimatiche'],
    [checked('n10'), 'Impianti distribuzione gas medicali'],
    [checked('n11'), 'Protezione antisismica'],
    [checked('inventario'), 'Inventario attrezzature aggiornato annualmente'],
    [checked('piano_man'), 'Piano di manutenzione ordinaria e straordinaria adottato'],
    [checked('resp_man'), 'Responsabile Manutenzione formalmente designato'],
    [checked('doc_tec'), 'Documentazione tecnica attrezzature disponibile'],
  ];
  sections.push({
    title: '4. ASPETTI STRUTTURALI E TECNOLOGICI (Criterio 1A.03)',
    locali: `N° locali: ${val('nLocali') || '—'} | N° riuniti: ${val('nRiuniti') || '—'}\n${val('locali')}`,
    attrezzature: val('attrezzature'),
    checklist: evidenze4
  });

  // Sezione 5
  const evidenze5 = [
    [checked('fascicoli'), 'Fascicoli personali per ogni collaboratore aggiornati'],
    [checked('assicurativi'), 'Obblighi assicurativi/previdenziali assolti (INAIL, INPS, RC L.24/2017)'],
    [checked('formazione'), 'Programma formativo/ECM documentato'],
    [checked('sito'), 'Sito web aggiornato con info struttura, servizi, mappa, form contatto'],
    [checked('customer'), 'Procedure per valutazione esperienza utente / customer satisfaction'],
  ];
  sections.push({
    title: '5. PERSONALE E COMUNICAZIONE (Criteri 1A.04 / 1A.05)',
    personale: `Odontoiatri: ${val('nMedici') || '—'} | Igienisti/ASO: ${val('nAso') || '—'} | Amm.: ${val('personaleAmm') || '—'}`,
    sito: val('sitoUrl'),
    checklist: evidenze5
  });

  // Render output
  const wrap = document.getElementById('outputArea');
  wrap.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'output-wrap';
  header.style.marginBottom = '20px';

  let html = `<div class="output-section">
    <h3>ALLEGATO A1 — REQUISITI GENERALI PER L'AUTORIZZAZIONE</h3>
    <div style="color:rgba(255,255,255,0.55); font-size:12px; margin-top:4px;">
      Strutture Non Residenziali Semplici Monopresidio · D.A. 9 gennaio 2024, n. 20 · MAMB 3.0 (giugno 2025)<br>
      Documento generato il ${ora} tramite Wizard Allegato A1
    </div>
  </div>`;

  sections.forEach(sec => {
    html += `<div class="output-section"><h3>${sec.title}</h3>`;

    if (sec.rows) {
      sec.rows.forEach(r => {
        html += `<div class="output-row"><span class="output-key">${r[0]}</span><span class="output-val">${r[1]}</span></div>`;
      });
    }
    if (sec.software) {
      html += `<div class="output-row"><span class="output-key">Software gestionale</span><span class="output-val">${sec.software}</span></div>`;
    }
    if (sec.qualita) {
      html += `<div class="output-row"><span class="output-key">Qualità servizi</span><span class="output-val" style="white-space:pre-wrap">${sec.qualita}</span></div>`;
    }
    if (sec.rischio) {
      html += `<div class="output-row"><span class="output-key">Gestione rischio</span><span class="output-val" style="white-space:pre-wrap">${sec.rischio}</span></div>`;
    }
    if (sec.locali) {
      html += `<div class="output-row"><span class="output-key">Locali</span><span class="output-val" style="white-space:pre-wrap">${sec.locali}</span></div>`;
    }
    if (sec.attrezzature) {
      html += `<div class="output-row"><span class="output-key">Attrezzature</span><span class="output-val" style="white-space:pre-wrap">${sec.attrezzature}</span></div>`;
    }
    if (sec.personale) {
      html += `<div class="output-row"><span class="output-key">Personale</span><span class="output-val">${sec.personale}</span></div>`;
    }
    if (sec.sito) {
      html += `<div class="output-row"><span class="output-key">Sito web</span><span class="output-val">${sec.sito}</span></div>`;
    }

    if (sec.checklist) {
      html += `<div style="margin-top:14px; border-top:1px solid rgba(255,255,255,0.08); padding-top:12px;">`;
      const ok = sec.checklist.filter(r => r[0]).length;
      const tot = sec.checklist.length;
      const pct = Math.round(ok/tot*100);
      html += `<div style="font-size:11px; color:${pct===100?'#4ade80':'#fbbf24'}; margin-bottom:10px; font-weight:600; letter-spacing:1px;">EVIDENZE: ${ok}/${tot} PRESENTI (${pct}%)</div>`;
      sec.checklist.forEach(r => {
        const icon = r[0] ? '<span class="check-ok">✅</span>' : '<span class="check-no">❌</span>';
        const style = r[0] ? '' : 'opacity:0.6';
        html += `<div class="checklist-row" style="${style}">${icon}<span>${r[1]}</span></div>`;
      });
      html += `</div>`;
    }

    html += `</div>`;
  });

  // Score complessivo
  const allChecks = [
    'gdpr','backup','tracciamento','reclami','piani_miglio','carta',
    'proc_ero','urgenze_proc','continuita','piano_emerg','isolamento','doc_san','dvr','proc_bio','rischio_clinico',
    'n1','n2','n3','n4','n5','n6','n7','n8','n9','n10','n11',
    'inventario','piano_man','resp_man','doc_tec',
    'fascicoli','assicurativi','formazione','sito','customer'
  ];
  const tot = allChecks.length;
  const ok = allChecks.filter(id => checked(id)).length;
  const pct = Math.round(ok/tot*100);
  const colore = pct >= 80 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#f87171';

  html += `<div style="border-top:2px solid rgba(255,255,255,0.15); padding-top:20px; text-align:center;">
    <div style="font-size:11px; letter-spacing:2px; color:rgba(255,255,255,0.5); text-transform:uppercase; margin-bottom:8px;">Indice di Completezza Documentale</div>
    <div style="font-family:'DM Serif Display',serif; font-size:52px; color:${colore}; line-height:1;">${pct}%</div>
    <div style="font-size:13px; color:rgba(255,255,255,0.6); margin-top:6px;">${ok} evidenze su ${tot} presenti e dichiarate</div>
  </div>`;

  header.innerHTML = html;
  wrap.appendChild(header);
}

function copyOutput() {
  const el = document.getElementById('outputArea');
  const text = el ? el.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✅ Copiato!';
    setTimeout(() => { btn.innerHTML = '📋 Copia testo'; }, 2000);
  });
}

/* ══════════════════════════════════════════════════
   PDF WRITER – zero dipendenze esterne
   Genera PDF/1.4 valido con testo multiriga, sezioni,
   checklist e score. Funziona offline al 100%.
   ══════════════════════════════════════════════════ */
function exportPDF() {
  const btn = document.getElementById('btnPdf');
  btn.disabled = true;
  btn.textContent = '⏳ Generazione PDF...';

  // Lascia respirare il browser prima di bloccare col calcolo
  setTimeout(() => {
    try {
      const pdf = buildPDF();
      const studio = (val('denominazione') || 'studio').replace(/[^a-zA-Z0-9]/g,'_').toLowerCase().slice(0,30);
      const dataStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
      const fileName = `AllegatoA1_${studio}_${dataStr}.pdf`;

      // Converti stringa PDF in array di byte
      const bytes = new Uint8Array(pdf.length);
      for (let i = 0; i < pdf.length; i++) {
        bytes[i] = pdf.charCodeAt(i) & 0xff;
      }

      // Converti bytes in base64 (funziona su tutti i dispositivi)
      // btoa su chunk per evitare stack overflow su PDF grandi
      let binary = '';
      const CHUNK = 8192;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
      }
      const b64 = btoa(binary);
      const dataUrl = 'data:application/pdf;base64,' + b64;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (isIOS || isSafari) {
        // Safari / iOS: apre il PDF nel viewer nativo.
        // L'utente tocca "Condividi → Salva in File" o "Apri in..."
        // È l'unico metodo affidabile su Safari — il download via blob non funziona.
        const newTab = window.open('', '_blank');
        if (newTab) {
          newTab.document.write(
            '<html><head><title>' + fileName + '</title></head>' +
            '<body style="margin:0">' +
            '<iframe src="' + dataUrl + '" style="width:100%;height:100vh;border:none"></iframe>' +
            '</body></html>'
          );
          newTab.document.close();
        } else {
          // Popup bloccato: fallback link diretto
          const a = document.createElement('a');
          a.href = dataUrl;
          a.target = '_blank';
          a.click();
        }
        btn.disabled = false;
        btn.textContent = '✅ Aperto – tocca Condividi → Salva in File';
        setTimeout(() => { btn.textContent = '📄 Scarica PDF'; }, 6000);
      } else {
        // Desktop (Chrome, Firefox, Edge) e Android: download diretto
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        btn.disabled = false;
        btn.textContent = '✅ PDF scaricato!';
        setTimeout(() => { btn.textContent = '📄 Scarica PDF'; }, 3000);
      }
    } catch(e) {
      console.error(e);
      btn.disabled = false;
      btn.textContent = '❌ Errore – riprova';
      setTimeout(() => { btn.textContent = '📄 Scarica PDF'; }, 3000);
    }
  }, 80);
}

const DOC_TEMPLATES = {
  1: `Il presente documento descritto è un Piano di Organizzazione e Gestione delle Risorse (POG-R) o
    un Piano di Gestione dei Servizi, che definisce le politiche, i processi e la struttura organizzativa
    per l'uso efficiente delle risorse e include un'analisi dei processi per identificare i punti deboli e i
    possibili disservizi dello studio Odontoiatrico.
     L'obiettivo è garantire un'organizzazione ottimale e prevenire problemi operativi, spesso
    attraverso l'analisi dei rischi e l'implementazione di procedure di controllo interno.
    Funzioni e scopi del documento
   Definizione dell'organizzazione:
    Descrive la struttura organizzativa, i ruoli e le responsabilità per la gestione delle risorse.
   Politiche di gestione:
    Stabilisce le regole e i principi che guidano l'uso delle risorse, come finanziarie, umane e materiali.
   Analisi dei processi:
    Mappa i processi aziendali per identificare le fasi critiche in cui potrebbero verificarsi disservizi,
    errori o inefficienze.
   Prevenzione dei disservizi:
    Individua le criticità e implementa azioni correttive o preventive per mitigare i rischi e garantire la
    continuità dei servizi.
   Controllo interno:
    Supporta l'implementazione di un sistema di controllo interno per assicurare la conformità alle
    procedure e la salvaguardia delle risorse.
   Base documentale:
    Fornisce una base documentale che può essere utilizzata per la formazione, la revisione e il
    miglioramento continuo delle operazioni.

    Contenuti tipici
   Mappatura dei processi:
    Descrizione dettagliata delle attività e delle interazioni tra le diverse unità organizzative.
   Analisi dei rischi:
    Identificazione dei rischi associati a ogni fase del processo e valutazione della loro probabilità e
    impatto.
   Piani di mitigazione:
    Descrizione delle misure preventive e correttive da attuare per ridurre i rischi.
   Indicatori di performance:
    Definizioni degli indicatori chiave di performance per monitorare l'efficienza e l'efficacia dei
    processi.
   Procedure operative standard:
    Istruzioni dettagliate su come svolgere le attività operative.


                                                                                                 

Documento Organizzativo e di Gestione delle Risorse
                      [STUDIO]

1. Scopo del Documento
Il presente documento ha l’obiettivo di definire e rendere esplicita l’organizzazione interna dello
studio odontoiatrico e le politiche adottate per la gestione delle risorse (umane, materiali e
tecnologiche). Inoltre, analizza i principali processi operativi per individuare eventuali fasi critiche
in cui possono verificarsi disservizi, al fine di prevenirli e garantire un servizio di qualità e in
sicurezza per i pazienti.


2. Struttura Organizzativa dello Studio
2.1 Personale e Ruoli

      Responsabile Sanitario / Titolare: Coordinamento generale, supervisione clinica e
       gestionale.
      Odontoiatri collaboratori: Esecuzione dei trattamenti e presa in carico dei pazienti.
      Igienisti dentali: Prevenzione, educazione e igiene orale.
      Assistenti alla poltrona (ASO): Supporto clinico e logistico alle attività odontoiatriche.
      Personale amministrativo: Accoglienza, gestione appuntamenti, documentazione,
       fatturazione.

2.2 Comunicazione Interna

      Riunioni periodiche di coordinamento (mensili o bimestrali).
      Uso di software gestionale per la condivisione di informazioni cliniche e organizzative.
      Canali interni di comunicazione digitale (email, chat interne, agenda condivisa).


3. Politiche di Gestione delle Risorse

3.1 Risorse Umane

      Aggiornamento continuo e formazione obbligatoria (corsi ECM, formazione ASO).
      Affiancamento e formazione on-the-job per nuovo personale.
      Verifica annuale delle competenze e colloqui di feedback.

3.2 Risorse Materiali e Tecnologiche

      Manutenzione periodica delle attrezzature odontoiatriche secondo calendario prestabilito.
      Controllo di scorte e materiali sanitari (sistemi di inventario automatico o manuale).
      Adozione di software gestionali aggiornati per appuntamenti, cartelle cliniche e
       amministrazione.

3.3 Sicurezza e Igiene

      Adozione dei protocolli di sterilizzazione e sanificazione secondo normative vigenti.
      Formazione del personale in materia di sicurezza sul lavoro e gestione emergenze.
                                                                                           

Verifica periodica del rispetto delle normative igienico-sanitarie.


4. Analisi dei Processi e delle Fasi Critiche

L’analisi dei principali processi permette di individuare punti di rischio e prevenire i disservizi. Di
seguito una tabella riepilogativa:

                                                                                Azioni Preventive /
       Processo               Fase Critica             Possibili Disservizi
                                                                                    Correttive
                                                                                Software gestionale,
  Accoglienza del                                     Errori agenda, attese         promemoria
                      Prenotazione, accettazione
     paziente                                              prolungate           automatici, conferma
                                                                                     telefonica

                                                          Errori clinici,      Check-list, formazione
Trattamento clinico Diagnosi, esecuzione terapia      strumentazione non        continua, protocolli
                                                           disponibile                 clinici

                                                                                   Manutenzione
   Sterilizzazione       Pulizia, imbustamento,         Contaminazione,
                                                                               periodica, tracciabilità
     strumenti             gestione autoclave          malfunzionamento
                                                                                   sterilizzazione

                                                                              Backup, digitalizzazione
     Gestione                                          Errori documentali,
                       Fatturazione, archiviazione                            documenti, formazione
   amministrativa                                          perdita dati
                                                                                  amministrativi

                                                          Mancanza di
                                                                                   Promemoria
Comunicazione con        Informazioni pre/post           informazioni,
                                                                               SMS/email, materiale
    pazienti            trattamento, follow-up           appuntamenti
                                                                               informativo standard
                                                          dimenticati

5. Monitoraggio e Miglioramento Continuo

Lo studio si impegna in un processo continuo di miglioramento della qualità attraverso:

       Raccolta del feedback da parte dei pazienti (questionari cartacei o digitali).
       Audit interni periodici per la verifica del rispetto delle procedure.
       Revisione degli eventi critici, analisi delle cause e implementazione di azioni correttive.
       Aggiornamento dei protocolli interni in base alle normative vigenti e ai risultati delle
        verifiche.


6. Conclusioni

Una gestione strutturata ed efficiente delle risorse è essenziale per garantire l’eccellenza del
servizio odontoiatrico offerto ai pazienti. Questo documento rappresenta una guida pratica per il
personale, promuovendo la qualità, la sicurezza e il miglioramento continuo in ogni area dello
studio.`,
  2: `Premessa
Il Codice sulla privacy impone a chiunque tratta informazioni relative ad altre persone, imprese, enti od
associazioni di rispettare alcuni principi fondamentali a garanzia della riservatezza dei dati stessi.
Il Codice prescrive precisi obblighi e comportamenti da attuare nel trattare i dati; questi obblighi sono
sanzionati anche penalmente: è necessario, pertanto, procedere all’adeguamento dell’organizzazione
dello Studio Odontoiatrico al fine di rispettare gli obblighi imposti dal Codice.
Con il presente documento si definisce, ai sensi delle disposizioni di legge, le procedure che
definiscono le modalità con cui è garantita la integrità dei dati adottate dallo Studio odontoiatrico
del [TITOLARE] sito in [INDIRIZZO]
Il documento procede, innanzi tutto, all’Identificazione delle Risorse da proteggere, risorse che in
diverso modo operano o comunque svolgono un ruolo significativo nei processi di trattamento dei dati
personali, si passa poi all’analisi ed all’elenco dei trattamenti e quindi alla distribuzione dei compiti e
delle responsabilità nell’ambito della struttura organizzativa. Poi, tramite l’Analisi dei Rischi, sono state
analizzate le minacce e le vulnerabilità a cui le risorse sono sottoposte, in modo da potere valutare gli
elementi che possono insidiare la protezione, l’integrità e la conservazione di ogni singolo dato
personale trattato.
Valutati i rischi, si è redatto un Piano di Sicurezza tramite il quale si è provveduto a definire l’insieme
delle misure fisiche, logiche ed organizzative adottate per tutelare le strutture e le risorse preposte al
trattamento dei dati e le misure da adottare per garantire l’integrità e la disponibilità dei dati stessi.
Inoltre, è stato definito un Piano di Verifiche delle misure adottate tramite il quale si provvederà ad
accertare, periodicamente, la bontà delle misure individuate e ad apportare gli accorgimenti che si
riveleranno necessari ed opportuni.
Parallelamente alla stesura del Piano di Verifiche è stato redatto un Piano di Formazione degli
Incaricati tramite il quale si renderanno edotti gli incaricati del trattamento dei rischi e dei modi per
prevenire i danni.
Il documento, inoltre, fornisce idonee informazioni relative alla tipologia di dati sensibili trattati e
all’analisi dei rischi connessi all’utilizzo degli strumenti mediante i quali viene effettuato il trattamento.

Il Documento si applica al trattamento di tutti i dati personali per mezzo di:

                Strumenti elettronici di elaborazione
                Altri strumenti di elaborazione (es. cartacei, audio, visivi e audiovisivi, ecc.)

Il Documento deve essere conosciuto ed applicato da tutti i componenti e collaboratori dello studio

Risorse Hardware
Le risorse hardware utilizzate per trattare i dati personali sono analizzate nelle seguenti schede
riepilogative:

                                                                                                     

SCHEDA RILEVAZIONE RISORSE HARDWAREN.01
Codice:                                PC01
Modello:                               HP OMEN 15

Sistema Operativo:                     Windows11
Categoria:                             [] Sistema Elaborativo Server
                                       [] Sistema Elaborativo Client
                                       [x] Altro Sistema: PC stand alone
Elaboratore in rete:                   [] No
                                       [X] Rete Privata
                                       [ ] Rete Disponibile al pubblico:
Dislocazione:                          Segreteria/ sala operativa 1
Operatore:                             [TITOLARE]


DISPOSITIVI DI PROTEZIONE
Presenza di Password:                  []No
                                       [x]Si
                                       Note: L’utente può cambiare
                                       autonomamente la password
Antivirus:                             [ ] No
                                       [x] Si
                                       Tipo/Prodotto: kaspersky internet
                                       security
                                       Periodicità: aggiornamento:
                                       Automatico
Firewall:                              [ ] No
                                       [x] Si
                                       Tipo/Prodotto: Presente nel
                                       Sistema Operativo
                                       Note:
Gruppo di Continuità:                  [ ] No
                                       [x]Si


COMPONENTI DI RILIEVO AI FINI DELLA SICUREZZA DEI
DATI

Componente                             Descrizione
Supporti di memorizzazione             HD locale da 1TB
                                       Masterizzatore DVD
                                       Dual.Rom
                                       PenDrive Flash Disk
                                       Cloud. NO
Connessione Internet                   Si

 Banche dati
 Gli archivi e le banche dati contenenti i dati personali trattati sono i seguenti:

                BANCA DATI CLIENTI;
                BANCA DATI FORNITORI;
                                                                                      

   BANCA DATI DIPENDENTI

             SCHEDA RILEVAZIONE BANCHE DATIN. 01
Codice:                               BD01
Descrizione:                          BANCA DATI CLIENTI: In questa
                                      banca dati sono conservati i dati dei
                                      clienti.
Tipologia risorsa:                    [x]Archivio Elettronico
                                      [x] Archivio Cartaceo
                                      Nota:
Ubicazione                            Cartacea: in Segreteria
Banca Dati                            Elettronica: Segreteria
Incaricati della Raccolta             Dot. [TITOLARE]
Metodologia di Archiviazione
Elettronica:                          Applicativo Software

Risorse Hardware su cui è allocata:   PC01

               STRUMENTI E POLITICHE DI BACKUP
Dispositivo di backup:          [] Non esistente
                                [x] Si, presente
                                Note:
Frequenza di backup:                  [] Giornaliera
                                      [X]Settimanale
                                      [ ] Periodico
Incaricati del backup:                Dot. [TITOLARE]
Modalità Operative:                   Mensilmente viene effettuato un
                                      backup completo.
Supporti di backup:                   Pendrive
Etichettatura:                        Denominazione univoca cartella di
                                      destinazione
Luogo di conservazione:               Studio
Verifica backup:                      La verifica del backup è effettuata
                                      confrontandole dimensioni dei file
                                      di backup con le dimensioni dei file
                                      originali.


                                                                              

Analisi dei Rischi sulle Aree e sui Locali

Risorsa         Elemento di Rischio               Soglia                     Motivazione
                                                Individuata
Tutte     Accesso nei locali dove si svolge     Bassa         L’accesso allo studio è sempre controllato
          il trattamento (rapine, furti, atti                 durante il normale svolgimento
          vandalici)                                          dell’attività lavorativa.
Tutte     Allagamenti                           Bassa         Area non soggetta ad inondazioni o calamità
                                                              di questo tipo.
Tutte     Incendio                              Bassa         La sede è provvista di dispositivi
                                                              antincendio.
Tutte     Cortocircuito                         Bassa         La sede è provvista di impianti a norma.


                                                                                            

Analisi dei Rischi sulle Risorse Hardware

Risorsa         Elemento di         Soglia                           Motivazione
                  Rischio         Individuata

 Tutte     Uso non autorizzato     Bassa        L’utilizzo dell’hardware è soggetto all’utilizzo di
             dell’hardware                      credenziali d’accesso.


 Tutte    Manomissione/Sabot       Bassa        Alle risorse non accedono persone non autorizzate.
               aggio                            La manutenzione è effettuata da tecnici autorizzati.


 Tutte    Probabilità/Frequenz     Bassa        L’hardware acquistato è di qualità e non ha
              a di guasto                       mai dato problemi rilevanti.

 Tutte       Rischi connessi       Bassa        Gli elaboratori sono dotati di gruppo di continuità
              all’elettricità                   che fornisce energia di buona qualità
                                                (stabilizzazione) e impedisce
                                                l’improvvisa assenza di corrente elettrica.

 Tutte     Rischi connessi alla    Bassa        Sono previste procedure di backup settimanali su
           l'integrità e la                     supporti informatici e Hard-disk. Tutti i sistemi
           sicurezza dei dati                   informatici sono dotati di antivirus aggiornati e la
                                                scansione degli hard disk viene effettuata
                                                settimanalmente.
                                                La gestione dei dati informatici è soggetta ad
                                                accesso protetto da password con credenziali
                                                gestite dal Titolare dello studio odontoiatrico.
                                                Per i dati in formato cartaceo è prevista la loro
                                                digitalizzazione con conseguente trattamento come
                                                dati informatici o in alternativa produzione di copie
                                                fotostatiche da conservare in archivio separato.


                                                                                       

Analisi dei Rischi sulle Banche Dati

  Risorsa               Elemento di Rischio                    Soglia                     Motivazione
                                                             Individuata
Tutte             Accesso non autorizzato                 Bassa                  L’accesso alle risorse dati
                                                                                 informato elettronico avviene
                                                                                 solo tramite gli elaboratori
                                                                                 protetti dall’utilizzo di
                                                                                 credenziali d’accesso gestite
                                                                                 dal titolare
Tutte             Intrusione da parte di soggetti         Bassa                  Le risorse sono protette da
                  Estranei o non autorizzati al                                  Un idoneo firewall software.
                  trattamento dei dati
Tutte             Cancellazione non autorizzata di        Bassa                  L’accesso alle risorse dati in
                  dati/Manomissione di dati                                      formato elettronico avviene
                                                                                 solo tramite gli elaboratori
                                                                                 protetti dall’utilizzo di
                                                                                 credenziali d’accesso gestite
                                                                                 dal titolare e solo i diretti
                                                                                 incaricati.
Tutte             Perdita di dati                         Bassa                  Vengono effettuate copie
                                                                                 periodiche di backup delle
                                                                                 banche dati. I PC sono
                                                                                 dotati di Software Anti virus
                                                                                 costantemente aggiornato.

Misure di Sicurezza adottate

        Descrizione Misura                                 Criteri per la corretta applicazione
Custodia dei supporti                    I supporti che vengono utilizzati per l’attività di backup sono conservati in
                                          un cassetto/armadio con serratura custodite dal titolare
Integrità e la sicurezza dei dati        Sono previste procedure di backup settimanali su supporti informatici e su
                                         Hard-disk. Tutti i sistemi informati ci sono dotati di antivirus aggiornati e
                                         la scansione deglihard diskviene effettuata settimanalmente. Per i dati in
                                         formato cartaceo è prevista la loro digitalizzazione con conseguente
                                         trattamento o in alternativa produzione di copie fotostatiche da conservare
                                         in archivio separato.


Continuità dell’alimentazione elettrica Gli HD e le Pendrive dedicate ove sono contenute le banche dati sono
                                         collegati ad un gruppo di continuità che garantisce una stabilizzazione
                                         dell’energia elettrica erogata. Il gruppo garantisce inoltre una autonomia
                                         temporale di esercizio sufficiente a chiudere correttamente tutte le
                                         applicazioni e completare la procedura di spegnimento dell’elaboratore.
Verifica dell’esito del backup          Sistematicamente dopo aver fatto la copia di backup settimanale,
                                         l’incaricato ne testa il contenuto dei dati registrati verificando nel contesto
                                         l’integrità.
Dispositivi antincendio                 I locali sono dotati di estintori regolarmente mantenuti.


                                                                                                           

Raccolta, archiviazione e custodia di atti, documenti e supporti.
La politica di gestione dei dati sensibili dei pazienti ad oggi i è esclusivamente in formatto cartaceo.
Il PC è impiegato esclusivamente per la gestione del database degli apparecchi radiografici digitali, e
successivamente sarà implementato un sistema informatico per la gestione delle cartelle cliniche.
Per quanto concerne la raccolta, la custodia e l’archiviazione di atti, documenti e supporti diversi si è
provveduto a dotare lo studio di cassetti con serratura ed armadi chiudibili a chiave nei quali si deporranno i
documenti sanitari cartacei contenenti dati sensibili.
Le chiavi sono in possesso del [TITOLARE] in qualità di Titolare dello studio odontoiatrico.
Ad oggi non è presente personale dipendente né sono presenti collaboratori odontoiatri.
Nella futura eventualità di personale dipendente verranno date loro disposizioni, per iscritto, di accedere ai
soli dati personali, la cui conoscenza sia strettamente necessaria per adempiere ai compiti loro assegnati, e
nello specifico sarà loro prescritto di prelevare dagli archivi informatici i soli atti e documenti che vengono
loro affidati per lo svolgimento delle mansioni lavorative, che devono controllare e custodire, durante l’intero
ciclo necessario per lo svolgimento delle operazioni di trattamento, per poi restituirli all’archivio, al termine
di tale.
Per quanto concerne l’archiviazione elettronica dei dati sensibili dei pazienti, il [TITOLARE] in
qualità di Titolare dello studio odontoiatrico ha predisposto il software con livello di protezione agli accessi
garantito da password di accesso modificabili esclusivamente dal Titolare.
Gli impianti e le attrezzature, per la custodia e l’archiviazione di atti, documenti e supporti, con particolare
riferimento a quelli contenenti dati sensibili, di cui è dotato lo studio appaiono soddisfacenti, al fine di
garantire la necessaria sicurezza ai dati personali contenuti in tali atti, documenti e supporti.

Criteri e modalità di ripristino dei dati
Per fronteggiare le ipotesi in cui i dati siano colpiti da eventi che possano danneggiarli, o addirittura
distruggerli, vengono previsti criteri e modalità tali, da garantire il loro ripristino in termini ragionevoli, e
comunque entro una settimana per i dati sensibili.
I documenti cartacei, e gli eventuali supporti diversi da quelli elettronici, contenenti dati personali, vengono
fotocopiati.
I supporti contenenti le copie vengono archiviati in armadi chiusi a chiave.
Per i dati trattati con strumenti elettronici, sono previste procedure di backup, attraverso le quali viene
periodicamente effettuata una copia di tutti i dati presenti nel sistema, su dispositivi opportuni.
Il salvataggio dei dati trattati avviene come segue:
      la frequenza è settimanale;
      si utilizzano supporti differenti da quelli in cui sono contenuti i dati dei salvataggi eseguiti la volta
         precedente;
      per ciascun salvataggio, si esegue 1copia.

  Piano di Verifica delle Misure adottate
  Al [TITOLARE] è affidato il compito di aggiornare le misure di sicurezza, al fine di adottare
  gli strumenti e le conoscenze, resi disponibili dal progresso tecnico, che consentano di ridurre al minimo
  i rischi di distruzione o perdita, anche accidentale, dei dati, di accesso non autorizzato odi trattamento
  non consentito.
  Al fine di verificare l’efficacia delle misure di sicurezza adottate, il Titolare provvede con frequenza
  mensile, anche con controlli a campione, ad effettuare una o più delle seguenti attività:
        verificare l’accesso fisico ai locali dove si svolge il trattamento;
        verificare la correttezza delle procedure di archiviazione e custodia di atti, documenti e supporti
           contenenti dati personali;
        verificare l’integrità dei dati e delle loro copie di backup;
        verificare la sicurezza delle trasmissioni in rete;
        verificare che i supporti magnetici, che non possono più essere riutilizzati, vengano di strutti.

  Almeno ogni sei mesi, si procederà ad una sistematica verifica del corretto utilizzo delle parole chiave e dei
  profili di autorizzazione che consentono l’accesso agli strumenti elettronici.`,
  3: `Il presente documento definisce i criteri e le modalità operative applicate dallo Studio
Odontoiatrico nel pianificare, programmare e gestire le modalità per la valutazione e
ilmiglioramento della qualità delle prestazioni e dei servizi erogati, le attività di valutazione e
miglioramento del sistema di gestione per la qualità, ma anche e soprattutto per migliorare
continuamente l’efficacia del sistema stesso.
Quanto descritto in questo documento, infatti, è fondamentale per una organizzazione che:
   Ha l’esigenza di dimostrare la propria capacità di fornire prestazioni che ottemperino alle
    necessità dei pazienti;
   Considera l’accrescimento della soddisfazione del paziente un obbiettivo fondamentale che
    porta inevitabilmente ad una continua ricerca del miglioramento dell’efficacia del proprio
    sistema di gestione.
Lo Studio intende gestire il miglioramento continuo del proprio sistema di gestione per la
qualità, con riferimento a:
   Soddisfazione del paziente, come metodo efficace di rilevazione dell’efficacia del sistema di
    gestione;
   Verifiche interne, come metodo di rilevamento finalizzato a verificare che l’applicazione del
    sistema rispetti quanto pianificato, e che sia efficacemente attuato e costantemente
    aggiornato.
Lo Studio Odontoiatricomisura e analizza costantemente la soddisfazione dei pazienti al fine di
valutare se siano stati soddisfatti i requisiti da lui richiesti, essendo questo uno dei maggiori
rilevatori dell’efficacia della gestione del sistema per la qualità.
Lefontidiinformazionisullasoddisfazionedelpazientesono:
   Incontriconipazienti;
   I questionarisoddisfazione;
   Controllo delle non conformità rilevate in tutte le fasi di erogazione dei servizi e delle
    prestazioni;
   Gestione dei reclami provenienti dai pazienti relativamente alle prestazioni e ai serviziforniti
    al fine di migliorare il servizio offerto ed erogato;

   Incrementodelnumerodeipazienti.
I reclamie le comunicazioni dirette, e la loro registrazione, forniscono un’evidenza continua
dello stato di soddisfazione o insoddisfazione dei pazienti e sono costantemente monitoratedallo
Studio Odontoiatrico.
L’analisi delle risposte al questionario indica il grado di soddisfazione/insoddisfazione in fase di

                                                                                         

erogazione del servizio e delle prestazioni.

Le Verifiche Interne sono uno strumento di particolare efficacia per mantenere un adeguato
controllo sullo stato del Sistema Qualità adottato e vengono svolte in conformità ad un
programma interno delle verifiche”.
Nello Studio le verifiche vengono svolte con spirito costruttivo allo scopo di evidenziare ed
eliminare le carenze, nonché di sensibilizzare il personale interessato alle proprie responsabilità.
A tale scopo:
a) Il programmadelle verifichevienepredispostodaltitolare.
La frequenza delle Verifiche varia in relazione alla criticità dei processi da verificare e/o sulla
base dei riscontri delle Verifiche precedenti.
b) Le Verifiche vengono generalmente svolte dal Titolare dello Studio, che può avvalersi della
collaborazione di personale competente esterno o interno, nel settore da verificare, purché non
direttamente responsabile dell’aspetto da verificare.


Procedura:
b) Raccolta ed archiviazione tutta la documentazione oggetto della Verifica a seguito di
rilevamento di carenzeriscontrate su riscontro della clientela in merito ad organizzazione,
efficienza ed appropriatezza dei servizi resi
c) Predispone l’analisi dei processi da verificare;
d) Comunica al Personale interessato la data e gli obiettivi della Verifica con almeno 3 giorni di
preavviso;
e) Concorda con il Personale interessato un programma di risoluzione delle carenze (definendo
aspetti, metodiche e tempi di risoluzione);
f) Verifica la risoluzione delle carenze riscontrate nei tempi previsti;
g) Trasmissione copia della documentazione al Titolare ed aggiornamento eventuale della carta
dei servizi
Tuttiprocessidescrittivengonogestitiinotticadimiglioramentocontinuativo.
Il Titolare ha individuato nella gestione dei seguenti strumenti le opportunità di miglioramento
effettivo che possono essere individuati in:
     Riesame della direzione;
     Analisi dei risultati delle verifiche interne;
     Misurazioni dei processi/servizi e della soddisfazione dei pazienti;
     Rispetto della politica della qualità e degli obiettivi della qualità
                                                                                         

determinati.

Le Azioni Correttive possono attivarsi per:
-   Esitinegativi delle verifiche ispettive;
-   Riesami del sistema qualità;
-   ReclamideiPazienti;
-   Osservazioni non conformità dell’ente di controllo.
Le Azioni Preventive vengono intraprese qualora, analizzando i vari dati disponibili presso
l’Studio o provenienti dall’esterno, si individuino dalle situazioni a rischio che rendono
opportune delle attività di miglioramento o di prevenzione:
-   Reclamideipazienti;
-   Derogheoconcessioni;
-   Propostedimiglioramentodelpersonale(suggerimenti).`,
  4: `La presentazione di un reclamo da parte di un cittadino che utilizzerà i servizi dello studio è un
 segnale sulla possibile esistenza nel sistema aziendale di disfunzioni che possono avere la loro
 causa nell’organizzazione, nella struttura tecnica dei servizi, nei comportamenti del Personale.

 Ai fini del mantenimento dei più alti livelli di qualità del servizio, che costituisce l’obiettivo
 strategico dello Studio tale segnale è di importanza fondamentale perché consente di intervenire per
 l’eliminazione delle disfunzioni e di riportare ai livelli la qualità dei servizi.

 Lo Studio si doterà di una procedura formalizzata per la trattazione dei reclami che mira non
 soltanto alla risoluzione del problema posto in evidenza ma anche ad agire come importante
 informazione di ritorno sull’efficacia ed efficienza del sistema qualità dell’azienda.

 I cittadini utenti possono presentare eventuali reclami per disservizi subiti prima, durante e dopo
 l'esecuzione delle prestazioni erogate dal Centro; il reclamo può essere inoltrato con le seguenti
 modalità:

        per iscritto, utilizzando il modulo predisposto disponibile presso l'ufficio di accettazione;
        per iscritto su carta semplice o a mezzo mail;
        verbalmente rivolgendosi al Personale in servizio presso Lo Studio.

Il [TITOLARE] titolare dello Studio fornirà una risposta a tutti i reclami entro il termine
massimo di 8giorni.

Si allega il modello che sarà utilizzato dello studio:

Gentile Signora/Gentile Signore
      Il questionario a cui Lei, se vorrà, potrà rispondere è formulato in forma anonima con lo scopo
 di conoscere il grado di soddisfazione per le prestazioni e i servizi erogati da questo studio.
      Le Sue risposte e gli eventuali suggerimenti serviranno a migliorare il livello delle prestazioni
 dei servizi. È sufficiente che sbarri con una croce la risposta che ritiene più giusta.

 1. Come valuta l’ubicazione dell’ambulatorio per facilità di accesso, raggiungimento, e presenza di
       ostacoli?
      Buona               Sufficiente               Insufficiente           Scarsa

 2.   Come giudica il sistema di prenotazione?
      Buono               Sufficiente                Insufficiente          Scarso

 3.   Come giudica il sistema di accoglienza?
      Buono               Sufficiente                Insufficiente          Scarso
 4.   Come giudica il sistema di accettazione?
      Buono               Sufficiente                Insufficiente          Scarso
 5.   Come giudica la prestazione sanitaria?
      Buona               Sufficiente               Insufficiente           Scarsa
 6.   Come valuta la disponibilità del front-office e l’atteggiamento mostrato nel venire in contro alle
        sue esigenze?
      Buona               Sufficiente               Insufficiente           Scarsa
 7. Comevalutanelsuoinsiemetuttoilpercorsodallarichiestadelsuomedicoall’esecuzionedellaprestazione?
      Buono               Sufficiente                Insufficiente          Scarso

      Qualora avesse dei suggerimenti da proporre, La invitiamo a scriverle nello spazio sottostante.


                                                                       Grazie per la collaborazione
                                                                             LA DIREZIONE


      P.S. Dopo aver debitamente compilato questo stampato, affinché il tutto avvenga in modo
      anonimo, La invitiamo a depositarlo presso la segreteria in apposito contenitore.

Lo studio Odontoiatrico è in fase di apertura, pertanto si prevede che a seguito della apertura può
 essere che sarà designato formalmente un referente per i rapporti con il pubblico individuabile con la
 figura di:

       Addetto alla Segreteria (attualmente non presente)

 Sino ad allora l’incarico sarà coperto direttamente dal Titolare dello Studio.


Tutto il personale (eventuali dipendenti e/o collaboratori esterni) sarà formato ed informato sulla
gestione dei reclami, osservazioni e/o suggerimenti. Le schede di valutazione da parte del pubblico
saranno disponibili in sala di attesa e si predisporranno a campione delle interviste ai pazienti ed ai
loro familiari.
Nello specifico si terrà una riunione interna per la presentazione del modello indicante la gestione di
eventuali reclami, osservazioni e suggerimenti

STUDIO ODONTOIATRICO
 [TITOLARE]
    Sito in [INDIRIZZO]


Documento 5
Documento/procedura che descrive
le modalità di erogazione
dell’assistenza.


Cod. Requisito
1A.02.02.01


[TITOLARE]

La presente procedura ha lo scopo di descrivere in modo chiaro e uniforme le modalità di
 erogazione dell’assistenza odontoiatrica presso lo Studio del [TITOLARE], garantendo
 qualità, sicurezza del paziente e conformità alle normative vigenti (D.Lgs. 81/08, GDPR, normative
 sanitarie regionali, Linee guida Ministero della Salute).

 1. Campo di applicazione
 La procedura si applica a tutte le attività cliniche e assistenziali erogate all’interno dello studio
 odontoiatrico, comprese:

      Visite odontoiatriche e diagnostiche
      Trattamenti terapeutici e chirurgici
      Prestazioni igienico - preventive
      Gestione delle urgenze odontoiatriche

 2. Riferimenti normativi

      D.Lgs. 81/2008 – Sicurezza nei luoghi di lavoro
      Regolamento UE 2016/679 (GDPR) – Protezione dei dati personali
      Linee guida del Ministero della Salute per la sicurezza del paziente odontoiatrico
      Codice Deontologico degli Odontoiatri

3. Responsabilità

      Titolare: supervisione generale del processo assistenziale, esecuzione delle prestazioni cliniche,
       diagnosi, trattamento, consenso informato, gestione strumenti, disinfezione e sterilizzazione,
       gestione accettazione, anagrafica, appuntamenti, privacy.

4. Descrizione della procedura

4.1 Accoglienza e accettazione del paziente

   1. Il paziente viene accolto dal titolare dello studio o da eventuale personale amministrativo,
   2. Vengono registrati i dati anagrafici e acquisiti i consensi informati (privacy e trattamento
      sanitario).
   3. Viene fissato o confermato l’appuntamento con l’odontoiatra.

4.2 Valutazione clinica e piano di trattamento

   1. L’odontoiatra effettua l’anamnesi generale e odontoiatrica.
   2. Si procede con l’esaminare il paziente.
   3. Viene elaborato un piano di trattamento personalizzato, discusso e approvato dal paziente
      mediante consenso informato scritto.

4.3 Erogazione della prestazione odontoiatrica

   1. Il titolare, verificando pulizia, sterilità e funzionamento delle attrezzature.
   2. L’odontoiatra esegue la prestazione secondo protocolli clinici e linee guida.
   3. Durante la seduta vengono rispettate le procedure di sicurezza e prevenzione del rischio
      biologico (uso DPI, gestione rifiuti sanitari, disinfezione).
   4. Al termine, il titolare provvede alla detersione, disinfezione e sterilizzazione degli strumenti
      utilizzati.

4.4 Follow-up e monitoraggio

   1. Al termine della prestazione, vengono fornite al paziente le indicazioni post-operatorie o di
      mantenimento.
   2. si pianifica eventuali controlli successivi.
   3. Tutti i dati clinici vengono registrati nella cartella odontoiatrica elettronica o cartacea.

5. Gestione delle urgenze

Le urgenze odontoiatriche vengono gestite con priorità.

   1. Il paziente viene identificato e valutato rapidamente.
   2. L’odontoiatra stabilisce la priorità e la tipologia di intervento.
   3. Dopo la prestazione, viene programmato il follow-up per la risoluzione definitiva.

6. Sicurezza e igiene

      Tutti gli ambienti vengono sanificati secondo protocolli giornalieri e tra un paziente e l’altro.
      Gli strumenti vengono sterilizzati in autoclave e tracciati mediante sistema di controllo.
      Vengono rispettati i protocolli di prevenzione del rischio infettivo (HBV, HCV, HIV, COVID-
       19, ecc.).

7. Documentazione e registrazioni

Le seguenti registrazioni devono essere mantenute:

      Schede anagrafiche e cliniche dei pazienti
      Consensi informati
      Registri di sterilizzazione
      Piani di manutenzione apparecchiature
      Registro smaltimento rifiuti sanitari

8. Miglioramento continuo

Il Direttore Sanitario valuta periodicamente:

      Soddisfazione del paziente
      Non conformità e segnalazioni
      Aggiornamenti scientifici e normativi
      Necessità di formazione del personale

Eventuali azioni correttive o preventive vengono pianificate e documentate.

Mensilmente è prevista la revisione di una tabella riepilogativa contenente i disservizi riscontrati
all’interno dello studio odontoiatrico, al fine di effettuare un’analisi statistica degli stessi, finalizzata
alla predisposizione di eventuali azioni di indagine e intervento.

               DESCRIZIONE                     MESE         Numero di          Rispetto al mese precedente
                                                              eventi        Diminuiti      Inalterati Aumentati
     Disservizi dovuti a fuori uso
              attrezzature
Ritardi erogazione prestazioni
    dovute a indisponibilità
      personale di studio
Appuntamenti non rispettati da
parte del pubblico giustificati
   Appuntamenti non rispettati per
   insufficiente comunicazione e/o
 chiarezza da parte della segreteria
 Disservizi dovuti a guasti impianti
           Disservizi dovuti a
          guasti/indisponibilità
           sistema informatico`,
  6: `PIANO PER LA GESTIONE
                           DELLE
                        EMERGENZA
                               Ultima revisione: _____________2025


Datore di Lavoro                          TERESI FRANCESCO

R.L.S.                                    _______________


Addetto all’antincendio ed emergenze      TERESI FRANCESCO


                                              1

Il presente Piano di Emergenza si basa su istruzioni scritte e chiare, ed è rivolto a tutte le persone
presenti all’interno dei locali indicati.
Al suo interno sono definite specifiche funzioni e responsabilità, assegnate al personale strutturato
con      ruolo      attivo      nella     gestione  e    nel      contenimento       dell’emergenza.
L’organizzazione interna è regolamentata secondo lo schema riportato di seguito.


Responsabile dell’emergenza: TERESI FRANCESCO

Responsabile delle chiamate: TERESI FRANCESCO


                                      ATTENZIONE
      Chiunque appartenga alla Squadra d’Emergenza o ricopra un ruolo importante per
                     l’attuazione di Questo PIANO D’EMERGENZA

                                     NONDIMENTICHIche:

  NON DEVE combattere il fuoco al di sopra delle sue possibilità
  DEVE preoccuparsi di tenersi sempre libera una via di fuga
  AL PRIMO segnale di malessere deve portarsi FUORI dalla zona di pericolo
  DEVE raggiungere gli altri al luogo di ritrovo sicuro e, SE POSSIBILE,
   attribuisca ad un altro i suoi incarichi preoccupandosi come PRIMA COSA di
   se stesso.

                                NUMERI TELEFONICI UTILI

  SOCCORSOPUBBLICO:                                                          113

  CARABINIERI:                                                               112

  VIGILIDELFUOCO:                                                            115

  EMERGENZASANITARIA:                                                        118


                                                2

PREMESSA
La presente relazione è stata redatta in base al D.M. 03/07/2021 “Decreto Mini codice” in attuazione
al disposto dell’art. 46 del D. Lgs. 81/08 smi relativo ai criteri divalutazione dei rischi di incendio nei
luoghi di lavoro ed in genere delle emergenze emisure di prevenzione e protezione da adottare, al fine
di definire le misureorganizzative e gestionali da attuare.
Scopo di questo “Piano di emergenza” è quello di fornire semplici informazioni suicomportamenti da
adottare in caso di emergenza. In esso s’individuano i possibiliscenari incidentali nonché, tutte quelle
azioni e procedure che devono attuarsi inconseguenza dell’evento sinistrorso.
Per “emergenza” s’intende il verificarsi di una situazione di pericolo, che puòcoinvolgere persone
e/o cose, arrecando danni.
Obbligo del datore di lavoro, secondo quanto previsto dall’Art. 18 del D.Lgs. 81/08, nonché dal
decreto di attuazione D.M. 03/07/2021 “Decreto Minicodice”, rimane:

1) attuare e rendere operativi tutti i necessari rapporti con i servizi pubblicicompetenti in materia di
pronto soccorso, salvataggio, lotta antincendio egestione dell’emergenza;
2) nominare, tra il personale, coloro che in caso di emergenza abbiano il compito diattuare le idonee
misure di prevenzione incendi e lotta antincendio, dievacuazione in caso di pericolo grave ed
immediato, di salvataggio, di prontosoccorso e, comunque di gestione dell’emergenza;
3) rendere edotti, tutti coloro che possono essere esposti ad un pericolo grave edimmediato circa le
misure predisposte ed i comportamenti da adottare;
4) in caso di pericolo grave ed immediato, pianificare e programmare in formapreventiva ogni
intervento,     affinché      tutti    possano      cessare     ordinatamente      leproprie    attività,
abbandonandoimmediatamente il luogo di lavoro, verso aree sicure.

Questo Piano di Emergenza, deve essere portato a conoscenza di tutti coloro i qualihanno un ruolo
attivo ai fine dell’attuazione dello stesso, pertanto esso sarà oggetto di riunioni periodiche
propedeutiche alla sua promulgazione e diffusione al personale.
Deve inoltre essere facilmente fruibile per essere consultato da chiunque n’abbiainteresse alla sua
attuazione, oltre ad essere reso disponibile agli organismi di controlloe vigilanza.
Questo elaborato non ha scadenza, ma deve essere necessariamente aggiornato.
Ogni qualvolta vi siano variazioni sostanziali tali da non renderlo più attuale.

Caratteristiche degli ambienti di lavoro:
            TIPO ATTIVITA’                   Studio odontoiatrico
       CLASSE DI RISCHIO INCENDIO            Bassa
        DURATA CORSO ADDETTI                 4 ore con aggiornamento quinquennale di 2 ore
             ANTINCENDIO
               ESTINTORI                     N.3 aCO2da5kg
              VIE DI ESODO                  Su luoghi sicuri all’esterno. Idonee al massimo
                                            Affollamento ipotizzabile – max percorrenza <1min
        NUMERO DI LAVORATORI E              Collaboratori oltre il pubblico (circa 3 persone)
           PERSONE PRESENTI
      LAVORATORI ESPOSTI A RISCHI            Nessuno
              PARTICOLARI
       ADDETTI ALLA PREVENZIONE              TERESI FRANCESCO
     INCENDI, ED ALLA EVACUAZIONE
        ADDETTI ALLE EMERGENZE               TERESI FRANCESCO
    ADDETTI AL PRIMO SOCCORSO                TERESI FRANCESCO


                                                  3

Scopo del piano

Il presente Piano di Emergenza ed Evacuazione (PEE) ha lo scopo di definire le procedure e i
comportamenti da adottare in caso di emergenza (incendio, fuga di gas, terremoto, malore, ecc.)
all’interno dello studio odontoiatrico, al fine di:

      Salvaguardare la vita e la salute delle persone presenti;
      Limitare i danni alle strutture, alle apparecchiature e ai materiali;
      Garantire un’evacuazione ordinata, rapida e sicura;
      Agevolare l’intervento dei soccorsi esterni.

Campo di applicazione

Il piano si applica a tutti i locali dello studio odontoiatrico, compresi:

      Sale operative e di sterilizzazione
      Sala d’attesa
      Uffici
      Servizi igienici e locali tecnici

Riferimenti normativi

      D.Lgs. 81/2008 – Sicurezza nei luoghi di lavoro
      D.M. 10/03/1998 – Criteri generali di sicurezza antincendio nei luoghi di lavoro
      D.M. 02/09/2021 – Criteri per la gestione dei luoghi di lavoro in esercizio e in emergenza

Identificazione dei rischi di emergenza

I principali rischi che possono richiedere l’attuazione del presente piano sono:

      Incendio o principio d’incendio
      Fuga di gas o sostanze chimiche (es. disinfettanti, ossigeno, anestetici)
      Corto circuito o guasti elettrici
      Evento sismico
      Malore o infortunio grave di pazienti o operatori
      Minaccia esterna o evento imprevisto (es. allagamento, vandalismo, blackout)

Mezzi e presidi antincendio presenti

      Estintori a CO₂ e/o polvere (uno ogni 150 m² o 30 m di percorso)
      Segnaletica di sicurezza conforme D.Lgs. 81/08
      Illuminazione di emergenza automatica
      Cassette di pronto soccorso e presidi sanitari
      Planimetria di evacuazione affissa in punti visibili.


                                                   4

1. SORVEGLIANZA E CONTROLLO DELLE ATTREZZATURE E DEI SISTEMI DI
SICUREZZA
I sistemi, i dispositivi, le attrezzature e gli impianti necessitano di una corretta gestione
emanutenzione.
Per gestione s’intende l’insieme delle operazioni atte a garantire nel tempo un grado diaffidabilità
sufficiente per il corretto funzionamento in caso di situazioni di emergenza.In particolare, nella
gestione antincendio un’importanza fondamentale riveste lamanutenzione, oltre ad un’attenta attività
di controllo e verifica riguardante:

 Estintori;
 Uscite di sicurezza;
 Luci di emergenza;
 Pulsanti di sganci o corrente elettrica;
 Pulsanti di allarme;
 Dispositivi di protezione individuali antincendio


Inoltre devono essere tenute sotto costante controllo i seguenti dispositivi:

 Segnaletica di emergenza;
 Agibilità delle vie di fuga;
 Materiale di primo soccorso;
 Dispositivi di protezione individuale;
 Stoccaggio prodotti chimici;
 Igiene degli impianti elettrici;
 Ordine generale.

2 CLASSIFICAZIONE DELLE EMERGENZE
Si definisce emergenza, un fatto anormale che può costituire fonte di grave pericoloper il personale o
per gli impianti.
Le principali situazione di pericolo sono:
     Incendio
     Esplosione
     Allagamenti dovuti alla rottura di impianti
     Mancanza di energia elettrica
     Persona in grave pericolo
     Infortunio grave
     Eventi naturali (alluvioni, terremoti,)

Nel seguito di questo documento, saranno esaminate le situazioni che s’intendono dipericolo
maggiore, poiché potenzialmente ad elevato rischio (incendio, allagamento, fughe di gas, terremoto).


                                                      5

L’efficace gestione della situazione di emergenza, non può prescindere dallacomprensione e dalla
natura dell’emergenza stessa. Per questo motivo, in genere, risulta utile classificare le emergenze come
segue:

A) Emergenza di livello lieve
L’emergenza può essere affrontata e controllata dal personale preposto, nonrichiede l’intervento della
forza pubblica.

B) Emergenza di livello medio
L’emergenza è ancora affrontabile come nel caso precedente, ma con undispiego di “forze interne”
notevoli. E’ opportuno in questo caso, avvisare le forzepubbliche di pronto intervento (Vigili del
Fuoco, Carabinieri). Tale preavviso è fondamentale nel caso in cui si perda il controllo delle
situazioni.

C) Emergenza di livello grave
Questo tipo di emergenza deve essere affrontata esclusivamente mediante l’intervento delle forze
pubbliche di pronto intervento.

3. FIGURE RESPONSABILI PER L’ESECUZIONE DELLE MISURE DI SICUREZZA
Di fronte ad una situazione riconosciuta “di emergenza”, alcuni membri del personale sono eletti e
designati come elementi facenti parte della “Squadra di Emergenza”.
Ogni figura della Squadra di Emergenza, dovrà conoscere perfettamente il proprio ruolo e compito
durante l’evento.
Ogni elemento avrà, tra gli altri, il principale compito di invitare il resto del personale presente a
tenere la calma: questo fattore è determinante al fine di garantire un ordinato svolgimento delle
operazioni previste da questo piano di emergenza.
Deve pertanto provvedersi preventivamente, alla nomina delle seguenti figure:
     Responsabile emergenza
     Responsabile chiamate
     Addetti antincendio
(che abbiano seguito con profitto un corso di formazione ai sensi del T.U. 81/08 e delD.M. 10/03/98).
     Addetti primo soccorso
(che abbiano seguito con profitto un corso di formazione ai sensi del T.U. 81/08 e delDecreto
Interministeriale in materia di pronto soccorso in azienda)
Gli elementi della Squadra, devono essere coadiuvati da sostituti che, in caso di loro assenza, sono
preposti allo svolgimento delle citate procedure in caso emergenza.

3.1 RESPONSABILE DELL’EMERGENZA E PROCEDURE DA SEGUIRE IN STATO DI
NONEMERGENZA
Il Responsabile dell’Emergenza è la figura incaricata alla gestione dell’emergenza.
Il Responsabile dell’Emergenza o il suo sostituto, avrà pertanto il compito di gestirel’evolversi
dell’intera emergenza. Sarà compito di questa figura, proclamare lo stato diinizio emergenza e di fine
emergenza, l’ordine di evacuazione, ecc
Se nel corso dell’emergenza sono presenti sia il responsabile designato, che il suosostituto, entrambi
collaboreranno al coordinamento delle procedure prescritte.
In caso di assenza contemporanea del responsabile designato e del suo sostituto, l’eventuale
situazione di emergenza, viene condotta da un addetto antincendio.


                                                 6

Nell’ambito dello svolgimento delle proprie mansioni, l’attività dei facenti parte dellasquadra addetta
all’emergenza, non si limita solo esclusivamente durante le fasi di unmalaugurato evento sinistro,
bensì si prolunga nel tempo sottoforma di prevenzione.

Durante il normale svolgimento dell’attività lavorativa, ossia in condizione di NONEMERGENZA, il
Responsabile dell’Emergenza ha il compito di:
a) vigilare sulla praticabilità delle vie di esodo;
b) verificare periodicamente la completezza degli organici preposti all’emergenza;
c) verificare periodicamente il “livello di addestramento del personale”;
d) organizzare le simulazioni relative all’emanazione di emergenza;
e) collaborare con il Servizio di Prevenzione e Protezione;
f) informare chi ha redatto il Piano di Emergenza di qualsiasi variazione strutturale ed organizzativa
che possa alterare le condizioni di sicurezza previste nello stesso;
g) presiedere ed organizzare le periodiche riunioni sulla sicurezza.

Per una corretta gestione dell’emergenza, QUOTIDIANAMENTE, è necessario che egliconosca
perfettamente il numero del personale presente.
E’pertanto opportuno rendere disponibile un registro aggiornato, dove si riportanogiornalmente i
lavoratori presenti.

3.2 RESPONSABILE CHIAMATE E PROCEDURE DA SEGUIRE IN STATO DI NON
EMERGENZA
Il Responsabile Chiamate rappresenta l’elemento all’interno dell’azienda, che ha ilcompito di
effettuare le chiamate telefoniche in caso di emergenza.
Egli comunica i preposti al soccorso; fornendo loro tutte le informazioni sulla emergenzacomunicate
dai Responsabili e/o Addetti.
Periodicamente aggiorna e verifica l’elenco dei numeri telefonici d’emergenza, comunicando le
variazioni alla squadra di emergenza.

3.3 ADDETTI ANTINCENDIO E PROCEDURE DA SEGUIRE IN STATO DI NON
EMERGENZA
Collaborano con le squadre dei VV.FF. durante la fase di emergenza; in particolaremodo deve sapere
dare informazioni su:
     l’esatta ubicazione dei presidi antincendio e di emergenza,
     la locazione quadri elettrici generali e secondare,
     l’eventuale presenza di linee sotto tensione, attivate da sistemi di generazionesecondari o
        tampone,
     possibili cause generatrici dell’incendio,
     eventuale tipologie di materiali stoccati al momento del sinistro.

In stato di NON EMERGENZA, gli addetti antincendio hanno il compito di:
a) controllare periodicamente (almeno una volta al mese) l’efficienza dei presidiantincendio:
         carica degli estintori;
         controllo della fruibilità dei percorsi di esodo;
         controllo e verifica dell’impianto di illuminazione d’emergenza;
b) segnalare a chiunque la presenza dei divieti vigenti (ad esempio “VietatoFumare”);
c) assicurarsi che le vie di esodo, le uscite di emergenza, i presidi antincendio e diemergenza, siano
sempre tenuti sgombri ed accessibili.
Uso corretto e manutenzione della cartellonistica di emergenza


                                                7

I cartelli ed i dispositivi segnaletici devono essere:
     posizionati appropriatamente e non coperti da ostacoli, in rapporto all'obiettivo
     bene illuminati ed in caso di cattiva illuminazione a colori fosforescenti,rifrangenti o ad
         illuminazione artificiale
     rimossi se non più necessari
     controllati, riparati, se necessario sostituiti, sottoposti a manutenzione affinché conservino le
         loro proprietà intrinseche; bisogna prevedere una periodicità neicontrolli per quelli alimentati
         da una fonte di energia
     garantiti da una alimentazione di emergenza se funzionanti a mezzo di fonte di energia in
         numero adeguato; non esiste un numero preciso se non in funzione dei rischie dell’area da
         coprire.

Incompatibilità:
    Non utilizzare contemporaneamente due segnali luminosi che possano confondersi.
    Non utilizzare un segnale luminoso nelle vicinanze di un’altra emissione luminosa poco
      distinta.
    Non utilizzare contemporaneamente due segnali sonori.
    Non utilizzare un segnale sonoro se il rumore di fondo è troppo intenso.

Marcatura:
La segnaletica di sicurezza non richiede o prevede nessun tipo di marcatura checonfermi la
conformità a qualsiasi standard nazionale o estero relativo allecaratteristiche sopra elencate.
Restano obbligatorie tutte le marcature previste per dispositivi sottoposti anormative diverse da quelle
citate e che si riferiscono alle caratteristiche intrinseche del prodotto (bassa tensione, compatibilità
elettromagnetica, bande di frequenza oper zone a rischio di esplosione).

3.4 ADDETTI PRONTO SOCCORSO E PROCEDURE DA SEGUIRE IN STATO DI NON
IN EMERGENZA.
Sono i responsabili delle operazioni di primo soccorso, intervengono sui feriti in attesa del personale
medico esterno.
Sono a conoscenza della esatta ubicazione delle cassette sanitarie e possono, in caso di incidente, fare
intervenire il locale presidio ospedaliero (118 “EMERGENZA SANITARIA”).
Essi hanno inoltre il compito di verificare periodicamente l’efficienza e la completezza delle cassette
sanitarie.

4. PROCEDURE OPERATIVE PIANO DI EMERGENZA
Nei paragrafi che seguono, sono riportate le riportate le procedure di caratteregenerale da rispettare
durante le possibili situazioni di emergenza.
Le norme comportamentali e le procedure che vengono esposte, sono valide sia per iresponsabili ed
addetti che per tutto il personale presente nei locali della sede.
Nello schema presente, a semplice titolo illustrativo, è possibile. Osservare le fasi chegeneralmente
caratterizzano una situazione di allarme, dovuto al propagarsi di unincendio: si osservi in particolare,
la necessità di dovere completare la fase dievacuazione della struttura interessata all’evento, entro i
tempi di estensione “generalizzata dell’incendio (flash over). Se la fase di evacuazione si protrae in
talefase, le conseguenze in termini di vite umane, possono essere disastrose. Si percepiscepertanto
l’importanza assoluta della tempestiva segnalazione e localizzazione delfuoco, succeduta
dall’immediata evacuazione.
Leggete attentamente le seguenti:


                                                 8

NORME DI PREVENZIONE
Familiarizzate con le seguenti procedure di prevenzione e protezione:
   Localizzate vie di fuga e uscite di emergenza;
   Osservate la posizione di pulsanti di emergenza, estintori e cassette di Primo Soccorso;
   Ponete in evidenza i numeri telefonici di emergenza;
   Non ostruite le vie di fuga o le uscite di emergenza;
   Leggete e rispettate quanto riportato nelle cartellonistica esposta;
   Tenete in ordine il vostro luogo di lavoro in modo tale che non possa rappresentare fonte di
      rischio;
   NON FUMATE né usate fiamme libere di alcun tipo dove vi è pericolo di incendio;
   Disponete i materiali facilmente infiammabili lontani da ogni possibile fonte di calore;
   Gettate i fiammiferi e i mozziconi di sigaretta negli appositi cestini solo DOPO esservi
      ATTENTAMENTE assicurati che siano spenti;
   NON sovraccaricate le prese di corrente;
   Quando possibile spegnete le apparecchiature elettriche al termine della giornata;
   Segnalate sempre tempestivamente il cattivo stato di apparecchiature elettriche o di prese di
      corrente;
   Segnalate sempre tempestivamente ai Responsabili principi di incendio o piccoli incidenti
      accaduti, anche quando vi sembrano trascurabili.


FASI IN CUI SI PROPAGA UN INCENDIO


                                              9

4.1 SEGNALAZIONE DELL’EMERGENZA
La gestione di una situazione di emergenza è compito esclusivo della squadra di emergenza.
Una volta accertata la gravità dell’evento, se opportuno, la squadra di emergenza procede alla
gestione dell’eventuale evacuazione.
I membri della Squadra di Emergenza, hanno il compito di comunicare a TUTTO IL PERSONALE
presente, il sancito ORDINE DI EVACUAZIONE.

Il livello di Emergenza che si prospetta, STABILITO DAL RESPONSABILE
DELL’EMERGENZA determina il tipo di comportamento e di approccio all’evento, discriminando
tra icomportamenti da adottare in ogni diversa circostanza, in particolare si devericonoscere:
      Emergenza di livello lieve
Evento di modesta entità, ad esempio piccolo incendio, da fronteggiare con ilpersonale della
“Squadra di emergenza” senza prevedere l’evacuazione deipresenti.
      Emergenza di livello medio
Evento di media entità in cui deve essere evacuata parte della struttura, ed in cuioccorre un notevole
dispiego di forze interne; avvisare in questo caso le forzepubbliche di pronto intervento.
      Emergenza di livello grave
Evento grave in cui è necessario evacuare l’intera struttura. Deve essere richiesto immediatamente
l’intervento delle forze pubbliche.

In caso di evacuazione, è necessario:
    1. Dirigersi immediatamente verso le vie di esodo consigliate e/o più vicine, senza correre;
    2. Abbandonare effetti personali o documenti.
    3. Non perdere tempo nell’aspettare colleghi o amici.
    4. Se eventuali visitatori non sono già stati presi in consegna da elementi dellasquadra di
       emergenza, condurli con se verso l’uscita di emergenza.
    5. Raggiunto il punto di raccolta prestabilito, detto “Punto di Riunione”, restare in tale area fino
       al termine dell’emergenza o fino a nuovo ordine da parte della squadra diemergenza.
    6. Non sostare in aree dove sono installati mezzi di emergenza/antincendio e nonintralciare in
       nessun modo il lavoro delle forza di emergenza.
    7. Tenere un comportamento ordinato, che non induca al panico se stessi ed il restodel personale.

4.3 PROCEDURE PER IL RESPONSABILE DELL’EMERGENZA                                           DURANTE
L’EMERGENZA
È compito del Responsabile dell’Emergenza:
    1. Stabilire la natura dell’emergenza, optando per emergenza di livello:
     Lieve
     Medio
     Grave

    2. Decidere se fare intervenire la squadra antincendio (se si tratta di incendio modesto).
    3. Contattare telefonicamente (attraverso il Responsabile chiamate ed eventualmente anche
       personalmente) gli Enti pubblici di Pronto Intervento, comunicando la natura dell’emergenza
       (VV.F.F. tel. 115, Carabinieri Tel. 112, Soccorso Sanitario 118).
    4. Decidere se dare il l’Ordine di Evacuazione.
    5. Coordinare gli Addetti antincendio, premurandosi di:
    togliere tensione elettrica all’impianto (localizzare dalle planimetrie il quadroelettrico
       generale);


                                                 10

   verificare che l’illuminazione di emergenza, sia entrata in funzione.

    6. Dirigere e coordinare, l’abbandono degli occupanti i locali attraverso le prefissatevie di fuga
       secondo i percorsi indicati in planimetria.
    7. Organizzare, qualora necessario, percorsi di fuga alternativi.
    8. In caso di evacuazione di portatori di handicap attenersi a quanto esposto nelparagrafo 4.8.
    9. Provvedere all’appello nominale, attraverso il registro delle presenze, una voltaraggiunto il
        PUNTO DI RACCOLTA. Qualora del personale risultasse assenteall’appello, accertatosi
        dell’attendibilità della lista presenze, informare le squadre disoccorso (interne ed esterne) per
        iniziare la loro ricerca.

4.4 PROCEDURE PER IL RESPONSABILE CHIAMATE DURANTE EMERGENZA
È compito del responsabile delle chiamate:
1) Informare gli Enti Pubblici preposti al soccorso (secondo lo schema di seguitoallegato), seguendo
le indicazione del Responsabile emergenza e/o degli Addettiantincendio.
Il contenuto del messaggio telefonico deve essere breve e esaustivo nei confrontidelle domande che
vengono poste, esempio:

VIGILI DEL FUOCO 115
Sono il sig. . . . . . . . . , responsabile delle chiamate dello
STUDIO ODONTOIATRICO DEL DOTT, TERESI FRANCESCO
Via Ammiraglio Gravina n 9 Villabate
E’ in corso una situazione di emergenza a causa di un . . . . .. . (incendio, esplosione, dissesto,
crollo, ect) /
All’interno dei locali interessati all’incidente, sono presenti. . . . . . . . .persone /
Sono presenti un numero di …… feriti, di cui ……..gravi/
L’area interessata dall’evento è un . . . . .(area limitata, intero piano, ect)

Seguire le disposizioni impartite dal Responsabile dell’Emergenza, tenendo informato il responsabile
dell’emergenza.

4.5 PROCEDURE PER GLI ADDETTI ANTINCENDIO DURANTE EMERGENZA
È compito della Squadra Antincendio:
1) Raggiungere il quadro generale, interrompendo l’erogazione di energia elettrica nella zona
interessata dall’emergenza.
2) In caso di incendio, riconoscere la causa dell’incendio, agire prontamente sul principio d’incendio
con i mezzi di estinzione più idoneo al caso (mobili, semimobili o fissi).
3) In caso di evacuazione, togliere tensione all’intera sede agendo sull’interruttore generale.
4) In caso di perdite di acqua, provvedere alla chiusura delle valvole di intercettazione. In caso di
impossibilità della manovra, informare il responsabile delle chiamate, il quale contattare il il
Comando Provinciale dei VV.F.F.
5) Agire prontamente su un principio d’incendio con i mezzi di estinzione in dotazione: non usare
mai acqua su apparecchiature elettriche ancora sotto tensione, ne estintori a base di acqua
(SCHIUMOGENI).
6) In caso di terremoto, appena terminato il movimento tellurico provvedere a chiudere le adduzioni
di acqua e gas.
7) Qualora si presenti il caso di individuo in fiamme:


                                                 11

- Invitare alla calma, bloccando con decisione l’individuo, provvedendo adattaccare le fiamme
soffocandole mediante coperte (preferibilmente inumidite) o mediante qualsiasi altro indumenti;
- inondare l’individuo con acqua;
- se non è possibile il rapido reperimento di coperte, qualsiasi abiti o indumenti, fare rotolare per terra
la persona coinvolta;
- L’utilizzo dell’estintore è ammesso, solo se trattasi di ESTINTORE A POLVERE (evitando di
dirigere il getto verso parti del corpo scoperte), non usare maiestintori caricati a CO2. (se presenti)
8) Coordinare l’ordinato sgombero dei locali.
9) Invitare il personale presente a proteggere le vie respiratorie con fazzolettiinumiditi, qualora le vie
di fuga risultassero pervase dal fumo.
10) In attesa dell’arrivo dei soccorritori effettuare una rapida ricognizione peraccertare la presenza di
persone all’interno dei locali (in particolare servizi, localiaccessori, etc.).
11) Informare i soccorritori sull’esatta ubicazione dei presidi antincendio ed indirizzarlisul particolare
tipo di incidente.

4.6 PROCEDURE PER GLI ADDETTI PRIMO SOCCORSO DURANTE L’EMERGENZA
È compito degli addetti al primo soccorso:
1. Richiedere, d’accordo con il responsabile dell’emergenza, l’intervento del personale medico (118
“EMERGENZA SANITARIA”).
2. Invitare alla calma gli eventuali feriti, prestando i primi medicamenti, in attesa del personale
  medico esterno.
3. Informare il personale medico esterno del tipo di evento subito dagli infortunati, precisando i
medicamenti già adoperati sugli stessi (bendaggi di fortuna, medicinali, ect)

4.7 PROCEDURE COMPORTAMENTALI PER TUTTO IL PERSONALE DURANTE LE
EMERGENZE
Ogni situazione di emergenza, si presenta in modo che difficilmente può essere prevista.
Al fine di preservare il più possibile l’incolumità della vita umana, è necessario che ogni elemento
presente nell’area sinistrata, assuma atteggiamenti che siano il più possibile rapidi ed efficaci. Ciò è
realizzabile solo attraverso una diffusa consapevolezza di una gestione ORDINATA dell’emergenza
da parte di TUTTI.
E necessario dunque rendere complementari le procedure comportamentali elencate in precedenza per
valide i Responsabili / Addetti, con i comportamenti tenuti dal resto del personale presente.
Per quanto detto, il personale presente nel luogo dove si è generata la condizione di emergenza, deve:

In Caso di Incendio:
1) Appena si rileva la presenza di un incendio (o principio di incendio), informare ilResponsabile
dell’emergenza o gli Addetti antincendio e procedereall’attivazione dei segnali d’allarme.
2) Rispettare le disposizione fornite dalla squadra di emergenza.
3) Assistere le persone non autosufficienti ed allontanarsi dalla zona interessata edalle zone
potenzialmente pericolose.
4) Non utilizzare acqua sugli apparecchi elettrici sotto tensione, utilizzare gli estintoricon cognizione
delle loro caratteristiche.
5) In caso di locali densi di fumo, proteggere le vie respiratori, rimando bassi sulpavimento,
guadagnare l’uscita.
6) Portarsi nei posti di raccolta, senza intralciare l’opera dei soccorritori, segnalando la propria
presenza e l’eventuale assenza di terzi impossibilitati per qualunque motivo.


                                                  12

In Caso di Allagamento:
1) Attenersi esattamente alle indicazioni fornite dalla squadra di emergenza.
2) Interrompere, se possibile, l’erogazione dell’energia elettrica (per i responsabili/addetti),
verificando che l’acqua non abbia raggiunto quadri.
3) Accertarsi che nessuna persona sia rimasta isolata in locali interessatidall’allagamento.
4) Verificare se vi sono cause accertabili di perdite di acqua - rubinetti aperti, visibilirotture di
tubazioni (per i responsabili / addetti).

In Caso di Terremoto:
1) Mantenere la calma e NON MUOVERSI sino a quando il sisma è finito.
2) Durante il sisma, se si è all’interno dell’edificio rimanerci, disponendosi sottoscrivanie, architravi.
3) Una volta terminato il movimento tellurico, procedere ordinatamente allo sgomberodei locali.
4) È compito dei responsabili e degli addetti, verificare che nei servizi igienici e localiaccessori non
siano rimaste persone bloccate.
5) È compito degli addetti al primo soccorso occuparsi di eventuali feriti.

5 PRESIDI ANTINCENDIO E DI EMERGENZA
L’impianto antincendio, di tipo mobile, è costituito in particolare da:
N. 3 – estintore a CO2 da 5 kg

5.1. TIPOLOGIA DI RISCHIO ATTIVITA’
Da quanto emerge dalle caratteristiche del locale in oggetto, in relazione con il tipodi attività che
viene svolta (numero lavoratori, attrezzature e sostanze utilizzate, ecc),si può affermare che:
Lo studio odontoiatrico in oggetto, ai sensi dell’allegato IX del decreto ministeriale 10 marzo 1998
“criteri generali di sicurezza antincendio e per la gestione delle emergenze nei luoghi di lavoro”, ed
il d.m. 18/09/02 “approvazione regola tecnica di prevenzione incendi per la progettazione, la
costruzione e l’esercizio delle strutture sanitarie pubbliche e private” è individuabile come:
ATTIVITA’ A RISCHIO INCEDIO BASSA
Tutto il personale deve ricevere adeguata formazione antincendio, basata nei tempi e nei contenuti
teorico-pratici, individuati all’allegato X del D.M. 10/03/98.
Inoltre, per quanto stabilito dall’allegato 1 di cui all’art. 2 comma 2 del D.P.R. n. 151 del 1 agosto
2011 (in particolare al n. 68: Strutture sanitarie che erogano prestazioni di assistenza specialistica
in regime ambulatoriale, ivi comprese quelle riabilitative, di diagnostica strumentale e di
laboratorio, di superficie complessiva superiore a 500 mq), l’attività in oggetto.

PERTANTO NON RIENTRA

Tra le attività per cui è necessario richiedere il parere preventivo dei Comandi Provinciali dei Vigili
del Fuoco con il susseguente rilascio del certificato di prevenzione incendi.


Ai fini del presente piano d’emergenza si definiscono:


                                                  13

- LUOGO SICURO: luogo dove le persone possono ritenersi al sicuro dagli effetti di unincendio;
- PERCORSO PROTETTO: percorso caratterizzato da una adeguata protezione contro glieffetti di
un incendio che può svilupparsi nella restante parte dell'edificio.
- USCITA DI PIANO: uscita che consente alle persone di non essere ulteriormenteesposte al rischio
diretto degli effetti di un incendio e che può configurarsi come segue:
● uscita che immette direttamente in un luogo sicuro;
● uscita che immette in un percorso protetto attraverso il quale può essereraggiunta l'uscita che
immette in un luogo sicuro;
- VIA DI ESODO (da utilizzare in caso di emergenza): percorso senza ostacoli al deflussoche
consente agli occupanti un edificio o un locale di raggiungere un luogo sicuro.


6. PRESIDI DA INSTALLARE ED OPERAZIONI DA COMPIERE AI FINI DELLA
SICUREZZA
Per potere gestire al meglio le eventuali situazioni di emergenza che si possonopresentare, sono
installati alcuni presidi all’interno dei locali atti a definire delleoperazioni preventive da compiere ai
fini della sicurezza.
Nei locali aziendali, si è pertanto provveduto a:
a) affliggere un numero sufficiente di planimetrie con l’indicazione delle vie di esodo, l’ubicazione
degli estintori, del quadro elettrico generale, del posto telefonico per lechiamate esterne (insieme alle
indicazioni grafiche saranno indicate le normecomportamentali di sicurezza in condizioni di
emergenza);
b) l’individuare delle aree di riferimento esterne all’edificio da utilizzare come zona diraccolta;
Queste aree sono scelte, in modo da essere:
- sufficientemente distanti dall’edificio;
- sicuri e protetti dal traffico stradale;
- un riferimento sicuro e conosciuto;
- di non intralcio per lo svolgimento delle operazioni di soccorso.
c) Affiggere idonea segnaletica di emergenza;
d) Istallare una adeguato sistema di illuminazione autonomo di emergenza.
L’importanza di un opportuna segnaletica d’emergenza, è stata analizzata danumerosi studi i quali
hanno analizzato la psiche umane nelle condizioni di panico.


7. PROVA DI EVACUAZIONE
Almeno al biennio l'azienda deve organizzare la Prova di Evacuazione, resaobbligatoria dallo stesso
decreto antincendio, attenendosi al seguente schema.
La Prova sarà condotta e coordinata dal Responsabile del Servizio di Prevenzione eProtezione, con
l’ausilio della Squadra di Emergenza.
Gli Addetti all’Antincendio interverranno con gli estintori là dove la prova verta sullospegnimento di
un evento di tipo comunque controllabile, contrariamente siprovvederà ad avvertire i Vigili del
Fuoco.
Gli Addetti al Primo soccorso lo faranno laddove venga richiesto un loro intervento aseguito di
contusioni, traumi, abrasioni, ustioni causate da eventi come crolli, inondazioni, incendi.
Gli Addetti alle Emergenze, cureranno la correttezza delle procedure esplicate durantele varie fasi
della simulazione che sono, nella fattispecie:
     il presidio delle uscite di emergenza e dei cancelli adibiti ad ingresso, così daorientare i mezzi
        di soccorso diretti nell’insediamento;
     il disinnesco dell’energia elettrica;


                                                  14

    L’avviso a voce di tutto il personale anche (o in sostituzione) dopo l’eventuale suono delle
       sirene di evacuazione;
       La messa in sicurezza, ove sia possibile, di alcuni beni aziendali esposti a rischio;
       La concentrazione del personale nei luoghi di lavoro in sicurezza;
      L’uscita dallo stabile dello stesso personale.


Uno specifico verbale firmato dal Responsabile del Servizio di Prevenzione e Protezione, dai
componenti la Squadra di Emergenza, dal Rappresentante dei Lavoratori per laSicurezza, dovrà
sancire l’avvenuta effettuazione della prova simulata che andràripetuta sino a che tutti gli ingranaggi
del meccanismo non abbiano funzionatoperfettamente.

Ricordiamo che la Prova di Evacuazione va ripetuta almeno ogni due anni, e che ilregime
sanzionatorio è quello di cui al Dlgs 81/08, coordinato con il DLgs 106/09 e s.m.i.per ciascuna delle
seguenti inadempienze:
    Piano di Emergenza mancante.
    Valutazione del Rischio Incendio mancante.
    Mancata effettuazione della prova di evacuazione.


Conclusioni
Il Presente PIANO DI EMERGENZA è stato redatto aNovembre 2025 ed èsoggetto alla revisione
periodica in base alle variazioni organizzative, agli aggiornamenti normativi ed al progresso tecnico.

Perapprovazione:

firma del Datore di Lavoro _________________________


firma del R.S.P.P. _________________________


firma del Responsabile dell’Emergenza ______________________________


firma del R.L.S. ______________________________


                                                15

VERBALE PROVA PERIODICA SIMULATA DI EMERGENZA GENERALE

In data …………… dalle ore …………. alle ore ………… è stata effettuata la provaperiodica

simulata di emergenza generale secondo quanto prescritto dal Piano diEmergenza.


Funzioni e persone coinvolte:

  ________________________________________________________

  ________________________________________________________

  ________________________________________________________

  ________________________________________________________

  Esito della prova e comportamento delle Funzioni interessate e del Personale:

  ________________________________________________________

  ________________________________________________________

  ________________________________________________________

Tipo di segnale usato: ______________________________________________________

Tempi di evacuazione: _____________________________________________________

Osservazioni eventuali: _____________________________________________________


Firma per presa visione del personale dipendente ___________________________________

Firma per presa visione dei collaboratori__________________________________________


  DataILRESPONSABILE


                                               16

INDICE
1 Sorveglianza e controllo delle attrezzature e dei sistemi di sicurezza
2 Classificazione delle emergenze
3 Figure responsabili per l’esecuzione delle misure di sicurezza
3.1 Responsabile emergenza e procedure da seguire in stato di non emergenza
3.2 Responsabile chiamate e procedure da seguire in stato di non emergenza
3.3 Addetti antincendio e procedure da seguire in stato di non emergenza
3.4 Addetti pronto soccorso e procedure da seguire in stato di non emergenza
4 Procedure operative Piano di Emergenza
4.1 Segnalazione dell’emergenza
4.2 Evacuazione
4.3 Procedure per il Responsabile dell’emergenza durante le emergenze
4.4 Procedure per il Responsabile delle chiamate durante le emergenze
4.5 Procedure per gli Addetti antincendio durante le emergenze
4.6 Procedure per gli Addetti primo soccorso durante le emergenze
4.7 Procedure comportamentali per tutto il personale, durante le emergenze
5 Descrizione della struttura
5.1 Presidi antincendio e di emergenza
5.1.1. Tipologia di rischio attività
6 Presidi da installare ed operazioni da compiere ai fini della sicurezza
7 Prova di Evacuazione
8 Elenco dei responsabili / addetti per la gestione delle emergenze
8.1 Elenco del personale

  Allegati

      Planimetrie con vie di fuga, uscite di emergenza e presidi antincendio
      Elenco aggiornato del personale e ruoli in emergenza
      Istruzioni nell’utilizzo dei sistemi di emergenza
      Attestati del personale
      Registro prove di evacuazione
      Schede di verifica estintori e impianti


                                                17`,
  7: `Il presente protocollo intende definire le raccomandazioni per le misure di isolamento da adottare per i
pazienti con patologie contagiose o potenzialmente tali.

DEFINIZIONI:

Isolamento: misura adottata per contenere la diffusione delle infezioni, che consiste nella
separazione fisica della fonte di infezione dai soggetti suscettibili. In ambiente ospedaliero,
l’isolamento coincide con il ricovero di un paziente fonte di infezione in un locale adeguato e separato
dagli altri pazienti con patologie diverse.

Serbatoio di infezione: soggetto (infetto o portatore) oppure ambiente in cui il microrganismo
sopravvive e si moltiplica.

Fonte di infezione: luogo da cui proviene il microrganismo infettante. In alcuni casi, il serbatoio e
la fonte di infezione coincidono (ad esempio Staphylococcus aureus e mucosa nasale), mentre in
altri casi serbatoio e fonte di infezione sono differenti (ad esempio nella salmonellosi).

           Ospite suscettibile: soggetto che, venendo a contatto con un microrganismo, sviluppa la
            malattia infettiva. Le difese dell’ospite possono essere alterate da diverse condizioni
            patologiche, dall’età, da terapie antibiotiche, steroidee, immunosoppressive o
            radioterapiche, nonché da procedure diagnostiche e/o terapeutiche (cateteri, endoscopie,
            interventi chirurgici, ecc.). Per questo motivo, un soggetto può diventare suscettibile anche
            venendo a contatto con microrganismi generalmente non patogeni.

Trasmissione: passaggio dell’agente infettivo dal serbatoio o dalla fonte di infezione all’ospite.
Le principali modalità di trasmissione delle infezioni sono:

          Per contatto diretto: avviene attraverso un contatto immediato tra la fonte di infezione e
           l’ospite.
           Esempio: durante attività di assistenza che richiedono il contatto diretto dell’operatore con
           liquidi biologici del paziente (mobilizzazione, igiene personale)


           Esempio di infezioni: infezioni a trasmissione parenterale.

          Per contatto indiretto:
               o Attraverso veicoli: avviene tramite il contatto tra un ospite suscettibile e un oggetto
                    contaminato da microrganismi (veicolo di infezione), come strumenti chirurgici,
                    manipoli, specilli, aghi, guanti.
               o Attraverso vettori: avviene quando il vettore (insetto o macroparassita in genere)
                    partecipa attivamente alla trasmissione dell’infezione.
          Attraverso droplets: il microrganismo si trasmette dalla fonte o dal serbatoio di infezione
           mediante particelle chiamate droplets (goccioline), eliminate con la tosse, gli starnuti o durante
           l’utilizzo di strumenti rotanti ad alta velocità. Le goccioline si depositano sulle mucose
           dell’ospite.
           Questo tipo di trasmissione avviene solo se l’ospite si trova a distanza ravvicinata dalla fonte
           di infezione.
           Esempi: Neisseria meningitidis, virus influenzali.
          Per via aerea: la trasmissione per via aerea si verifica quando il microrganismo è in grado di
           diffondersi nell’aria attraverso la disseminazione di nuclei di goccioline (droplet nuclei) di
           dimensioni inferiori rispetto alle droplets, oppure mediante particelle di polvere contaminate.
           In tal caso, il microrganismo può raggiungere anche lunghe distanze dalla fonte di infezione.
           Esempi: Mycobacterium tuberculosis (TBC), morbillo, varicella.

MODALITA’OPERATIVE

La catena di trasmissione delle infezioni nosocomiali presuppone l’esistenza di una fonte o di un
serbatoio di infezione da cui, direttamente o indirettamente, il microrganismo patogeno raggiunge
l’ospite suscettibile.

Il presente protocollo si propone, a scopo di prevenzione primaria, di applicare le misure precauzionali
indicate nelle Linee Guida dei principali organismi scientifici internazionali, in particolare quelle del
Centers for Disease Control and Prevention (CDC).


CAMPODIAPPLICAZIONE

Vi sono due livelli nelle precauzioni di isolamento:

   1. Precauzioni destinate all’assistenza di tutti i pazienti in ospedale
      → Precauzioni standard
   2. Precauzioni destinate all’assistenza di specifici pazienti
      → Precauzioni basate sulla modalità di trasmissione
         o Precauzioni per la trasmissione aerea
         o Precauzioni per la trasmissione attraverso goccioline (droplet)
         o Precauzioni da contatto


Le “Precauzioni standard (S)” riguardano:

   1.   Misure di barriera
   2.   Strumenti / oggetti taglienti
   3.   Decontaminazione dello strumentario riutilizzabile
   4.   Biancheria
   5.   Pulizia e disinfezione ambientale
   6.   Collocazione del paziente


Le “Precauzioni basate sulla modalità di trasmissione” riguardano:

   1. Precauzioni per la trasmissione aerea
   2. Precauzioni per la trasmissione attraverso goccioline (droplet)
   3. Precauzioni per la trasmissione da contatto

1. Precauzioni standard

1.1. Misure di barriera

1.1.1. Igiene delle mani

Il lavaggio delle mani è la misura più importante per ridurre il rischio di trasmissione di microrganismi
da una persona all’altra o tra sedi diverse dello stesso paziente.
È non solo una misura di controllo delle infezioni, ma anche una misura di protezione dell’operatore.

Piccole lesioni di continuo sulla cute delle mani possono rappresentare una via di ingresso e una fonte
o serbatoio di infezione; inoltre, le mani dell’operatore sono un potenziale veicolo di infezione.
Un efficace lavaggio delle mani è quindi la precauzione standard più incisiva nella riduzione delle
infezioni in ambito odontoiatrico.

Il lavaggio delle mani deve avvenire:

      Prima di ogni seduta con il paziente
      Prima e dopo le procedure asettiche
      Prima e dopo gli interventi chirurgici
      Prima e dopo le medicazioni
      Immediatamente, in caso di contatto accidentale con sangue, fluidi corporei, secreti, escreti o
       oggetti contaminati, anche se si indossavano i guanti
      Dopo aver tolto i guanti
      Dopo l’uso dei servizi igienici

Ulteriori indicazioni:

      Lavare le mani dopo la rimozione dei guanti e tra un paziente e l’altro.
      Utilizzare detergente normale per il lavaggio sociale (di routine) delle mani.
      Utilizzare antisettico in circostanze specifiche, rispettando tempi di lavaggio di almeno 1–2
       minuti.
      I lavabi devono essere dotati di dispenser con detergente, antisettico e salviette di carta
       monouso.
      Le unghie devono essere ben curate, corte e prive di smalto. Durante l’attività non portare
       anelli, bracciali o altri monili.


1.1.2. Guanti

      Devono essere indossati guanti monouso sterili in lattice o vinile per le procedure che
       comportano contatto con aree del corpo normalmente sterili.
      Devono essere indossati guanti monouso non sterili in lattice o vinile per le procedure che
       prevedono contatto con mucose o altre procedure diagnostiche o di controllo che non
       richiedono guanti sterili.
      Devono essere indossati guanti in gomma per uso domestico per la pulizia ambientale e la
       decontaminazione dello strumentario.

I guanti devono essere:

      Rimossi prontamente dopo l’uso.

   Rimossi prima di assistere un altro paziente.
       Sostituiti quando si rompono, si verifica una puntura o una lacerazione.
       Dopo la rimozione dei guanti, lavare immediatamente le mani.

ATTENZIONE:

Indossare i guanti non sostituisce la necessità di lavare le mani, poiché:

    1. I guanti possono presentare difetti invisibili o lacerarsi durante l’uso.
    2. Le mani possono contaminarsi durante la rimozione dei guanti.
    3. I guanti possono contaminarsi quando vengono indossati.


1.1.3. Mascherine, occhiali protettivi / visiere

       Devono essere utilizzati durante le procedure che possono determinare schizzi di sangue o di
        altri liquidi biologici.
       La mascherina deve essere sostituita ad ogni paziente e comunque non oltre un’ora di impiego,
        quindi gettata nel contenitore dei rifiuti pericolosi a rischio infettivo.


1.1.4. Camici

       Devono essere utilizzati camici in cotone pesante o camici in TNT per proteggere la cute e
        prevenire l’imbrattamento degli indumenti, riducendo la trasmissione di microrganismi durante
        procedure che possono determinare schizzi di sangue o altri liquidi biologici.
       Dopo aver tolto il camice, lavare le mani.


1.2. Strumenti / oggetti taglienti

Per prevenire incidenti causati da aghi, bisturi e altri dispositivi taglienti o appuntiti:

       Non reincappucciare gli aghi né rimuoverli manualmente dalle siringhe.
       Non indirizzare la punta di aghi o altri oggetti taglienti verso parti del corpo.
       Non raccogliere strumenti taglienti o appuntiti mentre stanno cadendo.
       Non piegare o rompere lame, aghi o altri oggetti taglienti.
       Eliminare sempre aghi e altri oggetti taglienti negli appositi contenitori per prevenire
        esposizioni accidentali.


1.3. Decontaminazione dello strumentario riutilizzabile

       Tutto il materiale riutilizzabile venuto a contatto con sangue o altri liquidi potenzialmente
        infetti deve essere immerso subito dopo l’uso in soluzione disinfettante a base di derivati
        fenolici 0,4% per 30 minuti.
       La pulizia dello strumentario va effettuata utilizzando mascherina con visiera e guanti.

   I presidi medico-chirurgici critici o semi-critici contaminati vanno sterilizzati o disinfettati; la
       tipologia di disinfettante da utilizzare è determinata dallo strumento e dal suo uso specifico.


1.4. Pulizia e disinfezione ambientale

La pulizia e disinfezione degli ambienti ordinari deve essere effettuata quotidianamente, mentre per
gli     ambienti       operativi       è  necessaria      tra      un      paziente      e      l’altro.
Per alcuni microrganismi patogeni (es. enterococchi), che resistono a lungo nell’ambiente, occorre
un’adeguata disinfezione delle superfici con cui il paziente è venuto a contatto (sedute, sale d’attesa,
maniglie delle porte, rubinetti, ecc.).


1.5. Collocazione del paziente

La gestione separata del paziente, in orari stabiliti e preferibilmente a fine giornata, può essere
necessaria per:

      Malattie a trasmissione aerea.
      Pazienti con scadenti abitudini igieniche, non collaboranti o che contaminano l’ambiente (es.
       bambini o soggetti con alterazioni mentali).

La gestione separata riduce la possibilità di trasmissione e facilita l’adozione delle misure di profilassi
da parte del personale.


1.6. Gestione pazienti con patologie contagiose o potenzialmente tali

Nel caso di:

      Temperatura corporea superiore a 37°C
      Insorgenza improvvisa di sintomi quali febbre, tosse, dispnea senza altra eziologia nota
      Sintomatologia riconducibile a patologie contagiose
      Riscontro di pediculosi o scabbia

Il paziente sarà temporaneamente isolato presso la seconda sala operativa e dotato di DPI
(mascherina FFP2 e guanti in lattice) in attesa di:

      Eventuale intervento del 118
      Arrivo di un familiare per il prelievo del paziente

Gli altri pazienti in sala d’attesa dovranno allontanarsi per almeno 60 minuti per consentire le
successive operazioni di sanificazione.

Si procederà quindi alla sanificazione immediata e straordinaria della sala d’attesa, sala operativa,
studio privato e bagno (se utilizzati dal paziente), aerando i locali per almeno 20 minuti.
Particolare attenzione dovrà essere prestata agli oggetti venuti a diretto contatto con il soggetto, che
andranno trattati con gli stessi prodotti e concentrazioni previste dal protocollo.

Se necessario, si procederà anche alla sanificazione dei filtri degli impianti di climatizzazione con
ricircolo d’aria.

DPI richiesti per le operazioni di sanificazione:

      Maschera FFP2
      Guanti monouso
      Tuta da lavoro monouso in TNT
      Cuffia in TNT
      Visiera
      Scarpe da lavoro con copricalzari monouso


2. Precauzioni basate sulla modalità di trasmissione

Destinate ai pazienti riconosciuti o sospetti di essere infetti da patogeni altamente trasmissibili o
epidemiologica mente importanti, diffusi per via aerea, tramite goccioline (droplets) o attraverso il
contatto con cute o superfici contaminate.
Richiedono ulteriori precauzioni oltre a quelle standard.


2.1. Precauzioni per la trasmissione aerea

In aggiunta alle precauzioni standard, devono essere adottate per pazienti noti o sospetti di infezione
da patogeni trasmessi da nuclei di goccioline aerodiffuse (droplet nuclei) che possono rimanere
sospesi e diffondersi nell’aria (es. TBC, morbillo, varicella).

2.1.1. Mascherine

Il personale deve indossare mascherina di protezione respiratoria all’ingresso nella sala operativa.

      Per pazienti con TBC: FFP2 per procedure di assistenza generali, FFP3 per procedure che
       inducono tosse o generano aerosol.
      La mascherina non è necessaria per operatori immuni in caso di varicella o morbillo.

2.1.2. Educazione sanitaria

Istruire il paziente sulle norme igieniche da osservare per prevenire la diffusione di microrganismi ad
altri degenti o all’ambiente (es. coprirsi naso e bocca con salviette monouso durante la tosse).


2.2. Precauzioni per la trasmissione attraverso goccioline (droplets)

In aggiunta alle precauzioni standard, queste misure si applicano ai pazienti infetti o sospetti di esserlo
per patogeni trasmessi da goccioline di dimensioni maggiori, generate da starnuti, tosse,
conversazione o alcune manovre diagnostiche o terapeutiche (es. N. meningitidis, difterite faringea, H.
influenzae, influenza, rosolia, pertosse).

2.2.1. Gestione del paziente

Per pazienti con patologie contagiose accertate o potenzialmente tali, rimandare l’appuntamento a
dopo la guarigione.
In caso di urgenza, programmare la seduta come ultimo appuntamento della giornata.

2.2.2. Guanti e mascherina di protezione

Il personale deve indossare mascherina FFP2 quando lavora a meno di un metro di distanza dal
paziente.


2.3. Precauzioni per la trasmissione da contatto

In aggiunta alle precauzioni standard, queste misure devono essere adottate per pazienti noti o sospetti
di infezione da patogeni trasmissibili tramite contatto diretto (mani, cute, mucose) o indiretto
(superfici, presidi). Esempi: affezioni gastrointestinali, ascessi, decubiti, scabbia, pediculosi.`,
  8: `Scopo:
Definire i requisiti e le modalità operative per garantire una corretta redazione, aggiornamento,
conservazione e verifica della documentazione sanitaria dei pazienti, assicurando tracciabilità,
riservatezza e conformità alle normative vigenti.

Documentazione:
Può essere in diversi formati (cartaceo o elettronico) e su diversi supporti.
In particolare la documentazione comprende:
                    Cartella clinica;
                    Consensi informati;
                    Documenti di posta elettronica, compresi gli allegati.
                    Gestione dei database informatici per radiografie digitali
                    Documenti necessari allo svolgimento delle attività, come ad esempio, fotografie,
                     esami radiografici

Struttura della documentazione
        La documentazione riporta nell’intestazione ordinatamente il nome dell’azienda, con
 l’eventuale logo, il nome del documento, modulo o altro, il codice del documento ed il numero di
 pagina, riferito al numero totale di pagine. Per i moduli è ammesso omettere la numerazione delle
 pagine se sono tutti contenuti in un sola pagina.
        Il piede di pagina riporta il nome del documento ed il percorso della cartella in cui è
 conservato, la data e l’indice di revisione.
        Quando è possibile la documentazione deve riportare l’indice generale; nei documenti più
 importanti e più articolati è raccomandato anche un indice analitico da inserire alla fine del
 documento stesso e che contenga le voci più importanti.


Responsabilità della redazione
         La redazione della documentazione sanitaria è compito del Titolare dello studio
 odontoiatrico, il [TITOLARE]. La redazione tiene conto per le specifiche pertinenze della
 normativa vigente sulla tutela dei dati personali, sul contenuto specifico (es. dati obbligatori e
 descrittivi della cartella clinica), sulla tutela radioprotezionistica (consenso informato)

Riesame ed Aggiornamento
          Ad ogni incontro con il paziente l’Odontoiatra richiama la cartella clinica
 cartacea/informatizzata e la documentazione sanitaria a corredo (dagli archivi e/o dal software
 gestionale), e dopo averla visionata apporrà gli eventuali aggiornamenti datati che descrivono gli
 avanzamenti del piano di cura concordato. Gli stessi aggiornamenti saranno di conseguenza
 attribuiti all’Odontoiatra che effettua le prestazioni/indagini strumentali tramite sigla autografa o
 direttamente dal software gestionale del database per le quali sono state consegnate le credenziali di
 accesso personali dal Titolare
          Gli aggiornamenti si rendono quindi necessari per uniformare la documentazione, e quindi le
 attività da essa supportate, al nuovo quadro clinico dovuto al progredire delle prestazioni erogate o
 in alternativa alla chiusura con relativa conservazione per almeno cinque anni della cartella clinica e
 di tutte le informazioni ad essa associate.

Conservazione della documentazione sanitaria
         La conservazione della documentazione sanitaria (es. cartella sanitaria, preventivi, piano di
 cura, consenso informato, prescrizioni e terapia) in formato digitale è prevista all’interno software
 gestionali protetti da password gestite dal titolare e/o all’interno di carpette codificate in maniera da
 essere riconducibili in maniera univoca al paziente, custodite all’interno di armadi con serratura a
 chiave affidata al titolare.

La documentazione sanitaria può essere costituita da:
           Cartella clinica digitale gestita da programma gestionale
           Cartella clinica cartacea
           Consensi informati informatizzati
           Radiografie convenzionali digitalizzate
           Piani di cura informatizzati
           Email

     La integrità è garantita da procedure di backup periodici su supporti removibili dedicati oltre
 che dalla presenza di un antivirus aggiornato e accesso ai dati consentito da password gestite dal
 Titolare. E’ altresì presente un UPS che interviene in caso di interruzione della fornitura elettrica.
     La documentazione cartacea sanitaria è custodita in armadio dotato di serratura a chiave tenute
 dal Titolare. Se ritenuto necessaria è prevista la copia della documentazione per sicurezza di
 conservazione che sarà inserita presso altro armadio distinto.

     La tutela dei dati personali si attua al livello fisico e al livello logistico. Per il primo è presente
 un locale segreteria ed un ufficio per la ricezione della clientela all’interno dei quali è rispettata la
 privacy durante i colloqui per le trattazioni sanitarie ed economiche. Il trattamento dei dati personali
 altresì per come previsto dalla normativa vigente viene concesso dal cliente tramite apposito
 consenso. La consultazione degli archivi digitali è consentito esclusivamente agli operatori
 odontoiatri dotati di apposite credenziali di accesso personali.

     La attività odontoiatrica non prevede consegna ai clienti di referti. Copia della cartella clinica o
 copia delle indagini strumentali (radiografie) può essere comunque richiesta dall’interessato brevi
 manu o su delega in busta chiusa (e con documento di riconoscimento del delegante e del delegato
 in corso di validità) con a fine del trattamento tramite formale procedura scritta o via email e
 consegnata allo stesso con le stesse modalità con tempi previsti in una settimana.

     Le cartelle cliniche sono firmate dal Titolare o suo collaboratore/consulente odontoiatra che ne
 cura la compilazione, e l’esecuzione delle indagini strumentali (eventuali radiografie) è consentito
 esclusivamente agli odontoiatri tramite software dedicato il quale abilita singolarmente gli stessi
 con credenziali personalizzabili. E’ di conseguenza identificabile univocamente il responsabile della
 prestazione.

     Tutti gli eventuali odontoiatri collaboratori coinvolti nel processo di redazione saranno formati
 ed informati delle procedure e relative responsabilità tramite incontri che saranno programmati al
 momento dell’inizio della collaborazione.

STUDIO ODONTOIATRICO
 [TITOLARE]
 Sito in [INDIRIZZO]


Documento 9
Documento formale di incarico del
responsabile della Manutenzione.

Cod. Requisito
1A.03.01.01


[TITOLARE]

Il sottoscritto [TITOLARE], Odontoiatra, in qualità di Titolare dello studio odontoiatrico sito in
Villabate in [INDIRIZZO]
Al fine di garantire l’efficienza, la sicurezza e la conformità normativa delle attrezzature, degli impianti e
delle strutture dello studio odontoiatrico, si rende necessario designare un Responsabile della Manutenzione
incaricato di sovrintendere alle attività di controllo, manutenzione ordinaria e straordinaria e alla relativa
documentazione, pertanto
                                                  NOMINA
 Se stesso come Responsabile della manutenzione ordinaria e straordinaria della struttura.


Compiti e responsabilità

Il Responsabile della Manutenzione ha il compito di:

   1. Garantire l’efficienza e la sicurezza di tutti gli strumenti odontoiatrici, e delle apparecchiature
      elettromedicali, dei dispositivi ausiliari e degli impianti tecnici (elettrico, idrico, aspirazione,
      compressore, ecc.).
   2. Garantire l’efficienza degli eventuali strumenti di radiologia, (contratto con esperto qualificato)
   3. Pianificare e monitorare gli interventi di manutenzione ordinaria e straordinaria, in accordo con le
      indicazioni dei produttori e le normative vigenti.
   4. Tenere aggiornato il registro delle manutenzioni e archiviare i relativi rapporti d’intervento.
   5. Segnalare tempestivamente eventuali anomalie, guasti o rischi.
   6. Verificare la regolarità delle tarature e verifiche di sicurezza elettrica delle apparecchiature
      mediche.
   7. Coordinare eventuali fornitori o tecnici esterni incaricati di interventi specialistici.


                                                                   Firma:`,
  10: `ELENCO DELLE ATTREZZATURE e STRUMENTARIO

Il sottoscritto [TITOLARE], nato a Palermo il 05/09/1996, residente in Misilmeri in via
Nazionale n°67 titolare dello studio medico odontoiatrico privato, sito in Villabate via Ammiraglio
Gravina n° 9-11,

                                             D I C H IAR O
che l’elenco delle attrezzature all’interno dello studio è il seguente:

        Locale tecnico:
     -   Compressore
         Marca: Cattani
         Modello: Comp. 2c. LT 30 rosso
         S/N: C2161289
         (Riferimento in planimetria: 18)
     -   Aspiratore
         Marca: Cattani
         Modello: “Micro smart cube” + idro
         S/N: WS203486
         (Riferimento in planimetria: 19)
     -   Filtri legionella
         Marca: Viroxidaqua
         Modello: UF - Unit Pro 1
         S/N: 070700
         (Riferimento in planimetria: 21)
        Sala Sterilizzazione:
     -   Autoclave
         Marca: Faro
         Modello: Nisea
         S/N: 21BSTN10A100104
         (Riferimento in planimetria: 22)
     -   Autoclave
         Marca: Dental X
         Modello: Domina Plus B
         S/N: 0946PB
         (Riferimento in planimetria: 23)
     -   Termosigillatrice
         Marca: Euronda S.P.A
         Modello: EurosealInfinity
         S/N: EDS250104
         (Riferimento in planimetria: 24)
     -   Distillatore
         Marca: Faro
         Modello: MH943T - SW

S/N: 739071
    (Riferimento in planimetria: 25)
-   Frigorifero farmaci
    Marca: Atlantic
    Modello: FM110
    (Riferimento in planimetria: 26)
-   Termopulitrice
    Marca: Tecno-Gaz
    Modello: Multisteril
    S/N: 2013092VM
    (Riferimento in planimetria: 27)
   Sala Operativa 1:
-   Diafanoscopio
    Marca: Tecnogaz
    Modello: 7085/N
    S/N: NE7320109
    (Riferimento in planimetria: 35)
-   Miscelatore per impronte dentali
    Marca: Aquasil
    Modello: Duomix 276000
    S/N: B00842
    (Riferimento in planimetria: 37)
-   Lampada fotopolimerizzante
    Marca: Ivoclar
    Modello: Bluephase G4 Grey
    S/N: 1400000376
    (Riferimento in planimetria: 38)
-   Scanner intraorale
    Marca: Medit I-700
    Modello: MD – IS0200
    S/N: AZ2404100100
    (Riferimento in planimetria: 39)
-   PC Notebook
    Marca: HP OMEN 15
    Modello: DC1050NL
    S/N: 5CD0142DGK
    (Riferimento in planimetria: 40)
-   Micromotore chirurgico
    Marca: Kavo
    Modello: Expert surg lux 1.008.3500
    S/N: 1016796
    (Riferimento in planimetria: 41)
-   Riunito
    Marca: Anthos
    Modello: A7 Plus continental

S/N: 71BX1581
       (Riferimento in planimetria: 16)
      Sala Operativa 2:
   -   Riunito
       Marca: Castellini
       Modello: Skema 5
       S/N: 71LP1052
       (Riferimento in planimetria: 16)
   -   Lampada sbiancamento dentale
       Marca: Blu Dent
       Modello: 12 BC
       S/N: 016750
       (Riferimento in planimetria: 42)

 Dispositivi di protezione individuale (guanti, mascherine, occhiali, camici ecc.)

 Materiali monouso (cannule di aspirazione, bicchieri, mantelline ecc.)

 Strumentario necessario per l’attuazione delle diverse prestazioni odontoiatriche (conservatina,
  protesica ecc.)

 Strumentario per estrattiva (pinze, leve ecc.)

 Strumentario per parodontologia (curette, sonde ecc.)

 Strumentario per conservativa (escavatori, otturatori ecc.)

 Strumentario per endodonzia (strumenti canalari ecc.)

Altresì si dichiara che:
Il manuale uso e manutenzione delle attrezzature si trova all’interno dello studio in formato digitale
e cartaceo.
L’inventario delle attrezzature si riferisce alla data di apertura dello studio odontoiatrico.
Lo stesso conterrà successivamente la eventuale data di modifica dello stesso.
   DATA                                                                         In fede
                                                                        [TITOLARE]

Procedura per l'identificazione delle attrezzature

La presente procedura ha lo scopo di definire le modalità per l’identificazione, classificazione e
tracciabilità delle attrezzature e apparecchiature presenti nello studio odontoiatrico, al fine di
garantirne la corretta gestione, manutenzione e conformità alle normative vigenti in materia di sicu-
rezza e qualità.

La procedura si applica a tutte le attrezzature e apparecchiature in uso presso lo studio odontoia-
trico, comprese:

      Poltrone odontoiatriche e relative unità operative
      Compressori e aspiratori chirurgici
      Autoclavi e sistemi di sterilizzazione
      Apparecchi radiografici e radiografici digitali
      Dispositivi elettromedicali (lampade polimerizzatrici, ablatori, turbine, ecc.)
      Strumentazione diagnostica e di laboratorio
      Attrezzature informatiche collegate alla gestione clinica.

Modalità operative
Identificazione delle attrezzature

Ogni attrezzatura è identificata mediante:

      Etichetta o codice identificativo univoco, applicato in posizione visibile;
      Scheda di identificazione contenente:
           o Codice attrezzatura
           o Descrizione e marca/modello
           o Numero di serie
           o Data di acquisto o installazione
           o Ubicazione (sala o reparto)
           o Fornitore e contatti
           o Scadenze di manutenzione/verifiche
           o Eventuali note o limitazioni d’uso

Registro delle attrezzature
Tutte le attrezzature sono inserite nel Registro delle Attrezzature (cartaceo o digitale), mantenuto
aggiornato dal Responsabile della Manutenzione.
Ogni nuova apparecchiatura sarà registrata prima dell’uso operativo.


Aggiornamenti

In caso di:

      Nuovo acquisto
      Dismissione
      Spostamento o rottamazione

il registro sarà aggiornato entro 5 giorni lavorativi e la scheda dell’attrezzatura archiviata.

Verifiche e manutenzioni

Le attrezzature saranno oggetto di:

      Verifiche periodiche di sicurezza elettrica e funzionale (secondo indicazioni del produtto-
       re o normativa vigente)
      Manutenzione preventiva e correttiva, registrata nella scheda di manutenzione.


Ogni intervento sarà firmato dall’esecutore (interno o esterno).

Identificazione di apparecchi fuori uso

Le attrezzature non operative o in manutenzione saranno chiaramente contrassegnate con cartello
“FUORI SERVIZIO”, per impedirne l’utilizzo accidentale.


Documentazione correlata

      Registro delle Attrezzature
      Schede di manutenzione e verifica periodica
      Rapporti tecnici di intervento
      Manuali d’uso e libretti di manutenzione


Archiviazione
Tutta la documentazione relativa alle attrezzature sarà conservata per almeno 10 anni dalla
dismissione dell’apparecchiatura e archiviata in modo ordinato, accessibile solo al personale
autorizzato.

STUDIO ODONTOIATRICO
 [TITOLARE]
 Sito in [INDIRIZZO]


Documento 11
Piano per la gestione e la
manutenzione (ordinaria e
straordinaria) delle strutture,
impianti, attrezzature e
apparecchiature biomediche.

Cod. Requisito
1A.03.02.02


[TITOLARE]

PIANO VERIFICHE
                                        PERIODICHE

Strutture
      Ispezione visiva         Annuale
      Tinteggiatura dei locali Quinquennale

Apparecchiature biomediche
biennale Autoclave:
      Vacuumtest – giornaliero
      Bowie and Dick          mensile
      Helix Test              mensile
      Testchimico:            adogni ciclo

Impianto elettrico:
      Lampade di emergenza                   semestrale
      Intervento interruttori differenziali: annuale
      Continuità conduttori di protezione: triennale

Impianto antincendio:           Estintori,semestrale
Impianto idrico                 Riserva idrica, sanificazione ogni tre mesi.
                                (vedi contratto con impresa “Pascale pulizie” allegato alla presente.)

Le verifiche periodichesopra el encat e sono sotto la Responsabilità del Titolare dello studio
odontoiatrico [TITOLARE].

CODICE STRUMENTO                                                    DESCRIZIONE
                                                             RIUNITO ODONTOIATRICO

PRODUTTORE/FORNITORE                                                                 ANNODIACQUISTO


                                                     TELEFONO
CONTRATTO DI MANUTENZIONE


                              TIPOLOGIACONTROLLIDAESEGUIRE                                  FREQUENZA


Verifichedisicurezzaelettrica                                                               Annuale

Controllo funzionamento Manipoli, aria acqua, lampada                                     Giornaliera

Controllofunzionamentoaspirazione                                                         Settimanale


                            REGISTRAZIONIMANUTENZIONEESEGUITA                                  DATA

CODICE STRUMENTO                                                    DESCRIZIONE
                                                                STERILIZZATRICE
PRODUTTORE/FORNITORE                                                              ANNODIACQUISTO


                                                     TELEFONO
CONTRATTO DI MANUTENZIONE


                              TIPOLOGIACONTROLLIDAESEGUIRE                               FREQUENZA


Verifichedisicurezzaelettrica                                                            Annuale

Controllo Vacuum Test                                                                  Giornaliero

TestBowieandDick                                                                          Mensile


                            REGISTRAZIONIMANUTENZIONEESEGUITA                               DATA`,
  12: `DOCUMENTAZIONE TECNICA DELLE ATTREZZATURE E APPARECCHIATURE

1. Obiettivo

Garantire la disponibilità immediata della documentazione tecnica relativa a tutte le attrezzature e
apparecchiature utilizzate nello studio odontoiatrico, al fine di:

      Assicurare l’utilizzo corretto e sicuro da parte degli operatori;
      Facilitare gli interventi di manutenzione ordinaria e straordinaria;
      Rispettare i requisiti di sicurezza e conformità normativa.

2. Modalità di Gestione della Documentazione

      Tutta la documentazione tecnica è conservata in formato cartaceo in appositi faldoni e/o
       digitale in un archivio dedicato (“Manuali Tecnici e Schede Apparecchiature”).
      Copie digitali sono archiviate su server locale o Hard-disk aziendale con accesso riservato al
       personale autorizzato.
      La documentazione deve essere sempre disponibile:
           o Agli operatori sanitari che utilizzano le apparecchiature;
           o Alla funzione preposta alla manutenzione (interna o esterna);
           o Al Responsabile della Sicurezza o RSPP, se richiesto.

3. Contenuti della Documentazione Tecnica

Per ogni attrezzatura o apparecchiatura sono presenti almeno i seguenti documenti:

Tipo di Documento:

      Manuale d’uso e manutenzione;
      Scheda tecnica;
      Certificato di conformità CE;
      Registro manutenzioni;
      Scheda sicurezza materiali;
      Check-list di controllo periodico
      Garanzie e contratti di assistenza

4. Aggiornamento e Controllo

      La documentazione è revisionata annualmente o ad ogni sostituzione di apparecchiatura.
      Il titolare dello studio verifica la completezza dei fascicoli tecnici.
      Ogni nuova apparecchiatura sarà registrata prima della messa in servizio.

5. Modalità di Consultazione

      Gli operatori possono consultare la documentazione tramite terminale informatico o
       raccoglitore cartaceo posto in segreteria.
      Gli addetti alla manutenzione dispongono di accesso dedicato ai fascicoli.`,
  13: `In relazione a quanto prescritto dalla norma vigente, si fa presente che:
1. L’attività lavorativa si svolge all’interno di un locale sito a piano terra con ingresso da Via Ammiraglio
    Gravina 9 – 11.
2. L’immobile in oggetto è censito al N.C.E.U. del Comune di Villabate al foglio n° 3 particella 3150 sub 9
    categoria A/10, per lo stesso è stato rilasciato dal comune di Villabate:
      Certificato di destinazione d’uso specifico a studio medico, giusto atto di concessione N° 19 del
          31.07.2001, ed autorizzazione N° 04 del 02 marzo 2007 per la fusione ed il cambio della destinazione
          d’uso del locale.
      È stata dichiarata agibile dal municipio di Villabate giusto certificato di agibilità Prot. N°
          21435/07 rilasciato in data 17.10.2007.
      È stata rilasciata dal Comune di Villabate Autorizzazione allo scarico n° 89 del 17.10.2007;
3. Nello stabile non vi è presenza di piani scantinati e, pertanto non necessita di autorizzazione all’uso dei
    locali seminterrati, prevista dell’art. 65 D.Lgs 81/08.
4. Non ha bisogno di autorizzazione all’emissione in atmosfera, ai sensi del 203/88, in quanto, non produce
    vapori e/o emissioni in atmosfera;
5. Non rientra fra quelli cui è necessaria la valutazione d’impatto ambientale;
6. Non necessita di Certificato di Prevenzione Incendi.
7. Non è elencata fra le attività classificate come insalubri, il suo esercizio non reca in ogni modo nocumento
    alla salute del vicinato.
8. Oggetto della nuova richiesta di autorizzazione è dovuta per il cambio del titolare del locale già adibito a
    studio medico odontoiatrico,
9. La presente ha lo scopo di segnalare, la modifica degli impianti e delle attrezzature all’interno del locale,
    adibito sostanzialmente a studio medico odontoiatrico.
10. In relazione al tipo d’attività svolta, e alle lavorazioni che sono effettuate, bene si prestano i locali.


Pertanto visto il certificato di Agibilità Prot. N° 21435/07 rilasciato dal Comune di Villabate in data
17.10.2007, si attestano i requisiti previsti dalle vigenti leggi in materia di caratteristiche ambientali e
di accessibilità.

STUDIO ODONTOIATRICO
 [TITOLARE]
 Sito in [INDIRIZZO]


Documento 14
Documentazione tecnica, in
relazione alla tipologia delle
attività svolte, attestante il possesso
dei requisiti previsti dalle vigenti
leggi in materia di protezione
antincendio.

Cod. Requisito
1A.03.05.02


[TITOLARE]

Lo studio ha stipulato un contratto disponibile in sede per la fornitura e la manutenzione
ordinaria/straordinaria dei presidi antincendio secondo quanto previsto dal D.M. 03/07/2021
con la ditta ITALFIRE S.R.L.`,
  15: `Requisiti in materia di protezione acustica

Il presente documento attesta che lo Studio Odontoiatrico del [TITOLARE], sito
in [INDIRIZZO]

è conforme ai requisiti tecnici e normativi vigenti in materia di protezione acustica relativamente a:

      Isolamento acustico dei locali;
      Livelli di rumorosità interna ed esterna;
      Emissioni sonore delle apparecchiature odontoiatriche e ausiliarie;
      Tutela dei lavoratori esposti a rumore.

Tipologia delle Attività

Lo studio svolge le seguenti attività:

      Prestazioni odontoiatriche e chirurgiche ambulatoriali;
      Attività di igiene e profilassi dentale;
      Sterilizzazione di strumenti e materiali.

Le apparecchiature utilizzate comprendono:

      Riuniti odontoiatrici con aspiratori e micromotori;
      Compressori medicali insonorizzati;
      Autoclavi per sterilizzazione;
      Aspiratori chirurgici.

Pertanto ai sensi del D. Lgs. 81/08, l’attività odontoiatrica non produce emissioni acustiche che
possano rientrare oltre ai “Valori inferiori di esposizione che fanno scattare l’azione”`,
  16: `La presente documentazione attesta che lo Studio Odontoiatrico [TITOLARE], sito
in [INDIRIZZO]

è dotato di impianti elettrici conformi ai requisiti di sicurezza prescritti dalle normative, e da quando
è stato redatto il progetto e la dichiarazione di conformità non sono avvenute modifiche.
Pertanto presso la sede dello studio odontoiatrico è disponibile il progetto dell’impianto elettrico
redatto da:
      Professionista abilitato Ing. Antonino Romano;
      Dichiarazione di conformità redatta dall’impiantista GIMAX s.n.c. di Morici G. e Romano
         M. ai sensi del D.M. 64/08.

STUDIO ODONTOIATRICO
 [TITOLARE]
    Sito in [INDIRIZZO]


Documento 17
Documentazione tecnica, in
relazione alla tipologia delle
attività svolte, attestante il
possesso dei requisiti previsti
dalle vigenti leggi in materia
di sicurezza anti infortunistica.


Cod. Requisito
1A.03.05.05


[TITOLARE]

Documentazione tecnica sulla sicurezza antinfortunistica

         Conformità alle normative di tutela della salute e sicurezza nei luoghi di lavoro
                            (D.Lgs. 81/2008 e successive modifiche).

Questa documentazione serve ad attestare che lo studio:

      Ha valutato i rischi specifici delle proprie attività (cliniche, radiologiche, di sterilizzazione,
       ecc.);
      Ha adottato misure preventive e protettive adeguate;
      Dispone di dispositivi, impianti e attrezzature conformi;
      Forma e informa il personale.


Attestazione del possesso dei requisiti previsti dalle vigenti leggi in materia di sicurezza
antinfortunistica

1. Premessa e riferimenti normativi

Studio Odontoiatrico del [TITOLARE], sito in Villabate via Ammiraglio Gravina 9-11 è
conforme alle disposizioni legislative e normative vigenti in materia di sicurezza antinfortunistica e
tutela della salute nei luoghi di lavoro, in particolare:

      D.Lgs. 9 aprile 2008, n. 81 e s.m.i. – “Testo unico sulla salute e sicurezza nei luoghi di
       lavoro”;
      D.M. 10/03/1998 e D.M. 3/09/2021 – Prevenzione incendi e gestione emergenze;
      D.Lgs. 475/1992 – Dispositivi di protezione individuale (DPI);
      D.Lgs. 81/2008 – Titolo III (Uso delle attrezzature di lavoro e dei DPI);
      D.Lgs. 81/2008 – Titolo IX (Agenti chimici e biologici);


2. Obiettivi

Il presente fascicolo ha lo scopo di:

      Attestare il possesso dei requisiti tecnico-organizzativi previsti per la sicurezza dei
       lavoratori;
      Documentare le misure di prevenzione e protezione adottate;
      Garantire la tracciabilità delle attività di controllo, manutenzione e formazione.


3. Tipologia delle attività svolte

Lo studio odontoiatrico svolge attività di:

      Diagnosi, terapia e chirurgia odontoiatrica ambulatoriale;
      Sterilizzazione di strumenti;
      Igiene orale professionale.

Personale presente:

      Odontoiatri N° 1

4. Requisiti e misure antinfortunistiche adottate

       Area / Rischio               Misure adottate                 Documentazione              Esito
                                                                       disponibile
Rischi generali nei luoghi   Conformità locali,                  DVR, planimetrie             Conforme
di lavoro                    illuminazione, aerazione,                                        ✅
                             segnaletica di sicurezza
Attrezzature                 Conformità CE, uso secondo          Manuali, schede tecniche,    Conforme
odontoiatriche e di          manuali, controlli periodici        registro manutenzioni        ✅
sterilizzazione
Impianto elettrico e         Verifica impianto, messa a          Certificato di conformità    Conforme
sicurezza elettrica          terra, differenziali,                                            ✅
Rischio biologico            DPI, procedure di                   DVR, protocolli, registro    Conforme
                             sterilizzazione, raccolta rifiuti   sterilizzazioni              ✅
                             sanitari
Rischio chimico              Valutazione rischio chimico,        Schede di sicurezza, DVR     Conforme
(disinfettanti, monomeri,    etichette CLP, SDS                                               ✅
anestetici)

Antincendio e emergenze      Estintori, vie di fuga, piano       Registro controlli           Conforme
                             emergenza, prove evacuazione        antincendio, planimetrie     ✅
Formazione e                 Formazione generale,                Attestati corsi, registro    Conforme
informazione                 specifica e primo soccorso          formazione                   ✅
Sorveglianza sanitaria       Visite mediche periodiche e         Cartelle sanitarie, nomina   Conforme
                             idoneità                            medico competente            ✅


5. Documentazione tecnica disponibile presso lo studio

   1. Documento di Valutazione dei Rischi (DVR);
   2. Piano di emergenza e gestione incendi;
   3. Registro controlli antincendio e primo soccorso;
   4. Manuali d’uso e manutenzione delle attrezzature;
   5. Certificati CE e dichiarazioni di conformità;
   6. Schede di sicurezza (SDS) dei prodotti chimici;
   7. Verbali di verifica impianto elettrico e di terra;
   8. Registro formazione e addestramento;
   9. Relazioni tecniche su sicurezza elettrica;
   10. Contratti di manutenzione periodica.


6. Controllo e aggiornamento

       La documentazione è verificata e aggiornata annualmente dal Responsabile della Sicurezza
        o RSPP;
       Tutte le attrezzature sono sottoposte a manutenzione preventiva programmata;
       Eventuali nuovi rischi introdotti da modifiche strutturali o tecnologiche vengono valutati e
        integrati nel DVR.

7. Descrizione dei locali


I pavimenti sono stati realizzati in gres porcellanato e consentono la perfetta pulizia non vi sono
fessure che sono ricettacolo di batteri e sporcizia, con classe di resistenza allo scivolamento R9.
Non sono presenti dislivelli, gradini o pendenze.
Dal punto di vista costruttivo, la struttura dell'edificio è realizzata con travi e pilastri in cemento
armato.
I tompagnamenti perimetrali sono in blocchi di tufo e hanno uno spessore finito di circa30 cm.
Itramezzi sono realizzati in parte con pannelli di faesite facili da pulire, in parte in conci di tufo,
ehanno uno spessorefinito di 0.15 cm
Le finiture delle pareti sono realizzate con pittura ad acqua lavabile antimuffa, e le pareti del bagno
sono ricoperte di piastrelle sino ad una altezza di 2,20 mt
Le scaffalature ed i pensili sono correttamente ancorati alle pareti.
Gliarredi sonoprividispigolivivi.
Ladistanzatradiessi consenteiltransitodel personale a congrua distanza, circostanza che minimizza la
probabilità di urti con gli stessi.


8. Allegati (esempi)

      Allegato – Copia DVR aggiornato
      Allegato – Schede DPI e protocolli operativi di sicurezza
      Allegato – Attestati formazione personale
      Allegato – Verbali manutenzione impianti e attrezzature`,
  18: `Il titolare dello Studio Odontoiatrico [TITOLARE], sito in [INDIRIZZO]

                                              Dichiara

Che all’interno dello studio non vi sono apparecchiature che producono radiazioni ionizzanti.`,
  19: `DICHIARAZIONE TECNICA DI CONFORMITÀ AI REQUISITI DI ACCESSIBILITÀ
                           (ai sensi della L. 13/1989, D.M. 236/1989 e s.m.i.)


Il titolare dello Studio Odontoiatrico [TITOLARE], sito in [INDIRIZZO]

                                               Dichiara

Di aver verificato la conformità dell’immobile in oggetto alle normative vigenti in materia di
eliminazione delle barriere architettoniche, ai sensi della Legge 9 gennaio 1989, n. 13, del D.M.
14 giugno 1989, n. 236, e del D.P.R. 503/1996, nonché alle norme regionali e comunali vigenti.


Descrizione dell’immobile e dell’accesso

L’attività odontoiatrica è ubicata al piano terra di un edificio, con accesso diretto dalla pubblica via
mediante ingresso privo di barriere architettoniche.

       Percorso esterno: il marciapiede antistante presenta una pavimentazione regolare e priva di
        dislivelli superiori a 2,5 cm.
       Accesso principale: dotato di porta con luce netta ≥ 90 cm.

In base ai rilievi effettuati e alla documentazione tecnica visionata, si attesta che lo studio
odontoiatrico sito al piano terra in [INDIRIZZO]
alle prescrizioni vigenti in materia di eliminazione delle barriere architettoniche, garantendo
l’accessibilità, la visitabilità e l’adattabilità previsti dalla normativa.

Inoltre trattandosi di uno studio privato di odontoiatria non si è soggetti alle prescrizioni della
normativa vigente.`,
  20: `Il titolare dello Studio Odontoiatrico [TITOLARE], sito in [INDIRIZZO]

                                                Dichiara

Di aver stipulato un contratto con la ditta Ambietal S.r.l. via Pingitore n. 2 – 90017 Santa Flavia
(PA) P.IVA: 03477990828 specializzata per il ritiro e lo smaltimento deirifiuti speciali.

Il presente contratto allegato alla presente e anche disponibile in sede.`,
  21: `DICHIARAZIONE TECNICA DI CONFORMITÀ – CONDIZIONI MICROCLIMATICHE
         (ai sensi del D.Lgs. 81/2008, D.P.R. 74/2013, UNI EN ISO 7730 e s.m.i.)

1. Dati generali

Oggetto: Studio odontoiatrico – Verifica condizioni microclimatiche
Comune: Villabate (PA)
Ubicazione: [INDIRIZZO]
Titolare attività: [TITOLARE]


2. Premessa

Per gli adeguamenti delle condizioni ambientali e impiantistiche, il Dott. Tereso Francesco per garantire
la conformità dei locali adibiti a studio odontoiatrico alle vigenti disposizioni in materia di microclima
e benessere termico, ha predispostounimpianto di climatizzazionea pompe di calorea semplice split
dotate discaricodicondensaadeguatamentecanalizzata, ed inoltre a istallato un impianto di ricambio
d’aria e ventilazione meccanica controllata.

Gli stessi consentono il mantenimento di temperature e percentuali di umidità ottimali nei mesi estivi
ed invernali.

La pulizia e sanificazione dei filtri è prevista con cadenza trimestrale.


4. Descrizione dell’immobile e degli impianti

Lo studio odontoiatrico è situato al piano terra, dotato di:

      Impianto di climatizzazione estiva/invernale con distribuzione a espansione diretta e
       regolazione della temperatura per ambiente;
      Impianto di ricambio d’aria e ventilazione meccanica controllata

       è stato istallato un recuperatore di calore “Mitsubishi Electric” denominato “Lossnay” modello
       LGH-50RX5 avente una portata d’aria mc/h 500 (S.Alta) a 150 Pa e di mc/h 350 (bassa) a 30
       Pa. Garantendo una portata d’aria ≥ 6 vol/h nei locali operativi e ≥ 3 vol/h nei locali di attesa;
       (si allega scheda tecnica dell’istallatore)

      filtrazione aria conforme alla classe minima F7 (UNI EN ISO 16890) per ambienti sanitari;
      sistemi di regolazione e manutenzione programmata documentata nel libretto d’impianto;
      umidità relativa mantenuta tra 40% e 60%;
      temperatura operativa media tra 20–24 °C in inverno e 24–26 °C in estate.


5. Valutazione delle condizioni microclimatiche

Sulla base delle misurazioni e della documentazione tecnica degli impianti, si riscontra che:

      i valori di temperatura, umidità relativa, velocità dell’aria e tasso di ventilazione rientrano
       nei limiti raccomandati per ambienti sanitari;

   i locali destinati a sala d’attesa, ambulatori odontoiatrici, locale sterilizzazione e servizi
       igienici garantiscono un microclima idoneo al comfort termico e alla sicurezza igienico-
       sanitaria;
      l’impianto è oggetto di manutenzione periodica e controlli di efficienza energetica.


6. Conclusioni

Pertanto lo studio odontoiatrico in oggettopossiede i requisiti microclimatici previsti dalle vigenti
norme in materia di tutela della salute e sicurezza dei lavoratori e degli utenti, garantendo adeguate
condizioni di aerazione e di comfort ambientale.


Allegati

      Scheda tecnica impianto di climatizzazione e recuperatore d’aria;
      Verbale ultima manutenzione e controllo efficienza energetica;
      Planimetria dei locali con indicazione dei punti di aerazione;

SCHEDAREGISTROMANUTENZIONEIMPIANTODICONDIZIONAMENTO

                                                          INTERVENTO
     POSIZIONE              DATA     OPERATORE                                            NOTE
                                                      (Indicaregliinterventieffettuati)

SALA ATTESA

SEGRETERIA

SALA OPERATIVA 1

SALA OPERATIVA 2

SALA PERSONALE

SALA
STERILIZZAZIONE


Intervento:
1)    Rimozione filtro
2)    Aspirazione polveri
3)    Sgrassaggio
4)    Sterilizzazione/Disinfezione/Sanificazione (per immersione almeno 30 mini soluzione, o in
      alternativa trattamento con spray specifico)
5)    Posizionamento filtro
6)    Sostituzione filtro
7)    Prodotto utilizzato: _______________________________________________________`,
  22: `Il titolare dello Studio Odontoiatrico [TITOLARE], sito in [INDIRIZZO]

                                               Dichiara

Che all’interno dello studio non vi sono presenti impianti di distribuzione di gas.`,
  23: `Il titolare dello Studio Odontoiatrico [TITOLARE], sito in [INDIRIZZO]

                                               Dichiara

Che all’interno dello studio non sono presenti materiali esplodenti.`,
  24: `L’immobile sito in [INDIRIZZO]
studio odontoiatrico è stato dichiarato agibile dal municipio di Villabate giusto
certificato di agibilità Prot. N° 21435/07 rilasciato in data 17.10.2007.
Da tale data l’immobile non ha subito variazioni strutturali tali da richiedere un nuovo
nulla osta strutturale.

STUDIO ODONTOIATRICO
 [TITOLARE]
    Sito in [INDIRIZZO]


Documento 25
Obblighi assicurativi definiti
dalla normativa applicabile.


Cod. Requisito
1A.04.12.04


[TITOLARE]

Secondo la normativa applicabile il [TITOLARE] a stipulato polizza allegata
alla presente`,
  26: `CARTA DEI SERVIZI


                             STUDIO
                      ODONTOIATRICODOTT.TE
                         RESI FRANCESCO

                          Via Ammiraglio
                          Gravina n°9– 11


Rev.01del03/11/2025                          

INDICE


         1. Studio Odontoiatrico [TITOLARE]

            1.1       Presentazione
            1.2       Fini istituzionali
            1.3       Principi fondamentali


         2. PRESTAZIONI, MODALITA’DIACCESSO, STANDARD

            2.1 Prenotazione eaccettazione

         3. TUTELA DEGLI UTENTI E CONTROLLI DELLA QUALITA’

            3.1 Organismi di controllo e verifica
            3.2 Rilevazione della soddisfazione degli utenti
            3.3 Gestione dei Reclami


Rev.01del03/11/2025                                            

Gentile utente,

         La presente Carta dei Servizi è essenzialmente volta alla tutela dei diritti degli utenti del
         nostro Studio e costituisce un importante strumento di controllo da parte del cittadino
         sulle modalità di erogazione dei servizi offerti, sugli standard di qualità garantiti e sulla
         completezza delle informazioni fornite.

         Essa illustra, inoltre, gli organismi interni preposti alla tutela dell’utente e le procedure
         per la presentazione dei reclami relativi ad atti o comportamenti che possano limitare o
         impedire la piena fruibilità delle prestazioni sanitarie. In tal modo, lo Studio assicura la
         trasparenza, la correttezza e l’efficacia delle prestazioni offerte.

         Ai cittadini utenti è richiesto di collaborare attivamente, anche attraverso la compilazione
         dei questionari di soddisfazione, al fine di consentire un continuo miglioramento della
         qualità del servizio, frutto dell’impegno condiviso e coordinato di tutto il personale
         operante nello Studio.

         In sintesi, l’obiettivo che ci proponiamo è quello di coinvolgere direttamente il cittadino
         utente nella gestione della propria salute, promuovendo la conoscenza, la libera scelta e
         la verifica dei servizi offerti.


                                                                                          IlTitolare


Rev.01del03/11/2025                                                                             

1. Lo Studio Odontoiatrico [TITOLARE]

         1.1 PRESENTAZIONE

         La struttura sanitaria in oggetto è un riferimento d’eccellenza per il territorio nelcampo
         odontoiatrico, ed offre una gamma di servizi che si erogano in ambienti dimoderna
         concezione in cui sono previstedue sale operative dotate di attrezzature di nuova
         concezione tecnologica, soluzioni impiantistiche all’avanguardia, ed è situata in una zona
         facilmente raggiungibile.

         L’esecuzione delle prestazioni vanno dalla diagnosi alla cura e si inoltrano nelle seguenti
         branche specialistiche della scienza e dell’arte odontoiatrica:


              1) Odontoiatria Conservativa e Restaurativa
              2) ChirurgiaOrale
              3) Protesi dentaria riabilitativa e funzionale
              4) Ortodonzia fissa, mobile, e funzionale
              5) Igieneorale
              6) Implantologia
              7) Endodonzia
         Lo studio odontoiatrico considera obiettivo primario il conseguimento di una qualità
         ottimale delle prestazioni fornite ai pazienti. Questo obiettivo impegnatutto il personale
         ad adeguare il proprio sistema operativo ed organizzativo alle richieste e ai bisogni
         dell’utenza.
         L’alta professionalità degli operatori garantisce una totale sicurezza e fiducia sia nelle
         prestazioni e sia nella fase di accettazione e contatti con la clientela.


                                          ORARI DI APERTURA:

                Lunedì Giovedì                        9.00 – 12.30

                                                      14.30- 19.00

                Venerdì                              9.00 – 12.00

         Ragione sociale: Studio Odontoiatrico Privato.
         Denominazione: Studio Odontoiatrico [TITOLARE]
         Sede: Via Ammiraglio Gravina 9 -11
         Tel: 3392900330
         Email: teresifrancesco@outlook.it
         Azienda di appartenenza: ASP6 - Palermo


Rev.01del03/11/2025                                                                             

1.2 INFORMAZIONI PER L’UTENTE

         COME ARRIVARE

       Lo Studio Odontoiatrico è situato in [INDIRIZZO]
           E’ raggiungibile tramite mezzi pubblici (autobus di linea) con fermata a me t r i 50 dallo
              Studio o con il Taxi
           Con mezzi privati che trovano facilmente parcheggio in zona: (foto Google)


Rev.01del03/11/2025                                                                              

1.2 FINI ISTITUZIONALI
         Scopo dello Studio è quello di erogare prestazioni odontoiatriche connesse con le
         esigenze dei cittadini; Lo Studio intende, inoltre, partecipare attivamente alla integrazione
         delle attività di quanti operano nell'ambito del Sistema Sanitario Nazionale (medici di
         base, medici specialisti, strutture ospedaliere, etc.). I suoi fini istituzionali sono:

                 Facilitare l’accesso ai servizi da parte dei cittadini, riducendo al minimo i tempi di
                  attesa e semplificando le procedure.
                 Ricercare ed attuare il massimo della sicurezza e dell’efficienza nell’esecuzione
                  delle procedure odontoiatriche e nell’assistenza agli utenti.
                 Garantire prestazioni del più alto livello di qualità, rispondenti alle esigenze di
                  personalizzazione delle attività sanitarie.
                 Garantire la disponibilità di tutti i mezzi giudicati necessari da parte dell’équipe di
                  medici, biologi e tecnici che operano al suo interno.
                 Informare compiutamente e correttamente il cittadino sull’iter successivo
                  all’esecuzione degli esami e alla presentazione dei risultati.
                 Partecipare alla ricerca scientifica nel settore, favorendo l’attività multidisciplinare
                  e la collaborazione con centri, enti e istituzioni esterne.
                 Partecipare alla formazione di odontoiatri, tecnici e personale amministrativo.


          1.3 PRINCIPI FONDAMENTALI

         Eguaglianza
         Lo Studio si impegna costantemente per assicurare l'accesso ai propri servizi nei tempi
         più brevi possibili, qualunque sia l’appartenenza sociale, razziale, ideologica, politica,
         economica e di età del cittadino utente in ossequio ai principi fondamentali di
         eguaglianza.
         Imparzialità
         Il personale del Centro ispira il proprio comportamento a criteri di giustizia e imparzialità
         nel pieno rispetto dei principi della dignità umana.
         Efficienza ed efficacia
         L'efficienza dell'organizzazione e l'efficacia delle prestazioni sono i due principi ispiratori
         dell'attività dello Studio.
         Partecipazione
         Lo Studio assicura al cittadino, nelle forme previste dalla legge, la possibilità diaccedere
         alle informazioni riferite alla propria persona, delle quali può richiederecopiain qualsiasi
         momento, e di formulare proposte di soluzioni migliorativenell'erogazionedeiservizi.


Rev.01del03/11/2025                                                                                 

2. ORGANIZZAZIONE


              Si tratta di un’organizzazione molto semplice, dal momento che la Direzione
               accentra la maggior parte delle attività critiche dell’ambulatorio.
              Il seguente organigramma illustra nel dettaglio le figure professionali presenti.


                                                  Titolare
                                               [TITOLARE]


                             EspertoQualificato
                            ____________


      SEGRETERIA/URP
                                            RESP. MANUTENZIONE
           Dott.         AMMINISTRAZIONE           Dott.TERESI
                            Dott.TERESI            FRANCESCO
           RESP.            FRANCESCO
      SISTEMAQUALIT
            A'                                                          ODONTOIATRIA
           Dott.                                                          Dott.TERESI
          TERESI                                                          FRANCESCO
        FRANCESCO


Rev.01del03/11/2025                                                                       

3.    PRESTAZIONI, MODALITA’ DI ACCESSO, STANDARD


         Le prestazione offerte dal Centro odontoiatrico sono le seguenti:

            Visitaodontoiatrica
            Endodonzia
            Conservativa
            Estrattiva
            Parodontologia/implantologia
            Ortodonzia
            Protesi

         Presso la segreteria dello Studio è disponibile un prontuario dettagliato delle singole
         prestazioni. Il cliente può fare espressa richiesta di prendere in visione tale elenco, al
         personale di segreteria.


         3.1 Prenotazione e accettazione
         Modalità di Accesso e Gestione delle Prestazioni

 L’utente può richiedere l’effettuazione di una visita:

        Telefonando negli orari di apertura riportati nel frontespizio;
        Presentandosi direttamente al Centro in qualunque giorno feriale.

 In quest’ultimo caso, vengono rispettati i turni in base all’ordine di arrivo e alla priorità delle
 emergenze.
 I piani di cura vengono preventivamente concordati con il medico e regolarmente registrati.


 Gestione delle Emergenze

 Le emergenze sono gestite secondo le seguenti modalità:

        Emergenza urgente (emorragia, dente fratturato, dolore spontaneo intenso, gonfiore con
         rialzo termico, decementazione provvisoria con dolore):
         → Appuntamento immediato con il medico responsabile, senza tener conto dell’ordine
         delle prenotazioni.
        Emergenza (rottura di protesi, frattura di dente non dolente):
         → Appuntamento entro 24 ore con il medico responsabile.
        Urgenza (rottura di protesi senza impedimenti particolari, caduta di otturazione senza
         dolore, decementazione, rottura o danno ortodontico):
         → Appuntamento entro 48-72 ore con il medico responsabile.


 Comunicazioni e Documentazione

       Le chiusure programmate dello studio sono comunicate per tempo mediante affissione.
Rev. 01 del 06/11/2025                                                                  

   Le chiusure per cause di forza maggiore saranno tempestivamente comunicate agli
          utenti.
         Il paziente deve essere provvisto di un documento di riconoscimento, come richiesto
          dalle normative sanitarie nazionali e regionali in materia di privacy.
         Il paziente è tenuto a fornire tutte le informazioni relative al proprio stato di salute e alle
          eventuali terapie in corso, per consentire una diagnosi e una cura accurate.
         Il mancato rispetto di uno o più appuntamenti, se non concordato con il personale di
          studio, autorizza il Titolare a considerare chiuso il piano di cura.


 Consenso Informato e Trattamento dei Dati

 L’utente deve inoltre sottoscrivere il modulo di consenso informato per il trattamento dei dati
 personali, ai sensi del Regolamento UE 679/2016 (GDPR) e del D.Lgs. 101/2018.


 Tempi di Attesa

 Per quanto riguarda i tempi medi di attesa, si fa riferimento al tempo necessario per sottoporsi
 alla visita iniziale, che viene erogata al momento stesso della richiesta.
 Il tempo successivo per le altre prestazioni è stabilito in base alla tipologia dell’intervento e alle
 esigenze del paziente, e pertanto non è standardizzabile.


 Prenotazioni e Gestione delle Liste d’Attesa

 La segreteria dello Studio Odontoiatrico può ricevere prenotazioni:

         Telefonicamente (chiamate, SMS, WhatsApp, e-mail);
         Direttamente in studio, preferibilmente previo appuntamento telefonico.

 Le liste d’attesa sono gestite dal personale preposto tramite un software gestionale o, in
 alternativa, mediante agenda cartacea, tenendo conto delle urgenze e delle terapie di particolare
 impegno stabilite dal Titolare.

         Al paziente presente fisicamente viene consegnata una ricevuta di promemoria;
         Al paziente non presente viene inviato un SMS di conferma e promemoria.


 Modalità di Pagamento

 Il pagamento delle prestazioni prevede:

         Un acconto iniziale pari a circa il 30% dell’importo totale, dopo l’accettazione del
          preventivo del piano di cura;
         Un secondo acconto durante l’erogazione delle prestazioni;
         Il saldo finale alla conclusione del trattamento.

 Le modalità di pagamento possono essere scelte dal cliente tra le opzioni proposte dallo studio.

                 Contante (massimale secondo le norme di legge vigenti)
Rev. 01 del 06/11/2025                                                                             

    Bonifico bancario
                  POS
                  Finanziamento

         STANDARD

                                                              INURGENZA                  INELEZIONE
                   TEMPID’ATTESA                              IMMEDIATA                  3GIORNILAVORATIVI
                      PERVISITA
                   ODONTOIATRICA
          TEMPID’ATTESA PER TRATTAMENTO                       3GIORNI                    7GG
          TEMPID’ATTESA PER IMPLANTOLOGIA                                                14GG
          TEMPID’ATTESA PER ORTODONZIA                                                   14GG


         Indicatori, valori di accettabilità e metodi di verifica dei requisiti

                                                                Valore di
                             Indicatore                                               Metodo di verifica
                                                              accettabilità

          Verifica accuratezza dei controlli sulla                            Verifica attività a campione (5
                                                                  100%
          sterilizzazione                                                     attività ogni mese)

          Verifica rispetto dei protocolli                        100%        Riesame annuale dei protocolli

                                                                              Rilevazione a campione su almeno
          Verifica della completezza dei referti rilasciati
                                                                  100%        10 cartelle o referti ogni 4 mesi


          Verifica registrazioni avvenuto controllo su                        Rilevazione a campione su
          apparecchiature/ impianti/dispositivi/farmaci           100%        almeno 10 registrazioni dei
                                                                              controlli ogni 6 mesi


         4.TUTELA DEGLI UTENTI E CONTROLLI DELLA QUALITÀ
          4.1 ORGANISMIDICONTROLLOEVERIFICA
         Lo Studio tramite il suo Titolare garantisce la supervisione ed il controllo di tutte le
         attività svolte al proprio interno, sia nell’ambito strettamente sanitario, sia in quello
         tecnologico.
         Lo stesso inoltre

          •    Garantisce l’informazione, l’accoglienza e la tutela degli utenti, con particolare
               riguardo agli aspetti di personalizzazione e umanizzazione del rapporto.
          •    Analizza le risultanze dei reclami pervenuti e i dati dei questionari di soddisfazione
               compilati dai cittadini utenti.
          •    Promuove l’attuazione delle azioni correttive e preventive necessarie al superamento
               delle criticità riscontrate.
          •    Riesamina annualmente l’intera struttura per assicurare la costante adeguatezza dei
               servizi rispetto alle aspettative dei cittadini utenti.

Rev. 01 del 06/11/2025                                                                                          

•    Garantisce il rispetto del “Codice deontologico della professione dei medici
               chirurghi e degli odontoiatri”, aggiornato il 16 dicembre 2006 dalla FNOMCeO
               (Federazione Nazionale degli Ordini dei Medici Chirurghi e degli Odontoiatri),
               nonché delle leggi e dei regolamenti vigenti in materia di esercizio delle attività
               odontoiatriche.


         4.2       RILEVAZIONE DELLA SODDISFAZIONE DEGLI UTENTI
          Lo Studio rileva periodicamente il grado di soddisfazione e i motivi di eventuale
          insoddisfazione degli utenti che hanno usufruito dei propri servizi, mediante la
          distribuzione di un questionario anonimo. I risultati della rilevazione vengono
          sintetizzati in un report trimestrale, che rappresenta un importante punto di riferimento
          per il miglioramento continuo del servizio.
         4.3 GESTIONE DEI RECLAMI

          La presentazione di un reclamo da parte di un cittadino utente rappresenta un segnale
          importante della possibile esistenza, all’interno del sistema organizzativo, di disfunzioni
          che possono avere origine nell’organizzazione stessa, nella struttura tecnica dei servizi o
          nei comportamenti del personale.

          Ai fini del mantenimento dei più alti livelli di qualità del servizio, che costituisce
          l’obiettivo strategico dello Studio, tale segnalazione è di fondamentale importanza, in
          quanto consente di intervenire tempestivamente per l’eliminazione delle disfunzioni e per
          il ripristino degli standard qualitativi.

          Il reclamo viene quindi considerato come un contributo collaborativo da parte dei
          cittadini utenti al miglioramento del sistema aziendale e, come tale, è oggetto della
          massima attenzione.

          Lo Studio si impegna a instaurare con chi ha presentato il reclamo un rapporto
          trasparente e collaborativo, volto alla risoluzione del problema e alla prevenzione di
          eventuali recidive.

          Lo Studio si è dotato di una procedura formalizzata per la gestione dei reclami, che
          mira non soltanto alla risoluzione delle problematiche segnalate, ma anche a costituire
          un’importante fonte di informazione di ritorno sull’efficacia e l’efficienza del proprio
          sistema di qualità.

 Modalità di Presentazione dei Reclami

          I cittadini utenti possono presentare eventuali reclami relativi a disservizi riscontrati
          prima, durante o dopo l’erogazione delle prestazioni da parte dello Studio, con le
          seguenti modalità:

                   Per iscritto, utilizzando l’apposito modulo predisposto, disponibile presso
                    l’ufficio di accettazione;
                   Per iscritto su carta semplice o tramite posta elettronica (e-mail);
                   Verbalmente, rivolgendosi al personale in servizio presso lo Studio.

Rev. 01 del 06/11/2025                                                                                

Raccolta dei Reclami e delle Osservazioni

          Presso la segreteria dello Studio è presente una cassetta appositamente predisposta,
          all’interno della quale l’utente può depositare i moduli di reclamo e, più in generale,
          qualsiasi osservazione o suggerimento finalizzato al miglioramento degli standard di
          qualità dei servizi erogati.

          Il Titolare dello Studio si impegna a fornire una risposta a tutti i reclami entro il
          termine massimo di 8 giorni dalla loro ricezione.


 Disponibilità della Carta dei Servizi

          Una copia della Carta dei Servizi è disponibile nella sala d’attesa e presso la segreteria
          dello Studio, a disposizione degli utenti e del personale.


 Revisione del Documento

          La revisione del presente documento è prevista con cadenza annuale e, in ogni caso, a
          seguito di modifiche riguardanti:

                  Le modalità e tipologie di erogazione dei servizi, oppure
                  L’organigramma dello Studio.


                                                                               IL TITOLARE


Rev. 01 del 06/11/2025`,
  27: `In pianta organica non sono presenti né previsti tirocinanti, specializzandi o altri soggetti che
intervengono nel percorso assistenziale.`,
  28: `La presentazione di un reclamo da parte di un cittadino che ha utilizzato i servizi dello studio è un
segnale sulla possibile esistenza nel sistema aziendale di disfunzioni che possono avere la loro
causa nell’organizzazione, nella struttura tecnica dei servizi, nei comportamenti del Personale.
Tale segnale è per noi di importanza fondamentale perché consente di intervenire per la
eliminazione delle disfunzioni e di riportare ai livelli la qualità dei servizi. (Customer satisfaction)

Si considera, quindi, il reclamo come un importante apporto collaborativo da parte dei cittadini
utenti per il miglioramento del sistema azienda e come tale lo si tratta, dedicandovi la massima
attenzione ed instaurando con che ha avuto motivo di reclamare un rapporto di ampia e trasparente
collaborazione.

Lo studio si è dotato di una procedura formalizzata per la trattazione dei reclami che mira non
soltanto alla risoluzione del problema posto in evidenza ma anche ad agire come importante
informazione di ritorno sull’efficacia ed efficienza del sistema qualità dell’azienda.

I cittadini utenti possono presentare eventuali reclami per disservizi subiti prima, durante e dopo
l'esecuzione delle prestazioni erogate dal Centro; il reclamo può essere inoltrato con le seguenti
modalità:
    per iscritto, utilizzando il modulo predisposto disponibile presso l'ufficio di accettazione.
    per iscritto su carta semplice o a mezzo mail.
    verbalmente rivolgendosi al Personale in servizio presso lo studio.


Presso la segreteria dello Studio è presente una cassetta appositamente predisposta all’interno della
quale l’utente conferirà i moduli di reclamo e comunque qualunque osservazione volta al
miglioramento degli standard di qualità.


       La Direzione fornirà una risposta a tutti i reclami entro il termine massimo di 8 giorni.

Scheda fornita ai clienti al fine di utilizzare le loro valutazioni insieme a
           quella dei familiari per la progettazione di piani di miglioramento:

    Gentile Signora/Gentile Signore
     Il questionario a cui Lei, se vorrà, potrà rispondere è formulato in forma anonima con lo scopo
di conoscere il grado di soddisfazione per le prestazioni e i servizi erogati da questo studio.
     Le Sue risposte e gli eventuali suggerimenti serviranno a migliorare il livello delle prestazioni e
dei servizi. È sufficiente che sbarri con una croce la risposta che ritiene più giusta.

    1. Come valuta l’ubicazione dell’ambulatorio per facilità di accesso, raggiungimento, e presenza
       di ostacoli?
    Buona                Sufficiente               Insufficiente          Scarsa

    2. Come giudica il sistema di prenotazione?
    Buono                Sufficiente               Insufficiente          Scarso

    3. Come giudica il sistema di accoglienza?
    Buono                Sufficiente               Insufficiente          Scarso
    4. Come giudica il sistema di accettazione?
    Buono                Sufficiente               Insufficiente          Scarso
    5. Come giudica la prestazione sanitaria?
    Buona                Sufficiente               Insufficiente          Scarsa

    6. Come valuta la disponibilità del front office e l’atteggiamento mostrato nel venire incontro
       alle sue esigenze?
    Buona                Sufficiente               Insufficiente          Scarsa

    7. Come valuta nel suo insieme tutto il percorso dalla richiesta del suo medico all’esecuzione
       della prestazione?
    Buono                Sufficiente               Insufficiente          Scarso

    Qualora avesse dei suggerimenti da proporre, La invitiamo a scriverle nello spazio sottostante.


                                                                     Grazie per la collaborazione
                                                                           LA DIREZIONE

    P. S. Dopo aver debitamente compilato questo stampato, affinché il tutto avvenga in modo
anonimo, La invitiamo a depositarlo presso la segreteria in apposito contenitore.`,
  29: `PIANOAZIENDALEPERLAGESTIONEDELRISCHIO
                                   REV. 01 del 06/11/2025

1.      Assistente alla poltrona
In tale gruppo sono compresi gli addetti alle operazioni di supporto all’attività professionale
dell’odontoiatra svolta presso lo Studio. Essi operano in prossimità del paziente durante le sedute e si
occupano delle esigenze logistiche, quali la preparazione delle attrezzature, le operazioni di
sterilizzazione dello strumentario e la disinfezione delle postazioni di lavoro tra un paziente e il
successivo.


Descrizione del pericolo                                       Durata   Gravità   Evento       I/R
Disturbi muscolo-scheletrici dovuti a posizioni di
                                                                 4        2         2           16
lavoro prolungate in piedi o incongrue/inadeguate.
Elettrocuzione durante l’uso di attrezzature elettriche.         2        4         1           8
Infortuni dovuti all’uso di attrezzature manuali, in
particolare a carico degli arti superiori, causati dal           2        2         2           8
contatto con parti taglienti o aghi.
Contatto con materiale organico potenzialmente
                                                                 2        4         2           16
infetto (ad esempio sangue o saliva).
Rischio biologico: contagio con i ceppi virali HSV1 e
HSV2 HBV e HCV, HIV, batteri e virus responsabili
delle infezioni delle vie aeree superiori, agenti eziologici     2        4         2           16
di affezioni polmonari virali e batteriche (es. legionella)

Inalazione di polveri e vapori/aerosol                           3        3         1           9
Irritazioni cutanee dovute all’uso di guanti in lattice.         2        2         1           4
Stress psicofisico causato da orari e ritmi di lavoro
                                                                 3        3         1           9
eccessivi.
“Contatto con detergenti e disinfettanti utilizzati per
                                                                 3        2         2           12
la manutenzione igienica dei locali e delle
attrezzature.”
Rischio da R.I..                                                 1        4         1            4
Uso dei video terminali                                          2        1         3            6
Movimentazione manuale dei carichi                               1        2         2            4
Ustioni da contatto durante i cicli di sterilizzazione.          2        3         2           12
Microclima                                                       4        2         1            8
Incendio                                                         1        4         1            4
Radiazioni ottiche artificiali (noncoerenti)                     2        2         2            8


              PRINCIPALI MISURE DI PREVENZIONE ED ISTRUZIONI PER GLI ADDETTI

Misure di Prevenzione e Protezione Generali

    Sostituire, ove possibile, i prodotti maggiormente nocivi con altri a minore impatto sulla salute e
     sull’ambiente.
    Effettuare ricambi d’aria dei locali in numero adeguato, garantendo una corretta ventilazione.
    Prevedere un’etichettatura idonea per tutte le sostanze chimiche o tossiche presenti nello studio.
    Sono predisposti comandi di emergenza per interrompere rapidamente l’alimentazione elettrica sia
     all’intero impianto (sul quadro generale) sia alle singole zone operative (quadri di zona).
    Gli utensili elettrici portatili devono essere corredati da libretto d’uso e manutenzione.


Uso di Prodotti Chimici e Disinfettanti

   Fornire formazione e informazione ai lavoratori sui rischi connessi all’uso di disinfettanti e prodotti
       chimici impiegati in odontoiatria.
      Durante l’uso di tali sostanze, adottare gli accorgimenti necessari per evitare il contatto con pelle, occhi
       e altre parti del corpo.
      Utilizzare adeguati dispositivi di protezione individuale (DPI).
      Ogni sostanza deve essere conservata in modo appropriato, secondo le indicazioni riportate nella
       scheda di sicurezza.
      È vietato consumare cibi e bevande durante l’utilizzo di sostanze chimiche o disinfettanti.
      Acquisire e conservare le schede di sicurezza (SDS) relative a tutte le sostanze chimiche e tossiche
       utilizzate.
      Predisporre tabelle di pronto soccorso con indicazioni sugli interventi da attuare in caso di esposizione
       accidentale.


  Misure Ergonomiche e Organizzative

      Attuare misure tecnico-organizzative per ridurre la ripetitività e la monotonia delle operazioni (pause,
       rotazione delle mansioni, turni equilibrati).
      Durante le operazioni di pulizia tra un paziente e l’altro, utilizzare sostanze il meno tossiche e volatili
       possibile.
      Scegliere prodotti detergenti con pH vicino alla neutralità.
      Utilizzare e conservare con cura le attrezzature taglienti.
      Adottare posizioni di lavoro comode ed ergonomiche.
      I pavimenti devono essere non scivolosi e mantenuti puliti.
      Le attività di pulizia non devono essere effettuate contemporaneamente ad altre attività operative.
      L’apertura delle porte non deve generare situazioni di pericolo; devono essere libere da ostacoli, avere
       maniglie prive di spigoli vivi ed essere facilmente accessibili.
      L’impianto idraulico deve fornire acqua calda e fredda; devono essere disponibili detergenti e mezzi
       per l’asciugatura delle mani.
      I locali devono essere mantenuti in perfette condizioni igieniche.
      Curare una scrupolosa igiene personale, con lavaggio frequente delle mani.


  Dispositivi di Protezione Individuale (DPI)

I lavoratori devono utilizzare DPI conformi alla normativa CE, in particolare:

      Guanti in lattice (per operazioni con contatto con liquidi biologici del paziente, es. sangue, saliva,
       sudore).
      Indumenti protettivi adeguati (camici o divise sanitarie).
      Mascherina di protezione delle vie respiratorie, da sostituire indicativamente ogni ora o quando
       necessario.
      Visiera protettiva durante le operazioni a stretto contatto con il paziente, soprattutto in caso di utilizzo
       di strumentazione rotante ad alta velocità.
      Cuffia per capelli per evitare contaminazioni.
      Occhiali protettivi durante l’esposizione a radiazioni ottiche artificiali non coerenti (ROA non
       coerenti).

2.       Collaboratore Odontoiatra/Igienista
  In tale gruppo sono considerati i collaboratori di supporto delle attività e pratiche professionali specifiche svolte in
  regime di consulenza svolte presso lo Studio. Operano in prossimità del paziente durante le sedutee provvedono alla
  prestazione delle pratiche professionali per le quali sono chiamati secondo le proprie specializzazioni, compreso la
  effettuazione delle radiografie ad uso complementare alla attività


   Descrizionedelpericolo                                          Durata        Gravità       Evento           I/R
   Disturbimuscolo-scheletriciperposizionedilavoro in piedi o
                                                                       2            1             2              4
   incongrue/inadeguate.
   Elettrocuzione durante l’utilizzo di attrezzature                   2            2             1              4
   elettriche.
   Infortuni per l’uso di attrezzature manuali e, in particolare
   agli arti superiori, per il contatto con parti taglienti ed         3            1             3              9
   aghi.
   Contatto con materiale organico potenzialmente in fetto
                                                                       3            3             3              27
   (es. sangue, saliva)
   Movimentazione Manuale dei Carichi                                  1            1             1              1
   Rischio biologico: contagio con i ceppi virali HSV1 e
   HSV2 HBV e HCV, HIV, batteri e virus responsabili
   delle infezioni delle vie aeree superiori, agenti                   3            3             3              27
   eziologicidiaffezionipolmonariviraliebatteriche
   (es.legionella)
   Inalazione di polveri e vapori/aerosol                              3            3             3              27
   Irritazioni cutanee da guanti in latice                             2            1             2               4
   Stress psicofisico causato da orari e ritmi di lavoro
                                                                       3            1             1              3
   eccessivi.
   Contatto con detergenti e disinfettanti per la manutenzione
                                                                       3            1             2              6
   igienica dei locali e delle attrezzature.
   Rischio daR.I..                                                     1            3             2              6
   Microclima                                                          3            2             1              6
   Incendio                                                            1            3             1              3
   Rischio elettrico                                                   3            2             1              6
   Radiazioni ottiche artificiali (non coerenti)                       2            2             2              8


                   PRINCIPALI MISURE DI PREVENZIONE E DISTRUZIONI PER GLI ADDETTI

Misure di prevenzione e protezione generali

       Sostituire i prodotti maggiormente nocivi con altri a minore impatto tossicologico.
       Effettuare ricambi d’aria dei locali in numero adeguato, garantendo una corretta ventilazione.
       Prevedere un’idonea etichettatura delle sostanze chimiche o tossiche presenti nello studio.
       Sono predisposti comandi di emergenza per interrompere rapidamente l’alimentazione elettrica
        all’intero impianto (sul quadro generale) e alle singole zone (quadri di settore).
       Gli utensili elettrici portatili devono essere corredati da un libretto d’uso e manutenzione.
       Fornire formazione e informazione ai lavoratori sui rischi lavorativi connessi all’uso di disinfettanti e
        prodotti chimici impiegati in odontoiatria.
       Durante l’uso di sostanze chimiche devono essere adottati tutti gli accorgimenti necessari per evitare il
        contatto con pelle, occhi e mucose.
       Adoperare adeguati mezzi di protezione personale (es. creme barriera, guanti in lattice, mascherine,
        visiere).
       Ogni sostanza deve essere opportunamente conservata secondo le istruzioni del produttore.
       Durante l’uso di sostanze chimiche o tossiche è vietato consumare cibi e bevande.
       Attenersi scrupolosamente a quanto prescritto dall’Esperto Qualificato in materia di Radioprotezione
        (art. 80 D.Lgs. 230/95 e s.m.i.).
       Acquisire e tenere a disposizione le schede di sicurezza (SDS) delle sostanze chimiche o tossiche
        utilizzate.

   Predisporre tabelle e istruzioni di primo soccorso per le sostanze impiegate.
       Attuare misure tecnico-organizzative per ridurre il più possibile la ripetitività e la monotonia delle
        operazioni (pause, rotazione dei compiti, turni equilibrati).
       Scegliere prodotti detergenti con pH vicino alla neutralità.
       Utilizzare e conservare gli strumenti taglienti con la dovuta attenzione e cura.
       Utilizzare occhiali protettivi durante l’esposizione a radiazioni ottiche artificiali (ROA) non coerenti.


Dispositivi di Protezione Individuale (DPI) con marcatura “CE”

I lavoratori che eseguono le attività operative devono utilizzare regolarmente i seguenti DPI:

       Guanti in lattice (per operazioni con contatto con liquidi biologici del paziente, come sangue, saliva,
        sudore).
       Indumenti protettivi adeguati (camici o divise da lavoro).
       Maschera di protezione delle vie respiratorie, da sostituire circa ogni ora o quando si inumidisce.
       Visiera protettiva durante le operazioni in prossimità del paziente che prevedono l’uso di
        strumentazione rotante, specialmente ad alta velocità.
       Occhiali schermanti protettivi per l’impiego di ROA non coerenti.

3.       Impiegato amministrativo

  In tale gruppo sono considerati gli addetti ai videoterminali, i responsabili dei rapporti con la clientela e con i fornitori

   Descrizionedelpericolo                                          Durata         Gravità       Evento           I/R
   Uso dei video terminali                                           3              1             4              12
   Urti, colpi, impatti e compressioni                               1              1             1               1
   Stress psicofisico                                                3              3             2              18
   Rischio biologico: contagio con i ceppi viraliHSV1 e              1              2             2               4
   HSV2 HBV e HCV, HIV, batteri e virus responsabili
   delle infezioni delle vie aeree superiori, agenti
   eziologici di affezioni polmonari virali e batteriche

   Punture, tagli ed abrasioni                                        1              1             2              2
   Elettrocuzione                                                     2              1             2              4
   Incendio                                                           2              3             1              6
   Inalazione di polveri                                              2              2             2              8
   Contatto con sostanze irritanti e allergizzanti                    1              1             1              1
   Contatto con materiale organico                                    1              1             1              1
   Allergie                                                           1              1             1              1
   Rumore                                                             1              1             1              1
   Movimentazione manuale dei carichi                                 1              2             2              4


                   PRINCIPALI MISURE DI PREVENZIONE E DISTRUZIONI PER GLI ADDETTI
Misure di Prevenzione e Buone Pratiche Operative – Uffici e Aree Amministrative

       Utilizzare schermi protettivi o filtri per ridurre l’affaticamento visivo durante il lavoro al
        videoterminale (VDT).
       Evitare di mantenere posizioni scomode o statiche per tempi prolungati; quando non è possibile,
        interrompere frequentemente il lavoro per rilassare la muscolatura.
       Assumere sempre una postura comoda ed ergonomicamente corretta.
       Effettuare semplici esercizi di rilassamento, stiramento e rinforzo muscolare durante la giornata
        lavorativa.
       Indossare la mascherina durante la sostituzione del toner della fotocopiatrice.
       Le prese elettriche devono essere correttamente fissate, dimensionate per l’utilizzo previsto e progettate
        in modo da impedire il contatto accidentale con parti in tensione durante l’inserimento della spina.
       I pavimenti devono essere antisdrucciolevoli e mantenuti in buono stato di pulizia.
       Le attività di pulizia non devono essere svolte contemporaneamente ad altre attività lavorative.
       L’apertura delle porte non deve generare situazioni di pericolo: i passaggi devono essere sgombri da
        ostacoli, le maniglie prive di spigoli vivi e facilmente accessibili.
       L’impianto idraulico deve fornire acqua fredda e calda, detergenti e mezzi idonei per l’asciugatura
        delle mani; i locali devono essere mantenuti puliti e ordinati.
       Mantenere una scrupolosa igiene personale, con lavaggio frequente delle mani.
       Garantire che temperatura e umidità dei locali siano mantenute entro i limiti del benessere termico;
        evitare attività rumorose nelle aree aperte al pubblico, salvo la normale rumorosità ambientale.
       Le sedie devono essere ergonomiche e stabili:
            o i sedili fissi devono garantire stabilità;
            o i sedili mobili devono avere cinque razze;
            o i comandi per le regolazioni (altezza, schienale, supporto lombare) devono essere facilmente
                 accessibili;
            o ove necessario, fornire poggiapiedi regolabili.
       I tavoli e le scrivanie devono avere superfici opache e prive di spigoli vivi.
       Gli scaffali devono essere ben fissati alla parete o alla struttura portante e recare l’indicazione del
        carico massimo per ciascun ripiano.
       L’utilizzo degli scaffali deve essere agevole e sicuro, anche in caso di impiego di scale, sgabelli o altri
        accessori.
       Le macchine da ufficio alimentate elettricamente devono:
            o essere collegate all’impianto di messa a terra tramite spina di alimentazione, oppure

o    possedere un doppio isolamento (doppia protezione), garantito da marchio CE e
               documentazione del fabbricante.


4.       Pazienti

In tale gruppo sono considerati i pazienti dello studio odontoiatrico


Descrizionedelpericolo                                             Durata   Gravità   Evento        I/R
Scivolamenti a livello                                               2        2         1            4
Urti e impatti con spigoli vivi degli arredi a corredo dello
                                                                        2     2         1            4
studio
Rischio biologico: contagio con i ceppi virali HSV1 e
HSV2 HBV e HCV, HIV, batteri e virus responsabili
delle infezioni delle vie aeree superiori, agenti eziologici            3     3         2            18
di affezioni polmonari virali e batteriche
(es.legionella eSars-Cov2)
Inalazione di polveri e vapori/aerosol                                  1     2         1            2
Rischio daR.I..                                                         1     3         2            6
Microclima                                                              3     2         1            6
Incendio                                                                1     3         1            3
Rischio elettrico                                                       3     2         1            6
Radiazioni ottiche artificiali (non coerenti)                           2     2         2            8


               PRINCIPALI MISURE DI PREVENZIONE E DI STRUZIONI PER GLI ADDETTI

    Effettuare ricambi d’aria dei locali in numero adeguato, garantendo una corretta ventilazione
     naturale o meccanica.
    Manutenere e sanificare i filtri dei condizionatori con cadenza trimestrale, utilizzando prodotti
     disinfettanti ad ampio spettro, specifici contro batteri Gram-negativi (es. Legionella) e virus
     Sars-CoV-2 (es. ipoclorito di sodio in soluzione al 2%).
    Sono predisposti comandi di emergenza per interrompere rapidamente l'alimentazione all'intero
     impianto elettrico (sul quadro generale) e a sue parti (sui quadri di zona);
    La manutenzione dei presidi antincendio deve essere effettuata con cadenza semestrale.
    Gli apparecchi elettromedicali devono essere verificati con cadenza biennale.
    Leoperazioni di pulizia e specificatamente di lavaggio dei pavimenti deve essere effettuata al termine
     della giornata lavorativa e comunque in assenza di pubblico.
    Attenersi a quanto prescritto dall'Esperto Qualificato in materia di Radioprotezione (art.131D.Lgs.
     100/2020)
    Acquisire le schede di sicurezza delle sostanze chimiche o tossiche utilizzate
    Durante la attesa è obbligatorio l’uso di mascherine possibilmente del tipo FFP2
    Uso degli occhiali protettivi durante l’esposizione a ROA non coerenti

5.       Ambienti di lavoro
Rischi di natura infortunistica

Pavimenti

 I pavimenti non presentano avvallamenti e parti in rilievo; non sono scivolosi e sono facilmente lavabili.
 Le attività di pulizia non devono essere effettuate in concomitanza con le altre attività.
 Devono avere le fughe integre;
 Le piastrelle devono essere prive di sbeccature o tagli profondi.

Pareti e soffitti
 Hanno una superficie liscia, integra, non polverosa, lavabile e di colore chiaro (colori pastello). Gli
  spigoli non devono presentare lesioni o disuniformità; gli zoccolini devono essere integri, privi di
  sporgenze e ben fissati alla parete.
 Verificare che le pareti siano prive di sporgenze o chiodi.
 I rivestimenti dei servizi devono essere uniformi, integri, privi di asperità e facilmente lavabili.
 Le pareti trasparenti e in particolare le pareti vetrate devono essere segnalate.

Porte
 L’apertura di porte non deve generare situazioni pericolose sia per chi compie l’operazione
   che per altre persone. Devono essere mantenute sgombre da ostacoli, avere maniglie prive di
   spigoli vivi ed essere facilmente accessibili. Le porte trasparenti, devono essere segnalare ad
   altezza occhio (1,5 - 1,8 mt.). Le porte devono inoltre essere conformi alla normativa vigente,
   dimensionate e posizionate correttamente a secondo del loro utilizzo (porte d’ingresso, porte
   interne).

Finestre
 L’apertura delle finestre, non deve generare situazioni pericolose sia per chi compie
   l’operazione che per altre persone. Esse vanno dotate di idonei sistemi di schermatura (ad es.
   tende regolabili di colore chiaro) per evitare fastidiosi abbagliamenti, inoltre devono garantire
   un buon ricambio d’aria.
 le cinghie delle persiane avvolgibili devono essere mantenute in buone condizioni e
   controllate periodicamente.
 la conformazione delle finestre deve essere tale da consentire le operazioni di pulitura in
   condizioni di sicurezza o dotati di dispositivi o attrezzature atte a conseguire il medesimo
   risultato.

Servizi
 i servizi devono servire pubblico e operatori.
 L’impianto idraulico deve erogare acqua fredda e calda e devono essere forniti i detergenti e i
   mezzi per asciugarsi. I locali vanno tenuti puliti. Le pareti sono piastrellate sino ad una altezza
   di mt. 2.20

Passaggi
 i corridoi e i passaggi in genere devono essere liberi da ostacoli ed avere sempre un livello di
   illuminamento sufficiente; eventuali dislivelli o riduzioni in altezza devono essere segnalati e
   non devono ridurre a meno di mt. 2 il vano utile percorribile.

Analisi

L’analisi del ciclo di lavoro ha evidenziato la presenza di attività che implicano l'esposizione ad
agenti biologici di cui all'art. 266 e seguenti del D.Lgs 81/2008
Gli agenti biologici, sono classificati in quattro gruppi:
Gruppo1: gli appartenenti a questo gruppo presentano poche probabilità di causare malattie in
soggetti umani
Gruppo2: le probabilità di causare malattie in soggetti umani e costituire un rischio per i lavoratori
aumentano. Difficilmente la malattia si propagherà nella comunità. Sono di norma disponibili
efficaci misure profilattiche o terapeutiche.
Gruppo3: elevate probabilità di causare malattie gravi in soggetti umani e costituire un serio rischio
per i lavoratori. L’agente biologico può propagarsi nella comunità, ma di norma sono disponibili
efficaci misure profilattiche o terapeutiche.
Gruppo 4: le probabilità di determinare malattie in soggetti umani e costituire un serio rischio per i
lavoratori sono elevatissime. E’ frequente la propagazione nella comunità; non sono disponibili
efficaci misure profilattiche o terapeutiche.
A titolo di esempio, i virus HIV e HBV sono inclusi nel gruppo 3.
La popolazione microbica del cavo orale è composta sia di microrganismi assolutamente innocui
che di agenti eziologici di patologie infettive tra le quali le più comuni sono:
                VirusHerpesSimplexHSV1eHSV2
                Virusdell’epatiteBeC(HBVeHCV)
                Virusdell’AIDS(HIV)
                Batteri e virus responsabili delle infezioni delle vie aeree superiori.
                Agenti eziologici di affezioni polmonari virali e batteriche (es. tubercolosi).

I fattori che concorrono alla trasmissione degli agenti patogeni negli ambienti dello studio sono da
ricercarsi nel continuo passaggio di persone, caratteristica dell’attività professionale, nellamancanza
di sistemi di isolamento tra sala operatoria ed ambiente esterno, nella continuaproduzione di
contaminanti ad alto rischio (liquidi organici) e nella grande quantità di materiali, strumenti ed
oggetti impiegati. Tutto ciò favorisce la contaminazione crociata, cioè la trasmissione
diunamalattiainfettivatramitecontagiodirettoe/oindirettodaunportatorealaltrapersona.              Insala
operatoria invece, la contaminazione degli operatori oltre che per diretto contatto con liquidi
biologici contaminati può avvenire anche per ricaduta di particelle, di dimensione compresa tra
0.5550um.Esse restano sospese per circa 24 ore, e le più piccole (il 95% circa) arrivano fino al
livello degli alveoli polmonari.
Possono essere individuati dei sistemi cosiddetti “barriera” che si frappongono tra la pelle o lo
strumentario e gli agenti patogeni. A tale categoria appartengono i guanti, la pellicola trasparente, le
mascherine oro-nasali, occhiali, visiere.

I guanti dovrebbero essere in latice di gommao al limite in vinile in caso di allergie al latice; le
  mascherine oro-nasali sono di buona qualità se la BFE (BacteryFiltrationEfficiency) è superiore al
  90% ed inoltre dovrebbero essere sostituite circa ogni ora dal momento che l’umidità riduce la
  capacità filtrante.
  Alla conclusione di ogni intervento, tutto lo strumentario contaminato deve essere trasportato
  nell’area di sterilizzazione ed essere sottoposto a dei cicli per la decontaminazione, detersione e
  disinfezione. A tal fine gli strumenti devono essere preventivamente immersi in bagno di
  glutaraldeide al 2% per 30’ per ridurre la carica batterica cambiando la soluzione quotidianamente.
  Successivamente la metodica ad ultrasuoni è la più impiegata in odontoiatria; si dovrà evitare di
  mescolaremetallidiversichepotrebbedareluogoaprocessielettroliticiconconseguentecorrosione         e/o
  colorazione. La vaschetta con la soluzione detergente durante il ciclo deve essere tenuta coperta per
  evitare la produzione di aerosol.
  A fine giornata lavorativa è consigliabile effettuare una disinfezione approfondita della sala
  operativa pulendo attentamente oltre che il corpo del riunito anche la sua base ed i mobiletti e il
  lavandino. Tra il paziente e l’altro sarebbe opportuno isolare con pellicola trasparente la lampada, i
  comandi manuali della poltrona e della faretra del riunito, gli aspiratori chirurgici, la testata del
  radiografico. Prima di ogni seduta si potrebbe chiedere al paziente uno sciacquo con clorexidina al
  0.2% per un minuto.

La profilassi per gli operatori, in previsione, sarà garantita da ciclo vaccinale.

Le responsabilità per la prevenzione e il controllo delle infezioni correlate all’assistenza sono:

         a capo dell’Odontoiatra che effettua la prestazione clinica. Lo stesso supervisiona con
          responsabilità diretta le eventuali ASO per le fasi di preparazione della sala operativa e,
          successivamente al congedo del paziente, alla sua sanificazione.

  Protocolli tecnici per la prevenzione dell’esposizione a Legionella
  La legionella è un batterio Gram- che si sviluppa all’interno di biofilm nei circuiti idrici con
  possibilità di permanenza di acqua stagnante. Il range di temperatura di proliferazione è compreso
  tra 20 e 55 °C, raggiungibili ovviamente nei circuiti di distribuzione di acqua calda sanitaria,
  impianti di condizionamento a termosifone, e circuiti idrici in prossimità di circuiti/apparecchiature
  elettriche che durante il loro normale funzionamento raggiungono la temperatura di circa 35°Ccome
  il caso delle poltrone odontoiatriche.
  Al fine di procedere alla valutazione del rischio è stata effettuata la ricognizione all’interno della
  struttura del circuito idrico nel suo complesso, dall’approvvigionamento comunale sino alle singole
  utenze.
  Le risultanze hanno escluso la presenza di rami morti e/o in disuso, e la configurazione “in serie”
  della riserva idrica indipendente posta tra la fornitura comunale e il collettore di smistamento,
  assicurando un continuo ricambio dell’acqua al suo interno. La stessa riserva idrica è
  semestralmente sanificata con soluzione di Amuchina, il cui principio attivo è l’ipoclorito di sodio
  1,15 g che nello spettro di azione contempla elettivamente i batteri Gram-.

Il riunito odontoiatrico si compone del gruppo di adduzione (siringa aria/acqua, ablatore,
  micromotore, contrangolo, bicchiere) e dello scarico (vaschetta sputacchiera ed aspirazione
  localizzata) con circuiti ovviamente separati.
  Premesso che quotidianamente al termine della giornata lavorativa l’assistente alla poltrona
  provvede alla sanificazione e sterilizzazione del gruppo aspirazione con prodotto apposito tramite
  circolazione in matrice chiusa (escluso ogni possibile contatto e/o inalazione) di soluzione adatta
  alla tipologia di riunito, periodicamente (con cadenza semestrale) un tecnico autorizzato provvedeal
  “lavaggio e sanificazione” del gruppo di adduzione in modalità differenti a seconda della
  classificazione e modello del riunito stesso:
       Lavaggio a pressione (circa 2,5 bar) con soluzione (2%) di acido per acetico e tempo di
          permanenza del gruppo idrico di circa 10 minuti con successivo risciacquo
       Lavaggio con acqua ossigenata (per ossido di idrogeno) al3%
  Per ridurre la contaminazione microbica e/o la formazione del biofilm all'interno dei circuiti idrici
  del riunito, si raccomanda di:

         Eliminare dal circuito i tratti esclusi dalle correnti di flusso.
         Installare dispositivi anti-ristagno in grado di far circolare l’acqua in continuo, in particolare durante
          le pause lavorative.
         Alimentare il circuito con soluzioni sterili, dopo averlo isolato dalla rete idrica.
         Disinfettare l’acqua con trattamenti in continuo o discontinui. Questi ultimi, effettuati
          periodicamente o tra un paziente e il successivo utilizzando disinfettanti di alto livello, evitano la
          possibilità     di      contaminazioni         chimiche       del    campo       operatorio,      riducono
          l'esposizionedeglioperatorieminimizzanoilrischiodiselezionaremicrorganismiresistenti,                   ma
          richiedono maggiore impegno di risorse e attenzione rispetto ai trattamenti in continuo.

Per ridurre l’esposizione del paziente ad aerosol potenzialmente contaminati e/o minimizzare il rischio di
infezione.

Il rischio nei pazienti più vulnerabili si consiglia di:
    • All’inizio della giornata lavorativa, effettuare la disinfezione dei circuiti con soluzioni a base di acido
    peracetico e successivo flussaggio di ciascuno strumento (tempo minimo 2 minuti) e prima di ogni
    intervento (tempo minimo 20–30 secondi).

   • A fine giornata lavorativa, eseguire la disinfezione dei circuiti, della vaschetta e del bicchiere con soluzioni
   a base di acido peracetico e successivo flussaggio di ciascuno strumento (tempo minimo 2 minuti) e prima di
   ogni intervento (tempo minimo 20–30 secondi).

   • Installare, subito a monte dei manipoli, filtri (≤ 0,2 μm) in grado di trattenere i microrganismi provenienti
   dall’interno del circuito.

   • Acquisire, preliminarmente all’inizio delle cure, informazioni sulla salute del paziente, con particolare
   riguardo alle condizioni che definiscono il “rischio molto elevato” (Tabella 9). In tali casi, devono essere
   rigorosamente adottate le misure sopra descritte, volte a contenere il rischio di contaminazione da
   Legionella.

Si provvederà a far eseguire annualmente una analisi di laboratorio di campioni d’acqua prelevati dal circuito di
adduzione dei riuniti (bicchiere, manipoli e siringa) per la ricerca del batterio della legionella.

I filtri dei condizionatori saranno smontati e sanificati semestralmente con soluzione a base di
ipoclorito di sodio o disinfettante spray secondo la seguente sequenza:

1         Rimozione filtro
  2         Aspirazione polveri
  3         Sgrassaggio
  4         Sterilizzazione/Disinfezione/Sanificazione (per immersione almeno 30 min in soluzione, o
            in alternativa trattamento con spray specifico
  5         Posizionamento filtro

  Il titolare e gli eventuali futuri dipendenti o collaboratori faranno uso costante dei DPI, seguiranno le
  procedure di disinfezione dei piani di lavoro e delle attrezzature odontoiatriche (lampada e riunito) dopo ogni
  seduta,     ed    effettueranno     il    ricambio     d’aria     naturale    tra    un     paziente     e    l’altro.
  Si valuterà la necessità dell’istituzione della sorveglianza sanitaria tramite la nomina di un Medico
  Competente.


Firme per presa visione dei dipendenti e collaboratori

Il presente documento è stato letto, compreso e accettato da tutti i dipendenti e collaboratori dello
Studio.
Con la firma apposta, ciascun lavoratore dichiara di aver preso visione del contenuto, di essere stato
informato sulle procedure e sulle misure di sicurezza da adottare, e di impegnarsi al rispetto delle
stesse.

N. Nome e Cognome            Qualifica / Mansione         Firma        Data
1
2
3
4
5


  Il piano sarà aggiornato nel caso di eventi straordinari e ogni qual volta sia necessario con la adozioni di eventuali
  misure aggiuntive.

STUDIO ODONTOIATRICO
 [TITOLARE]
     Sito in [INDIRIZZO]


Documento 30
Procedura per la pulizia e
sanificazione degli ambienti.

Cod. Requisito
1A.06.02.02


[TITOLARE]

INDICE

Generalità .............................................................................................................................. 2

Scopo ...................................................................................................................................... 2

Campo di applicazione........................................................................................................... 2

Attività .................................................................................................................................... 3

Identificazione delle aree ....................................................................................................... 4

Valutazione dei criteri igienico sanitari riferiti alle aree ...................................................... 4

Definizione dei protocolli di sanificazione ............................................................................ 4

Scelta degli agenti sanificanti ................................................................................................ 6

Sanificazione ordinaria .......................................................................................................... 7

Sanificazione straordinaria.................................................................................................... 7

Registrazione attività svolta ................................................................................................... 7

GENERALITÀ

Per garantire l’igiene è necessario effettuare quattro distinte operazioni:
   1.   Eliminazione dei rifiuti speciali
   2.   Eliminazione dei rifiuti normali
   3.   Detersione
   4.   Disinfezione


Per l’eliminazione dei rifiuti speciali vanno utilizzati gli appositi contenitori forniti dalla ditta
specializzata checura il ritiro e la successiva eliminazione; i contenitori dei rifiuti speciali devono
essere tenuti costantementechiusi emantenutinellezonepreviste.

Per l’eliminazione dei rifiuti normali, durante le operazioni quotidiane di igienizzazione,
provvedere al lorodepositocomeprevistodalledisposizionicomunali.
Il Responsabile Qualitàdeve controllare cheil personaleaddettoalle pulizie effettui leoperazioni
diigienizzazionesecondo la frequenza e le modalità stabilite nel presente documento e, al termine
delle operazioni, deve provvedere alla registrazione sul documento–Scheda Pulizia e Sanificazione.
Sino al momento della assunzione di personale, le operazioni di pulizia e sanificazione dello studio
sarannosvoltedirettamentedalTitolare.


   SCOPO

        Scopo della presente proceduraè assicurare che vengano rispettate tutte le operazioni per la
puliziadei locali pressolostudio.

   CAMPODIAPPLICAZIONE

L’istruzione si applica a tutte le aree operative e non dello studio.

ATTIVITÀ
   Sono qui descritte sinteticamente le attività dell’igiene degli ambienti per mezzo di un diagramma di
flusso.


       Identificazione
          delle aree


     Valutazione dei criteri
     igienico sanitari delle
          Singole aree


        Definizione del
                                          Scelta degli agenti
         protocollo di
                                              sanificanti
         Sanificazione


                                                                                    Controllo periodico
                                          Sanificazione
                                                                                     della conformità
                                            Ordinaria


                                                                                     NO


                                                                   Sanificazione
                                                                    straordinaria


                                                                                          Scheda
                                                                Registrazione
                                                                                          sanificazione

Identificazione delle aree


Lo studio ha identificato le seguenti aree:

a) Sala d’attesa
b) Segreteria/ufficio
c) Sala personale
d) Sala operativa (1)
e) Sala operativa (2)
f) Sala sterilizzazione
g) Servizio igienico clienti
h) Servizio igienico personale
i) Ingresso - Corridoio
j) zona tecnica


Valutazione dei criteri igienico sanitari riferiti alle aree

La sanificazione degli ambienti di lavoro va riferita alla destinazione d’uso degli ambienti e quindi
alla potenziale contaminazione legata alla specifica attività.

Per tale motivo vanno distinti:
        AMBIENTI A RISCHIO GENERICO (zona di attesa, corridoi, ufficio amministrativo,
         spogliatoio) (ZONA1)
        AMBIENTI A BASSO RISCHIO (Servizi igienici) (ZONA2)
        AMBIENTI A MEDIO RISCHIO (sale operative) (ZONA3)
        SERVIZI IGIENICI (ZONA4)


Definizione dei protocolli di sanificazione.

La sanificazione degli ambienti di lavoro comprende le seguenti operazioni:


Locali:
a) Sala d’attesa
b) Segreteria/ufficio
c) Sala personale

Attività giornaliera:
            Sostituzione dei sacchi dei rifiuti dai cestini, pulire questi ultimi con panno umido, quindi
             introdurre il sacchetto nuovo. Mediante panno inumidito con detergente, asportare la polvere
             dalle mensole, dai tavoli e dalle suppellettili varie e dagli arredi, nonché dai davanzali interni
             e dagli interruttori.
            Sempre con panno umido, eliminare le tracce di sporco e di impronte da porte, stipiti, vetri e
             maniglie, telefoni; per maniglie e telefoni è opportuno utilizzare successivamente un panno
             umido intriso di soluzione disinfettante.
            Lavare i pavimenti con l’uso di MOP a doppio secchio; devono essere previsti almeno due
             passaggi: uno di detersione e il successivo di risciacquo. Ricordarsi di sostituire
             periodicamente i panni utilizzati.

AttivitàMensile:
        Pulizia delle tastiere dei computer con aria compressa.
        Lavaggio finestre, porte, pareti, armadi, vetrine

    Sale Odontoiatriche e sterilizzazione
     d) Sala operativa (1)
     e) Sala operativa (2)
     f) Sala sterilizzazione
Durante l'attività:
                        -   Disinfezione delle superfici di lavoro e/o dei pavimenti tutte le volte che si presenti la
                            necessità (Per esempio, in caso di caduta accidentale di un campione biologico o di
                            sostanze potenzialmente infette.)
                        -   Turbine, ablatori, contrangoli, inserti

Attività Giornaliera:
                        -   Pulizia superfici esterne attrezzature, alogene, riuniti, negativoscopio, autoclave, vasca
                            ultras, ablatore. Lavaggio tubi di aspirazione. Lavaggio filtri aspirazione
                        -   Disinfezione circuiti (prevenzione legionellosi)
                        -   Aprire le finestre per aerare gli ambienti
                        -   Disinfezione di tutte le superfici di lavoro
                        -   Disinfezione lettighe
                        -   Disinfezione pavimenti di tutte le aree di lavoro
                        -   Disinfezione del lavandino
                        -   Sostituzione sacchi rifiuti
                        -   Sostituzione contenitori rifiuti speciali (o in accordo alle condizioni di contratto con la
                            società addetta allo smaltimento)

Attività settimanale
                        -   Pulizia vasca ultrasuoni
                        -   Pulizia camera sterilizzazione dell’autoclave

AttivitàMensile:
                        -   Lavaggio finestre, porte, pareti, armadi, vetrine
                        -   Scarico condensa compressore;
                        -   Lampade.

    Servizi igienici

Durante l'attività:
                        -   Il titolare ed eventualmente il futuro personale da lui incaricato, ha il compito di
                            controllare periodicamente le condizioni igieniche dei servizi e prevedere la disinfezione
                            lasciandone traccia su apposito documento di registrazione.
                        -   Provvederà inoltre alla sanificazione tutte le volte che sene presenti la necessità (per es.
                            caduta accidentale di un campione biologico o di sostanze potenzialmente infette)

Attività Giornaliera:

                        -   Detergere i lavabi con prodotto specifico, quindi risciacquare abbondantemente ed
                            igienizzare   con    derivati   del   cloro;   asciugare   accuratamente   la   rubinetteria.
                            Periodicamente devono essere asportate dai lavabi e dalla rubinetteria le incrostazioni
                            calcaree, con intervento meccanico o chimico.

                        -   Pulire lavabi e water con polveri leggermente abrasive, risciacquare e disinfettare;
                            versare nei sifoni una soluzione di idoneo detergente.
                        -   Lavare i pavimenti
                        -   Eseguire il lavaggio dei servizi igienici nel seguente ordine: con panno spugna
                            inumiditocon detergente pulire i coperchi dei WC, quindi sciacquarli, proseguire poi con
                            la pulizia dei vasi, utilizzando lo scopino e tirando lo sciacquone, infine igienizzare con
                            candeggina
                        -   Controllo e sostituzione carta igienica e rotoloni asciugamani
                        -   Pulizia piastrelle e porte

    Al termine delle operazioni di sanificazione, il responsabile di tale attività, registra la stessa in apposite
    schede di registrazione (vedi allegati alla presente procedura).


    Scelta degli agenti sanificanti.
La scelta degli agenti sanificanti viene effettuata dal Titolare.
    Per la disinfezione di tutte le superfici vengono utilizzati disinfettanti dotati dei seguenti requisiti:
        Largo spettro di attività antibatterica.

   Bassa inattivazione da parte di materiale organico.
    Lunga attività residua sulle superfici trattate.
    Assenza di azione irritante o tossica per l’operatore.


 Sanificazione ordinaria
 Il disinfettante viene ciclicamente (ogni anno o ogni qualvolta sorgano dubbi sulla sua efficacia) sostituito con
 un altro che soddisfi gli stessi criteri. I disinfettanti utilizzati per tutte le superfici sono il benzalconio cloruro e
 l’ipoclorito di sodio.
 Il disinfettante spray per ambienti e superfici contiene cloruro d’ammonio e cloruro benzilammonio


 Sanificazione straordinaria
 Quella stabilita dal programma di sanificazione.
 La disinfezione di maniglie delle porte, interruttori, suppellettili e di tutte le parti ad uso promiscuo avverrà
 periodicamente tramite nebulizzazione di spray disinfettante.
 La disinfezione delle attrezzature va eseguita ad oggi (in assenza di personale) dal Titolare, e in futuro
 dall’assistente alla poltrona sotto la direzione dell’odontoiatra.

Sarà effettuata in caso di riscontro di pazienti con patologie potenzialmente contagiose (es. Sars-CoV-2).


 Registrazione attività svolta

 Il personale addetto, al termine delle operazioni di sanificazione, registra la propria attività sull’apposita
 scheda di sanificazione.

                                            IGIENEDELPERSONALE


 È vietato fumare all’interno di tutti i locali della struttura, a partire dalla zona di attesa.

 L’abbigliamento in dotazione, costituito da camici in cotone pesante, deve essere conservato negli
 appositi armadietti personali situati nello spogliatoio ed indossato all’inizio di ogni giornata,
 assicurandosi che sia pulito e provvedendo, eventualmente, al cambio.

 Le mani devono essere prive di anelli e di bigiotteria, avere sempre le unghie corte e non coperte da
 smalti; eventuali ferite o abrasioni devono essere ben protette da medicazioni impermeabili atte a
 garantirne l’isolamento.

 Le operazioni di igiene personale vanno condotte con la seguente frequenza e modalità:
    • ogni volta che si rientra dall’esterno
    • prima di ogni prestazione effettuata sui pazienti
    • prima di ogni contatto con materiale sanitario o con alimenti
    • dopo ogni contatto con oggetti potenzialmente inquinanti
    • dopo l’utilizzazione dei servizi igienici

     Per l’igienizzazione devono essere utilizzati prodotti a base di tensioattivi vegetali e triclosan o

benzalconio, con pH compreso tra 5,5 e 6,5, ed effettuati i necessari risciacqui; le parti lavate
    andranno asciugate utilizzando tessuto o carta idonea monouso.

    ALLEGATI
1       Schedapuliziaesanificazione


Firmeperpresavisione deilavoratoriedipendenti

        NOMEE COGNOME                                                     FIRMA

SCHEDAI GIENIZZAZIONE BAGNI

                                                                                BAGNO ADIACENTE ALLA SALA D’ATTESA
      Il presente modulo dovrà rimanere affisso nei bagni sino al termine della compilazione e va aggiornato quotidianamente. Scrivere in
                                          stampatello leggibile. Al termine consegnare in Direzione.
Durante le attività:                                                                                        Attività Giornaliera:
Il personale addetto, nelle ore destinate al ricevimento del pubblico, ha il compito di controllare ogni    Detergere i lavabi con un prodotto specifico, quindi risciacquare abbondantemente e igienizzare con derivati
                                                                                                            del cloro; asciugare accuratamente la rubinetteria. Periodicamente devono essere asportate dai lavabi e dalla
2 ore le condizioni igieniche dei servizi e procedere alla disinfezione, lasciandone traccia su apposito    rubinetteria     le   incrostazioni    calcaree,     mediante     intervento   meccanico      o     chimico.
documento di registrazione. Provvederà inoltre alla sanificazione tutte le volte che se ne presenti la      Pulire lavabi e water con polveri leggermente abrasive, risciacquare e disinfettare; versare nei sifoni una
                                                                                                            soluzione di idoneo detergente. Lavare i pavimenti.
necessità (ad esempio in caso di caduta accidentale di un campione biologico o di sostanze
potenzialmente infette).                                                                                   Eseguire il lavaggio dei servizi igienici nel seguente ordine: con panno spugna inumidito con detergente pulire
                                                                                                           i coperchi dei WC, quindi sciacquarli; proseguire con la pulizia dei vasi utilizzando lo scopino e tirando lo
                                                                                                           sciacquone; infine igienizzare con candeggina.

                                                                                                           Controllare e, se necessario, sostituire la carta igienica e i rotoloni asciugamani. Procedere alla pulizia delle
                                                                                                           piastrelle e delle porte.


Mese                                                                                                        Mese
       Data                Orario                                  Operatore                                      Data                 Orario                                        Operatore


                                                                                                                                                                   Rev. N ____del______`,
  31: `Incidenti per esposizione a materiale biologico
 Gli operatori odontoiatri ed eventualmente le Assistenti di Studio Odontoiatrico possono essere soggetti
 ad incidenti che li espongano a materiale biologico. (Al momento non è presente altro personale in studio)

Gli stessi possono essere di seguito elencati:
              Contatto accidentale con sangue del paziente durante l’impiego di bisturi
              Contatto accidentale con liquido anestetico
              Esposizione a radiazioni ottiche artificiali non coerenti (lampade fotopolimerizzatrici)
      Ferite da taglio o da punta

Procedura:
Premesso che il Titolare ed eventualmente tutti gli eventuali collaboratori e personale di supporto (ASO)
saranno formati ed informati sui rischi relativi alla mansione specifica, sarà obbligatorio indossare durante le
sedute con i pazienti i seguenti dispositivi di protezione individuale:

                Visiera para schizzi
                Guanti in latice
                Camice in TNT
                Cuffie in TNT
                Mascherine in TNT
                Occhiali di protezione per ROA non coerenti (all’occorrenza durante i cicli di
                 polimerizzazione)

Tutti i materiali di scarto impiegati durante la seduta odontoiatrica (es. rulli salivari, cannule, bicchieri, teli e
monouso vari, scarti organici) vanno conferiti all’interno del contenitore dei rifiuti speciali. Stessa cosa andrà
fatta per i DPI potenzialmente infetti.

Ai fini della prevenzione delle ferite da taglio o da punta lo studio segue le seguenti norme procedurali:

                                NORME PER L’USO DI AGHI E TAGLIENTI

Le norme per l’uso di aghi e taglienti (bisturi, lancette, lame, ecc.) sono fondamentali per garantire la
sicurezza degli operatori sanitari e dei pazienti, prevenendo in particolare punture accidentali e infezioni da
agenti biologici (come HIV, HBV, HCV).

Ecco le principali linee guida e buone pratiche:


1. Principi generali

       Utilizzare aghi e taglienti solo quando strettamente necessario.
       Evitare di passare aghi o strumenti taglienti di mano in mano: utilizzare vassoi o superfici neutre.
       Maneggiare sempre con attenzione, tenendo il dispositivo puntato lontano da sé e dagli altri.
       Non piegare, rompere o reincappucciare gli aghi dopo l’uso.
       Procedere con la massima attenzione per prevenire punture o tagli.
       Laddove occorra praticare su uno stesso paziente iniezioni multiple di anestetico o di altri farmaci da
        una singola siringa, è prudente, nell’intervallo tra una iniezione e un’altra, proteggere l’ago nodo in un
        tubo sterile, piuttosto che incappucciarlo.
       Smaltire aghi, siringhe, lame di bisturi e altri taglienti negli appositi contenitori rigidi resistenti
        alla foratura.
       Non manipolare o tenere con sé siringhe o taglienti usati, oltre il tempo strettamente necessario.

   Non disconnettere manualmente gli aghi dalle siringhe o le lame di bisturi dal portalame e non
        piegare, spezzare o manipolare in qualunque modo gli aghi.
       Non manipolare gli aghi usati con entrambe le mani. (operazioni con una sola mano)
       Non infilare gli aghi nei set di infusione.
       Non rivolgere mai la punta dell’ago verso il corpo.
       Utilizzare aghi con sistemi di protezione.
       Durante l’uso di aghi e taglienti, gli altri operatori devono tenere le mani lontano dal campo
        interessato dall’operazione a meno che non sia richiesto il loro aiuto.
       Contenitori resistenti alla puntura devono essere sistemati in vicinanza ed in posizione comoda,
        rispetto al posto dove devono essere utilizzati.
       Non rompere, manipolare, piegare gli aghi usati con le mani.
       I contenitori di sicurezza non vanno riempiti fino all'orlo ma al massimo per 3/4 (salvo attenersi alle
        indicazioni di massimo livello presenti sugli stessi) e alla fine del riempimento vanno chiusi in
        maniera definitiva.


2. Dispositivi di protezione individuale (DPI)
     Indossare guanti monouso (e, se necessario, doppi guanti).
     Usare camici, mascherine, occhiali o visiere per proteggere da schizzi di sangue o liquidi
         biologici.
     Sostituire i guanti in caso di rottura o contaminazione.
 3. Utilizzo corretto
     Utilizzare solo dispositivi sterili e integri.
     Non manipolare aghi e taglienti inutilmente dopo l’uso.
     Eliminare immediatamente gli aghi e taglienti usati nei contenitori dedicati, senza lasciarli su
         superfici o carrelli.
🗑4. Smaltimento
  Questi rifiuti devono essere raccolti in contenitori rigidi in polipropilene gialli, specifici per
  taglienti, da lt. 3 o 6 o di capacità ancora inferiore.
  Questi contenitori una volta riempiti al massimo per ¾ e chiusi ermeticamente, devono essere messi
  nei contenitori per i rifiuti da lt. 60 utilizzati per gli altri rifiuti la cui raccolta e smaltimento richiede
  precauzioni particolari in funzione della prevenzione di infezioni.

   Utilizzare contenitori rigidi, resistenti alla perforazione, chiaramente identificabili,
       posizionati vicino alla zona di utilizzo.
      Non riempire oltre i 2/3 del volume del contenitore.
      Non tentare mai di comprimere o svuotare i contenitori per recuperare spazio.
      Smaltire secondo le normative sui rifiuti sanitari pericolosi a rischio infettivo (D.Lgs.
       81/2008 e s.m.i., D.P.R. 254/2003).


🚨 5. In caso di puntura o ferita accidentale
  1. Non far sanguinare la ferita in modo forzato.
  2. Lavare immediatamente con acqua e sapone.
  3. Disinfettare con antisettico (es. clorexidina o iodopovidone).
  4. Segnalare immediatamente l’incidente al responsabile o al medico competente.`,
  32: `I near miss mettono in luce criticità impreviste e improvvise sul luogo di lavoro, riguardanti
contesti di tipo organizzativo, tecnico o comportamentale.

La procedura di segnalazione e analisi degli infortuni mancati (anche detti “incidenti” nel
documento Inail) avviene su base volontaria.

In concreto, si tratta di un flusso di comunicazione che ha lo scopo di segnalare, registrare e
comunicare gli incidenti non dannosi. Gli obiettivi sono molteplici:

   Identificare, raccogliere e analizzare gli incidenti che si verificano sul lavoro e che
    riguardano il personale o il pubblico, tramite modulistica appropriata;
   Valutare le situazioni di non conformità o di criticità organizzative, tecniche,
    procedurali o comportamentali che precedono gli incidenti;
   Individuare e applicare le adeguate misure correttive e preventive;
   Garantire un’opportuna comunicazione biunivoca e assicurare un’immediata risposta alla
    segnalazione: sia nella fase iniziale che in quella di lavorazione sullo stato di avanzamento
    e trattazione della segnalazione, fino all’esito finale.

Per rendere effettivo questo strumento di prevenzione è fondamentale la partecipazione di tutte
le componenti dello studio, in particolare attraverso feedback tempestivi e condivisione delle
problematiche.

Le figure e i gruppi coinvolti nella gestione dei mancati infortuni sono:

   Lavoratore che effettua la segnalazione di incidente: può essere coinvolto o meno nello stesso,
    e appartenere sia al personale aziendale che alle ditte appaltatrici;

   Soggetto coinvolto nell’incidente: può essere diretto dipendente, oppure una qualsiasi figura
    (cliente, fornitore, ecc.) che si trova in prossimità del luogo la cui titolarità è dell’azienda;

   Gruppo di ricezione, trasmissione, valutazione degli incidenti (GRTVI): è composto da DL,
    RSPP, RLS. Riceve la segnalazione dell’incidente, valuta e adotta le necessarie misure
    correttive;

   Gruppo risoluzione incidenti (GRI). Si occupa di valutare la risoluzione degli incidenti
    qualora il GRTVI non sia stato in grado di risolvere l’incidente in reparto e,
    conseguentemente, verifica la concreta efficacia delle soluzioni adottate;

   DL - datore di lavoro: riceve le comunicazioni dal GRI e verifica l’efficacia delle soluzioni
    adottate nel caso di incidente non risolvibile in reparto, oppure in caso di incidente non
    risolvibile in azienda e risolvibile dalle ditte appaltatrici. Verifica, inoltre, la chiusura
    dell’incidente da parte del GRI.

 NEAR MISS: MODALITÀ OPERATIVE DI COMUNICAZIONE DI INFORTUNIO MANCATO

Le modalità operative per la gestione degli infortuni mancati seguono 5 step:

           1. Redazione/registrazione/archiviazione;
           2. Coinvolgimento;
           3. Verifica;
           4. Approvazione;
           5. Attuazione.

Il flusso di comunicazione del near miss è organizzato secondo dei moduli o feedback di
differenti livelli, corrispondenti alle diverse azioni messe in atto dai soggetti coinvolti. Vediamo i
principali passaggi:

   il lavoratore che effettua la segnalazione o eventuale testimone segnala l’incidente
    all’incaricato, che provvede a comunicarlo a SPP e RLS);
   l’incaricato comunica al lavoratore l’avvenuta ricezione
   il GRTVI valuta se la segnalazione sia da riconoscere come incidente. In caso negativo,
    l’incaricato o il GRTVI consegna motivata comunicazione al lavoratore che effettua la
    segnalazione di non presa in carico. In caso positivo, il GRTVI deve decidere se
    l’incidente è risolvibile in reparto o meno;
   se la soluzione è gestita dal reparto, il GRTVI provvede a risolvere il problema, manda
    relazione delle modalità esecutive adottate ai diversi responsabili e comunica al lavoratore
    che effettua la segnalazione la risoluzione dell’incidente ;
   qualora non sia risolvibile in reparto, il GRTVI richiede l’ausilio del GRI per mezzo del
    modulo per la risoluzione di incidenti a carico del DL in cui descrive dinamica
    dell’incidente mancato e problematiche della messa in sicurezza;
   il GRI valuta le condizioni, determina una risoluzione interna all’azienda e invia
    comunicazione di risoluzione incidente al lavoratore che effettua la segnalazione e al
    GRTVI, spiegando modalità esecutive e logistiche intervenute nella procedura.`,
};

function buildPDF() {
  // ── A4 in punti (1pt = 1/72 inch) ──
  const PW = 595.28, PH = 841.89;
  const ML = 42, MR = 42;
  const CW = PW - ML - MR;   // ~511 pt larghezza contenuto

  // Colonne tabella (misure dall'originale)
  const COL_NUM  = ML;            // numero: 42
  const COL_DOC  = ML + 18;       // testo documento: 60
  const COL_SEP  = ML + CW - 95; // separatore verticale
  const COL_COD  = COL_SEP + 5;  // codice requisito
  const W_DOC    = COL_SEP - COL_DOC - 4;
  const W_NUM    = 16;

  // Font: Times-Roman / Times-Bold / Times-Italic
  const F_NORM = 'F1';  // Times-Roman
  const F_BOLD = 'F2';  // Times-Bold
  const F_ITAL = 'F3';  // Times-Italic

  // ── 32 documenti ufficiali ALL.A1 ──
  const DOCS = [
    ["Documento che definisce ed esplicita l'organizzazione e le politiche di gestione delle risorse (analisi dei principali processi per l'individuazione delle fasi nelle quali e possibile che si verifichino disservizi)", "1A.01.03.01"],
    ["Documentazione inerente il sistema informativo", "1A.01.04.01"],
    ["Documento/programma che descrive le modalita per la valutazione e il miglioramento della qualita delle prestazioni e dei servizi erogati", "1A.01.05.01"],
    ["Procedura per la presentazione e gestione di reclami, osservazioni e suggerimenti.", "1A.01.06.01"],
    ["Documento/procedura che descrive le modalita di erogazione dell'assistenza", "1A.02.02.01"],
    ["Piano per la gestione delle emergenze", "1A.02.02.02"],
    ["Protocollo per l'isolamento di pazienti con patologie contagiose o potenzialmente tali", "1A.02.02.03"],
    ["Procedura che definisce i requisiti per la redazione, l'aggiornamento, la conservazione e la verifica della documentazione sanitaria nonche le modalita di controllo.", "1A.02.05.01"],
    ["Documento formale di incarico del responsabile della Manutenzione", "1A.03.01.01"],
    ["Inventario delle attrezzature aggiornato e verificato annualmente e procedura per l'identificazione delle attrezzature", "1A.03.02.01"],
    ["Piano per la gestione e la manutenzione (ordinaria e straordinaria) delle strutture, impianti, attrezzature e apparecchiature biomediche.", "1A.03.02.02"],
    ["Documentazione tecnica relativa alle singole attrezzature e apparecchiature immediatamente disponibile agli operatori interessati e alla funzione preposta alla manutenzione", "1A.03.02.03"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di caratteristiche ambientali e di accessibilita", "1A.03.05.01"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di protezione antincendio", "1A.03.05.02"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di protezione acustica", "1A.03.05.03"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di sicurezza elettrica e continuita elettrica", "1A.03.05.04"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di sicurezza anti-infortunistica", "1A.03.05.05"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di protezione dai rischi di radiazioni ionizzanti", "1A.03.05.06"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di eliminazione della barriere architettoniche", "1A.03.05.07"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di smaltimento dei rifiuti", "1A.03.05.08"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di condizioni microclimatiche", "1A.03.05.09"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di impianti di distribuzione dei gas", "1A.03.05.10"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di materiali esplodenti", "1A.03.05.11"],
    ["Documentazione tecnica, in relazione alla tipologia delle attivita svolte, attestante il possesso dei requisiti previsti dalle vigenti leggi in materia di protezione antisismica", "1A.03.05.12"],
    ["Obblighi assicurativi definiti dalla normativa applicabile", "1A.04.12.04"],
    ["Carta dei servizi", "1A.05.03.01"],
    ["Modalita identificazione di tirocinanti, specializzandi e altri soggetti che intervengono nel percorso assistenziale.", "1A.05.03.03"],
    ["Report criticita riscontrate dall'analisi dei reclami e dei risultati delle indagini di customer satisfaction e relativi Piani di intervento", "1A.05.03.05"],
    ["Piano aziendale per la gestione del rischio", "1A.06.02.01"],
    ["Procedura per la pulizia e sanificazione degli ambienti", "1A.06.02.02"],
    ["Procedura per la protezione dagli incidenti per esposizione a materiale biologico o altre sostanze pericolose", "1A.06.02.03"],
    ["Sistema (Piani di intervento/report) per l'identificazione e la segnalazione di \"near miss\", eventi avversi ed eventi sentinella", "1A.06.02.04"],
  ];

  // ── Stato presente/assente per riga ──
  const rowState = new Array(32).fill(false);
  rowState[0]  = checked('gdpr') || val('qualita').length > 2;
  rowState[1]  = checked('gdpr') || checked('backup') || checked('tracciamento');
  rowState[2]  = checked('gdpr') || val('qualita').length > 2;
  rowState[3]  = checked('reclami');
  rowState[4]  = checked('proc_ero');
  rowState[5]  = checked('piano_emerg');
  rowState[6]  = checked('isolamento');
  rowState[7]  = checked('doc_san');
  rowState[8]  = checked('resp_man');
  rowState[9]  = checked('inventario');
  rowState[10] = checked('piano_man');
  rowState[11] = checked('doc_tec');
  rowState[12] = checked('n1');
  rowState[13] = checked('n2');
  rowState[14] = checked('n3');
  rowState[15] = checked('n4');
  rowState[16] = checked('n5');
  rowState[17] = checked('n6');
  rowState[18] = checked('n7');
  rowState[19] = checked('n8');
  rowState[20] = checked('n9');
  rowState[21] = checked('n10');
  rowState[22] = false; // materiali esplodenti – N/A studio odontoiatrico
  rowState[23] = checked('n11');
  rowState[24] = checked('assicurativi');
  rowState[25] = checked('carta');
  rowState[26] = false;
  rowState[27] = checked('customer') || checked('piani_miglio');
  rowState[28] = checked('dvr');
  rowState[29] = checked('proc_bio');
  rowState[30] = checked('proc_bio');
  rowState[31] = checked('rischio_clinico');

  // ── Encoder testo per PDF ──
  function esc(s) {
    return String(s||'')
      .replace(/à/g,'a').replace(/á/g,'a').replace(/â/g,'a').replace(/ã/g,'a')
      .replace(/è/g,'e').replace(/é/g,'e').replace(/ê/g,'e').replace(/ë/g,'e')
      .replace(/ì/g,'i').replace(/í/g,'i').replace(/î/g,'i').replace(/ï/g,'i')
      .replace(/ò/g,'o').replace(/ó/g,'o').replace(/ô/g,'o').replace(/õ/g,'o')
      .replace(/ù/g,'u').replace(/ú/g,'u').replace(/û/g,'u').replace(/ü/g,'u')
      .replace(/À/g,'A').replace(/È/g,'E').replace(/É/g,'E').replace(/Ì/g,'I')
      .replace(/Ò/g,'O').replace(/Ù/g,'U').replace(/ç/g,'c').replace(/ñ/g,'n')
      .replace(/°/g,'').replace(/€/g,'EUR')
      .replace(/[–—]/g,'-').replace(/[\u201C\u201D]/g,'"').replace(/[\u2018\u2019]/g,"'")
      .replace(/\u2026/g,'...').replace(/\u00AB/g,'"').replace(/\u00BB/g,'"')
      .replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)')
      .replace(/[^\x20-\x7E]/g,'?');
  }

  // wrap testo in linee
  function wrap(text, maxCh) {
    const words = esc(text).split(' ');
    const lines = []; let cur = '';
    words.forEach(w => {
      const cand = cur ? cur + ' ' + w : w;
      if (cand.length <= maxCh) { cur = cand; }
      else { if (cur) lines.push(cur); cur = w; }
    });
    if (cur) lines.push(cur);
    return lines;
  }

  // ── Page stream builder ──
  function makePage() {
    const cmds = [];
    const p = {
      raw(s)             { cmds.push(s); },
      setFill(r,g,b)     { cmds.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`); },
      setStroke(r,g,b)   { cmds.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`); },
      setLW(w)           { cmds.push(`${w} w`); },
      fillRect(x,y,w,h)  { cmds.push(`${x} ${y} ${w} ${h} re f`); },
      strokeRect(x,y,w,h){ cmds.push(`${x} ${y} ${w} ${h} re S`); },
      line(x1,y1,x2,y2)  { cmds.push(`${x1} ${y1} m ${x2} ${y2} l S`); },
      text(s,x,y,font,sz,r,g,b) {
        const ri = (r||0).toFixed(3), gi = (g||0).toFixed(3), bi = (b||0).toFixed(3);
        cmds.push(`BT /${font} ${sz} Tf ${ri} ${gi} ${bi} rg ${x} ${y} Td (${esc(s)}) Tj ET`);
      },
      // testo già pre-escaped
      textRaw(s,x,y,font,sz,r,g,b) {
        const ri=(r||0).toFixed(3),gi=(g||0).toFixed(3),bi=(b||0).toFixed(3);
        cmds.push(`BT /${font} ${sz} Tf ${ri} ${gi} ${bi} rg ${x} ${y} Td (${s}) Tj ET`);
      },
      stream() { return cmds.join('\n'); }
    };
    return p;
  }

  // ── Gestione multi-pagina ──
  const pageStreams = [];
  let pg = makePage();
  let curY = PH - 50;

  function footerPage() {
    const pn = pageStreams.length + 1;
    pg.setStroke(0,0,0); pg.setLW(0.5);
    pg.line(ML, 35, PW-MR, 35);
    pg.text(`${pn}`, PW-MR, 22, F_NORM, 9, 0,0,0);
  }

  function newPage() {
    footerPage();
    pageStreams.push(pg.stream());
    pg = makePage();
    curY = PH - 40;
  }

  function need(h) {
    if (curY - h < 50) newPage();
  }

  // ══════════════════════════════════════════
  // PAGINA 1 – Intestazione ufficiale
  // ══════════════════════════════════════════

  // Box "ALL. A1" – bordo nero, testo grassetto
  pg.setStroke(0,0,0); pg.setLW(1);
  pg.strokeRect(ML, PH-70, 52, 22);
  pg.text('ALL. A1', ML+5, PH-62, F_BOLD, 11, 0,0,0);

  // Titolo centrato sottolineato
  const tx1 = 'Per struttura non residenziale semplici monopresidio';
  const tx1x = ML + 60;
  pg.text(tx1, tx1x, PH-58, F_BOLD, 10.5, 0,0,0);
  // sottolineatura
  const tx1w = tx1.length * 5.5; // approssimazione larghezza
  pg.setStroke(0,0,0); pg.setLW(0.5);
  pg.line(tx1x, PH-60, tx1x + tx1w, PH-60);

  const tx2 = '(vedi definizioni art. 2 e classificazione art. 3 del D.A. 9 gennaio 2024 n. 20).';
  pg.text(tx2, tx1x, PH-70, F_NORM, 9, 0,0,0);

  curY = PH - 86;

  // Testo istruzione subcodici (grassetto, giustificato su 2 righe)
  const istr1 = "Per una puntuale applicazione di ciascun requisito fare riferimento ai subcodici riportati nell'allegato";
  const istr2 = "A1 del D.A. 9 gennaio 2024 n. 20.";
  pg.text(istr1, ML, curY, F_BOLD, 9.5, 0,0,0);
  pg.text(istr2, ML, curY-12, F_BOLD, 9.5, 0,0,0);
  curY -= 28;

  // Box GdV con bordo
  const gdvText = "Il Responsabile della struttura mettera a disposizione del GdV prima della visita i seguenti documenti previsti dai requisiti generali per l'autorizzazione di cui all'allegato A1 al decreto assessoriale 09 gennaio 2024 n. 20 (G.U.R.S. 26 gennaio 2024, n. 5, S.O. n. 4)";
  const gdvLines = wrap(gdvText, 88);
  const gdvH = gdvLines.length * 11 + 12;
  pg.setStroke(0,0,0); pg.setLW(0.8);
  pg.strokeRect(ML, curY - gdvH, CW, gdvH);
  let gy = curY - 9;
  gdvLines.forEach(l => {
    pg.textRaw(l, ML+5, gy, F_BOLD, 9, 0,0,0);
    gy -= 11;
  });
  curY -= gdvH + 6;

  // ── Header tabella ──
  // Riga header nera con testo bianco
  const HDR_H = 17;
  pg.setFill(0,0,0);
  pg.fillRect(ML, curY - HDR_H, CW, HDR_H);

  // "DOCUMENTO" centrato nella colonna sinistra
  const docColMid = ML + (COL_SEP - ML) / 2 - 30;
  pg.text('DOCUMENTO', docColMid, curY - 12, F_BOLD, 10, 1,1,1);

  // "Cod. Requisito" nella colonna destra
  pg.text('Cod. Requisito', COL_COD, curY - 12, F_BOLD, 10, 1,1,1);

  curY -= HDR_H;

  // ── Righe documenti ──
  const FONT_SZ  = 9;
  const LINE_H   = 10.5;
  const MAX_CHARS = 62; // caratteri per riga colonna documento

  DOCS.forEach((doc, i) => {
    const num    = i + 1;
    const testo  = doc[0];
    const codice = doc[1];
    const present = rowState[i];

    const lines = wrap(testo, MAX_CHARS);
    const ROW_H = Math.max(15, lines.length * LINE_H + 6);

    need(ROW_H);

    // Sfondo alternato leggerissimo (come originale)
    if (i % 2 === 0) {
      pg.setFill(1,1,1);
    } else {
      pg.setFill(0.97,0.97,0.97);
    }
    pg.fillRect(ML, curY - ROW_H, CW, ROW_H);

    // Bordo riga (grigio sottile)
    pg.setStroke(0.5,0.5,0.5); pg.setLW(0.3);
    pg.strokeRect(ML, curY - ROW_H, CW, ROW_H);

    // Separatore verticale colonna codice
    pg.setStroke(0.5,0.5,0.5); pg.setLW(0.3);
    pg.line(COL_SEP, curY, COL_SEP, curY - ROW_H);

    // Numero riga
    const textTopY = curY - LINE_H + 2;
    pg.text(`${num}.`, COL_NUM + 1, textTopY, F_NORM, FONT_SZ, 0,0,0);

    // Testo documento (wrappato, rientro seconda riga come originale)
    let ty = textTopY;
    lines.forEach((l, li) => {
      const lx = li === 0 ? COL_DOC : COL_DOC + 3;
      pg.textRaw(l, lx, ty, F_NORM, FONT_SZ, 0,0,0);
      ty -= LINE_H;
    });

    // Codice requisito in corsivo, centrato verticalmente nella riga
    const codY = curY - ROW_H / 2 - 3;
    pg.text(codice, COL_COD + 3, codY, F_ITAL, FONT_SZ, 0,0,0);

    // Indicatore presente (checkbox stile originale) – colonna aggiuntiva destra
    const chkX = PW - MR - 12;
    const chkY = curY - ROW_H/2 - 4;
    pg.setStroke(0,0,0); pg.setLW(0.5);
    pg.strokeRect(chkX, chkY, 9, 9);
    if (present) {
      // Segno di spunta: due linee diagonali
      pg.setStroke(0,0,0); pg.setLW(1);
      pg.line(chkX+1, chkY+4, chkX+3.5, chkY+1.5);
      pg.line(chkX+3.5, chkY+1.5, chkX+8, chkY+7.5);
    }

    curY -= ROW_H;
  });

  // ── Fine tabella ──
  // Bordo inferiore tabella
  pg.setStroke(0,0,0); pg.setLW(0.8);
  pg.line(ML, curY, ML+CW, curY);

  // Footer ultima pagina tabella
  footerPage();
  pageStreams.push(pg.stream());
  pg = makePage();
  curY = PH - 40;

  // ══════════════════════════════════════════
  // PAGINE COPERTINA PER OGNI DOCUMENTO (32)
  // ══════════════════════════════════════════

  const oggi2 = new Date().toLocaleDateString('it-IT',{month:'numeric',year:'numeric'});
  const rev = 'REV. 1/' + new Date().getFullYear();

  DOCS.forEach((doc, i) => {
    const num    = i + 1;
    const testo  = doc[0];
    const codice = doc[1];

    // ── COPERTINA ──
    // Sfondo azzurro chiaro tutta la pagina
    pg = makePage();
    pg.setFill(0.753, 0.820, 0.878);  // azzurro chiaro come originale
    pg.fillRect(0, 0, PW, PH);

    // Box bianco centrato destra – dimensioni come originale
    const BX = PW * 0.38;   // x inizio box
    const BY = 120;          // y bottom
    const BW = PW - BX - 35;
    const BH = PH - BY - 100;

    pg.setFill(1,1,1);
    pg.fillRect(BX, BY, BW, BH);
    pg.setStroke(0.6,0.7,0.8);
    pg.setLW(0.8);
    pg.strokeRect(BX, BY, BW, BH);

    // Box navy in alto nel box bianco (dati studio)
    const NX = BX;
    const NH = 130;
    const NY = BY + BH - NH;
    pg.setFill(0.098, 0.176, 0.314);  // navy scuro
    pg.fillRect(NX, NY, BW, NH);

    // Testo studio nel box navy (bianco grassetto)
    const studioLines2 = wrap((val('denominazione') || 'STUDIO ODONTOIATRICO').toUpperCase(), 28);
    let sy = NY + NH - 18;
    studioLines2.forEach(l => {
      pg.textRaw(l, NX + BW/2 - l.length*3, sy, F_BOLD, 10, 1,1,1);
      sy -= 13;
    });
    // Titolare
    if (val('titolare')) {
      pg.textRaw(esc(val('titolare').toUpperCase()), NX + BW/2 - val('titolare').length*2.8, sy, F_BOLD, 9.5, 1,1,1);
      sy -= 12;
    }
    // Indirizzo
    if (val('indirizzo')) {
      const adrStr = esc(val('indirizzo'));
      pg.textRaw(adrStr.slice(0,30), NX + BW/2 - Math.min(adrStr.length,30)*2.5, sy, F_NORM, 8.5, 1,1,1);
      sy -= 11;
      if (val('comune')) {
        const loc = esc(val('comune') + (val('provincia') ? ' (' + val('provincia') + ')' : ''));
        pg.textRaw(loc, NX + BW/2 - loc.length*2.5, sy, F_NORM, 8.5, 1,1,1);
      }
    }

    // Contenuto nel box bianco
    const contentX = NX + 12;
    let cy2 = NY - 20;

    // DOCUMENTO N:
    pg.text(`DOCUMENTO ${num}:`, contentX, cy2, F_BOLD, 11, 0,0,0);
    cy2 -= 14;

    // Testo documento wrappato
    const docLines2 = wrap(testo, 30);
    docLines2.forEach(l => {
      pg.textRaw(l, contentX, cy2, F_NORM, 10, 0,0,0);
      cy2 -= 12;
    });
    cy2 -= 10;

    // Cod. Requisito
    pg.text('Cod. Requisito', contentX, cy2, F_BOLD, 10, 0,0,0);
    cy2 -= 13;
    pg.text(codice, contentX, cy2, F_BOLD, 10, 0,0,0);
    cy2 -= 20;

    // REV.
    pg.text(rev, contentX, BY + 60, F_BOLD, 9, 0,0,0);

    // Barra oro/marrone in fondo (firma) come originale
    pg.setFill(0.545, 0.404, 0.243);
    pg.fillRect(NX, BY, BW, 5);

    // Testo firma
    const firma = esc((val('titolare') || 'IL RESPONSABILE').toUpperCase());
    pg.text(firma, contentX, BY + 22, F_NORM, 7.5, 0.4, 0.3, 0.1);

    pageStreams.push(pg.stream());

    // ── PAGINA BIANCA per il contenuto ──
    pg = makePage();
    // Header con nome studio e documento
    pg.setFill(0.95,0.95,0.95);
    pg.fillRect(ML, PH-45, CW, 25);
    pg.text(esc((val('denominazione') || 'Studio Odontoiatrico').toUpperCase()), ML+5, PH-28, F_BOLD, 8, 0.1,0.1,0.3);
    pg.text(`DOCUMENTO ${num} - Cod. ${codice}`, ML+5, PH-38, F_NORM, 7.5, 0.3,0.3,0.3);

    // Titolo documento
    pg.text('Titolo:', ML, PH-70, F_BOLD, 9, 0,0,0);
    const tLines = wrap(testo, 80);
    let ty2 = PH-82;
    tLines.forEach(l => { pg.textRaw(l, ML, ty2, F_NORM, 9, 0,0,0); ty2 -= 11; });

    // Linee per il contenuto
    let lineY = ty2 - 20;
    pg.text('CONTENUTO DEL DOCUMENTO:', ML, lineY, F_BOLD, 9, 0,0,0);
    lineY -= 15;
    for (let r = 0; r < 28; r++) {
      pg.setStroke(0.7,0.7,0.7); pg.setLW(0.3);
      pg.line(ML, lineY, PW-MR, lineY);
      lineY -= 18;
      if (lineY < MB + 30) break;
    }

    // Footer
    pg.setStroke(0,0,0); pg.setLW(0.5);
    pg.line(ML, MB+15, PW-MR, MB+15);
    pg.text(`Documento ${num} di 32 - ${codice}`, ML, MB+5, F_NORM, 7, 0.4,0.4,0.4);
    pg.text('___ / ___ / ______    Firma: ______________________', PW-MR-130, MB+5, F_NORM, 7, 0,0,0);

    pageStreams.push(pg.stream());
  });


  // ══════════════════════════════════════════
  // SEZIONE DATI STUDIO (come nel PDF Teresi)
  // ══════════════════════════════════════════
  need(120);

  // Intestazione studio
  const studioName = val('denominazione') || '';
  const titolare   = val('titolare') || '';
  const indirizzo  = val('indirizzo') || '';
  const comune     = val('comune') || '';
  const prov       = val('provincia') || '';
  const albo       = val('albo') || '';
  const asp        = val('asp') || '';

  if (studioName || titolare) {
    pg.setStroke(0,0,0); pg.setLW(0.8);
    pg.strokeRect(ML, curY - 75, 160, 75);

    pg.text(studioName.toUpperCase(), ML+5, curY-12, F_BOLD, 9, 0,0,0);
    if (titolare) pg.text(titolare, ML+5, curY-24, F_BOLD, 9, 0,0,0);
    if (indirizzo) {
      const adr = (indirizzo + (comune ? ', ' + comune : '') + (prov ? ' (' + prov + ')' : ''));
      const adrLines = wrap(adr, 26);
      adrLines.forEach((l,i) => pg.textRaw(l, ML+5, curY-36-i*11, F_NORM, 8.5, 0,0,0));
    }
    if (asp)  pg.text('ASP: ' + asp,  ML+5, curY-58, F_NORM, 8.5, 0,0,0);
    if (albo) pg.text('Albo n.: ' + albo, ML+5, curY-69, F_NORM, 8.5, 0,0,0);
  }

  // Data e firma a destra
  const oggi = new Date().toLocaleDateString('it-IT',{day:'2-digit',month:'2-digit',year:'numeric'});
  pg.text('Data compilazione: ' + oggi, ML + 170, curY - 20, F_NORM, 9, 0,0,0);

  pg.setStroke(0,0,0); pg.setLW(0.5);
  pg.line(ML+170, curY-55, PW-MR, curY-55);
  pg.text('Il Responsabile della struttura', ML+170, curY-64, F_NORM, 8.5, 0,0,0);
  if (titolare) pg.text(esc(titolare), ML+170, curY-75, F_ITAL, 8.5, 0,0,0);

  // Footer ultima pagina
  footerPage();
  pageStreams.push(pg.stream());

  // ══════════════════════════════════════════════════════
  // SEZIONE 2: Schede individuali per ogni documento
  // Struttura: copertina blu + pagine contenuto
  // ══════════════════════════════════════════════════════

  // Dati studio per sostituzione placeholder
  const studioName2 = val('denominazione')  || 'Studio Odontoiatrico';
  const titolareVal = val('titolare')        || '';
  const indirizzoVal= val('indirizzo')       || '';
  const comuneVal   = val('comune')          || '';
  const provVal     = val('provincia')       || '';
  const fullAddr    = [indirizzoVal, comuneVal ? comuneVal + (provVal ? ' (' + provVal + ')' : '') : ''].filter(Boolean).join(', ');

  function fillTemplate(text) {
    return text
      .replace(/\[TITOLARE\]/g, esc(titolareVal) || 'Il Titolare')
      .replace(/\[STUDIO\]/g,   esc(studioName2))
      .replace(/\[INDIRIZZO\]/g, esc(fullAddr) || 'sede dello studio');
  }

  // Pagina copertina blu per ogni documento
  function drawCoverPage(docNum, docTitle, codReq) {
    // Nuova pagina
    footerPage();
    pageStreams.push(pg.stream());
    pg = makePage();
    curY = PH;

    // Sfondo azzurro chiaro (come originale)
    pg.setFill(0.702, 0.761, 0.820);  // #B3C2D1 azzurro chiaro
    pg.fillRect(0, 0, PW, PH);

    // Box bianco centrale (come originale)
    const BX = ML + 60, BY = PH/2 - 120, BW = PW - BX - 40, BH = 240;
    pg.setFill(1, 1, 1);
    pg.fillRect(BX, BY, BW, BH);
    pg.setStroke(0.4, 0.5, 0.65); pg.setLW(1.5);
    pg.strokeRect(BX, BY, BW, BH);

    // Barra superiore blu scuro dentro il box
    pg.setFill(0.133, 0.239, 0.412);  // #223D69
    pg.fillRect(BX, BY + BH - 90, BW, 90);

    // Nome studio nel box blu
    const studioLines = esc(studioName2).toUpperCase();
    const sLines = wrap(studioLines, 28);
    let sy = BY + BH - 18;
    sLines.forEach(l => {
      pg.text(l, BX + BW/2 - l.length * 3.3, sy, F_BOLD, 10, 1,1,1);
      sy -= 13;
    });
    if (fullAddr) {
      const addrLines = wrap(esc(fullAddr), 32);
      addrLines.forEach(l => {
        pg.text(l, BX + BW/2 - l.length * 2.8, sy, F_NORM, 9, 0.8,0.9,1);
        sy -= 11;
      });
    }

    // Numero documento
    const docLabel = 'DOCUMENTO ' + docNum + ':';
    pg.text(docLabel, BX + 12, BY + BH - 105, F_BOLD, 11, 0,0,0);

    // Titolo documento (wrappato)
    const titleLines = wrap(esc(docTitle), 30);
    let ty2 = BY + BH - 120;
    titleLines.forEach(l => {
      pg.text(l, BX + 12, ty2, F_NORM, 9.5, 0,0,0);
      ty2 -= 12;
    });

    // Codice requisito
    pg.text('Cod. Requisito', BX + 12, BY + 30, F_BOLD, 9.5, 0,0,0);
    pg.text(codReq, BX + 12, BY + 18, F_BOLD, 10, 0,0,0);

    // Nome titolare in fondo al box
    if (titolareVal) {
      pg.setFill(0.9, 0.93, 0.97);
      pg.fillRect(BX, BY, BW, 12);
      pg.text(esc(titolareVal).toUpperCase(), BX + 8, BY + 4, F_NORM, 7.5, 0.2,0.3,0.5);
    }

    // Barra dorata in fondo al box
    pg.setFill(0.45, 0.55, 0.72);
    pg.fillRect(BX, BY - 4, BW, 4);

    // Prepara nuova pagina per il contenuto
    footerPage();
    pageStreams.push(pg.stream());
    pg = makePage();
    curY = PH - 40;
  }

  // Pagina contenuto documento (testo libero wrappato)
  function drawDocContent(docNum, docTitle, bodyText) {
    if (!bodyText) return;

    // Intestazione pagina contenuto
    function drawContentHeader() {
      pg.setFill(0.133, 0.239, 0.412);
      pg.fillRect(ML, PH - 35, CW, 18);
      const hdr = esc(studioName2).toUpperCase() + '  |  Documento ' + docNum + ' – ' + esc(docTitle).slice(0,50);
      pg.text(hdr.slice(0, 85), ML + 5, PH - 25, F_BOLD, 7.5, 1,1,1);
      pg.setLW(0.5); pg.setStroke(0.4,0.5,0.65);
      pg.line(ML, PH - 37, ML + CW, PH - 37);
      curY = PH - 48;
    }

    drawContentHeader();

    // Suddividi il testo in paragrafi e scrivi
    const paragraphs = bodyText.split('\n\n');
    const FONT_BODY = 8.5;
    const FONT_HEAD = 9.5;
    const LH_BODY = 11;
    const LH_HEAD = 13;
    const MAX_LINE = 90;

    paragraphs.forEach(para => {
      if (!para.trim()) return;
      const trimmed = para.trim();

      // Riconosci se è un titolo (breve, tutto maiuscolo o termina con ':')
      const isHeading = trimmed.length < 80 && (
        trimmed === trimmed.toUpperCase() ||
        trimmed.endsWith(':') ||
        /^\d+\.\s+[A-Z]/.test(trimmed) ||
        /^\d+\.\d+\s+/.test(trimmed)
      );

      const fontSize = isHeading ? FONT_HEAD : FONT_BODY;
      const fontName = isHeading ? F_BOLD : F_NORM;
      const lineH    = isHeading ? LH_HEAD : LH_BODY;
      const indent   = 0;

      const lines = wrap(fillTemplate(trimmed), MAX_LINE);
      const blockH = lines.length * lineH + (isHeading ? 4 : 2);

      need(blockH + 4);
      if (curY > PH - 80 && isHeading) {
        // Ridisegna header se nuova pagina
      }

      if (isHeading) curY -= 3;
      lines.forEach(l => {
        pg.text(l, ML + indent, curY, fontName, fontSize, 0,0,0);
        curY -= lineH;
      });
      if (isHeading) curY -= 3;
      else curY -= 2;
    });
  }

  // ── Genera tutte le schede ──
  const DOC_META = [
    [1,  "Documento che definisce ed esplicita l'organizzazione e le politiche di gestione delle risorse", "1A.01.03.01"],
    [2,  "Documentazione inerente il sistema informativo", "1A.01.04.01"],
    [3,  "Documento/programma per la valutazione e il miglioramento della qualita delle prestazioni", "1A.01.05.01"],
    [4,  "Procedura per la presentazione e gestione di reclami, osservazioni e suggerimenti", "1A.01.06.01"],
    [5,  "Documento/procedura che descrive le modalita di erogazione dell'assistenza", "1A.02.02.01"],
    [6,  "Piano per la gestione delle emergenze", "1A.02.02.02"],
    [7,  "Protocollo per l'isolamento di pazienti con patologie contagiose o potenzialmente tali", "1A.02.02.03"],
    [8,  "Procedura per la redazione, aggiornamento, conservazione e verifica della documentazione sanitaria", "1A.02.05.01"],
    [9,  "Documento formale di incarico del responsabile della Manutenzione", "1A.03.01.01"],
    [10, "Inventario delle attrezzature aggiornato e verificato annualmente", "1A.03.02.01"],
    [11, "Piano per la gestione e la manutenzione delle strutture, impianti, attrezzature", "1A.03.02.02"],
    [12, "Documentazione tecnica relativa alle singole attrezzature e apparecchiature", "1A.03.02.03"],
    [13, "Documentazione tecnica – caratteristiche ambientali e di accessibilita", "1A.03.05.01"],
    [14, "Documentazione tecnica – protezione antincendio", "1A.03.05.02"],
    [15, "Documentazione tecnica – protezione acustica", "1A.03.05.03"],
    [16, "Documentazione tecnica – sicurezza elettrica e continuita elettrica", "1A.03.05.04"],
    [17, "Documentazione tecnica – sicurezza anti-infortunistica", "1A.03.05.05"],
    [18, "Documentazione tecnica – protezione dai rischi di radiazioni ionizzanti", "1A.03.05.06"],
    [19, "Documentazione tecnica – eliminazione delle barriere architettoniche", "1A.03.05.07"],
    [20, "Documentazione tecnica – smaltimento dei rifiuti", "1A.03.05.08"],
    [21, "Documentazione tecnica – condizioni microclimatiche", "1A.03.05.09"],
    [22, "Documentazione tecnica – impianti di distribuzione dei gas", "1A.03.05.10"],
    [23, "Documentazione tecnica – materiali esplodenti", "1A.03.05.11"],
    [24, "Documentazione tecnica – protezione antisismica", "1A.03.05.12"],
    [25, "Obblighi assicurativi definiti dalla normativa applicabile", "1A.04.12.04"],
    [26, "Carta dei servizi", "1A.05.03.01"],
    [27, "Modalita identificazione di tirocinanti, specializzandi e altri soggetti", "1A.05.03.03"],
    [28, "Report criticita riscontrate dall'analisi dei reclami e customer satisfaction", "1A.05.03.05"],
    [29, "Piano aziendale per la gestione del rischio", "1A.06.02.01"],
    [30, "Procedura per la pulizia e sanificazione degli ambienti", "1A.06.02.02"],
    [31, "Procedura per la protezione dagli incidenti per esposizione a materiale biologico", "1A.06.02.03"],
    [32, "Sistema per l'identificazione e la segnalazione di near miss ed eventi avversi", "1A.06.02.04"],
  ];

  // Mappa doc num → template estratto (presenti solo quelli con testo nel PDF originale)
  const TEMPLATE_MAP = {
    1: DOC_TEMPLATES[1], 2: DOC_TEMPLATES[2], 3: DOC_TEMPLATES[3],
    4: DOC_TEMPLATES[4], 6: DOC_TEMPLATES[6], 7: DOC_TEMPLATES[7],
    8: DOC_TEMPLATES[8], 10: DOC_TEMPLATES[10], 12: DOC_TEMPLATES[12],
    13: DOC_TEMPLATES[13], 15: DOC_TEMPLATES[15], 16: DOC_TEMPLATES[16],
    18: DOC_TEMPLATES[18], 19: DOC_TEMPLATES[19], 20: DOC_TEMPLATES[20],
    21: DOC_TEMPLATES[21], 22: DOC_TEMPLATES[22], 23: DOC_TEMPLATES[23],
    24: DOC_TEMPLATES[24], 26: DOC_TEMPLATES[26], 27: DOC_TEMPLATES[27],
    28: DOC_TEMPLATES[28], 29: DOC_TEMPLATES[29], 31: DOC_TEMPLATES[31],
    32: DOC_TEMPLATES[32],
  };

  // Testi per documenti senza template (generici)
  function genericText(num, title, code) {
    return `Il presente documento e stato predisposto ai sensi del D.A. 9 gennaio 2024 n. 20 e del MAMB 3.0 (giugno 2025) per attestare la conformita ai requisiti generali per l'autorizzazione all'esercizio di attivita sanitarie delle strutture non residenziali semplici monopresidio.\n\nCodice requisito: ${code}\n\nOggetto: ${title}\n\nLo studio [STUDIO], con sede in [INDIRIZZO], nella persona del Titolare/Direttore Tecnico [TITOLARE], dichiara di soddisfare il presente requisito e di disporre della relativa documentazione probatoria disponibile presso la sede della struttura.\n\nData: ${new Date().toLocaleDateString('it-IT')}`;
  }

  DOC_META.forEach(([num, title, code]) => {
    const bodyText = TEMPLATE_MAP[num] || genericText(num, title, code);
    drawCoverPage(num, title, code);
    drawDocContent(num, title, bodyText);
  });



  // ══════════════════════════════════════════
  // ASSEMBLAGGIO PDF
  // ══════════════════════════════════════════
  const objs = [];
  let objIdx = 0;
  function addObj(c) { objIdx++; objs.push({id:objIdx, content:c}); return objIdx; }

  const fNorm = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman   /Encoding /WinAnsiEncoding >>');
  const fBold = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold    /Encoding /WinAnsiEncoding >>');
  const fItal = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic  /Encoding /WinAnsiEncoding >>');

  const pageIds = [];
  pageStreams.forEach(stream => {
    const sId = addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pId = addObj(`<< /Type /Page /Parent 999 0 R /MediaBox [0 0 ${PW} ${PH}] /Contents ${sId} 0 R /Resources << /Font << /F1 ${fNorm} 0 R /F2 ${fBold} 0 R /F3 ${fItal} 0 R >> >> >>`);
    pageIds.push(pId);
  });

  const pagesId = objIdx + 1;
  addObj(`<< /Type /Pages /Kids [${pageIds.map(id=>id+' 0 R').join(' ')}] /Count ${pageIds.length} >>`);
  pageIds.forEach(id => {
    objs[id-1].content = objs[id-1].content.replace('999 0 R', `${pagesId} 0 R`);
  });

  const studioEsc = esc(studioName2 || 'Studio Odontoiatrico');
  const catId  = addObj(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  const infoId = addObj(`<< /Title (Allegato A1 - ${studioEsc}) /Producer (Wizard ALL.A1 - Dr.ssa Barbara Sabiu - AIO Palermo) >>`);

  let pdf = '%PDF-1.4\n';
  const offs = [];
  objs.forEach(o => { offs.push(pdf.length); pdf += `${o.id} 0 obj\n${o.content}\nendobj\n`; });
  const xp = pdf.length;
  pdf += `xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;
  offs.forEach(o => { pdf += `${String(o).padStart(10,'0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objs.length+1} /Root ${catId} 0 R /Info ${infoId} 0 R >>\nstartxref\n${xp}\n%%EOF`;
  return pdf;
}

function encode(s) { return s; } // placeholder per compatibilità


// ── INIT ──
document.getElementById('btnBack').style.visibility = 'hidden';

// Fix Safari iOS: touch-action manipulation elimina il delay 300ms
// Usiamo 'click' standard che su iOS con touch-action:manipulation
// viene sparato senza ritardo
function bindBtn(id, fn) {
  var el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', fn);
}

bindBtn('btnBack', function(){ navigate(-1); });
bindBtn('btnNext', function(){ navigate(1); });
bindBtn('btnPdf',  function(){ exportPDF(); });

document.querySelectorAll('.copy-btn').forEach(function(b){
  b.addEventListener('click', copyOutput);
});
