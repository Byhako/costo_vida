import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-preact';

export function ToastContainer() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = Info;
        let colorClass = 'badge-info';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClass = 'badge-success';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          colorClass = 'badge-warning';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          colorClass = 'badge-danger';
        }

        return (
          <div key={toast.id} className="toast" role="alert">
            <span className={`badge ${colorClass} btn-icon`}>
              <Icon size={16} />
            </span>
            <span>{toast.text}</span>
          </div>
        );
      })}
    </div>
  );
}
