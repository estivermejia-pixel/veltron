import React, { createContext, useContext, useState, useCallback } from 'react';
import FileLoadingOverlay from '../components/effects/FileLoadingOverlay';

const FileLoadingContext = createContext(null);

export function FileLoadingProvider({ children }) {
  const [loadingState, setLoadingState] = useState({
    visible: false,
    progress: 0,
    operation: 'upload', // 'upload' | 'download' | 'processing'
    status: 'idle',      // 'idle' | 'uploading' | 'downloading' | 'processing' | 'success' | 'error'
    fileName: '',
    errorMessage: '',
  });

  const startLoading = useCallback(({ operation = 'upload', fileName = '', initialProgress = 10 }) => {
    setLoadingState({
      visible: true,
      progress: initialProgress,
      operation,
      status: operation === 'download' ? 'downloading' : operation === 'processing' ? 'processing' : 'uploading',
      fileName,
      errorMessage: '',
    });
  }, []);

  const updateProgress = useCallback((percent) => {
    setLoadingState((prev) => ({
      ...prev,
      progress: percent,
    }));
  }, []);

  const setSuccess = useCallback((message = '', autoCloseMs = 1800) => {
    setLoadingState((prev) => ({
      ...prev,
      status: 'success',
      progress: 100,
    }));

    if (autoCloseMs > 0) {
      setTimeout(() => {
        setLoadingState((prev) => ({
          ...prev,
          visible: false,
          status: 'idle',
        }));
      }, autoCloseMs);
    }
  }, []);

  const setError = useCallback((message = 'Ocurrió un error en la transferencia.') => {
    setLoadingState((prev) => ({
      ...prev,
      status: 'error',
      errorMessage: message,
    }));
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState((prev) => ({
      ...prev,
      visible: false,
      status: 'idle',
    }));
  }, []);

  return (
    <FileLoadingContext.Provider
      value={{
        loadingState,
        startLoading,
        updateProgress,
        setSuccess,
        setError,
        hideLoading,
      }}
    >
      {children}
      <FileLoadingOverlay
        visible={loadingState.visible}
        progress={loadingState.progress}
        operation={loadingState.operation}
        status={loadingState.status}
        fileName={loadingState.fileName}
        errorMessage={loadingState.errorMessage}
        onClose={hideLoading}
      />
    </FileLoadingContext.Provider>
  );
}

export function useFileLoading() {
  const context = useContext(FileLoadingContext);
  if (!context) {
    throw new Error('useFileLoading debe usarse dentro de un FileLoadingProvider');
  }
  return context;
}
