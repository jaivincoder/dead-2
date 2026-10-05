export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiPage<T> {
  records: T[];
  page: number;
  total: number;
  totalPages: number;
}
