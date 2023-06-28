var cycleForm = document.getElementById('cycleTornanoForm');
var instantForm = document.getElementById('instantTornanoForm');

// JavaScript code for handling form submission
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent form submission

  // Hide form and display loading gif
  document.getElementById('allForm').style.display = 'none';
  document.getElementById('loading').style.display = 'block';

  // Get form values
  const type = document.getElementById("selectType").value;

  if (type === "faucet") {
    const toAddress = document.getElementById('toAddressInstant').value;
    // Create request URL
    const url = `/faucet/${toAddress}`;

    // Send GET request to the Tornano API endpoint
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.status === "ok") {
          // Display success message
          document.getElementById('loading').style.display = 'none';
          document.getElementById('success').style.display = 'block';
        } else {
          // Display error message
          document.getElementById('loading').style.display = 'none';
          document.getElementById('error').style.display = 'block';
        }
      });
  } else {
    let payload;

    if (type === "cycle") {
      const toAddress = document.getElementById('toAddressCycle').value;
      const cycles = document.getElementById('cycles').value;
      const decalage = document.getElementById('decalage').value;
      // Create request payload
      payload = {
        type: 1,
        to: toAddress,
        cycles: parseInt(cycles),
        decalage: parseInt(decalage)
      };
    } else if (type === "instant") {
      const toAddress = document.getElementById('toAddressInstant').value;
      // Create request payload
      payload = {
        type: 2,
        to: toAddress
      };
    }

    // Send POST request to the Tornano API endpoint
    fetch('/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          // Display error message
          document.getElementById('loading').style.display = 'none';
          document.getElementById('error').style.display = 'block';
        } else {
          // Hide form and display loading gif for at least 5 seconds
          setTimeout(() => {
            document.getElementById('allForm').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
          }, 5000);

          if (data.deposit) {
            // Hide loading gif and display reception address
            setTimeout(() => {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('address').value = data.deposit;
              generateQRCode(data.deposit);
              document.getElementById('receptionAddress').style.display = 'block';

              // Start checking user status every 5 seconds
              setInterval(() => checkUserStatus(data.deposit), 5000);
            }, 5000);
          }
        }
      });
  }
}

// Add event listener for form submission on both forms
cycleForm.addEventListener('submit', handleFormSubmission);
instantForm.addEventListener('submit', handleFormSubmission);

// Function to check user status
function checkUserStatus(user) {
  // Send GET request to the Tornano API endpoint
  fetch(`/users/${user}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "true") {
        // Display success message and hide reception address
        document.getElementById('receptionAddress').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        document.getElementById('status').style.display = 'none';
      } else {
        // Display pending message
        document.getElementById('statusMessage').textContent = 'Dépôt en attente...';
      }
    });
}
