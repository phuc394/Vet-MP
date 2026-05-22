export interface Service {
    service_id?: number;
    name: string;
    description?: string;
    price: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateServiceRequest {
    name: string;
    description?: string;
    price: number;
    is_active: boolean;
}

export interface UpdateServiceRequest {
    name?: string;
    description?: string;
    price?: number;
    is_active?: boolean;
}

export type SortOrder = 'asc' | 'desc';

export interface ServiceSortQuery {
    sortBy?: string;
    order?: SortOrder;
}

export interface ServiceSearchQuery {
    name?: string;
    description?: string;
    isActive?: string;
}

export interface ServiceSearchFilters {
    name?: string;
    description?: string;
    isActive?: boolean;
}
