import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { MembersListPage } from '../features/members/MembersListPage';
import { AddMemberPage } from '../features/members/AddMemberPage';
import { MemberDetailPage } from '../features/members/MemberDetailPage';
import { PlansPage } from '../features/plans/PlansPage';
import { PaymentsPage } from '../features/payments/PaymentsPage';
import { WebsiteEditorPage } from '../features/website/WebsiteEditorPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { GymPublicPage } from '../features/public-website/GymPublicPage';

export const router = createBrowserRouter([
  // Standalone Public Gym Website (Clean visitor view without dashboard sidebar)
  {
    path: '/gym-preview',
    element: <GymPublicPage />,
  },

  // Main Authenticated / Demo SaaS Dashboard Layout
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'members',
        element: <MembersListPage />,
      },
      {
        path: 'members/new',
        element: <AddMemberPage />,
      },
      {
        path: 'members/:id',
        element: <MemberDetailPage />,
      },
      {
        path: 'plans',
        element: <PlansPage />,
      },
      {
        path: 'payments',
        element: <PaymentsPage />,
      },
      {
        path: 'website',
        element: <WebsiteEditorPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
