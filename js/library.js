// library.js
function renderLibrary() {
  const container = document.getElementById("library-content");
  container.innerHTML = "";

  const index = loadIndex();

  if (index.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted p-5">
        <p class="text-light">! هنوز هیچ کپسولی نداری</p>
        <p class="text-light">! را بزن تا اولین کپسولت را بسازی <b class="text-danger">New capsule</b> </p>
      </div>`;
    return;
  }

  index.forEach(item => {
    const progress = loadProgress(item.id) || {};
    const bestScore = progress.bestScore || 0;
    const knownCount = (progress.knownFlashcards || []).length;

    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
      <div class="card shadow-sm h-100">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <span class="badge bg-info mb-2">${item.level}</span>
          <p class="card-text text-light">${item.subject || ''}</p>
          <small class="text-light">
            Last updated: ${new Date(item.updatedAt).toLocaleString("en-US", { hour12: false })}</small>
          <hr>
          <div class="mb-2">
            <div class="small">Best Quiz Score:</div>
            <div class="progress mb-2">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${bestScore}%">
                ${bestScore}%
              </div>
            </div>
            <div class="small">Known Flashcards: ${knownCount}</div>
          </div>
          <div class="mt-auto d-flex gap-2">
            <button class="btn btn-sm btn-outline-info flex-fill" onclick="learnCapsule('${item.id}')">🧠 Learn</button>
            <button class="btn btn-sm btn-outline-warning flex-fill" onclick="editCapsule('${item.id}')">📝 Edit</button>
            <button class="btn btn-sm btn-outline-success flex-fill" onclick="exportCapsule('${item.id}')">📤 Export</button>
            <button class="btn btn-sm btn-outline-danger flex-fill" onclick="deleteCapsule('${item.id}')">🗑️ Delete</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function deleteCapsule(id) {
  if (!confirm("آیا مطمئنی می‌خواهی این کپسول حذف شود؟")) return;
  localStorage.removeItem(STORAGE_KEYS.capsule(id));
  localStorage.removeItem(STORAGE_KEYS.progress(id));

  let index = loadIndex().filter(c => c.id !== id);
  saveIndex(index);

  renderLibrary();
}

document.getElementById("newCapsuleBtn").addEventListener("click", () => {
  editingCapsuleId = null;
  document.getElementById("authorForm").reset();
  document.getElementById("flashcards").innerHTML = "";
  document.getElementById("quiz").innerHTML = "";
  document.querySelector('[data-target="author"]').click();
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

function learnCapsule(id) {
  // switch to Learn and select capsule
  document.querySelector('[data-target="learn"]').click();
  setTimeout(()=> {
    const sel = document.getElementById("learnSelector");
    if (sel) {
      sel.value = id;
      loadCapsuleForLearning(id);
    }
  }, 100);
}

// Export
function exportCapsule(id) {
  const capsule = loadCapsule(id);
  if (!capsule) return;

  capsule.schema = "pocket-classroom/v1";

  const blob = new Blob([JSON.stringify(capsule, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${capsule.title.replace(/\s+/g,"_")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import
document.getElementById("importFile").addEventListener("change", e=>{
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = ()=>{
    try {
      const capsule = JSON.parse(reader.result);

      if (capsule.schema !== "pocket-classroom/v1") throw "Invalid schema";
      if (!capsule.title) throw "Title is required";
      if (
        (!capsule.notes || capsule.notes.length===0) &&
        (!capsule.flashcards || capsule.flashcards.length===0) &&
        (!capsule.quiz || capsule.quiz.length===0)
      ) throw "Empty capsule";

      capsule.id = "c_" + Date.now();
      capsule.updatedAt = new Date().toISOString();

      saveCapsule(capsule.id, capsule);

      let index = loadIndex();
      index.push({
        id: capsule.id,
        title: capsule.title,
        subject: capsule.subject,
        level: capsule.level,
        updatedAt: capsule.updatedAt
      });
      saveIndex(index);

      alert("کپسول با موفقیت ایمپورت شد ✅");
      renderLibrary();
      if (typeof loadLearnSelector === "function") loadLearnSelector();
    } catch (err) {
      alert("خطا در ایمپورت: " + err);
    }
  };
  reader.readAsText(file);
});

document.addEventListener("DOMContentLoaded", renderLibrary);
