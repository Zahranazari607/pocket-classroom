// author.js
let editingCapsuleId = null;

function addFlashcardRow(front = "", back = "") {
  const div = document.createElement("div");
  div.className = "input-group mb-2";
  div.innerHTML = `
    <input type="text" class="form-control front" placeholder="Front" value="${front}">
    <input type="text" class="form-control back" placeholder="Back" value="${back}">
    <button type="button" class="btn btn-outline-danger remove">&times;</button>
  `;
  div.querySelector(".remove").onclick = () => div.remove();
  document.getElementById("flashcards").appendChild(div);
}

function addQuestionBlock(q = "", choices = ["","","",""], correct = 0) {
  const name = "correct_" + Date.now() + Math.random().toString(36).slice(2,8);
  const div = document.createElement("div");
  div.className = "border rounded p-2 mb-2";
  div.innerHTML = `
    <input type="text" class="form-control mb-2 question" placeholder="سوال" value="${q}">
    ${choices.map((c,i)=>`
      <div class="input-group mb-1">
        <span class="input-group-text">${String.fromCharCode(65+i)}</span>
        <input type="text" class="form-control choice" value="${c}">
        <div class="input-group-text">
          <input type="radio" name="${name}" ${i===correct?"checked":""}>
        </div>
      </div>
    `).join("")}
    <button type="button" class="btn btn-sm btn-outline-danger remove">🗑 Remove</button>
  `;
  div.querySelector(".remove").onclick = () => div.remove();
  document.getElementById("quiz").appendChild(div);
}

document.getElementById("authorForm").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  if (!title) {
    alert("عنوان الزامی است!");
    return;
  }

  const capsule = {
    id: editingCapsuleId || "c_" + Date.now(),
    title,
    subject: document.getElementById("subject").value,
    level: document.getElementById("level").value,
    description: document.getElementById("description").value,
    updatedAt: new Date().toISOString(),
    notes: document.getElementById("notes").value
      .split("\n").filter(x=>x.trim()!==""),
    flashcards: [...document.querySelectorAll("#flashcards .input-group")].map(div=>({
      front: div.querySelector(".front").value,
      back: div.querySelector(".back").value
    })).filter(fc => fc.front || fc.back),
    quiz: [...document.querySelectorAll("#quiz .border")].map(block=>{
      const q = block.querySelector(".question").value;
      const choices = [...block.querySelectorAll(".choice")].map(c=>c.value);
      const radios = [...block.querySelectorAll("input[type=radio]")];
      const correct = radios.findIndex(r=>r.checked);
      return { q, choices, correct };
    }).filter(q=>q.q && q.choices.some(c=>c))
  };

  if (capsule.notes.length===0 && capsule.flashcards.length===0 && capsule.quiz.length===0) {
    alert("باید حداقل یکی از Notes/Flashcards/Quiz وجود داشته باشد!");
    return;
  }

  saveCapsule(capsule.id, capsule);

  let index = loadIndex();
  const existing = index.find(c=>c.id===capsule.id);
  if (existing) {
    Object.assign(existing, {
      title: capsule.title,
      subject: capsule.subject,
      level: capsule.level,
      updatedAt: capsule.updatedAt
    });
  } else {
    index.push({
      id: capsule.id,
      title: capsule.title,
      subject: capsule.subject,
      level: capsule.level,
      updatedAt: capsule.updatedAt
    });
  }
  saveIndex(index);

  alert("کپسول ذخیره شد ✅");
  editingCapsuleId = null;
  renderLibrary();
  if (typeof loadLearnSelector === "function") loadLearnSelector();
});

document.getElementById("addFlashcard").addEventListener("click", ()=> addFlashcardRow());
document.getElementById("addQuestion").addEventListener("click", ()=> addQuestionBlock());

function editCapsule(id) {
  const capsule = loadCapsule(id);
  if (!capsule) return;

  editingCapsuleId = id;
  document.querySelector('[data-target="author"]').click();

  document.getElementById("title").value = capsule.title;
  document.getElementById("subject").value = capsule.subject || "";
  document.getElementById("level").value = capsule.level || "Beginner";
  document.getElementById("description").value = capsule.description || "";
  document.getElementById("notes").value = (capsule.notes || []).join("\n");

  document.getElementById("flashcards").innerHTML = "";
  document.getElementById("quiz").innerHTML = "";

  (capsule.flashcards || []).forEach(fc=> addFlashcardRow(fc.front, fc.back));
  (capsule.quiz || []).forEach(q=> addQuestionBlock(q.q, q.choices, q.correct));
}
