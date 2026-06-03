import api from '../config/api';
import { CatalogApiResponse, CatalogService } from '../types/catalog.type';

const getServices = async (): Promise<CatalogService[]> => {
  const response = await api.get<CatalogApiResponse<CatalogService>>('/catalog/services');
  return response.data.data;
};

const getServiceById = async (serviceId: number): Promise<CatalogService | null> => {
  const response = await api.get<CatalogApiResponse<CatalogService>>(`/catalog/services/${serviceId}`);
  return response.data.data[0] ?? null;
};

export default {
  getServices,
  getServiceById,
};

