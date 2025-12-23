import React from 'react';
import { Clock } from 'lucide-react';

interface AssignmentCardProps {
  title: string;
  courseCode: string;
  deadline: string;
  status?: 'pending' | 'in-progress' | 'completed';
  deadlineLabel: string;
  statusLabelMap: Record<'pending' | 'in-progress' | 'completed', string>;
}

export default function AssignmentCard({
  title,
  courseCode,
  deadline,
  status = 'in-progress',
  deadlineLabel,
  statusLabelMap,
}: AssignmentCardProps) {
  const statusConfig = {
    pending: { text: statusLabelMap.pending, bg: 'bg-gray-100', color: 'text-gray-700' },
    'in-progress': { text: statusLabelMap['in-progress'], bg: 'bg-yellow-100', color: 'text-yellow-700' },
    completed: { text: statusLabelMap.completed, bg: 'bg-green-100', color: 'text-green-700' },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="border-l-4 border-blue-500 bg-white rounded-r-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <h4 className="text-gray-900 font-semibold text-sm mb-2">{title}</h4>
      <p className="text-gray-600 text-xs mb-2">{courseCode}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-gray-500 text-xs">
          <Clock size={14} />
          <span>
            {deadlineLabel}: {deadline}
          </span>
        </div>
        <span className={`${currentStatus.bg} ${currentStatus.color} text-xs font-medium px-2.5 py-1 rounded`}>
          {currentStatus.text}
        </span>
      </div>
    </div>
  );
}
