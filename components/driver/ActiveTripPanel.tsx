import { CheckCircle, Clock, MapPin, Package } from "lucide-react";

type TripStep = {
  id: string;
  name: string;
  status: "complete" | "current" | "upcoming";
  time?: string;
};

type ActiveTripPanelProps = {
  pickupLocation: string;
  dropLocation: string;
  currentStep: number;
  onAction: (
    action: "reached_pickup" | "start_trip" | "complete_delivery"
  ) => void;
};

export function ActiveTripPanel({
  pickupLocation,
  dropLocation,
  currentStep,
  onAction,
}: ActiveTripPanelProps) {
  const steps: TripStep[] = [
    {
      id: "accepted",
      name: "Request Accepted",
      status: currentStep > 0 ? "complete" : "current",
      time: "10:30 AM",
    },
    {
      id: "reached_pickup",
      name: "Reached Pickup",
      status:
        currentStep === 1
          ? "current"
          : currentStep > 1
            ? "complete"
            : "upcoming",
      time: currentStep > 1 ? "11:15 AM" : undefined,
    },
    {
      id: "loaded",
      name: "Loaded",
      status:
        currentStep === 2
          ? "current"
          : currentStep > 2
            ? "complete"
            : "upcoming",
      time: currentStep > 2 ? "11:30 AM" : undefined,
    },
    {
      id: "in_transit",
      name: "In Transit",
      status:
        currentStep === 3
          ? "current"
          : currentStep > 3
            ? "complete"
            : "upcoming",
      time: currentStep > 3 ? "11:35 AM" : undefined,
    },
    {
      id: "delivered",
      name: "Delivered",
      status: currentStep === 4 ? "current" : "upcoming",
      time: currentStep === 4 ? "12:45 PM" : undefined,
    },
  ];

  const getActionButton = () => {
    if (currentStep === 1) {
      return (
        <button
          onClick={() => onAction("reached_pickup")}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Reached Pickup Location
        </button>
      );
    } else if (currentStep === 2) {
      return (
        <button
          onClick={() => onAction("start_trip")}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Start Trip
        </button>
      );
    } else if (currentStep === 3) {
      return (
        <button
          onClick={() => onAction("complete_delivery")}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          Complete Delivery
        </button>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Active Trip</h3>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-green-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">From</p>
              <p className="text-sm text-gray-900">{pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-red-500">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">To</p>
              <p className="text-sm text-gray-900">{dropLocation}</p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-indigo-500">
              <Package className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Load Type</p>
              <p className="text-sm text-gray-900">General Cargo</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Trip Progress
          </h4>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start">
                <div className="flex-shrink-0">
                  {step.status === "complete" ? (
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  ) : step.status === "current" ? (
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-indigo-600" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {step.name}
                  </p>
                  {step.time && (
                    <p className="text-xs text-gray-500">{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {getActionButton() && <div className="pt-4">{getActionButton()}</div>}
      </div>
    </div>
  );
}
