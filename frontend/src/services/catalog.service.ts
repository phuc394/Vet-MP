import api from '../config/api';
import { CatalogApiResponse, CatalogService } from '../types/catalog.type';

type RawCatalogService = Omit<CatalogService, 'is_active'> & {
  is_active?: boolean | number | string | { data?: number[] };
};

export const isCatalogServiceActive = (service: Pick<CatalogService, 'is_active'>) => {
  return service.is_active;
};

const normalizeIsActive = (value: RawCatalogService['is_active']) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'object') {
    return value.data?.[0] !== 0;
  }

  return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
};

const normalizeService = (service: RawCatalogService): CatalogService => ({
  ...service,
  is_active: normalizeIsActive(service.is_active),
});

const getServices = async (): Promise<CatalogService[]> => {
  const response = await api.get<CatalogApiResponse<RawCatalogService>>('/catalog/services');
  return (response.data.data ?? []).map(normalizeService);
};

const getServiceById = async (serviceId: number): Promise<CatalogService | null> => {
  const response = await api.get<CatalogApiResponse<RawCatalogService>>(`/catalog/services/${serviceId}`);
  const service = response.data.data[0];
  return service ? normalizeService(service) : null;
};

export default {
  getServices,
  getServiceById,
};

