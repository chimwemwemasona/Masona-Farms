import type { ReportModel } from "../reports/currentReportRules";
import { buildReportCsv, buildReportHtml, buildShareReport } from "../reports/currentReportRules";

type ShareTextPayload = {
  title: string;
  message: string;
};

type ShareFileOptions = {
  mimeType: string;
  dialogTitle: string;
};

type ReportExportDependencies = {
  cacheDirectory: string | null | undefined;
  shareText: (payload: ShareTextPayload) => Promise<unknown>;
  printToFile: (payload: { html: string }) => Promise<{ uri: string }>;
  isFileSharingAvailable: () => Promise<boolean>;
  shareFile: (uri: string, options: ShareFileOptions) => Promise<unknown>;
  writeTextFile: (uri: string, contents: string) => Promise<unknown>;
  alert: (title: string, message: string) => void;
};

export function createReportExportActions(report: ReportModel, dependencies: ReportExportDependencies) {
  async function shareReport() {
    try {
      await dependencies.shareText({
        title: "Masona Farms report",
        message: buildShareReport(report)
      });
    } catch {
      dependencies.alert("Share failed", "The report could not be shared right now.");
    }
  }

  async function exportPdf() {
    try {
      const html = buildReportHtml(report);
      const file = await dependencies.printToFile({ html });
      if (await dependencies.isFileSharingAvailable()) {
        await dependencies.shareFile(file.uri, { mimeType: "application/pdf", dialogTitle: "Share Masona Farms PDF report" });
      } else {
        dependencies.alert("PDF created", file.uri);
      }
    } catch {
      dependencies.alert("PDF export failed", "The report could not be exported right now.");
    }
  }

  async function exportCsv() {
    try {
      const csv = buildReportCsv(report.fields, report.records);
      const fileUri = `${dependencies.cacheDirectory ?? ""}masona-farms-report.csv`;
      await dependencies.writeTextFile(fileUri, csv);
      if (await dependencies.isFileSharingAvailable()) {
        await dependencies.shareFile(fileUri, { mimeType: "text/csv", dialogTitle: "Share Masona Farms CSV report" });
      } else {
        await dependencies.shareText({ title: "Masona Farms CSV report", message: csv });
      }
    } catch {
      dependencies.alert("CSV export failed", "The report could not be exported right now.");
    }
  }

  return { shareReport, exportPdf, exportCsv };
}
