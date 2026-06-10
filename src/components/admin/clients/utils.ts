export function formatDate(dateString: string, format: "full" | "short" = "full"): string {
  const date = new Date(dateString)

  if (format === "short") {
    // Formato corto: "Ene 2023"
    const month = date.toLocaleString("es-ES", { month: "short" })
    const year = date.getFullYear()
    return `${month} ${year}`
  }

  // Formato completo: "1 de enero de 2023, 10:30"
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  return new Intl.DateTimeFormat("es-ES", options).format(date)
}
