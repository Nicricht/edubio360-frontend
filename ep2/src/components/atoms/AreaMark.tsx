import {
  HeartPulse,
  MonitorCog,
  Scale,
  Building2,
  FlaskConical,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
const marks = [
  { terms: ['Salud'], icon: HeartPulse, className: 'mark-salud' },
  { terms: ['Tecnología'], icon: MonitorCog, className: 'mark-tecnologia' },
  { terms: ['Derecho'], icon: Scale, className: 'mark-derecho' },
  { terms: ['Administración y Comercio'], icon: Building2, className: 'mark-administracion' },
  { terms: ['Ciencias Básicas'], icon: FlaskConical, className: 'mark-ciencias' },
  { terms: ['Educación'], icon: BookOpen, className: 'mark-educacion' },
];

export function AreaMark({ area, large = false }: { area: string; large?: boolean }) {
  const choice = marks.find((mark) => mark.terms.includes(area));
  const Icon = choice?.icon ?? GraduationCap;
  return (
    <div
      className={`area-visual ${choice?.className ?? 'mark-otro'} ${large ? 'area-visual-large' : ''}`}
      aria-hidden="true"
    >
      <div className="area-orbit area-orbit-one" />
      <div className="area-orbit area-orbit-two" />
      <div className="area-icon">
        <Icon size={large ? 68 : 54} strokeWidth={1.5} />
      </div>
      <span className="area-visual-label">EDUBÍO 360</span>
    </div>
  );
}
