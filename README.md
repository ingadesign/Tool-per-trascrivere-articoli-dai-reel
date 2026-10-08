# Da reel ad articolo

Strumento web per trasformare la trascrizione di un reel in un file Markdown con l'intestazione del blog.

Funziona tutto nel browser: non c'è server, non servono account e nessun testo viene inviato da nessuna parte.

## Cosa fa

- Compili titolo, data, categoria, autore, estratto e copertina (facoltativa).
- Incolli la trascrizione del reel, oppure carichi un file `.srt`, `.vtt` o `.txt`.
- I sottotitoli `.srt` e `.vtt` vengono ripuliti da numeri e orari.
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
