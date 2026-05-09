import React from 'react';
import './BatchProgress.css';

const BatchProgress = ({ files = [], results = [], processing = false }) => {
  if (files.length === 0) return null;

  const completed = results.filter((r) => r.status === 'done').length;
  const failed = results.filter((r) => r.status === 'error').length;
  const total = files.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="batch-progress">
      <div className="batch-header">
        <span className="batch-status">
          {processing ? 'Processing...' : completed === total ? 'Complete' : 'Ready'}
        </span>
        <span className="batch-count">
          {completed}/{total} files {failed > 0 && `(${failed} failed)`}
        </span>
      </div>
      <div className="batch-bar">
        <div
          className={`batch-bar-fill ${failed > 0 ? 'batch-bar-fill--warning' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="batch-files">
        {files.map((file, i) => {
          const result = results[i];
          return (
            <div key={i} className={`batch-file ${result?.status || 'pending'}`}>
              <span className="batch-file-name">{file.name}</span>
              <span className={`batch-file-status batch-file-status--${result?.status || 'pending'}`}>
                {result?.status === 'done' ? 'Done' : result?.status === 'error' ? 'Failed' : result?.status === 'processing' ? 'Processing...' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BatchProgress;
