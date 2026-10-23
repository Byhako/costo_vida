import { useEffect, useRef } from 'preact/hooks';
import { AlertTriangle } from 'lucide-preact';
import { useApp } from '../context/AppContext';
import { useModalExit } from '../hooks/useModalExit';

export function ConfirmModal() {
  const { confirmRequest, resolveConfirm } = useApp();
  const { closing, runExit } = useModalExit();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (confirmRequest) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      confirmRef.current?.focus();
    }
  }, [confirmRequest]);

  const close = (result: boolean) =>
    runExit(() => {
      resolveConfirm(result);
      const el = previousFocusRef.current;
      if (el && el.isConnected) el.focus();
    });

  useEffect(() => {
    if (!(confirmRequest && !closing)) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close(false);
      } else if (e.key === 'Tab') {
        const active = document.activeElement;
        if (active !== cancelRef.current && active !== confirmRef.current) {
          e.preventDefault();
          confirmRef.current?.focus();
        } else if (e.shiftKey && active === cancelRef.current) {
          e.preventDefault();
          confirmRef.current?.focus();
        } else if (!e.shiftKey && active === confirmRef.current) {
          e.preventDefault();
          cancelRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [confirmRequest, closing]);

  if (!confirmRequest) return null;

  return (
    <div className={`modal-overlay${closing ? ' is-closing' : ''}`} onClick={() => close(false)}>
      <div
        className="modal-content confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-body confirm-modal-body">
          <div className="confirm-modal-icon"><AlertTriangle size={22} /></div>
          <div>
            <h3 id="confirm-modal-title" className="confirm-modal-title">{confirmRequest.title}</h3>
            <p id="confirm-modal-message" className="confirm-modal-message">{confirmRequest.message}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={() => close(false)}>
            {confirmRequest.cancelLabel ?? 'Cancelar'}
          </button>
          <button ref={confirmRef} type="button" className="btn btn-danger" onClick={() => close(true)}>
            {confirmRequest.confirmLabel ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
