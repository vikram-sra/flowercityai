const page = document.body.dataset.page;
const checks = [...document.querySelectorAll('[data-check]')];
const key = `flower-city-launch-v2-${page}`;
const status = document.getElementById('workspace-status');
function announce(message) { if (status) status.textContent = message; }
function update() {
  const completed = checks.filter(input => input.checked).length;
  const meter = document.querySelector('progress');
  const label = document.querySelector('[data-progress]');
  if (meter) { meter.max = checks.length; meter.value = completed; }
  if (label) label.textContent = `${completed} of ${checks.length} complete`;
}
try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); checks.forEach(input => { if (typeof saved[input.dataset.check] === 'boolean') input.checked = saved[input.dataset.check]; }); }
catch { announce('Progress could not be restored. You can still use and print this checklist.'); }
checks.forEach(input => input.addEventListener('change', () => {
  update();
  try { localStorage.setItem(key, JSON.stringify(Object.fromEntries(checks.map(c => [c.dataset.check, c.checked])))); }
  catch { announce('Progress is not being saved in this browser. Print a copy to keep it.'); }
}));
update();
document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const content = document.getElementById(button.dataset.copy);
  try { await navigator.clipboard.writeText(content.textContent); announce('Copied. Replace bracketed details before sending.'); }
  catch { const range = document.createRange(); range.selectNodeContents(content); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); announce('Text selected. Use your browser’s Copy command.'); }
}));
