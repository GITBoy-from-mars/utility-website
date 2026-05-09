import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/common/SEOHead';
import './NotFound.css';

const NotFound = () => (
  <>
    <SEOHead title="Page Not Found" description="The page you are looking for does not exist." />
    <main className="notfound-page">
      <div className="container notfound-content">
        <span className="notfound-code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
      </div>
    </main>
  </>
);

export default NotFound;
