import type { Destination } from '@/lib/mockData';

export type { Destination };

export type SearchResult = { results: Destination[] };

export type EmergencyResult = {
  status: string;
  ticketId: string;
  type: string;
  message: string;
  contact?: {
    name: string;
    location?: string;
    contact_number?: string;
  };
};

export type ReservationResult = {
  status: 'confirmed' | 'waitlist';
  bookingCode: string;
  restaurant: {
    id: string;
    name: string;
    location?: string;
    contact_number?: string;
  };
  guestName: string;
  partySize: number;
  dateTime: string;
  message: string;
  qrHint: string;
};
