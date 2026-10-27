import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Brand({ admin = false }: { admin?: boolean }) {
  return (
    <Link className="brand text-decoration-none" to="/" aria-label="EduBío 360, ir al inicio">
      <span className="brand-icon">
        <GraduationCap size={25} strokeWidth={2.2} />
      </span>
      <span className="brand-text">
        EduBío<span className="brand-number">360</span>
        {admin && <small>ADMIN</small>}
      </span>
    </Link>
  );
}
