import React, { useState } from 'react';
import './ToolFAQ.css';

const ToolFAQ = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="tool-faq" id="tool-faq">
      <h2 className="tool-faq-title">❓ Frequently Asked Questions</h2>
      <div className="tool-faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className={`tool-faq-item ${openIndex === i ? 'open' : ''}`}>
            <button className="tool-faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)} aria-expanded={openIndex === i}>
              <span>{faq.q}</span>
              <span className="tool-faq-chevron">{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && (
              <div className="tool-faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ToolFAQ;
