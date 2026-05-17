export interface AuditActor {
  id: string;
  fullName: string;
  role: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeState: any | null;
  afterState: any | null;
  ipAddress: string;
  createdAt: string;
  actor: AuditActor;
}

export interface AuditLogsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  actorId?: string;
  targetType?: string;
  action?: string;
}

export interface AuditLogsResponse {
  success: boolean;
  data: {
    items: AuditLog[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
