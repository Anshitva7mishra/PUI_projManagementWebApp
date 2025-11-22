import { useEffect, useState } from "react";
import {
  GitCommit,
  MessageSquare,
  Clock,
  Bug,
  Zap,
  Square,
} from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const typeIcons = {
  BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
  FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
  TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
  IMPROVEMENT: {
    icon: MessageSquare,
    color: "text-amber-500 dark:text-amber-400",
  },
  OTHER: { icon: GitCommit, color: "text-purple-500 dark:text-purple-400" },
};

const statusColors = {
  TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
  IN_PROGRESS:
    "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
  DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
};

const RecentActivity = () => {
  const [tasks, setTasks] = useState([]);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  useEffect(() => {
    if (!currentWorkspace) return;

    const allTasks = currentWorkspace.projects.flatMap((project) =>
      project.tasks.map((task) => task)
    );

    setTasks(allTasks);
  }, [currentWorkspace]);

  return (
    <div className="w-full bg-white dark:bg-zinc-950 dark:bg-linear-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-all">
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <h2 className="text-md text-zinc-800 dark:text-zinc-200">
          Recent Activity
        </h2>
      </div>

      <div>
        {tasks.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
              <Clock className="w-7 h-7 text-zinc-600 dark:text-zinc-500" />
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              No recent activity
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {tasks.map((task) => {
              const TypeIcon = typeIcons[task.type]?.icon || Square;
              const iconColor =
                typeIcons[task.type]?.color ||
                "text-gray-500 dark:text-gray-400";

              return (
                <div
                  key={task.id}
                  className="p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors w-full"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0">
                      <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between flex-wrap gap-2 mb-2 min-w-0">
                        <h4 className="text-zinc-800 dark:text-zinc-200 font-medium truncate flex-1 min-w-0">
                          {task.title}
                        </h4>

                        <span
                          className={`px-2 py-1 rounded text-[10px] sm:text-xs whitespace-nowrap max-w-[90px] truncate text-center ${
                            statusColors[task.status]
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="capitalize">
                          {task.type.toLowerCase()}
                        </span>

                        {task.assignee && (
                          <div className="flex items-center gap-1 min-w-0">
                            <div className="w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-[10px]">
                              {task.assignee.name[0].toUpperCase()}
                            </div>
                            <span className="truncate max-w-[120px]">
                              {task.assignee.name}
                            </span>
                          </div>
                        )}

                        <span className="whitespace-nowrap">
                          {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                        </span>
                      </div>
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
};

export default RecentActivity;
