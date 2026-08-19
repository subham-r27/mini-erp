import {
    CheckCircle2,
    CircleUserRound,
    PackageCheck,
    ClipboardList,
    AlertTriangle,
  } from "lucide-react";
  
  import { recentActivities } from "../../data/mockData";
  
  const activityIcons = {
    success: CheckCircle2,
    customer: CircleUserRound,
    inventory: PackageCheck,
    challan: ClipboardList,
    warning: AlertTriangle,
  };
  
  export default function RecentActivity() {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">
            Recent Activity
          </h2>
  
          <p className="mt-1 text-sm text-slate-500">
            Latest actions across the system
          </p>
        </div>
  
        <div className="divide-y divide-slate-100">
          {recentActivities.map((activity) => {
            const Icon =
              activityIcons[
                activity.type as keyof typeof activityIcons
              ];
  
            return (
              <div
                key={activity.id}
                className="flex gap-3 p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon className="h-4 w-4" />
                </div>
  
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.title}
                  </p>
  
                  <p className="mt-1 text-xs text-slate-400">
                    {activity.description}
                  </p>
  
                  <p className="mt-2 text-[11px] text-slate-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }