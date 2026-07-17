export interface IUpdate {
  bio: string;
  skills: string;
  experience: number;
  rate: number;
  location: string;
  availability: string;
  categoryId: string;
  userId?: string;
}

export interface ITechnicianQuery {
  searchTerm?: string;
  categoryId?: string;
  location?: string;
}
