import React, { useCallback, useState, useRef } from 'react';
import { Icon } from '../../assets/icons/icons';
import './FileUploader.css';

const FileUploader = ({
  accept = '*',
  multiple = true,
  maxSizeMB = 50,
  onFilesSelected,
  label = 'Drop files here or click to browse',
  sublabel = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const inputRef = useRef(null);

  const maxBytes = maxSizeMB * 1024 * 1024;

  const validateFiles = useCallback((fileList) => {
    const valid = [];
    const errs = [];
    Array.from(fileList).forEach((file) => {
      if (file.size > maxBytes) {
        errs.push(`${file.name} exceeds ${maxSizeMB}MB limit`);
      } else {
        valid.push(file);
      }
    });
    return { valid, errs };
  }, [maxBytes, maxSizeMB]);

  const handleFiles = useCallback((fileList) => {
    const { valid, errs } = validateFiles(fileList);
    setErrors(errs);
    if (valid.length > 0) {
      const newFiles = multiple ? [...files, ...valid] : valid.slice(0, 1);
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    }
  }, [files, multiple, onFilesSelected, validateFiles]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  }, [files, onFilesSelected]);

  const clearAll = useCallback(() => {
    setFiles([]);
    setErrors([]);
    onFilesSelected?.([]);
  }, [onFilesSelected]);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="file-uploader">
      <div
        className={`file-drop-zone ${isDragging ? 'file-drop-zone--active' : ''} ${files.length > 0 ? 'file-drop-zone--has-files' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload files"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="file-input-hidden"
        />
        <div className="file-drop-content">
          <div className="file-drop-icon">
            <Icon name="Upload" size={32} />
          </div>
          <p className="file-drop-label">{label}</p>
          <p className="file-drop-sublabel">
            {sublabel || `Max ${maxSizeMB}MB per file${multiple ? ' · Multiple files supported' : ''}`}
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="file-errors">
          {errors.map((err, i) => (
            <p key={i} className="file-error">{err}</p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <span className="file-list-count">{files.length} file{files.length !== 1 ? 's' : ''} selected</span>
            <button onClick={(e) => { e.stopPropagation(); clearAll(); }} className="file-clear-btn">Clear All</button>
          </div>
          {files.map((file, i) => (
            <div key={i} className="file-item">
              <Icon name="File" size={18} className="file-item-icon" />
              <span className="file-item-name">{file.name}</span>
              <span className="file-item-size">{formatSize(file.size)}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="file-item-remove"
                aria-label={`Remove ${file.name}`}
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
