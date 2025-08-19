// local storage

function getItem(key: string) {
  const data = localStorage.getItem(key);

  if (data) {
    return JSON.parse(data);
  }

  return null;
}

function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clearAllItem() {
  localStorage.clear();
}

export { getItem, setItem, clearAllItem };
