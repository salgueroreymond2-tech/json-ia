// Ejemplos predefinidos del proyecto
const EJEMPLOS = {
    1: "Hola, la impresora del piso 2 echa humo y huele a quemado.",
    2: "Buenas tardes, habla Carlos de contabilidad. Desde hace una hora internet se cayó en toda mi área y no podemos enviar los reportes a dirección.",
    3: "Hola equipo, necesito revisar por favor la factura de la suscripción de software del mes pasado para conciliar pagos."
};

function cargarEjemplo(id) {
    document.getElementById("ticketInput").value = EJEMPLOS[id];
}

/**
 * Motor de triaje simulado en cliente
 * (En producción llama al Endpoint API de OpenAI/Anthropic utilizando el Prompt del Proyecto)
 */
function procesarTicket() {
    const textoRaw = document.getElementById("ticketInput").value.trim();
    
    if (!textoRaw) {
        alert("Por favor ingrese el texto de un ticket.");
        return;
    }

    // Reglas de Negocio del Caso C
    let categoria = "Software";
    let prioridad = "Media";
    let usuario = "No especificado";
    let impactoCritico = false;
    let resumen = "";

    const txtLower = textoRaw.toLowerCase();

    // 1. Extracción de Nombre de Usuario (ej. "habla Carlos", "soy María")
    const matchUser = textoRaw.match(/(?:habla|soy|atentamente|firma|de|yo)\s+([A-ZÁÉÍÓÚ][a-záéíóú]+)/i);
    if (matchUser && matchUser[1]) {
        usuario = matchUser[1];
    }

    // 2. Determinación de Categoría
    if (txtLower.includes("impresora") || txtLower.includes("pantalla") || txtLower.includes("teclado") || txtLower.includes("hardware") || txtLower.includes("disco")) {
        categoria = "Hardware";
    } else if (txtLower.includes("internet") || txtLower.includes("red") || txtLower.includes("wifi") || txtLower.includes("vpn") || txtLower.includes("acceso") || txtLower.includes("entrar")) {
        categoria = "Acceso / Redes";
    } else if (txtLower.includes("factura") || txtLower.includes("pago") || txtLower.includes("cobro") || txtLower.includes("contabilidad") || txtLower.includes("finanzas")) {
        categoria = "Facturación / Finanzas";
    }

    // 3. Reglas de Prioridad e Impacto Crítico
    const tieneRiesgoFisico = txtLower.includes("humo") || txtLower.includes("quemado") || txtLower.includes("fuego") || txtLower.includes("chispa");
    const tieneCaidaTotal = txtLower.includes("cayó") || txtLower.includes("caida") || txtLower.includes("no podemos") || txtLower.includes("urgente") || txtLower.includes("bloqueo");

    if (tieneRiesgoFisico || tieneCaidaTotal || (categoria === "Facturación / Finanzas" && txtLower.includes("urgente"))) {
        prioridad = "Alta";
        impactoCritico = true;
    } else if (txtLower.includes("consulta") || txtLower.includes("duda") || txtLower.includes("revisar")) {
        prioridad = "Baja";
        impactoCritico = false;
    }

    // 4. Generación del Resumen Técnico
    resumen = textoRaw.length > 90 ? textoRaw.substring(0, 87) + "..." : textoRaw;

    // 5. Construcción del Objeto JSON Final
    const jsonOutputObj = {
        categoria: categoria,
        prioridad: prioridad,
        resumen_tecnico: resumen,
        usuario: usuario,
        impacto_critico: impactoCritico
    };

    // Renderizado y Validación
    const jsonString = JSON.stringify(jsonOutputObj, null, 2);
    document.getElementById("jsonOutput").textContent = jsonString;

    // Actualizar Badges y Estado
    const badge = document.getElementById("statusBadge");
    badge.className = "badge badge-success";
    badge.textContent = "Confirmado: Ticket procesado correctamente";

    // Mostrar Métricas
    document.getElementById("metricsBar").classList.remove("hidden");
    document.getElementById("catResult").textContent = categoria;
    
    const prioEl = document.getElementById("prioResult");
    prioEl.textContent = prioridad;
    prioEl.className = `prio-tag prio-${prioridad.toLowerCase()}`;
    
    document.getElementById("userResult").textContent = usuario;
}

function copiarJSON() {
    const jsonText = document.getElementById("jsonOutput").textContent;
    navigator.clipboard.writeText(jsonText).then(() => {
        alert("¡JSON copiado al portapapeles!");
    });
}