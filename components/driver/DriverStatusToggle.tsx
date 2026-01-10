import { useState } from 'react';

type Status = 'available' | 'on_trip' | 'offline';

export function DriverStatusToggle() {
  const [status, setStatus] = useState<Status>('offline');

  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'available':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          indicator: 'bg-green-500',
          label: 'Available',
        };
      case 'on_trip':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-300',
          indicator: 'bg-yellow-500',
          label: 'On Trip',
        };
      case 'offline':
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          indicator: 'bg-gray-500',
          label: 'Offline',
        };
    }
  };

  const config = getStatusConfig(status);

  const toggleStatus = () => {
    if (status === 'offline') {
      setStatus('available');
    } else if (status === 'available') {
      setStatus('on_trip');
    } else {
      setStatus('offline');
    }
  };

  return (
    <button
      type="button"
      onClick={toggleStatus}
      className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${config.bg} ${config.text} ${config.border} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${config.indicator} mr-2`}></span>
      {config.label}
    </button>
  );
}
