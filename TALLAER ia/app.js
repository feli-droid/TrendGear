/**
 * TRENDGEAR - SISTEMA DE MONITOREO DE TRANSACCIONES EN TIEMPO REAL
 * Lógica funcional conectada a Firebase Realtime Database.
 */

// 1. Configuración de Firebase Realtime Database
const firebaseConfig = {
    databaseURL: "https://proyect-ia-64fcd-default-rtdb.firebaseio.com/" 
};

// Inicializar la App Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const dbRef = database.ref("transacciones");

// Elementos del DOM
const elements = {
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    navMenu: document.getElementById('navMenu'),
    btnResumen: document.getElementById('btnResumen'),
    btnAnalitica: document.getElementById('btnAnalitica'),
    tableSearch: document.getElementById('tableSearch'),
    transactionsBody: document.getElementById('transactionsBody'),
    kpiVentas: document.getElementById('kpiVentas'),
    kpiClientes: document.getElementById('kpiClientes'),
    kpiTicket: document.getElementById('kpiTicket'),
    countYoung: document.getElementById('countYoung'),
    percentYoung: document.getElementById('percentYoung'),
    countAdult: document.getElementById('countAdult'),
    percentAdult: document.getElementById('percentAdult'),
    countSenior: document.getElementById('countSenior'),
    percentSenior: document.getElementById('percentSenior'),
    analyticsSection: document.getElementById('analyticsSection')
};

// Inicialización de Iconos Lucide
lucide.createIcons();

// 2. Inicialización inteligente de Datos (Persistencia en la Nube)
document.addEventListener("DOMContentLoaded", () => {
    initApp();
    setupEventListeners();
});

async function initApp() {
    try {
        // PASO 1: Verificar si ya existen datos en la base de datos de Firebase
        const snapshot = await dbRef.once('value');
        const existingData = snapshot.val();

        if (existingData && Object.keys(existingData).length > 0) {
            // Si ya hay datos en Firebase, no tocamos el JSON local. Usamos los de Firebase.
            console.log("Datos cargados directamente desde Firebase (Persistencia Activa).");
            processAndRenderData(existingData);
        } else {
            // PASO 2: Si Firebase está vacío, usamos el usuarios.json local como semilla inicial
            console.log("Firebase vacío. Inicializando base de datos con usuarios.json local...");
            const response = await fetch("usuarios.json");
            if (!response.ok) throw new Error("No se pudo cargar usuarios.json");
            
            const localData = await response.json();
            
            // Subimos la semilla inicial a Firebase
            await dbRef.set(localData);
            console.log("Semilla inicial subida a Firebase exitosamente.");
        }

        // PASO 3: Activar el escuchador en tiempo real para cualquier cambio futuro en la consola o app
        dbRef.on('value', (snapshot) => {
            const remoteData = snapshot.val();
            if (remoteData) {
                processAndRenderData(remoteData);
            } else {
                elements.transactionsBody.innerHTML = `<tr><td colspan="9" class="table-loading">No hay datos en tiempo real en la base de datos.</td></tr>`;
            }
        });

    } catch (error) {
        console.error("Error durante la inicialización:", error);
        elements.transactionsBody.innerHTML = `<tr><td colspan="9" class="table-loading" style="color: #FF3B30 !important;">Error al sincronizar datos con Firebase.</td></tr>`;
    }
}

// 3. Procesamiento, Ordenamiento Estricto y Renderizado
function processAndRenderData(data) {
    // Conversión a array de objetos
    const transaccionesArray = Object.values(data);

    // ORDENAMIENTO NUMÉRICO ESTRICTO: "TG-101", "TG-102", "TG-110", etc.
    transaccionesArray.sort((a, b) => {
        const idA = parseInt(a.CustomerID.replace("TG-", ""), 10);
        const idB = parseInt(b.CustomerID.replace("TG-", ""), 10);
        return idA - idB; // Ascendente
    });

    // Cálculos Analíticos y KPIs
    calculateKPIsAndAnalytics(transaccionesArray);

    // Inyección en la tabla
    renderTable(transaccionesArray);
}

// Renderizar filas de la tabla
function renderTable(transactions) {
    elements.transactionsBody.innerHTML = "";

    transactions.forEach(tx => {
        const tr = document.createElement("tr");

        // Iniciales del avatar y color único basado en Hash
        const initials = getInitials(tx.Name);
        const avatarBgColor = getHashColor(tx.Name);

        // Formato para divisa
        const formattedAmount = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(tx.AmountSpent);

        // Clase según Membresía para las insignias
        const membershipClass = tx.MembershipStatus.toLowerCase();

        tr.innerHTML = `
            <td class="col-id">${tx.CustomerID}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar" style="background-color: ${avatarBgColor};">
                        ${initials}
                    </div>
                    <span class="user-divider"></span>
                    <span class="user-name">${tx.Name}</span>
                </div>
            </td>
            <td>${tx.Email}</td>
            <td>${tx.ProductPurchased}</td>
            <td>${tx.PurchaseDate}</td>
            <td>${formattedAmount}</td>
            <td>${tx.City}</td>
            <td>${tx.PaymentMethod}</td>
            <td>
                <div class="badge-wrapper badge-${membershipClass}">
                    <span class="badge-dot"></span>
                    <span class="badge-text">${tx.MembershipStatus}</span>
                </div>
            </td>
        `;
        elements.transactionsBody.appendChild(tr);
    });
}

// Generar iniciales (Las dos primeras letras del nombre compuesto)
function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Generación de Hash de Color único pero consistente para cada nombre
function getHashColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 45%)`;
}

// 4. Cálculos Financieros e Histograma de Edades
function calculateKPIsAndAnalytics(transactions) {
    const totalTransactions = transactions.length;
    let totalSales = 0;
    
    // Distribución por Edad
    let youngCount = 0;
    let adultCount = 0;
    let seniorCount = 0;

    transactions.forEach(tx => {
        totalSales += Number(tx.AmountSpent);

        // Clasificación por edad
        const age = Number(tx.Age);
        if (age < 30) {
            youngCount++;
        } else if (age >= 30 && age <= 50) {
            adultCount++;
        } else {
            seniorCount++;
        }
    });

    // Formatear Ventas Totales
    const formattedTotalSales = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(totalSales);

    // Calcular Ticket Promedio
    const avgTicket = totalTransactions > 0 ? (totalSales / totalTransactions) : 0;
    const formattedAvgTicket = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(avgTicket);

    // Actualizar KPIs de la Interfaz
    elements.kpiVentas.textContent = formattedTotalSales;
    elements.kpiClientes.textContent = totalTransactions;
    elements.kpiTicket.textContent = formattedAvgTicket;

    // Actualizar Bloques de Analítica de Edad
    elements.countYoung.textContent = youngCount;
    elements.countAdult.textContent = adultCount;
    elements.countSenior.textContent = seniorCount;

    // Calcular Porcentajes
    const youngPercent = totalTransactions > 0 ? Math.round((youngCount / totalTransactions) * 100) : 0;
    const adultPercent = totalTransactions > 0 ? Math.round((adultCount / totalTransactions) * 100) : 0;
    const seniorPercent = totalTransactions > 0 ? Math.round((seniorCount / totalTransactions) * 100) : 0;

    elements.percentYoung.textContent = `${youngPercent}%`;
    elements.percentAdult.textContent = `${adultPercent}%`;
    elements.percentSenior.textContent = `${seniorPercent}%`;
}

// 5. Interactividad del Dashboard y Eventos Globales
function setupEventListeners() {
    // Interactividad Menú Móvil
    elements.hamburgerBtn.addEventListener("click", () => {
        elements.hamburgerBtn.classList.toggle("open");
        elements.navMenu.classList.toggle("open");
    });

    // Cerrar menú móvil al hacer clic en un enlace
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            elements.hamburgerBtn.classList.remove("open");
            elements.navMenu.classList.remove("open");
        });
    });

    // Navegación Interactiva: Scroll Suave con control de estado activo
    elements.btnResumen.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveLink(elements.btnResumen);
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    elements.btnAnalitica.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveLink(elements.btnAnalitica);
        elements.analyticsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Barra de Búsqueda de Alto Desempeño
    elements.tableSearch.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const rows = elements.transactionsBody.querySelectorAll("tr");

        rows.forEach(row => {
            if (row.querySelector(".table-loading")) return;

            const textContent = row.textContent.toLowerCase();
            if (textContent.includes(query)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
}

function setActiveLink(activeLink) {
    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });
    activeLink.classList.add("active");
}