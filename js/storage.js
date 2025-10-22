// storage.js
const STORAGE_KEYS = {
  index: "pc_capsules_index",
  capsule: id => `pc_capsule_${id}`,
  progress: id => `pc_progress_${id}`,
};

function loadIndex() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.index) || "[]");
  } catch (e) {
    return [];
  }
}

function saveIndex(index) {
  localStorage.setItem(STORAGE_KEYS.index, JSON.stringify(index));
}

function loadCapsule(id) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.capsule(id)) || "null");
  } catch (e) {
    return null;
  }
}

function saveCapsule(id, capsule) {
  localStorage.setItem(STORAGE_KEYS.capsule(id), JSON.stringify(capsule));
}

function loadProgress(id) {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.progress(id)) || "{}");
  } catch (e) {
    return {};
  }
}

function saveProgress(id, progress) {
  localStorage.setItem(STORAGE_KEYS.progress(id), JSON.stringify(progress));
}
