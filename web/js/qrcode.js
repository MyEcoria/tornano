// Function to generate QR code
function generateQRCode(data) {
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    qrCodeContainer.innerHTML = ''; // Clear previous QR code (if any)

    const qrCode = new QRCode(qrCodeContainer, {
      text: `nano:` + data,
      width: 200,
      height: 200,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
}