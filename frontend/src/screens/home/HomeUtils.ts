
import type { CatalogService } from '../../types/catalog.type';
import type { Pet } from '../../types/pet.type';

export function formatServicePrice(price: CatalogService['price']) {
  if (typeof price === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  }

  return price;
}

export function getServiceIconName(service: CatalogService) {
  const serviceName = service.name.toLowerCase();

  if (serviceName.includes('vaccin')) return 'needle';
  if (serviceName.includes('dental')) return 'tooth';
  if (serviceName.includes('surg')) return 'scissors-cutting';
  if (serviceName.includes('groom')) return 'shower-head';
  if (serviceName.includes('check')) return 'stethoscope';
  if (serviceName.includes('x-ray') || serviceName.includes('scan')) return 'radiology-box-outline';

  return 'paw';
}

export function getServiceLabel(service: CatalogService) {
  return service.description?.trim() || 'Service information is being updated.';
}

export function getPetImageSource(pet: Pet) {
  return pet.avatar ? { uri: pet.avatar } : null;
}