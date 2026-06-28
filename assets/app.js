const themeButton = document.querySelector('[data-theme]');
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') document.body.classList.add('dark');
if (themeButton) {
  themeButton.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    themeButton.textContent = dark ? '☀️' : '🌙';
  });
}

document.querySelectorAll('[data-speak]').forEach(button => {
  button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return alert('Speech is not supported in this browser.');
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  });
});

const searchInput = document.querySelector('[data-search]');
const filters = [...document.querySelectorAll('[data-filter]')];
const rows = [...document.querySelectorAll('[data-word-row]')];
const sections = [...document.querySelectorAll('[data-word-section]')];
let activeTopic = 'all';

function filterWords() {
  if (!searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  let visibleTotal = 0;
  rows.forEach(row => {
    const matchesText = row.textContent.toLowerCase().includes(query);
    const matchesTopic = activeTopic === 'all' || row.dataset.topic === activeTopic;
    const visible = matchesText && matchesTopic;
    row.hidden = !visible;
    if (visible) visibleTotal++;
  });
  sections.forEach(section => {
    section.hidden = !section.querySelector('[data-word-row]:not([hidden])');
  });
  const empty = document.querySelector('[data-empty]');
  if (empty) empty.style.display = visibleTotal ? 'none' : 'block';
}
if (searchInput) searchInput.addEventListener('input', filterWords);
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  activeTopic = button.dataset.filter;
  filterWords();
}));
