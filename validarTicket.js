/**
 * Función equivalente a la validación en Python pero usando JavaScript/Node.js.
 * Cumple con el criterio del Caso C: parsear sin errores sintácticos y validar esquema.
 */
function validarYParsearRespuestaIA(jsonRawString) {
  try {
    // 1. Parsing estricto equivalente a json.loads()
    const data = JSON.parse(jsonRawString);

    // 2. Validación del esquema de negocio requerido
    const camposRequeridos = [
      "categoria",
      "prioridad",
      "resumen_tecnico",
      "usuario",
      "impacto_critico"
    ];

    for (const campo of camposRequeridos) {
      if (!(campo in data)) {
        throw new Error(`Campo faltante en el JSON: ${campo}`);
      }
    }

    console.log("✅ Validación exitosa: JSON 100% válido sintácticamente y en esquema.");
    return data;

  } catch (error) {
    console.error("❌ Error al parsear o validar el JSON:", error.message);
    throw error;
  }
}

// Ejemplo de prueba con la salida del Prompt Validado
const salidaEjemploIA = `{
  "categoria": "Acceso / Redes",
  "prioridad": "Alta",
  "resumen_tecnico": "Caída total del servicio de internet en el área de contabilidad impidiendo la entrega de reportes.",
  "usuario": "Carlos",
  "impacto_critico": true
}`;

// Ejecución
const ticketEstructurado = validarYParsearRespuestaIA(salidaEjemploIA);
console.log("Resultado final:", ticketEstructurado);