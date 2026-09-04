import React, { useEffect, useState } from 'react';
import { getRequests, createRequest, voteRequest } from '../services/api';
import SEOHead from '../components/SEOHead';
import { PlusCircle, BookOpen, FileSpreadsheet, CheckCircle2, MessageSquarePlus, ThumbsUp } from 'lucide-react';


export default function RequestPage() {
  const [requests, setRequests] = useState([]);
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState('libro');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exito, setExito] = useState(false);
  const [votedIds, setVotedIds] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setSubmitting(true);
    try {
      const newReq = await createRequest({ texto, tipo });
      setRequests([newReq, ...requests]);
      setTexto('');
      setExito(true);
      setTimeout(() => setExito(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id) => {
    if (votedIds[id]) return;

    try {
      const updatedReq = await voteRequest(id);
      setRequests(prev => prev.map(r => r.id === id ? updatedReq : r).sort((a, b) => b.votos - a.votos));
      setVotedIds(prev => ({ ...prev, [id]: true }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-10">
      <SEOHead
        title="Solicitar Producto Digital | Votación Comunidad | Veltron Capital"
        description="Solicita el libro en PDF o plantilla en Excel que necesitas. La comunidad vota las mejores solicitudes para su publicación en Veltron Capital."
        path="/solicitar"
      />

      {/* Title */}

      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 text-[#1E3A8A] text-xs font-extrabold uppercase tracking-wider mb-2">
          <MessageSquarePlus className="w-3.5 h-3.5" /> Solicitudes & Votación Pública
        </div>
        <h1 className="text-3xl font-black text-[#2C2C2C]">¿No está lo que buscas? Pide lo tuyo</h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Pide un libro digital o plantilla de Excel específica. La comunidad vota y elegimos las más solicitadas para publicarlas con opción de pago o aporte libre.
        </p>
      </div>

      {/* Formulario */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs">
        {exito && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-2xl mb-6 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ¡Solicitud enviada con éxito! La comunidad ahora puede votar por ella.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-[#2C2C2C] mb-2 uppercase">
              Tipo de Producto *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipo('libro')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  tipo === 'libro'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Libro PDF
              </button>
              <button
                type="button"
                onClick={() => setTipo('excel')}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  tipo === 'excel'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" /> Plantilla Excel
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#2C2C2C] mb-1.5 uppercase">
              Descripción de lo que necesitas *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ej. Una plantilla en Excel para control de inventario de pequeños negocios con alertas de stock..."
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E3A8A] rounded-2xl p-4 text-sm text-[#2C2C2C] placeholder-slate-400 focus:outline-none transition-colors shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 btn-cta rounded-2xl text-[#2C2C2C] font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            Enviar Solicitud
          </button>
        </form>
      </div>

      {/* Lista de Votación de Solicitudes */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Solicitudes Recientes & Ranking de Votos
        </h2>

        {loading ? (
          <div className="h-20 glass-card rounded-2xl animate-pulse"></div>
        ) : requests.length === 0 ? (
          <p className="text-xs text-slate-500 italic px-1 font-medium">Aún no hay solicitudes registradas.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const yaVoto = votedIds[req.id];

              return (
                <div key={req.id} className="glass-card rounded-3xl p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2.5 rounded-2xl bg-[#1E3A8A]/10 text-[#1E3A8A] shrink-0 border border-[#1E3A8A]/20 mt-0.5">
                        {req.tipo === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {req.tipo === 'excel' ? 'Plantilla Excel' : 'Libro PDF'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#2C2C2C] mt-1.5">{req.texto}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-black text-[#1E3A8A]">{req.votos || 0} <span className="text-[10px] font-normal text-slate-400">votos</span></span>
                      <button
                        onClick={() => handleVote(req.id)}
                        disabled={yaVoto}
                        className={`btn-vote px-4 py-2 rounded-2xl text-xs flex items-center gap-1.5 ${
                          yaVoto ? 'opacity-60 cursor-not-allowed bg-[#1E3A8A]/20' : ''
                        }`}
                      >
                        {yaVoto ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Votado
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-3.5 h-3.5" /> Votar
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
