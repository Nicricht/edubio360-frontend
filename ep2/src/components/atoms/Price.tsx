export const pesoCL = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

export function Price({ value, label = 'Arancel anual' }: { value: number; label?: string }) {
  return (
    <div className="price-block">
      <span>{label}</span>
      <strong>{pesoCL(value)}</strong>
    </div>
  );
}
