export interface CatalogService {
  service_id: number;
  name: string;
  description?: string | null;
  price: number | string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CatalogApiResponse<T> {
  status: number;
  message: string;
  data: T[];
}

