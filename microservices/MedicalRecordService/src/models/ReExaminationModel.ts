export interface ReExamination {
    re_exam_id: number;
    record_id: number;
    suggested_date: Date;
    reason: string;
    is_booked: boolean;
    created_at: Date;
}

export interface CreateReExaminationRequest {
    record_id: number;
    suggested_date: Date;
    reason: string;
    is_booked: boolean;
}

export interface UpdateReExaminationRequest {
    suggested_date?: Date;
    reason?: string;
    is_booked?: boolean;
}
