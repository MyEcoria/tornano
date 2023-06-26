// Copy address to clipboard
document.getElementById('receptionAddress').addEventListener('click', function(event) {
    if (event.target.id === 'copyButton') {
      const addressInput = document.getElementById('address');
      addressInput.select();
      document.execCommand('copy');
    }
});