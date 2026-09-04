import { supabase, isSupabaseConfigured } from '../config/supabase';
import {
  getMockRequests,
  saveMockRequest,
  voteMockRequest,
  updateMockRequestStatus
} from './mockData';

export async function getRequests() {
  if (!isSupabaseConfigured) {
    return getMockRequests();
  }

  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('votos', { ascending: false });

  if (error) {
    console.error('Error obteniendo solicitudes:', error);
    return getMockRequests();
  }

  return data;
}

export async function createRequest({ texto, tipo }) {
  if (!isSupabaseConfigured) {
    const newReq = {
      id: `req-${Date.now()}`,
      texto,
      tipo,
      votos: 1,
      estado: 'abierta',
      created_at: new Date().toISOString().split('T')[0]
    };
    return saveMockRequest(newReq);
  }

  const { data, error } = await supabase
    .from('requests')
    .insert([{ texto, tipo, votos: 1, estado: 'abierta' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function voteRequest(requestId, identificador = 'sesion-anonima') {
  if (!isSupabaseConfigured) {
    return voteMockRequest(requestId);
  }

  const { error: voteErr } = await supabase
    .from('request_votes')
    .insert([{ request_id: requestId, identificador }]);

  if (voteErr && voteErr.code === '23505') {
    console.warn('Ya has votado por esta solicitud.');
  }

  const { data: currentReq } = await supabase
    .from('requests')
    .select('votos')
    .eq('id', requestId)
    .single();

  const currentVotes = currentReq ? (currentReq.votos || 0) : 0;

  const { data, error } = await supabase
    .from('requests')
    .update({ votos: currentVotes + 1 })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    return voteMockRequest(requestId);
  }

  return data;
}

export async function updateRequestStatus(requestId, nuevoEstado) {
  if (!isSupabaseConfigured) {
    return updateMockRequestStatus(requestId, nuevoEstado);
  }

  const { data, error } = await supabase
    .from('requests')
    .update({ estado: nuevoEstado })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
