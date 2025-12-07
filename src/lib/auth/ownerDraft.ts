// salvar e recuperar dados do owner preenchidos no register
export function saveOwnerDraft(data) {
  localStorage.setItem("barboo_owner_registration_data", JSON.stringify(data));
}

export function getOwnerDraft() {
  const raw = localStorage.getItem("barboo_owner_registration_data");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearOwnerDraft() {
  localStorage.removeItem("barboo_owner_registration_data");
}
