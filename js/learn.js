// learn.js
let currentCapsule = null;
let flashcardIndex = 0;
let knownFlashcards = [];
let quizIndex = 0;
let score = 0;

function loadLearnSelector() {
  const selector = document.getElementById("learnSelector");
  if (!selector) return;
  selector.innerHTML = "";
  const index = loadIndex();
  index.forEach(item=>{
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = `${item.title} (${item.subject || ''})`;
    selector.appendChild(opt);
  });
  if (index.length>0) {
    selector.value = index[0].id;
    loadCapsuleForLearning(index[0].id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sel = document.getElementById("learnSelector");
  if (sel) {
    sel.addEventListener("change", e=>{
      loadCapsuleForLearning(e.target.value);
    });
  }
});

function loadCapsuleForLearning(id) {
  currentCapsule = loadCapsule(id);
  if (!currentCapsule) return;

  renderNotes();

  flashcardIndex = 0;
  const prog = loadProgress(id);
  knownFlashcards = prog.knownFlashcards || [];
  renderFlashcard();

  quizIndex = 0;
  score = 0;
  renderQuizQuestion();
}

// Notes
function renderNotes() {
  if (!currentCapsule) return;
  const list = document.getElementById("notesList");
  list.innerHTML = "";
  (currentCapsule.notes || []).forEach(note=>{
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
}

document.getElementById("noteSearch") && document.getElementById("noteSearch").addEventListener("input", e=>{
  const term = e.target.value.toLowerCase();
  const list = document.getElementById("notesList");
  list.innerHTML = "";
  (currentCapsule.notes || []).filter(n=>n.toLowerCase().includes(term))
    .forEach(note=>{
      const li = document.createElement("li");
      li.textContent = note;
      list.appendChild(li);
    });
});

// FlashCards
function renderFlashcard() {
  if (!currentCapsule) return;
  if (!currentCapsule.flashcards || !currentCapsule.flashcards.length) {
    document.getElementById("flashcardFront").textContent = "هیچ فلش کارتی وجود ندارد";
    document.getElementById("flashcardBack").textContent = "";
    document.getElementById("cardCounter").textContent = "";
    return;
  }
  const card = currentCapsule.flashcards[flashcardIndex];
  document.getElementById("flashcardFront").textContent = card.front;
  document.getElementById("flashcardBack").textContent = card.back;
  document.getElementById("flashcardFront").classList.remove("d-none");
  document.getElementById("flashcardBack").classList.add("d-none");

  document.getElementById("cardCounter").textContent =
    `${flashcardIndex+1}/${currentCapsule.flashcards.length} (Known: ${knownFlashcards.length})`;
}

document.getElementById("flashcard") && document.getElementById("flashcard").addEventListener("click", ()=>{
  document.getElementById("flashcardFront").classList.toggle("d-none");
  document.getElementById("flashcardBack").classList.toggle("d-none");
});

document.getElementById("prevCard") && document.getElementById("prevCard").addEventListener("click", ()=>{
  if (!currentCapsule || !currentCapsule.flashcards) return;
  flashcardIndex = (flashcardIndex-1+currentCapsule.flashcards.length)%currentCapsule.flashcards.length;
  renderFlashcard();
});

document.getElementById("nextCard") && document.getElementById("nextCard").addEventListener("click", ()=>{
  if (!currentCapsule || !currentCapsule.flashcards) return;
  flashcardIndex = (flashcardIndex+1)%currentCapsule.flashcards.length;
  renderFlashcard();
});

document.getElementById("markKnown") && document.getElementById("markKnown").addEventListener("click", ()=>{
  if (!currentCapsule) return;
  if (!knownFlashcards.includes(flashcardIndex)) knownFlashcards.push(flashcardIndex);
  saveProgress(currentCapsule.id, { bestScore: loadProgress(currentCapsule.id).bestScore || 0, knownFlashcards });
  renderFlashcard();
});

document.getElementById("markUnknown") && document.getElementById("markUnknown").addEventListener("click", ()=>{
  if (!currentCapsule) return;
  knownFlashcards = knownFlashcards.filter(i=>i!==flashcardIndex);
  saveProgress(currentCapsule.id, { bestScore: loadProgress(currentCapsule.id).bestScore || 0, knownFlashcards });
  renderFlashcard();
});

// Quiz
function renderQuizQuestion() {
  const quizDiv = document.getElementById("quizContent");
  const resultP = document.getElementById("quizResult");
  quizDiv.innerHTML = "";
  resultP.textContent = "";

  if (!currentCapsule || !currentCapsule.quiz || !currentCapsule.quiz.length) {
    quizDiv.textContent = "هیچ سوالی وجود ندارد";
    return;
  }

  if (quizIndex >= currentCapsule.quiz.length) {
    const percent = Math.round((score/currentCapsule.quiz.length)*100);
    resultP.textContent = `نتیجه شما: ${percent}%`;

    const prog = loadProgress(currentCapsule.id);
    const best = prog.bestScore || 0;
    if (percent > best) {
      saveProgress(currentCapsule.id, { bestScore: percent, knownFlashcards });
    }
    renderLibrary();
    return;
  }

  const q = currentCapsule.quiz[quizIndex];
  const h5 = document.createElement("h5");
  h5.textContent = q.q;
  quizDiv.appendChild(h5);

  q.choices.forEach((choice,i)=>{
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary text-light d-block w-100 text-start mb-2";
    btn.textContent = choice;
    btn.onclick = ()=>{
      if (i===q.correct) {
        btn.classList.replace("btn-outline-primary","btn-success");
        score++;
      } else {
        btn.classList.replace("btn-outline-primary","btn-danger");
      }
      setTimeout(()=>{
        quizIndex++;
        renderQuizQuestion();
      },1000);
    };
    quizDiv.appendChild(btn);
  });
}
