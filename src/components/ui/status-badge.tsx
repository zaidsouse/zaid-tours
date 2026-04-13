'use client';

import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'completed' | 'processing' | 'pending' | 'rejected' | 'paid' | 'failed';
  label?: string;
}

const statusConfig = {
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: CheckCircle,
    label: 'Completed',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: Clock,
    label: 'Processing',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: AlertCircle,
    label: 'Pending',
  },
  rejected: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: XCircle,
    label: 'Rejected',
  },
  paid: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: CheckCircle,
    label: 'Paid',
  },
  failed: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: XCircle,
    label: 'Failed',
  },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      <Icon size={16} />
      {displayLabel}
    </span>
  );
}
