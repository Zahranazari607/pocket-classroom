# Pocket Classroom – Offline Learning Capsules
A single-page web app for creating, studying, and sharing small learning capsules (notes, flashcards, quiz). Fully works offline using LocalStorage.
---
## Tech Stack
- HTML / CSS / Bootstrap (CDN)
- Vanilla JavaScript (modules)
- LocalStorage (no backend)
---
## Features
- **Library:** List capsules, Edit, Delete, Learn, Export/Import (JSON)
- **Author Mode:** Create/edit capsule with notes, flashcards, and quiz
- **Learn Mode:** Study notes, flip flashcards, take quizzes with progress saved
---
## How to Run
1. Download or clone the project  
2. Open `index.html` in your browser  
3. Create a new capsule or import JSON  
4. Start learning (your progress is saved automatically)  
---
## Sample Capsule JSON (Included)
```json
{
  "id": "c_1761039312545",
  "title": "Neurotransmitters Basics",
  "subject": "Neurochemistry",
  "level": "Beginner",
  "description": "The role of neurotransmitters in brain function and behavior",
  "updatedAt": "2025-10-21T10:05:12.543Z",
  "notes": [
    "1. Dopamine is responsible for pleasure and reward",
    "2. Serotonin affects mood and sleep",
    "3. Glutamate is the main excitatory neurotransmitter",
    "4. GABA is the main inhibitory neurotransmitter",
    "5. Acetylcholine is involved in learning and memory"
  ],
  "flashcards": [
    { "front": "Dopamine", "back": "Responsible for pleasure, reward, and motivation" },
    { "front": "Serotonin", "back": "Regulates mood, sleep, and appetite" },
    { "front": "Glutamate", "back": "Main excitatory neurotransmitter in the brain" },
    { "front": "GABA", "back": "Main inhibitory neurotransmitter, reduces neural activity" },
    { "front": "Acetylcholine", "back": "Important for learning, memory, and muscle activation" },
    { "front": "Norepinephrine", "back": "Involved in alertness, attention, and stress response" },
    { "front": "Endorphins", "back": "Natural painkillers, released during exercise and pleasure" },
    { "front": "Oxytocin", "back": "Involved in social bonding and trust" },
    { "front": "Histamine", "back": "Regulates wakefulness and attention" },
    { "front": "Substance P", "back": "Transmits pain signals to the brain" }
  ],
  "quiz": [
    {
      "q": "1. Which neurotransmitter is responsible for pleasure and reward?",
      "choices": ["Serotonin", "Dopamine", "GABA", "Acetylcholine"],
      "correct": 1
    },
    {
      "q": "2. Which neurotransmitter is the main inhibitory one in the brain?",
      "choices": ["Glutamate", "Dopamine", "GABA", "Norepinephrine"],
      "correct": 2
    },
    {
      "q": "3. Which neurotransmitter regulates mood and sleep?",
      "choices": ["Serotonin", "Endorphins", "Acetylcholine", "Glutamate"],
      "correct": 0
    },
    {
      "q": "4. Which neurotransmitter is important for learning and memory?",
      "choices": ["Acetylcholine", "Dopamine", "Oxytocin", "GABA"],
      "correct": 0
    },
    {
      "q": "5. Glutamate is:",
      "choices": ["Inhibitory neurotransmitter", "Excitatory neurotransmitter", "Pain regulator", "Hormone for bonding"],
      "correct": 1
    }
  ],
  "schema": "pocket-classroom/v1"
}
