import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));
const LandingPage = lazy(() => import('../pages/Home/LandingPage'));
const QuestionPage = lazy(() => import('../pages/Question/QuestionPage'));

const routes = [
  { path: '/', element: <LandingPage /> },
  { path: '/questionnaire/access/:userId/:token', element: <QuestionPage /> },
];

export default function AppRoutes() {
  return (
    <div>
      <Router>
        <Suspense
          fallback={
            <div
              style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
              }}
            >
              Loading...
            </div>
          }
        >
          <Routes>
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}