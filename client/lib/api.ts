export interface User {
  id: number;
  name: string;
  email: string;
  sendNotification: boolean;
}

export interface PlacementDrive {
  id: number;
  externalId: string;
  companyName: string;
  jobLocation: string | null;
  jobDescriptionUrl: string | null;
  companyApplyUrl: string | null;
  minCgpa: number | null;
  maxBacklog: number | null;
  startDate: string | null;
  registrationDeadline: string | null;
  isOpenForApply: boolean;
  sourceCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function fetchPlacementDrives(): Promise<PlacementDrive[]> {
  const res = await fetch(`${API_BASE_URL}/placement-drives`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load placement drives: ${res.statusText}`);
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ message: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ message: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function fetchUserProfile(userId: number): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }
  return data;
}

export async function updateUserNotification(userId: number, sendNotification: boolean): Promise<{ message: string; user: User }> {
  const res = await fetch(`${API_BASE_URL}/auth/user/${userId}/notification`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sendNotification }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update notification setting');
  }
  return data;
}
