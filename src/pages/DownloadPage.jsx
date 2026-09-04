import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { validateAndGetDownload, markTokenAsUsed } from '../services/api';
import { Download, CheckCircle2, Lock, Clock, FileCheck, Loader2 } from 'lucide-react';

export default function DownloadPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const info = await validateAndGetDownload(token);
        setDownloadInfo(info);
      } catch (err) {
        console.error(err);
        setDownloadInfo({ valido: false, mensaje: 'Ocurrió un error al validar el token de descarga.' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const handleDownloadClick = async () => {
    setDownloaded(true);
    await markTokenAsUsed(token);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 text-[#1E3A8A] animate-spin mx-auto mb-3" />
        <p className="text-slate-600 font-medium text-sm">Validando tu token de descarga seguro...</p>
      </div>
    );
  }

  if (!downloadInfo || !downloadInfo.valido) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-3xl p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-[#2C2C2C]">Enlace no disponible</h1>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {downloadInfo?.mensaje || 'El enlace es inválido, ya fue utilizado o ha expirado después de 48 horas.'}
          </p>

          <div className="pt-4 border-t border-slate-200/60 space-y-2">
            <Link
              to="/estado"
              className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#2C2C2C] rounded-2xl text-xs font-bold transition-colors"
            >
              Consultar estado de mi orden
            </Link>
            <Link
              to="/"
              className="block w-full py-3 btn-primary text-[#2C2C2C] rounded-2xl text-xs font-black"
            >
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { downloadUrl, filename, order } = downloadInfo;

  return (
    <div className="max-w-xl mx-auto px-4 py-14">
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center space-y-6 border border-white">
        
        <div className="w-16 h-16 rounded-3xl bg-[#FFD53D] text-[#2C2C2C] flex items-center justify-center mx-auto shadow-md">
          <FileCheck className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wider font-black text-[#1E3A8A] bg-[#1E3A8A]/10 px-3 py-1 rounded-full border border-[#1E3A8A]/20">
            Descarga Verificada
          </span>
          <h1 className="text-2xl font-black text-[#2C2C2C] mt-3 leading-tight">
            {filename}
          </h1>
          <p className="text-xs text-slate-600 mt-2 font-medium">
            Tu pago ha sido verificado con éxito por Llave Bancolombia. Haz clic para descargar tu archivo digital.
          </p>
        </div>

        {/* Botón de descarga */}
        <div className="pt-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className="inline-flex items-center justify-center gap-3 w-full py-4 px-6 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-black text-base rounded-2xl shadow-md active:scale-95 transition-all"
          >
            <Download className="w-5 h-5" />
            Descargar Archivo Ahora
          </a>
        </div>

        {downloaded && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3 rounded-2xl flex items-center justify-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Descarga iniciada. El token ha quedado registrado como utilizado.
          </div>
        )}

        {/* Metadata */}
        <div className="border-t border-slate-200/60 pt-6 grid grid-cols-2 gap-4 text-left text-xs text-slate-600 font-medium">
          <div>
            <span className="block text-slate-400 font-bold text-[10px] uppercase">Email comprador:</span>
            <span className="text-[#2C2C2C] truncate block font-semibold">{order?.email_comprador || 'Comprador'}</span>
          </div>
          <div>
            <span className="block text-slate-400 font-bold text-[10px] uppercase">Vencimiento del Link:</span>
            <span className="text-[#2C2C2C] flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#FF7A45]" /> 48 horas
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
