Actúa como un Desarrollador Frontend Senior y Diseñador UX/UI experto en dashboards oscuros. Necesito que crees un Dashboard de Monitoreo de Transacciones interactivo, responsivo y de alto impacto visual utilizando HTML5, CSS3 (con un estilo moderno de alto contraste) y JavaScript Vanilla conectado a Firebase Realtime Database.

El proyecto consta de cuatro archivos principales: index.html, styles.css, app.js y usuarios.json.

---

### 1. ESTRUCTURA Y CONTENIDO DEL ARCHIVO LOCAL (usuarios.json)
El dashboard se alimenta inicialmente de un archivo local llamado "usuarios.json". Debes generar este archivo con exactamente 20 usuarios realistas (ID desde "TG-101" hasta "TG-120") con la siguiente estructura de datos exacta (esquema del dataset de transacciones). Tu código JavaScript debe estar preparado para procesar estos campos:

{
  "cliente_1": {
    "CustomerID": "TG-101",
    "Name": "Juan Pérez",
    "Email": "juan.perez@email.com",
    "Age": 28,
    "ProductPurchased": "Laptop Gamer",
    "PurchaseDate": "2026-03-15",
    "AmountSpent": 1250.00,
    "City": "Bogotá",
    "PaymentMethod": "Tarjeta de Crédito",
    "MembershipStatus": "Gold"
  }
  // ... (Crear de manera idéntica hasta completar 20 registros secuenciales de TG-101 a TG-120 con datos variados de edad, montos, membresías y ciudades)
}

---

### 2. CONFIGURACIÓN DE FIREBASE (A integrar en app.js)
El script debe conectarse directamente a la base de datos de Firebase Realtime Database utilizando la siguiente configuración exacta:
const firebaseConfig = {
    databaseURL: "https://proyect-ia-64fcd-default-rtdb.firebaseio.com/" 
};

---

### 3. REQUISITOS DE DISEÑO (CSS - styles.css)

Queremos una interfaz con estética oscura y sofisticada ("dark premium"). Aplica las siguientes pautas:
- **Colores globales (Variables CSS):**
  - Fondo de la web: `#1E1E1E` (Gris oscuro profundo).
  - Tarjetas y paneles: `#2A2A2A` (Gris panel).
  - Bordes y líneas divisorias: `#3D3D3D`.
  - Acento principal: Azul `#007BFF`.
  - Fuentes: Usa la tipografía de Google Fonts 'Outfit' para textos generales y 'Permanent Marker' para el título de la tabla.
- **Header y Navegación:** De color `#2A2A2A`, con un logo a la izquierda, menú de navegación a la derecha (en móvil se oculta tras un botón de hamburguesa animado) y posición fija (sticky).
- **Tarjetas KPI:** 
  - Tres tarjetas superiores: "Ventas Totales", "Clientes Totales" y "Ticket Promedio".
  - La tarjeta de "Clientes Totales" debe incluir un círculo verde de "Cliente Activo" con animación de parpadeo suave (`@keyframes blink`) y sombra de luz de neón verde (`#39FF14`).
- **Título de la Tabla:** Estilo grafiti/rebelde usando la fuente 'Permanent Marker' en tamaño grande, color celeste neón (`#00D2FF`), inclinado ligeramente (`-1.5deg`) y con sombra de texto negra y celeste difuminada.
- **Tabla de Transacciones (El núcleo del diseño):**
  - **Buscador:** Barra de búsqueda redondeada. Al hacer foco, debe iluminarse con un borde rojo (`#FF3B30`) y una sombra difuminada roja.
  - **Cabeceras (th):** Fondo ligeramente translúcido, fuente en color ROJO VIBRANTE (`#FF3B30`), texto en mayúsculas y bordes finos.
  - **Celdas de Datos (td):** Todo el texto general de las filas de la tabla (como Correo, Producto, Fecha, Monto, Ciudad y Método de pago) debe ir en color BLANCO PURO (`#FFFFFF`) con un peso medio (`font-weight: 500`) para máxima legibilidad y contraste.
  - **Columna ID:** Los códigos ID de cliente (ej: TG-101) deben resaltar en un color celeste neón (`#00D2FF`).
  - **Columna de Usuario/Nombre:** Debe usar flexbox para alinear:
    1. Un avatar redondo con las iniciales del cliente. El círculo del avatar DEBE tener `flex-shrink: 0` para evitar que se aplaste o se deforme.
    2. Una línea divisoria vertical fina (`1px` de grosor).
    3. El nombre del cliente en blanco puro.
  - **Insignias de Membresía:** La última columna no debe tener texto simple. Crea un contenedor `.badge-wrapper` que alinee un círculo indicador de color (`.badge-dot`) de 10px y el texto de la membresía al lado (`.badge-text`). El color del círculo y el texto debe variar dinámicamente según la membresía:
    - Gold: Círculo y texto en Amarillo dorado (`#FFD700`) con brillo de neón.
    - Silver: Círculo en gris metálico y texto en gris claro (`#C0C0C0`).
    - Bronze: Círculo y texto en Bronce cálido (`#CD7F32`).
    - Platinum: Círculo en blanco platino y texto en blanco brillante (`#E5E4E2`).
- **Analítica de Edades (Debajo de la tabla):**
  - Esta sección debe estar contenida en un bloque identificado con un ID claro (ej: `#analyticsSection`).
  - Tres tarjetas que clasifiquen a los clientes por edad: "Jóvenes (<30 años)", "Adultos (30-50 años)", "Mayores (>50 años)".
  - Cada tarjeta debe llevar una barra de color vertical a la izquierda: Verde para Jóvenes, Naranja para Adultos y Roja para Mayores.
- **Footer:** De fondo `#1A1A1A` con borde superior sutil `#3D3D3D`. Debe mostrar centrado el copyright: "© 2026 TrendGear Enterprise. Todos los derechos reservados." con tipografía limpia, color de texto gris claro y tamaño de fuente adecuado para pie de página.

---

### 4. REQUISITOS LÓGICOS Y FUNCIONALES (JavaScript - app.js)

El script debe realizar de manera robusta las siguientes tareas:
- **Inicialización e Inyección Inteligente con Persistencia en la Nube:**
  - Al iniciar la aplicación, debe consultar primero a Firebase (mediante `dbRef.once('value')`) para verificar si existen datos almacenados en la base de datos en tiempo real.
  - **Si existen datos en Firebase:** Debe omitir la lectura del archivo local y procesar la información directamente desde Firebase. Esto garantiza que si el archivo `usuarios.json` local es borrado o alterado, la aplicación mantenga intactos los datos de forma permanente en la nube ("fuente de verdad").
  - **Si NO existen datos en Firebase (base de datos vacía en su primera carga):** Debe realizar un `fetch` del archivo local `usuarios.json` y subir/inicializar esos datos semilla en Firebase mediante `dbRef.set()`.
  - En cualquiera de los casos anteriores, debe activar inmediatamente un escuchador activo en tiempo real (`dbRef.on('value')`) para capturar cualquier modificación remota subsiguiente.
- **Ordenamiento Numérico Estricto (Evitar desorden alfabético):**
  - Al recibir los datos de Firebase, **no** recorras el objeto directamente, ya que JavaScript los ordenará alfabéticamente (mostrando por ejemplo el ID 110 antes que el 102).
  - Debes convertir el objeto recibido en un array (`Object.values(data)`) y aplicar un ordenamiento (`.sort()`) numérico ascendente basado en el `CustomerID`, extrayendo el número real (removiendo el prefijo "TG-") para compararlos correctamente como enteros.
- **Procesamiento de Datos en Tiempo Real:**
  - Tras ordenar el array, limpia la tabla e inyectar las filas dinámicamente.
  - Para cada cliente en la tabla, debe extraer las iniciales (las dos primeras letras de su nombre compuesto) y generar un color de fondo único para su avatar basado en un hash de caracteres de su nombre.
  - Debe calcular y actualizar instantáneamente los KPIs en las tarjetas (Ventas Totales con formato de moneda, número de clientes y Ticket Promedio).
  - Debe calcular la distribución de edades por grupos (Jóvenes, Adultos, Mayores), contar los clientes y actualizar las tarjetas de analítica de edades con sus respectivos porcentajes.
- **Navegación Interactiva (Scroll Suave):**
  - Al hacer clic en el botón "Resumen" del menú, la pantalla debe hacer un scroll suave hacia el tope de la página (`window.scrollTo`).
  - Al hacer clic en el botón "Analítica" del menú, la pantalla debe hacer un scroll suave automático (`scrollIntoView({ behavior: 'smooth' })`) directo hasta la sección de Analítica de Edades (`#analyticsSection`).
- **Interactividad General:**
  - **Barra de Búsqueda:** Filtra en tiempo real las filas de la tabla sin necesidad de recargar la página ni hacer peticiones adicionales, comparando el texto ingresado contra todo el contenido de cada fila.
  - **Menú Móvil:** Alterna la visibilidad del menú de navegación al presionar el botón de hamburguesa.

Por favor, provee el código limpio, comentado y listo para producción del archivo index.html, styles.css, app.js con lógica de persistencia inteligente, y usuarios.json con exactamente 20 registros estructurados de prueba.
