import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NoEncontrada() {
  return (
    <main className="container page-container not-found-page">
      <span>404</span>
      <h1>Página no encontrada</h1>
      <p>Quizás este camino no era el indicado. Volvamos a empezar.</p>
      <Link to="/" className="btn btn-dark rounded-pill px-4 py-3">
        Ir al inicio <ArrowUpRight size={18} />
      </Link>
    </main>
  );
}
