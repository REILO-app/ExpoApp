import { auth } from '../config/firebase';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Returns auth headers with a fresh Firebase ID token.
 * Firebase tokens expire after 1 hour; getIdToken() auto-refreshes them.
 */
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const fetchReferrals = async () => {
  const headers = await getAuthHeaders();
  if (!headers['Authorization']) return [];
  const res = await fetch(`${API_URL}/api/referrals`, { headers });
  if (!res.ok) throw new Error('Failed to fetch referrals');
  return res.json();
};

export const fetchJobs = async () => {
  const headers = await getAuthHeaders();
  if (!headers['Authorization']) return [];
  const res = await fetch(`${API_URL}/api/jobs`, { headers });
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
};

export const fetchNotifications = async () => {
  const headers = await getAuthHeaders();
  if (!headers['Authorization']) return [];
  const res = await fetch(`${API_URL}/api/notifications`, { headers });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

export const fetchUserProfile = async () => {
  const headers = await getAuthHeaders();
  if (!headers['Authorization']) return null;
  const res = await fetch(`${API_URL}/api/auth/me`, { headers });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
};

export const updateUserProfile = async (profileData: Record<string, string>) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
};

export const fetchReferralById = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch referral');
  return res.json();
};

export const fetchJobById = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/jobs/${id}`, { headers });
  if (!res.ok) throw new Error('Failed to fetch job');
  return res.json();
};

export const fetchJobsByReferralId = async (referralId: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals/${referralId}/jobs`, { headers });
  if (!res.ok) throw new Error('Failed to fetch jobs for referral');
  return res.json();
};

export const addReferral = async (referralData: any) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(referralData),
  });
  if (!res.ok) throw new Error('Failed to add referral');
  return res.json();
};

export const deleteReferral = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete referral');
  return res.json();
};

export const addJob = async (jobData: any) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/jobs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(jobData),
  });
  if (!res.ok) throw new Error('Failed to add job');
  return res.json();
};

export const deleteJob = async (id: string) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/jobs/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete job');
  return res.json();
};

export const addReferralHistoryEvent = async (referralId: string, eventData: any) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals/${referralId}/history`, {
    method: 'POST',
    headers,
    body: JSON.stringify(eventData),
  });
  if (!res.ok) throw new Error('Failed to add referral history event');
  return res.json();
};

export const updateReferralStatus = async (referralId: string, statusData: any) => {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/referrals/${referralId}/status`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(statusData),
  });
  if (!res.ok) throw new Error('Failed to update referral status');
  return res.json();
};
