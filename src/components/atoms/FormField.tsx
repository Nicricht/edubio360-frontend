import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

interface Base {
  label: string;
  name: string;
  error?: string;
  hint?: string;
}
type FieldProps = Base & InputHTMLAttributes<HTMLInputElement>;

export function FormField({ label, name, error, hint, ...rest }: FieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        {...rest}
      />
      {hint && !error && (
        <small id={`${name}-hint`} className="field-hint">
          {hint}
        </small>
      )}
      {error && (
        <small id={`${name}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

type SelectProps = Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode };
export function SelectField({ label, name, error, children, ...rest }: SelectProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <small className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}

type TextareaProps = Base & TextareaHTMLAttributes<HTMLTextAreaElement>;
export function TextareaField({ label, name, error, ...rest }: TextareaProps) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <small className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
