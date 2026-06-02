import api from '../config/api';
import { CatalogApiResponse, CatalogService } from '../types/catalog.type';

const getServices = async (): Promise<CatalogService[]> => {
  const response = await api.get<CatalogApiResponse<CatalogService>>('/catalog/services');
  return response.data.data;
};

export default {
  getServices,
};

