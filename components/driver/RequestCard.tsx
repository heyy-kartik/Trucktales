import { Truck, MapPin, Clock, Package, ArrowRight, IndianRupee } from 'lucide-react';

type RequestCardProps = {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  distance: number;
  estimatedTime: string;
  loadType: string;
  weight: number;
  fare: number;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
};

export function RequestCard({
  id,
  pickupLocation,
  dropLocation,
  distance,
  estimatedTime,
  loadType,
  weight,
  fare,
  onAccept,
  onReject,
}: RequestCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Truck className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {loadType} Load
            </span>
          </div>
          <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {weight} kg
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-green-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900">Pickup</p>
              <p className="text-sm text-gray-500">{pickupLocation}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-red-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900">Drop</p>
              <p className="text-sm text-gray-500">{dropLocation}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{estimatedTime}</span>
          </div>
          <div className="text-sm text-gray-500">
            {distance} km
          </div>
          <div className="flex items-center font-medium text-gray-900">
            <IndianRupee className="h-4 w-4 mr-1" />
            {fare.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <button
          onClick={() => onReject(id)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reject
        </button>
        <button
          onClick={() => onAccept(id)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Accept Request
        </button>
      </div>
    </div>
  );
}
