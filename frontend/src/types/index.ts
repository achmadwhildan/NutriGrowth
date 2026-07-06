export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role: 'ADMIN' | 'PARENT' | 'DOCTOR' | 'SELLER';
  createdAt: string;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  gender: 'L' | 'P';
  birthDate: string;
  imageUrl?: string;
  birthWeight: number;
  birthHeight: number;
  createdAt: string;
}

export interface GrowthLog {
  id: string;
  childId: string;
  weight: number;
  height: number;
  headCircumference?: number;
  status: 'NORMAL' | 'WASTING' | 'OVERWEIGHT' | 'STUNTING';
  note?: string;
  createdAt: string;
}