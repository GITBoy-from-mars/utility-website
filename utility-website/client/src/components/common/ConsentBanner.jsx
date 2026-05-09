import React, { useState, useEffect } from 'react';
import { Icon } from '../../assets/icons/icons';
import './ConsentBanner.css';

const CONSENT_KEY = 'utilitools_consent';

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="consent-banner" role="alert">
      <div className="consent-content container">
        <div className="consent-info">
          <Icon name="Shield" size={20} className="consent-icon" />
          <div>
            <p className="consent-title">Your Privacy Matters</p>
            <p className="consent-text">
              Files you upload are processed securely and automatically deleted within 10 minutes. 
              We do not store, share, or access your files. No account or login required.
            </p>
          </div>
        </div>
        <button onClick={accept} className="btn btn-primary btn-sm consent-btn">
          I Understand
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
