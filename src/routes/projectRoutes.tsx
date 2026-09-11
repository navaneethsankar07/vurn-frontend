import { Navigate, type RouteObject } from "react-router-dom";
import { ProjectsPage } from "@/modules/user/projects/pages/ProjectsPage";
import { CreateProjectPage } from "@/modules/user/projects/pages/CreateProjectPage";
import { ProjectLayout } from "@/layouts/ProjectLayout";
import { ProjectOverviewPage } from "@/modules/user/projects/pages/ProjectOverviewPage";
import { ProjectSettingsLayout } from "@/modules/user/projects/layout/ProjectSettingsLayout";
import { GeneralSettingsPage } from "@/modules/user/projects/pages/GeneralSettingsPage";
import { DangerZoneSection } from "@/modules/user/projects/pages/DangerZonePage";
import { ProjectMembersPage } from "@/modules/user/projects/pages/ProjectMembersPage";
import { ProjectWorkflowPage } from "@/modules/user/projects/pages/ProjectWorkflowPage";


export const projectRoutes: RouteObject[] = [
  {
    path: "projects",
    children: [
      {
        index: true,
        element: <ProjectsPage />,
      },
      {
        path: "create",
        element: <CreateProjectPage />,
      },
      {
        path: ":projectSlug",
        element: <ProjectLayout />,
        children: [
          {
            index: true,
            element: <ProjectOverviewPage />,
          },
          {
            path: "board",
            element: (
              <div className="p-4 text-xs text-gray-400">
                Board View (Coming Soon)
              </div>
            ),
          },
          {
            path: "sprints",
            element: (
              <div className="p-4 text-xs text-gray-400">
                Sprints View (Coming Soon)
              </div>
            ),
          },
          {
            path: "issues",
            element: (
              <div className="p-4 text-xs text-gray-400">
                Issues View (Coming Soon)
              </div>
            ),
          },
          {
            path: "workflow",
            element: <ProjectWorkflowPage/>,
          },
          {
            path: "repository",
            element: (
              <div className="p-4 text-xs text-gray-400">
                Repository View (Coming Soon)
              </div>
            ),
          },
          {
            path: "members",
            element: <ProjectMembersPage/>,
          },
          {
            path: "settings",
            element: <ProjectSettingsLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="general" replace />,
              },
              {
                path: "general",
                element: <GeneralSettingsPage/>,
              },
              {
                path: "github",
                element: (
                  <div className="p-4 text-xs text-gray-400">
                    GitHub Integration (Component)
                  </div>
                ),
              },
              {
                path: "danger-zone",
                element: <DangerZoneSection/>,
              },
            ],
          },
        ],
      },
    ],
  },
];
