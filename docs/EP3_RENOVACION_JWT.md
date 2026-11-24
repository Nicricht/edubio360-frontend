# Renovación JWT

React consulta /api/auth/me cada minuto mientras la sesión está activa y al recargar. Si el JWT se acerca a su vencimiento (tres minutos), solicita POST /api/auth/refresh. El servidor valida el token y la cuenta; el navegador no autentica leyendo el contenido del JWT. La sesión solo se reemplaza si el token original sigue almacenado, para evitar reabrir una sesión cerrada durante una petición. El modo de demostración se conserva únicamente para pruebas EP2. Este incremento requiere el backend de la rama feature/ep3-sesion-segura y validación conjunta.
