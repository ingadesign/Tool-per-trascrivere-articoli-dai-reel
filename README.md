# Da reel ad articolo

Strumento web per trasformare la trascrizione di un reel in un file Markdown con l'intestazione del blog.

Funziona tutto nel browser: non c'è un server nostro e non servono account. Testi e video restano sul computer di chi usa la pagina, con due eccezioni descritte più sotto: la trascrizione automatica scarica un modello da internet, e la scrittura dell'articolo invia a Anthropic il testo della trascrizione.

## Cosa fa

- Compili titolo, data, categoria, autore, estratto e copertina (facoltativa).
- Incolli la trascrizione del reel, oppure carichi un file `.srt`, `.vtt` o `.txt`.
- I sottotitoli `.srt` e `.vtt` vengono ripuliti da numeri e orari.
- Se non hai i sottotitoli, puoi caricare il video o l'audio e farti trascrivere il parlato direttamente nel browser (vedi "Trascrizione automatica").
- Il testo viene diviso in paragrafi (ogni 2, 3 o 4 frasi, oppure lasciato com'è).
- Il file `.md` si aggiorna mentre scrivi. Puoi copiarlo o scaricarlo.
- Il nome del file è `AAAA-MM-GG-titolo-articolo.md`.
- La bozza resta salvata nel browser, quindi se ricarichi la pagina non perdi quello che hai scritto.

## Formato prodotto

```markdown
---
titolo: Titolo dell'articolo
data: 2026-10-08
categoria: Volontariato
autore: Tung Tung Saur
estratto: Una o due frasi che fanno venire voglia di leggere.
copertina:
---

Testo dell'articolo…
```

Per aggiungere una sezione scrivi una riga che inizia con `## ` direttamente nella trascrizione, per esempio `## Come funziona`. I blocchi di testo che contengono un titolo non vengono rimessi in paragrafi.

## Trascrizione automatica

Il pulsante **Scegli video o audio** trascrive il parlato con Whisper, un modello di riconoscimento vocale gratuito che gira nel browser grazie a [transformers.js](https://github.com/huggingface/transformers.js). Il testo compare nel campo della trascrizione, pronto da correggere.

- Il video non viene inviato a nessuno: l'audio viene letto e trascritto sul computer di chi usa la pagina.
- Alla prima trascrizione il browser scarica il motore (da jsDelivr) e il modello (da Hugging Face). Servono internet e un po' di pazienza: circa 40 MB per "Veloce", 80 MB per "Media", 250 MB per "Alta". Poi il modello resta nella cache del browser e le volte successive parte subito.
- Funziona con file video e audio che il browser sa leggere (.mp4, .mov, .webm, .mp3, .wav, .m4a). Se un file non si apre, estrai l'audio in .mp3 e caricalo. Il limite è 500 MB.
- Più la precisione è alta, meglio vengono i nomi propri, ma più è lenta la trascrizione, soprattutto su computer meno potenti. Per i reel di pochi minuti "Media" è un buon punto di partenza.
- Whisper sbaglia spesso nomi propri e titoli di giochi, e con musica o rumore forte può inventare parole. **Rileggi sempre la trascrizione** prima di pubblicare.
- Per far funzionare bene la cache del modello usa la pagina dal link GitHub Pages (https) e non aprendo `index.html` da file.

La versione di transformers.js è fissata in `app.js` (`TRANSFORMERS_URL`) per evitare sorprese quando esce una nuova versione.

## Scrittura dell'articolo in tono giornalistico

Il pulsante **Scrivi l'articolo** manda la trascrizione a Claude, che racconta il video come farebbe un giornalista: attacco chiaro, frasi brevi, citazioni solo se sono nella trascrizione e nessun dato inventato. Se titolo, estratto e categoria sono vuoti, li compila lui; quelli già scritti restano come sono. L'articolo compare nel campo "Articolo scritto", modificabile, e nel file `.md` va quello. Se il campo resta vuoto, nel file va la trascrizione.

Puoi scegliere modello, lunghezza, voce (cronista esterno oppure "noi" della redazione) e se usare i titoletti. Nel campo "Note per chi scrive" puoi dire cosa si vede nel video, il nome del progetto, chi parla: Claude legge solo il parlato, quindi tutto ciò che è solo visivo va scritto lì.

### Chiave API

- Serve una chiave API personale, da creare nella [Console di Anthropic](https://console.anthropic.com). È separata dall'abbonamento a Claude.ai: l'account API ha un credito a consumo da ricaricare.
- Ogni articolo costa di solito circa un centesimo con Sonnet, meno con Haiku. I prezzi aggiornati sono nella [documentazione](https://docs.claude.com).
- La chiave la scrive ciascun utente nella pagina. **Non va mai scritta nei file del repository.** Se spunti "Ricorda la chiave su questo computer" resta salvata solo nel browser di quel computer; "Dimentica la chiave" la cancella.
- Consiglio: nella Console crea una chiave dedicata a questo strumento e imposta un limite di spesa mensile. Non usare questo strumento su computer condivisi o pubblici.
- La richiesta parte direttamente dal browser verso i server di Anthropic. Non c'è nessun server intermedio nostro e il testo della trascrizione non passa da altre parti.

Claude può comunque sbagliare nomi, numeri e citazioni: rileggi sempre l'articolo con il video accanto prima di pubblicare.

## Come usarlo

### In locale

Scarica la cartella e apri `index.html` con un doppio clic. Non serve installare nulla.

### Online con GitHub Pages

1. Carica i file di questa cartella in un repository GitHub.
2. Vai in **Settings → Pages**.
3. In **Build and deployment** scegli **Deploy from a branch**, seleziona il branch `main` e la cartella `/ (root)`, poi salva.
4. Dopo un minuto circa la pagina è online all'indirizzo `https://NOME-UTENTE.github.io/NOME-REPOSITORY/`. Manda quel link ai colleghi.

## File

- `index.html`: la pagina.
- `stile.css`: il foglio di stile del progetto, copiato senza modifiche. Colori, spaziature, bottoni e campi vengono da qui, così lo strumento ha la stessa immagine coordinata del sito.
- `strumento.css`: le poche regole che servono solo a questa pagina (disposizione in due colonne, menu a tendina, area del file). Usa solo le variabili di `stile.css`.
- `app.js`: la logica.

Se `stile.css` del progetto cambia, sostituisci il file: lo strumento si aggiorna da solo.

## Font

Come scritto in `stile.css`, i font del marchio non sono inclusi e il foglio di stile non carica nessun webfont: il testo usa Open Sans se è installato, altrimenti il font di sistema. Se il sito carica Open Sans con un `<link>`, copia la stessa riga nell'`<head>` di `index.html`.

## Personalizzare

- **Autore predefinito:** in `index.html` cerca il campo con `id="autore"` e modifica il valore `Tung Tung Saur`.
- **Marchio in alto:** in `index.html` cerca `marchio__testo`. Per usare il logo al posto del testo, inserisci `<img src="logo.svg" alt="Nome del progetto">` dentro `<span class="marchio">`.
