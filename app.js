// ===== Utility =====
const $ = (id) => document.getElementById(id);
const num = (id) => parseFloat($(id).value) || 0;
const fmt = (n) => n.toLocaleString("ja-JP");
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();
const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const dayOfYear = (d) => Math.floor((d - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1;

// ===== Calculation =====
function calc() {
  const kStr = $("f-kessaibi").value;
  if (!kStr) return null;
  const kessai = new Date(kStr);
  const y = kessai.getFullYear(), m = kessai.getMonth() + 1, d = kessai.getDate();
  const monthDays = daysInMonth(y, m);
  const daysToEom = monthDays - d + 1;
  const yearDays = isLeap(y) ? 366 : 365;
  const daysToEoy = yearDays - dayOfYear(kessai) + 1;

  const baibai = num("f-baibai"), tetsuke = num("f-tetsukekin");
  const keiyaku = baibai - tetsuke;

  const koteiNen = num("f-kotei-nenngaku");
  const koteiAmt = Math.round(koteiNen * daysToEoy / yearDays);

  const kanriGetsu = num("f-kanri-getsugaku");
  const kanriMade = parseInt($("f-kanri-made").value);
  const kanriHiwari = Math.round(kanriGetsu * daysToEom / monthDays);
  const kanriFullMonths = Math.max(0, kanriMade - m);
  const kanriFullAmt = kanriGetsu * kanriFullMonths;
  const kanriAmt = kanriHiwari + kanriFullAmt;
  const kanriFullLabels = [];
  for (let i = m + 1; i <= kanriMade; i++) kanriFullLabels.push(i + "月分満額");

  const yachinGetsu = num("f-yachin-getsugaku");
  const yStart = $("f-yachin-start").value, yEnd = $("f-yachin-end").value;
  let yachinDays = 0, yachinAmt = 0;
  if (yStart && yEnd) {
    yachinDays = Math.round((new Date(yEnd) - new Date(yStart)) / 86400000) + 1;
    yachinAmt = Math.round(yachinGetsu * yachinDays / monthDays);
  }

  const shikikin = num("f-shikikin");
  const touki = num("f-touki");
  const inshi = num("f-inshi");
  const total = keiyaku + koteiAmt + kanriAmt + yachinAmt + shikikin - touki + inshi;

  return {
    kessai, y, m, d, monthDays, daysToEom, yearDays, daysToEoy,
    baibai, tetsuke, keiyaku,
    koteiNen, koteiAmt,
    kanriGetsu, kanriMade, kanriHiwari, kanriFullMonths, kanriFullAmt, kanriAmt, kanriFullLabels,
    yachinGetsu, yStart, yEnd, yachinDays, yachinAmt,
    shikikin, touki, inshi, total,
    furikomi1: total, furikomi2: touki,
  };
}

// ===== Preview =====
function updatePreview() {
  const c = calc();
  if (!c) return;

  $("d-sei").textContent = $("f-sei").value;
  $("d-mei").textContent = $("f-mei").value;
  $("d-bukken").textContent = $("f-bukken").value;
  $("d-goshitsu").textContent = $("f-goshitsu").value;
  $("d-baibai").textContent = "¥" + fmt(c.baibai);
  $("d-tetsukekin").textContent = "¥" + fmt(c.tetsuke);
  $("d-kessaibi").textContent = c.y + "年" + c.m + "月" + c.d + "日";
  $("d-basho").textContent = $("f-basho").value;
  $("d-chukaisha").textContent = $("f-chukaisha").value;
  $("d-tanto").textContent = $("f-tanto").value;
  $("d-invoice").textContent = $("f-invoice").value;

  $("d-month-days").textContent = c.monthDays;
  $("d-days-eom").textContent = c.daysToEom;
  $("d-year-days").textContent = c.yearDays;
  $("d-days-eoy").textContent = c.daysToEoy;

  $("d-keiyaku-amt").textContent = fmt(c.keiyaku);
  $("d-kotei-nen").textContent = fmt(c.koteiNen);
  $("d-kotei-amt").textContent = fmt(c.koteiAmt);

  $("d-kanri-getsu").textContent = fmt(c.kanriGetsu);
  $("d-kanri-made-month").textContent = c.kanriMade;
  $("d-kanri-amt").textContent = fmt(c.kanriAmt);
  $("d-kanri-month").textContent = c.m;
  $("d-kanri-hiwari").textContent = fmt(c.kanriHiwari);
  if (c.kanriFullLabels.length > 0) {
    $("d-kanri-full-label").innerHTML = c.kanriFullLabels.join("<br>");
    $("d-kanri-full-amt").textContent = fmt(c.kanriFullAmt);
    $("d-kanri-full-yen").textContent = "円";
  } else {
    $("d-kanri-full-label").textContent = "";
    $("d-kanri-full-amt").textContent = "";
    $("d-kanri-full-yen").textContent = "";
  }

  if (c.yStart && c.yEnd) {
    const s = new Date(c.yStart), e = new Date(c.yEnd);
    const r = (s.getMonth()+1)+"月"+s.getDate()+"日〜"+(e.getMonth()+1)+"月"+e.getDate()+"日";
    $("d-yachin-range").textContent = r;
    $("d-yachin-detail").textContent = r;
    $("d-yachin-detail-amt").textContent = fmt(c.yachinAmt);
    $("d-yachin-amt").textContent = fmt(c.yachinAmt);
  }
  $("d-yachin-getsu").textContent = fmt(c.yachinGetsu);
  $("d-shikikin-amt").textContent = c.shikikin ? fmt(c.shikikin) : "";
  $("d-touki-amt").textContent = c.touki ? "▲" + fmt(c.touki) : "";
  $("d-inshi-amt").textContent = c.inshi ? fmt(c.inshi) : "";
  $("d-total").textContent = fmt(c.total);
  $("d-furikomi1").textContent = fmt(c.furikomi1);
  $("d-furikomi2").textContent = "";

  // Transfer
  $("d-tf1-bank").textContent = $("f-bank1-name").value;
  $("d-tf1-branch").textContent = $("f-bank1-branch").value;
  $("d-tf1-type").textContent = $("f-bank1-type").value;
  $("d-tf1-number").textContent = $("f-bank1-number").value;
  $("d-tf1-holder").textContent = $("f-bank1-holder").value;
  $("d-tf1-amount").textContent = fmt(c.furikomi1);
  $("d-tf2-bank").textContent = $("f-bank2-name").value;
  $("d-tf2-branch").textContent = $("f-bank2-branch").value;
  $("d-tf2-type").textContent = $("f-bank2-type").value;
  $("d-tf2-number").textContent = $("f-bank2-number").value;
  $("d-tf2-holder").textContent = $("f-bank2-holder").value;
  $("d-tf2-amount").textContent = fmt(c.furikomi2);
}

// ===== Logo =====
$("f-logo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const wrap = $("d-logo-wrap");
  wrap.innerHTML = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = document.createElement("img");
      img.src = ev.target.result;
      wrap.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// ===== PDF =====
$("btn-pdf").addEventListener("click", () => {
  html2pdf().set({
    margin: 0,
    filename: "取引明細書.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#fff" },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }).from($("doc")).save();
});

// ===== Excel =====
$("btn-excel").addEventListener("click", async () => {
  const c = calc();
  if (!c) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("取引明細書");

  ws.columns = [
    { width: 5 },  // A
    { width: 14 }, // B
    { width: 14 }, // C
    { width: 14 }, // D
    { width: 5 },  // E
    { width: 14 }, // F
    { width: 16 }, // G
    { width: 5 },  // H
    { width: 16 }, // I
    { width: 5 },  // J
    { width: 5 },  // K
  ];

  const bdr = (style = "thin") => ({
    top: { style }, bottom: { style }, left: { style }, right: { style },
  });
  const ra = { horizontal: "right", vertical: "middle" };
  const ca = { horizontal: "center", vertical: "middle" };
  const bf = { bold: true };

  let r = 1;

  // Title
  ws.mergeCells(r, 1, r, 11);
  const titleCell = ws.getCell(r, 1);
  titleCell.value = "取引明細書";
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = ca;
  r += 2;

  // Name
  ws.getCell(r, 1).value = $("f-sei").value + "　" + $("f-mei").value + "　様";
  ws.getCell(r, 1).font = { bold: true, size: 14 };
  r += 2;

  // --- Reference data row (for formulas) ---
  const REF_ROW = r;
  const labels = [
    ["売買代金", c.baibai, "手付金", c.tetsuke, "固定資産税年額", c.koteiNen,
     "管理費月額", c.kanriGetsu, "管理費負担月", c.kanriMade],
  ];
  // Row 1: A=label B=baibai C=label D=tetsuke E=label F=koteiNen G=label H=kanriGetsu I=label J=kanriMade
  ws.getCell(r, 1).value = "売買代金"; ws.getCell(r, 2).value = c.baibai;
  ws.getCell(r, 3).value = "手付金"; ws.getCell(r, 4).value = c.tetsuke;
  ws.getCell(r, 5).value = "固定資産税年額"; ws.getCell(r, 6).value = c.koteiNen;
  ws.getCell(r, 7).value = "管理費月額"; ws.getCell(r, 8).value = c.kanriGetsu;
  ws.getCell(r, 9).value = "管理費負担月"; ws.getCell(r, 10).value = c.kanriMade;
  for (let i = 1; i <= 10; i++) {
    ws.getCell(r, i).font = { size: 8, color: { argb: "FF888888" } };
  }
  r++;
  const REF_ROW2 = r;
  ws.getCell(r, 1).value = "家賃月額"; ws.getCell(r, 2).value = c.yachinGetsu;
  ws.getCell(r, 3).value = "家賃取得日数"; ws.getCell(r, 4).value = c.yachinDays;
  ws.getCell(r, 5).value = "決済月日数"; ws.getCell(r, 6).value = c.monthDays;
  ws.getCell(r, 7).value = "年末日数"; ws.getCell(r, 8).value = c.daysToEoy;
  ws.getCell(r, 9).value = "年間日数"; ws.getCell(r, 10).value = c.yearDays;
  for (let i = 1; i <= 10; i++) {
    ws.getCell(r, i).font = { size: 8, color: { argb: "FF888888" } };
  }
  r++;
  const REF_ROW3 = r;
  ws.getCell(r, 1).value = "月末日数"; ws.getCell(r, 2).value = c.daysToEom;
  ws.getCell(r, 3).value = "敷金"; ws.getCell(r, 4).value = c.shikikin;
  ws.getCell(r, 5).value = "登記費用"; ws.getCell(r, 6).value = c.touki;
  ws.getCell(r, 7).value = "印紙代"; ws.getCell(r, 8).value = c.inshi;
  ws.getCell(r, 9).value = "決済月"; ws.getCell(r, 10).value = c.m;
  for (let i = 1; i <= 10; i++) {
    ws.getCell(r, i).font = { size: 8, color: { argb: "FF888888" } };
  }
  r += 2;

  // Cell refs
  const R = {
    baibai: `B${REF_ROW}`, tetsuke: `D${REF_ROW}`,
    koteiNen: `F${REF_ROW}`, kanriGetsu: `H${REF_ROW}`, kanriMade: `J${REF_ROW}`,
    yachinGetsu: `B${REF_ROW2}`, yachinDays: `D${REF_ROW2}`,
    monthDays: `F${REF_ROW2}`, daysToEoy: `H${REF_ROW2}`, yearDays: `J${REF_ROW2}`,
    daysToEom: `B${REF_ROW3}`, shikikin: `D${REF_ROW3}`,
    touki: `F${REF_ROW3}`, inshi: `H${REF_ROW3}`, kessaiMonth: `J${REF_ROW3}`,
  };

  // --- Property & Settlement info ---
  const propStart = r;
  [
    ["物件名", $("f-bukken").value],
    ["号室", $("f-goshitsu").value],
    ["売買代金", "¥" + fmt(c.baibai)],
    ["手付金", "¥" + fmt(c.tetsuke)],
  ].forEach(([label, val], i) => {
    const cr = propStart + i;
    ws.getCell(cr, 1).value = label; ws.getCell(cr, 1).border = bdr(); ws.getCell(cr, 1).font = bf;
    ws.mergeCells(cr, 2, cr, 4);
    ws.getCell(cr, 2).value = val; ws.getCell(cr, 2).border = bdr();
  });
  [
    ["決済日：", c.y + "年" + c.m + "月" + c.d + "日"],
    ["場　所：", $("f-basho").value],
    ["仲介者：", $("f-chukaisha").value],
    ["担　当：", $("f-tanto").value],
    ["適格請求書番号：", $("f-invoice").value],
  ].forEach(([label, val], i) => {
    const cr = propStart + i;
    ws.getCell(cr, 6).value = label; ws.getCell(cr, 6).border = bdr();
    ws.mergeCells(cr, 7, cr, 10);
    ws.getCell(cr, 7).value = val; ws.getCell(cr, 7).border = bdr();
  });
  r = propStart + 5 + 1;

  // Date calc
  ws.getCell(r, 1).value = "決済月日数"; ws.getCell(r, 1).border = bdr(); ws.getCell(r, 1).font = bf;
  ws.getCell(r, 2).value = c.monthDays; ws.getCell(r, 2).border = bdr(); ws.getCell(r, 2).alignment = ra;
  ws.getCell(r, 3).value = "月末までの日数"; ws.getCell(r, 3).border = bdr(); ws.getCell(r, 3).font = bf;
  ws.getCell(r, 4).value = c.daysToEom; ws.getCell(r, 4).border = bdr(); ws.getCell(r, 4).alignment = ra;
  r++;
  ws.getCell(r, 1).value = "年間日数"; ws.getCell(r, 1).border = bdr(); ws.getCell(r, 1).font = bf;
  ws.getCell(r, 2).value = c.yearDays; ws.getCell(r, 2).border = bdr(); ws.getCell(r, 2).alignment = ra;
  ws.getCell(r, 3).value = "年末までの日数"; ws.getCell(r, 3).border = bdr(); ws.getCell(r, 3).font = bf;
  ws.getCell(r, 4).value = c.daysToEoy; ws.getCell(r, 4).border = bdr(); ws.getCell(r, 4).alignment = ra;
  r += 2;

  // --- Main items ---
  function amtCell(row, formula, result) {
    const cell = ws.getCell(row, 9);
    cell.value = { formula, result };
    cell.numFmt = "#,##0";
    cell.font = bf;
    cell.border = bdr();
    ws.getCell(row, 10).value = "円";
    return row;
  }

  // ①
  ws.getCell(r, 1).value = "①"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 8); ws.getCell(r, 2).value = "契約最終代金";
  const r1 = amtCell(r, `${R.baibai}-${R.tetsuke}`, c.keiyaku);
  r++;

  // ②
  ws.getCell(r, 1).value = "②"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 5); ws.getCell(r, 2).value = "固定資産税の清算";
  ws.mergeCells(r, 6, r, 8); ws.getCell(r, 6).value = "年額 " + fmt(c.koteiNen) + " 円"; ws.getCell(r, 6).alignment = ra;
  const r2 = amtCell(r, `ROUND(${R.koteiNen}*${R.daysToEoy}/${R.yearDays},0)`, c.koteiAmt);
  r++;
  ws.mergeCells(r, 2, r, 8); ws.getCell(r, 2).value = "（1月1日現在の所有者が負担すること前提として）";
  ws.getCell(r, 2).font = { size: 9 };
  r++;

  // ③
  ws.getCell(r, 1).value = "③"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 5); ws.getCell(r, 2).value = "管理費等の清算";
  ws.mergeCells(r, 6, r, 8); ws.getCell(r, 6).value = "月額 " + fmt(c.kanriGetsu) + " 円"; ws.getCell(r, 6).alignment = ra;
  r++;
  ws.mergeCells(r, 2, r, 8);
  ws.getCell(r, 2).value = "（売主が" + c.kanriMade + "月分までの管理費を管理組合に支払うことを前提として）";
  ws.getCell(r, 2).font = { size: 9 };
  const r3 = amtCell(r, `ROUND(${R.kanriGetsu}*${R.daysToEom}/${R.monthDays},0)+${R.kanriGetsu}*MAX(0,${R.kanriMade}-${R.kessaiMonth})`, c.kanriAmt);
  r++;
  ws.mergeCells(r, 2, r, 4);
  ws.getCell(r, 2).value = c.m + "月分日割 " + fmt(c.kanriHiwari) + " 円";
  ws.getCell(r, 2).font = { size: 9 };
  if (c.kanriFullLabels.length) {
    ws.mergeCells(r, 5, r, 8);
    ws.getCell(r, 5).value = c.kanriFullLabels.join("/") + " " + fmt(c.kanriFullAmt) + " 円";
    ws.getCell(r, 5).font = { size: 9 };
  }
  r++;

  // ④
  ws.getCell(r, 1).value = "④"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 5); ws.getCell(r, 2).value = "家賃の清算";
  ws.mergeCells(r, 6, r, 8); ws.getCell(r, 6).value = "月額 " + fmt(c.yachinGetsu) + " 円"; ws.getCell(r, 6).alignment = ra;
  r++;
  let rngLabel = "";
  if (c.yStart && c.yEnd) {
    const s = new Date(c.yStart), e = new Date(c.yEnd);
    rngLabel = (s.getMonth()+1)+"月"+s.getDate()+"日〜"+(e.getMonth()+1)+"月"+e.getDate()+"日";
  }
  ws.mergeCells(r, 2, r, 8);
  ws.getCell(r, 2).value = "（売主が" + rngLabel + "までの家賃を取得することを前提として）";
  ws.getCell(r, 2).font = { size: 9 };
  const r4 = amtCell(r, `ROUND(${R.yachinGetsu}*${R.yachinDays}/${R.monthDays},0)`, c.yachinAmt);
  r++;
  ws.mergeCells(r, 2, r, 8);
  ws.getCell(r, 2).value = rngLabel + "分 " + fmt(c.yachinAmt) + " 円";
  ws.getCell(r, 2).font = { size: 9 };
  r++;

  // ⑤
  ws.getCell(r, 1).value = "⑤"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 8); ws.getCell(r, 2).value = "敷金の移行";
  const r5 = r;
  if (c.shikikin) {
    ws.getCell(r, 9).value = { formula: R.shikikin, result: c.shikikin };
  } else {
    ws.getCell(r, 9).value = "";
  }
  ws.getCell(r, 9).numFmt = "#,##0"; ws.getCell(r, 9).border = bdr();
  ws.getCell(r, 10).value = "円";
  r++;

  // ⑥
  ws.getCell(r, 1).value = "⑥"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 8); ws.getCell(r, 2).value = "登記・抹消費用";
  const r6 = r;
  ws.getCell(r, 9).value = { formula: `-${R.touki}`, result: -c.touki };
  ws.getCell(r, 9).numFmt = '"▲"#,##0;"▲"#,##0;""';
  ws.getCell(r, 9).font = bf; ws.getCell(r, 9).border = bdr();
  ws.getCell(r, 10).value = "円";
  r++;

  // ⑦
  ws.getCell(r, 1).value = "⑦"; ws.getCell(r, 1).alignment = ca;
  ws.mergeCells(r, 2, r, 8); ws.getCell(r, 2).value = "契約書貼付印紙代金";
  const r7 = r;
  if (c.inshi) {
    ws.getCell(r, 9).value = { formula: R.inshi, result: c.inshi };
  } else {
    ws.getCell(r, 9).value = "";
  }
  ws.getCell(r, 9).numFmt = "#,##0"; ws.getCell(r, 9).border = bdr();
  ws.getCell(r, 10).value = "円";
  r += 2;

  // 合計
  ws.mergeCells(r, 2, r, 8);
  ws.getCell(r, 2).value = "合計"; ws.getCell(r, 2).font = { bold: true, size: 12 }; ws.getCell(r, 2).alignment = ca;
  const totalF = `I${r1}+I${r2}+I${r3}+I${r4}+IF(I${r5}="",0,I${r5})+I${r6}+IF(I${r7}="",0,I${r7})`;
  ws.getCell(r, 9).value = { formula: totalF, result: c.total };
  ws.getCell(r, 9).numFmt = "#,##0";
  ws.getCell(r, 9).font = { bold: true, size: 12 };
  ws.getCell(r, 9).border = { top: { style: "medium" }, bottom: { style: "medium" }, left: { style: "medium" }, right: { style: "medium" } };
  ws.getCell(r, 10).value = "円";
  const rTotal = r;
  r += 2;

  // 内訳
  ws.getCell(r, 2).value = "内訳"; ws.getCell(r, 2).font = bf; ws.getCell(r, 2).border = bdr(); ws.getCell(r, 2).alignment = ca;
  ws.getCell(r, 3).value = "振込"; ws.getCell(r, 3).border = bdr(); ws.getCell(r, 3).alignment = ca;
  ws.getCell(r, 9).value = { formula: `I${rTotal}`, result: c.furikomi1 };
  ws.getCell(r, 9).numFmt = "#,##0"; ws.getCell(r, 9).font = bf; ws.getCell(r, 9).border = bdr();
  ws.getCell(r, 10).value = "円"; ws.getCell(r, 10).border = bdr();
  ws.getCell(r, 11).value = "Ⅰ"; ws.getCell(r, 11).font = bf;
  r++;
  ws.getCell(r, 2).value = ""; ws.getCell(r, 2).border = bdr();
  ws.getCell(r, 3).value = "振込"; ws.getCell(r, 3).border = bdr(); ws.getCell(r, 3).alignment = ca;
  ws.getCell(r, 9).value = ""; ws.getCell(r, 9).border = bdr();
  ws.getCell(r, 10).value = "円"; ws.getCell(r, 10).border = bdr();
  ws.getCell(r, 11).value = "Ⅱ"; ws.getCell(r, 11).font = bf;
  r++;
  ws.mergeCells(r, 3, r, 10);
  ws.getCell(r, 3).value = "※一円未満は四捨五入して計算しています。";
  ws.getCell(r, 3).font = { size: 8 }; ws.getCell(r, 3).alignment = ra;
  r += 2;

  // 振込先
  ws.getCell(r, 1).value = "振込先"; ws.getCell(r, 1).font = bf;
  r++;
  [
    ["振込先Ⅰ", $("f-bank1-name").value, "銀行", $("f-bank1-branch").value, "支店",
     $("f-bank1-type").value, $("f-bank1-number").value, $("f-bank1-holder").value,
     { formula: `I${rTotal}`, result: c.furikomi1 }, "円"],
    ["振込先Ⅱ", $("f-bank2-name").value, "銀行", $("f-bank2-branch").value, "支店",
     $("f-bank2-type").value, $("f-bank2-number").value, $("f-bank2-holder").value,
     c.furikomi2, "円"],
  ].forEach(row => {
    row.forEach((v, ci) => {
      const cell = ws.getCell(r, ci + 1);
      cell.value = v;
      cell.border = bdr();
      if (ci === 0) cell.font = { bold: true, underline: true };
      if (ci === 8) { cell.numFmt = "#,##0"; cell.font = bf; cell.alignment = ra; }
    });
    r++;
  });

  // Download
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "取引明細書.xlsx";
  a.click();
  URL.revokeObjectURL(a.href);
});

// ===== Wire up =====
document.querySelectorAll(".form-panel input, .form-panel select").forEach(el => {
  el.addEventListener("input", updatePreview);
  el.addEventListener("change", updatePreview);
});
updatePreview();
