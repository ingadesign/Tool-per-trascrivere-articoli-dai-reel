(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var FIELDS = ["titolo", "data", "categoria", "autore", "estratto", "copertina", "corpo", "parag"];
  var STORAGE_KEY = "da-reel-ad-articolo:bozza";

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function oneLine(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function slugify(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").split("-").slice(0, 7).join("-") || "articolo";
  }

  function setStatus(msg, isErr) {
    var s = $("status");
    s.textContent = msg;
    s.hidden = !msg;
    s.className = "esito " + (isErr ? "esito--errore" : "esito--ok");
  }

  // Toglie numeri, orari e tag dai sottotitoli .srt e .vtt e unisce il parlato in un solo testo.
  function cleanSubs(raw) {
    var lines = String(raw).replace(/\r/g, "").split("\n").filter(function (l) {
      var t = l.trim();
      if (!t) return false;
      if (/^WEBVTT/i.test(t)) return false;
      if (/^\d+$/.test(t)) return false;
      if (/-->/.test(t)) return false;
      if (/^(NOTE|STYLE|Kind:|Language:)/.test(t)) return false;
      return true;
    }).map(function (l) {
      return l.replace(/<[^>]+>/g, "").replace(/\{\\an\d\}/g, "").trim();
    });
    var out = [];
    lines.forEach(function (l) { if (out[out.length - 1] !== l) out.push(l); });
    return out.join(" ").replace(/\s+/g, " ").trim();
  }

  // Pulisce i sottotitoli se servono e divide il testo in paragrafi di n frasi.
  // I blocchi che contengono righe con "#" (titoli di sezione) restano come scritti.
  function buildBody(raw, n) {
    var text = String(raw).replace(/\r/g, "").trim();
    if (!text) return "";
    if (/-->/.test(text) || /^WEBVTT/i.test(text)) text = cleanSubs(text);
    if (!n) return text;
    return text.split(/\n\s*\n/).map(function (block) {
      var hasHeading = block.split("\n").some(function (l) { return /^\s*#/.test(l); });
      if (hasHeading) return block.trim();
      var flat = block.replace(/\s*\n\s*/g, " ").trim();
      var sentences = flat.split(/(?<=[.!?…])\s+/);
      var paras = [];
      for (var i = 0; i < sentences.length; i += n) paras.push(sentences.slice(i, i + n).join(" "));
      return paras.join("\n\n");
    }).join("\n\n");
  }

  function buildFile() {
    var titolo = oneLine($("titolo").value);
    var copertina = oneLine($("copertina").value);
    var body = buildBody($("corpo").value, parseInt($("parag").value, 10));
    var md = "---\n" +
      "titolo: " + titolo + "\n" +
      "data: " + ($("data").value || "") + "\n" +
      "categoria: " + oneLine($("categoria").value) + "\n" +
      "autore: " + oneLine($("autore").value) + "\n" +
      "estratto: " + oneLine($("estratto").value) + "\n" +
      "copertina:" + (copertina ? " " + copertina : "") + "\n" +
      "---\n\n" + (body ? body + "\n" : "");
    var fname = ($("data").value || today()) + "-" + slugify(titolo) + ".md";
    return { md: md, fname: fname };
  }

  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try {
        var o = {};
        FIELDS.forEach(function (f) { o[f] = $(f).value; });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
      } catch (e) {}
    }, 400);
  }

  function update() {
    var f = buildFile();
    $("out").value = f.md;
    $("fname").textContent = f.fname;
    $("estrattoCount").textContent = oneLine($("estratto").value).length + " caratteri";
    var t = $("corpo").value.trim();
    $("corpoCount").textContent = (t ? t.split(/\s+/).length : 0) + " parole";
    save();
  }

  // Invio dentro un campo non deve ricaricare la pagina.
  $("modulo").addEventListener("submit", function (e) { e.preventDefault(); });

  FIELDS.forEach(function (id) {
    $(id).addEventListener("input", update);
    $(id).addEventListener("change", update);
  });

  $("data").value = today();
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved) {
      FIELDS.forEach(function (f) {
        if (typeof saved[f] === "string" && saved[f] !== "") $(f).value = saved[f];
      });
    }
  } catch (e) {}

  $("load").addEventListener("click", function () { $("file").click(); });
  $("file").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    var fr = new FileReader();
    fr.onload = function () {
      var had = $("corpo").value.trim();
      $("corpo").value = had ? had + "\n\n" + fr.result : String(fr.result);
      if (!$("titolo").value.trim()) {
        $("titolo").value = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      }
      setStatus("Caricato " + file.name + ".", false);
      update();
    };
    fr.onerror = function () { setStatus("Non riesco a leggere " + file.name + ".", true); };
    fr.readAsText(file);
  });

  $("clear").addEventListener("click", function () {
    ["titolo", "categoria", "estratto", "copertina", "corpo"].forEach(function (f) { $(f).value = ""; });
    $("data").value = today();
    setStatus("Modulo svuotato. Autore e paragrafi restano come li avevi impostati.", false);
    update();
  });

  $("copy").addEventListener("click", function () {
    var btn = $("copy");
    var done = function () {
      btn.textContent = "Copiato";
      setTimeout(function () { btn.textContent = "Copia"; }, 1500);
    };
    var fallback = function () {
      $("out").focus();
      $("out").select();
      setStatus("Testo selezionato: premi Ctrl+C (o Cmd+C) per copiarlo.", false);
    };
    try {
      navigator.clipboard.writeText($("out").value).then(done, fallback);
    } catch (e) {
      fallback();
    }
  });

  $("dl").addEventListener("click", function () {
    var f = buildFile();
    var blob = new Blob([f.md], { type: "text/markdown;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = f.fname;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  update();
})();
