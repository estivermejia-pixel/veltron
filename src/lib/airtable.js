/**
 * Airtable Integration — Veltron Founding Cohort
 * 
 * Para configurar:
 * 1. Crea una base en Airtable con una tabla llamada "Founding Cohort"
 * 2. Columnas: Nombre (Single line), WhatsApp (Phone), Monto (Single select), Fecha (Date)
 * 3. Genera un Personal Access Token en https://airtable.com/create/tokens
 * 4. Reemplaza AIRTABLE_PAT y AIRTABLE_BASE_ID abajo
 */

const AIRTABLE_PAT = "YOUR_AIRTABLE_PAT_HERE";
const AIRTABLE_BASE_ID = "YOUR_BASE_ID_HERE";
const AIRTABLE_TABLE_NAME = "Founding Cohort";

/**
 * Envía una solicitud de Acceso Fundador a Airtable.
 * @param {{ nombre: string, whatsapp: string, monto: string }} data
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function submitFounderApplication(data) {
  // Si no se han configurado las credenciales, guardar localmente como fallback
  if (AIRTABLE_PAT === "YOUR_AIRTABLE_PAT_HERE" || AIRTABLE_BASE_ID === "YOUR_BASE_ID_HERE") {
    console.warn("[Veltron] Airtable no configurado. Guardando en localStorage.");
    return saveToLocalStorage(data);
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_PAT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Nombre: data.nombre,
                WhatsApp: data.whatsapp,
                Monto: data.monto,
                Fecha: new Date().toISOString().split("T")[0],
                Fuente: data.fuente || "Landing Page",
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      console.error("[Veltron] Airtable error:", errBody);
      // Fallback a localStorage
      return saveToLocalStorage(data);
    }

    const result = await response.json();
    console.log("[Veltron] Solicitud guardada en Airtable:", result.records?.[0]?.id);
    return { success: true };
  } catch (err) {
    console.error("[Veltron] Error de red:", err);
    // Fallback a localStorage
    return saveToLocalStorage(data);
  }
}

function saveToLocalStorage(data) {
  try {
    const existing = JSON.parse(localStorage.getItem("veltron_founder_apps") || "[]");
    existing.push({
      ...data,
      fecha: new Date().toISOString(),
      id: crypto.randomUUID?.() || Date.now().toString(),
    });
    localStorage.setItem("veltron_founder_apps", JSON.stringify(existing));
    return { success: true };
  } catch {
    return { success: false, error: "No se pudo guardar la solicitud." };
  }
}
