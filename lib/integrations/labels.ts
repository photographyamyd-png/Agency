export function integrationPropertyLabel(
  prop: { id?: string; siteUrl?: string; name?: string; address?: string }
): { id: string; label: string } {
  if ("siteUrl" in prop && prop.siteUrl) {
    return { id: prop.siteUrl, label: prop.siteUrl };
  }
  if ("name" in prop && prop.name && "address" in prop) {
    const id = prop.id ?? prop.name;
    const addr = prop.address ? ` — ${prop.address}` : "";
    return { id, label: `${prop.name}${addr}` };
  }
  if ("name" in prop && prop.name && prop.id) {
    return { id: prop.id, label: `${prop.name} (${prop.id})` };
  }
  const id = prop.id ?? "unknown";
  return { id, label: id };
}

export function integrationSelectTitle(service: string): string {
  if (service === "GA4") return "GA4 property";
  if (service === "GOOGLE_SEARCH_CONSOLE") return "Search Console site";
  if (service === "GBP") return "Business Profile location";
  return "property";
}
