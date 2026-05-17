export type ExportType = "tickets" | "revenue" | "trips" | "anomalies";
export type ExportFormat = "csv" | "pdf";

export interface ExportParams {
  type: ExportType;
  format: ExportFormat;
  fromDate?: string;
  toDate?: string;
  routeId?: string;
  driverId?: string;
}
