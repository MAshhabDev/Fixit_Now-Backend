export interface ICreateService {
  title: string;
  description: string;
  price: number;
  duration: string;
  categoryId: string;
  technicianId?: string;
}

export interface IUpdateService {
  title?: string;
  description?: string;
  price?: number;
  duration?: string;
  categoryId?: string;
}

export interface IServiceQuery {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
}
