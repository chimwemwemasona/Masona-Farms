import type { CropField, FarmRecord, FarmTotals } from "../data/types";

const currency = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0
});

export function calculateFarmTotals(records: FarmRecord[]): FarmTotals {
  const revenue = records.filter((record) => record.type === "Sale").reduce((sum, item) => sum + item.amount, 0);
  const expenses = records.filter((record) => record.type !== "Sale" && record.type !== "Harvest").reduce((sum, item) => sum + item.amount, 0);
  return { revenue, expenses, profit: revenue - expenses };
}

export function calculateFieldReportValues(totals: FarmTotals, fields: CropField[]) {
  const fieldCost = fields.length ? totals.expenses / fields.length : 0;
  const totalArea = fields.reduce((sum, field) => sum + parseArea(field.area), 0);
  const costPerHa = totalArea ? totals.expenses / totalArea : 0;
  return { fieldCost, costPerHa };
}

export function getBestCrop(fields: CropField[], records: FarmRecord[]) {
  const cropByField = new Map(fields.map((field) => [field.field, field.crop]));
  const totalsByCrop = new Map<string, number>();

  records.forEach((record) => {
    const crop = cropByField.get(record.field) ?? "Unlinked";
    const signedAmount = record.type === "Sale" ? record.amount : record.type === "Harvest" ? 0 : -record.amount;
    totalsByCrop.set(crop, (totalsByCrop.get(crop) ?? 0) + signedAmount);
  });

  const sorted = [...totalsByCrop.entries()].sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return { name: "No data", detail: "Add sales and expenses" };
  const [name, value] = sorted[0];
  return { name, detail: currency.format(value) };
}

export function buildAgronomistSummary(fields: CropField[], records: FarmRecord[]) {
  const watchField = fields.find((field) => field.status === "Watch") ?? fields[0];
  if (!watchField) return "Add a field to create an agronomist summary.";
  const history = records
    .filter((record) => record.field === watchField.field)
    .slice(0, 4)
    .map((record) => `${record.type}: ${record.detail}${record.quantity ? ` (${record.quantity})` : ""}`)
    .join("; ");
  return `${watchField.crop} - ${watchField.field} is at ${watchField.stage} stage with ${watchField.progress}% progress and ${watchField.status.toLowerCase()} status. Recent history: ${history || "no linked records yet"}.`;
}

export function buildShareReport({
  totals,
  fields,
  records,
  bestCrop,
  fieldCost,
  costPerHa,
  agronomistSummary
}: {
  totals: FarmTotals;
  fields: CropField[];
  records: FarmRecord[];
  bestCrop: { name: string; detail: string };
  fieldCost: number;
  costPerHa: number;
  agronomistSummary: string;
}) {
  const recentRecords = records
    .slice(0, 6)
    .map((record) => `- ${record.type}: ${record.cropCycleName || record.field}, ${record.detail}${record.quantity ? `, ${record.quantity}` : ""}, ${currency.format(record.amount)}`)
    .join("\n");
  const fieldSummary = fields
    .slice(0, 6)
    .map((field) => `- ${field.crop} ${field.field}: ${field.area}, ${field.stage}, ${field.status}`)
    .join("\n");

  return [
    "Masona Farms Report",
    "",
    `Revenue: ${currency.format(totals.revenue)}`,
    `Expenses: ${currency.format(totals.expenses)}`,
    `Net profit: ${currency.format(totals.profit)}`,
    `Cost per field: ${currency.format(fieldCost)}`,
    `Cost per hectare: ${currency.format(costPerHa)}`,
    `Best crop: ${bestCrop.name} (${bestCrop.detail})`,
    "",
    "Active fields:",
    fieldSummary || "- No fields recorded",
    "",
    "Recent records:",
    recentRecords || "- No records recorded",
    "",
    "Agronomist summary:",
    agronomistSummary
  ].join("\n");
}

export function buildReportHtml({
  totals,
  fields,
  records,
  bestCrop,
  fieldCost,
  costPerHa,
  agronomistSummary,
  insights
}: {
  totals: FarmTotals;
  fields: CropField[];
  records: FarmRecord[];
  bestCrop: { name: string; detail: string };
  fieldCost: number;
  costPerHa: number;
  agronomistSummary: string;
  insights: { title: string; detail: string }[];
}) {
  const recordRows = records.map((record) => `<tr><td>${escapeHtml(record.date)}</td><td>${escapeHtml(record.type)}</td><td>${escapeHtml(record.cropCycleName || record.field)}</td><td>${escapeHtml(record.detail)}</td><td>${escapeHtml(record.quantity)}</td><td>${currency.format(record.amount)}</td></tr>`).join("");
  const insightRows = insights.map((insight) => `<li><strong>${escapeHtml(insight.title)}:</strong> ${escapeHtml(insight.detail)}</li>`).join("");
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body { font-family: Arial, sans-serif; color: #121c17; padding: 28px; }
          h1 { color: #06613f; margin-bottom: 4px; }
          h2 { color: #121c17; margin-top: 26px; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .card { border: 1px solid #dde8e2; border-radius: 8px; padding: 12px; background: #f7faf8; }
          .label { color: #68766f; font-size: 12px; font-weight: 700; }
          .value { font-size: 20px; font-weight: 800; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border-bottom: 1px solid #dde8e2; text-align: left; padding: 8px; font-size: 12px; }
          th { background: #dff6e9; color: #06613f; }
        </style>
      </head>
      <body>
        <h1>Masona Farms Report</h1>
        <p>${new Date().toLocaleDateString("en-ZM")}</p>
        <div class="grid">
          <div class="card"><div class="label">Total earned</div><div class="value">${currency.format(totals.revenue)}</div></div>
          <div class="card"><div class="label">Total spent</div><div class="value">${currency.format(totals.expenses)}</div></div>
          <div class="card"><div class="label">Net profit</div><div class="value">${currency.format(totals.profit)}</div></div>
          <div class="card"><div class="label">Cost per field</div><div class="value">${currency.format(fieldCost)}</div></div>
          <div class="card"><div class="label">Cost per hectare</div><div class="value">${currency.format(costPerHa)}</div></div>
          <div class="card"><div class="label">Best crop</div><div class="value">${escapeHtml(bestCrop.name)}</div></div>
        </div>
        <h2>Farm summary</h2>
        <p>${escapeHtml(agronomistSummary)}</p>
        <h2>Benchmark checks</h2>
        <ul>${insightRows || "<li>No benchmark checks yet.</li>"}</ul>
        <h2>Records</h2>
        <table>
          <thead><tr><th>Date</th><th>Type</th><th>Crop cycle</th><th>Detail</th><th>Quantity</th><th>Amount</th></tr></thead>
          <tbody>${recordRows || "<tr><td colspan='6'>No records yet.</td></tr>"}</tbody>
        </table>
      </body>
    </html>
  `;
}

export function buildReportCsv(fields: CropField[], records: FarmRecord[]) {
  const rows = [
    ["Section", "Date", "Type", "Field", "Crop", "Crop cycle", "Detail", "Quantity", "Amount"],
    ...fields.map((field) => ["Field", field.plantingDate, "Crop cycle", field.field, field.crop, `${field.crop} - ${field.field}`, field.stage, field.variety, ""]),
    ...records.map((record) => ["Record", record.date, record.type, record.field, "", record.cropCycleName, record.detail, record.quantity, String(record.amount)])
  ];
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

export function csvCell(value: string) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export function escapeHtml(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseArea(area: string) {
  const match = area.match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}
