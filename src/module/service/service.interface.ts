export interface ICreateService {
  title: string;
  description: string;
  price: number;
  duration: string;
  categoryId: string;
  technicianId?: string;
}
