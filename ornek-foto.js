/* Denetim Cebi tanıtımı: örnek "uygunsuzluk fotoğrafı" (acil çıkışın önüne istiflenmiş koliler).
 * Gerçek bir fotoğraf değildir; tarayıcıda çizilir. Uygulamanın kendi fotoğraf alanına verilir,
 * uygulama da üzerine tarih/saat/şube damgasını kendisi basar.
 * Kullanım: ornekFoto(hedefPencere) → hedef pencerenin File nesnesi (Promise). */
(function () {
  function ciz(doc) {
    var W = 1200, H = 900;
    var c = doc.createElement("canvas"); c.width = W; c.height = H;
    var g = c.getContext("2d");
    // duvar
    var duvar = g.createLinearGradient(0, 0, 0, 640);
    duvar.addColorStop(0, "#b9b4a8"); duvar.addColorStop(1, "#d6d1c4");
    g.fillStyle = duvar; g.fillRect(0, 0, W, 640);
    // süpürgelik ve zemin
    var zemin = g.createLinearGradient(0, 640, 0, H);
    zemin.addColorStop(0, "#77736a"); zemin.addColorStop(1, "#4f4c46");
    g.fillStyle = zemin; g.fillRect(0, 640, W, H - 640);
    g.fillStyle = "#5d5a53"; g.fillRect(0, 628, W, 14);
    g.strokeStyle = "rgba(255,255,255,.06)"; g.lineWidth = 2;
    for (var i = -6; i <= 12; i++) { g.beginPath(); g.moveTo(600 + i * 40, 642); g.lineTo(600 + i * 190, H); g.stroke(); }
    // kapı kasası ve kapı
    g.fillStyle = "#8d9196"; g.fillRect(520, 170, 360, 470);
    var kapi = g.createLinearGradient(540, 0, 860, 0);
    kapi.addColorStop(0, "#a7abb0"); kapi.addColorStop(.5, "#c4c7cb"); kapi.addColorStop(1, "#9ea2a7");
    g.fillStyle = kapi; g.fillRect(540, 188, 320, 452);
    g.strokeStyle = "rgba(0,0,0,.18)"; g.lineWidth = 3; g.strokeRect(540, 188, 320, 452);
    g.fillStyle = "#6b6f74"; g.fillRect(570, 420, 260, 16);
    g.fillStyle = "#d9534f"; g.fillRect(570, 420, 40, 16);
    // acil çıkış levhası
    g.fillStyle = "#1f8f4e"; roundRect(g, 585, 92, 230, 64, 6); g.fill();
    g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 3; roundRect(g, 591, 98, 218, 52, 4); g.stroke();
    g.fillStyle = "#fff"; g.font = "700 30px Arial, sans-serif"; g.textBaseline = "middle"; g.textAlign = "center";
    g.fillText("ACİL ÇIKIŞ", 700, 125);
    // koliler
    var koliler = [
      [430, 560, 210, 200], [640, 590, 230, 170], [870, 540, 190, 220],
      [470, 400, 170, 160], [660, 450, 190, 140], [880, 410, 160, 130], [560, 300, 150, 110],
    ];
    koliler.forEach(function (k, n) { koli(g, k[0], k[1], k[2], k[3], n); });
    // hafif vinyet
    var v = g.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .85);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.38)");
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    // kumlanma
    var px = g.getImageData(0, 0, W, H), d = px.data, s = 11;
    for (var p = 0; p < d.length; p += 4) { s = (s * 16807) % 2147483647; var r = (s / 2147483647 - .5) * 14; d[p] += r; d[p + 1] += r; d[p + 2] += r; }
    g.putImageData(px, 0, 0);
    return c;
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function koli(g, x, y, w, h, n) {
    var ton = ["#b98a52", "#c4955c", "#ad7f49", "#bf9058"][n % 4];
    g.fillStyle = "rgba(0,0,0,.25)"; g.fillRect(x + 8, y + h - 6, w, 12);
    g.fillStyle = ton; g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(x + w * .72, y, w * .28, h);
    g.fillStyle = "rgba(255,255,255,.08)"; g.fillRect(x, y, w, 10);
    g.fillStyle = "rgba(225,196,140,.85)"; g.fillRect(x + w * .44, y, w * .12, h * .55);
    g.fillStyle = "#f3f1ea"; g.fillRect(x + w * .12, y + h * .62, w * .34, h * .22);
    g.fillStyle = "#222"; for (var i = 0; i < 9; i++) g.fillRect(x + w * .15 + i * (w * .028), y + h * .66, i % 3 ? 2 : 3, h * .1);
    g.strokeStyle = "rgba(0,0,0,.25)"; g.lineWidth = 2; g.strokeRect(x, y, w, h);
  }
  window.ornekFoto = function (hedef) {
    hedef = hedef || window;
    var c = ciz(hedef.document);
    return new Promise(function (ok) {
      c.toBlob(function (b) { ok(new hedef.File([b], "ornek-acil-cikis.jpg", { type: "image/jpeg" })); }, "image/jpeg", .88);
    });
  };
})();
