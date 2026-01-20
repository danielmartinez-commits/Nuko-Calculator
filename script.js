// ===== CONFIGURACIÓN DE PORCENTAJES =====
// Porcentaje de factoring que se descuenta del valor de la carga
const FACTORING_RATE = 4.0; // 4.0% - Modificar este valor para cambiar el porcentaje
// ========================================

let selectedTransferMethod = 'none';

// Transfer method selection
document.querySelectorAll('.transfer-card').forEach(card => {
  card.addEventListener('click', function() {
    document.querySelectorAll('.transfer-card').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
    selectedTransferMethod = this.getAttribute('data-method');
  });
});

// Select default option (none)
const defaultCard = document.querySelector('.transfer-card[data-method="none"]');
if (defaultCard) defaultCard.classList.add('selected');

function calculateFactoring() {
  const raw = (document.getElementById('loadValue') || {}).value || '';
  const loadValue = parseFloat(raw.replace(',', '.'));

  if (isNaN(loadValue) || loadValue <= 0) {
    alert('⚠️ Por favor, ingresa un valor válido para la carga.');
    return;
  }

  // Calculate factoring fee
  const factoringFee = (loadValue * FACTORING_RATE) / 100;
  const subtotalAfterFactoring = loadValue - factoringFee;

  // Calculate transfer fee
  let transferFee = 0;
  switch(selectedTransferMethod) {
    case 'ach':
      transferFee = 1.00;
      break;
    case 'wire':
      transferFee = 30.00;
      break;
    case 'none':
    default:
      transferFee = 0;
      break;
  }

  const finalAmount = subtotalAfterFactoring - transferFee;

  // Update display (corrigiendo concatenación)
  const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const el = id => document.getElementById(id);

  if (el('originalValue')) el('originalValue').textContent = '+ ' + fmt(loadValue);
  if (el('factoringFee')) el('factoringFee').textContent = '- ' + fmt(factoringFee);
  if (el('subtotalAfterFactoring')) el('subtotalAfterFactoring').textContent = '+ ' + fmt(subtotalAfterFactoring);
  if (el('transferFee')) el('transferFee').textContent = transferFee > 0 ? '- ' + fmt(transferFee) : '- $0.00';
  if (el('finalAmount')) el('finalAmount').textContent = '+ ' + fmt(finalAmount);
  if (el('finalTotal')) el('finalTotal').textContent = '+ ' + fmt(finalAmount);

  // Show results with animation
  const resultsDiv = el('results');
  if (resultsDiv) {
    resultsDiv.classList.add('show');
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Allow Enter key to calculate
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    calculateFactoring();
  }
});

