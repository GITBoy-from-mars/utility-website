import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import SkeletonLoader from './components/common/SkeletonLoader';
import { getAllTools } from './tools/_registry';

/* Pages */
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import DataStorage from './pages/DataStorage/DataStorage';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  const tools = getAllTools();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-storage" element={<DataStorage />} />

        {/* Auto-registered tool routes */}
        {tools.map((tool) => {
          const ToolComponent = tool.component;
          return (
            <Route
              key={tool.slug}
              path={`/tools/${tool.slug}`}
              element={
                <Suspense fallback={<SkeletonLoader type="tool" />}>
                  <ToolComponent />
                </Suspense>
              }
            />
          );
        })}

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
