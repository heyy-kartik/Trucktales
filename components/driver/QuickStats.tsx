import { Clock, CheckCircle, IndianRupee } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  color: string;
};

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

type QuickStatsProps = {
  todaysTrips: number;
  todaysEarnings: number;
  completedTrips: number;
};

export function QuickStats({
  todaysTrips = 0,
  todaysEarnings = 0,
  completedTrips = 0,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Today's Trips"
        value={todaysTrips}
        icon={<Clock className="h-6 w-6 text-blue-600" />}
        color="text-blue-600 bg-blue-100"
      />
      <StatCard
        title="Today's Earnings"
        value={
          <span className="flex items-center">
            <IndianRupee className="h-4 w-4 mr-1" />
            {todaysEarnings.toLocaleString()}
          </span>
        }
        icon={<IndianRupee className="h-6 w-6 text-green-600" />}
        color="text-green-600 bg-green-100"
      />
      <StatCard
        title="Total Trips"
        value={completedTrips}
        icon={<CheckCircle className="h-6 w-6 text-purple-600" />}
        color="text-purple-600 bg-purple-100"
      />
    </div>
  );
}
