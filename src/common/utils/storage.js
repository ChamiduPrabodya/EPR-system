export function loadJsonState(storageKey, fallbackValue) {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return fallbackValue;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return fallbackValue;
  }
}

export function saveJsonState(storageKey, value) {
  localStorage.setItem(storageKey, JSON.stringify(value));
}
