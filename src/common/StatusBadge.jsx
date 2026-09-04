import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function StatusBadge({ estado }) {
  const configs = {
    pendiente: {
      bg: 'bg-amber-100/80',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Pendiente Verificación',
      icon: Clock,
    },
    aprobado: {
      bg: 'bg-emerald-100/80',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      label: 'Pago Aprobado',
      icon: CheckCircle2,
    },
    rechazado: {
      bg: 'bg-rose-100/80',
      text: 'text-rose-800',
      border: 'border-rose-200',
      label: 'Rechazado',
      icon: XCircle,
    },
  };

  const config = configs[estado] || configs.pendiente;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-2xs ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}
