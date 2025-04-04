import { lazy } from "react";
import { Refine } from "@refinedev/core";
import { ErrorComponent } from "@/components/ErrorComponent";
import { useNotificationProvider } from "@/providers/notificationProvider";
import routerBindings, { DocumentTitleHandler } from "@refinedev/react-router";
import { dataProvider } from "@/providers/dataProvider";
import { App as AntdApp } from "antd";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Layout } from '@/components/layout/main';
import { ColorModeContextProvider } from "@/contexts/color-mode";
import { lazyComponent } from '@/utils/components';

// Pages:
const Home = lazy(() => import('@/pages/home/Page'));
const RepoDetail = lazy(() => import('@/pages/repo/Page'));

const customTitleHandler = () => document.title || import.meta.env.VITE_APP_NAME;

const RefineProvider = () => (
  <ColorModeContextProvider>
    <AntdApp notification={{ bottom: 0 }}>
      <Refine
        dataProvider={dataProvider()}
        notificationProvider={useNotificationProvider}
        routerProvider={routerBindings}
        options={{
          disableTelemetry: true,
          syncWithLocation: false,
          useNewQueryKeys: true,
          /** @DOCS : https://refine.dev/docs/core/refine-component/#reactquery */
          reactQuery: {
            clientConfig: {
              defaultOptions: {
                queries: {
                  retry: false,
                },
              },
            },
          },
        }}
      >
        <Layout>
          <Outlet />
        </Layout>
        <DocumentTitleHandler handler={customTitleHandler} />
      </Refine>
    </AntdApp>
  </ColorModeContextProvider>
);

const router = createBrowserRouter([
  {
    Component: RefineProvider,
    children: [
      {
        path: "/",
        children: [
          { index: true, element: lazyComponent(Home) },
          { path: "/repo/:repo/:owner", element: lazyComponent(RepoDetail) },
        ],
      },
      { path: "*", Component: ErrorComponent },
    ]
  }
]);

export const App = () => <RouterProvider router={router} />;
