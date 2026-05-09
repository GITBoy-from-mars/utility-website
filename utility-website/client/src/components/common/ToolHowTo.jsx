import React from 'react';
import './ToolHowTo.css';

const ToolHowTo = ({ steps = [] }) => {
  if (!steps || steps.length === 0) return null;

  return (
    <section className="tool-howto" id="tool-howto">
      <h2 className="tool-howto-title">📖 How to Use</h2>
      <div className="tool-howto-steps">
        {steps.map((step, i) => (
          <div key={i} className="tool-howto-step">
            <div className="tool-howto-num">{i + 1}</div>
            <div className="tool-howto-content">
              <h3 className="tool-howto-step-title">{step.title}</h3>
              <p className="tool-howto-step-desc">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolHowTo;
