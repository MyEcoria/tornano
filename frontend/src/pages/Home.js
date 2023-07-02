import { Button, Text, Container, Input, Image, Card, createTheme, NextUIProvider } from "@nextui-org/react";
import { NavBarre } from "./utils/navbar";
import './css/select.css'

const theme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: '$green200',
      primaryLightHover: '$green300',
      primaryLightActive: '$green400',
      primaryLightContrast: '$green600',
      primary: '#4ADE7B',
      primaryBorder: '$green500',
      primaryBorderHover: '$green600',
      primarySolidHover: '$green700',
      primarySolidContrast: '$white',
      primaryShadow: '$green500',

      gradient: 'linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)',
      link: '#5E1DAD',

      // you can also create your own color
      myColor: '#ff4ecd'

      // ...  more colors
    },
    space: {},
    fonts: {}
  }
})

function showForm() {
  var select = document.getElementById("selectType");
  var instantForm = document.getElementById("instantForm");
  var cycleForm = document.getElementById("cycleForm");

  console.log(select);

  if (select.value === "instant") {
    instantForm.style.display = "block";
    cycleForm.style.display = "none";
  } else if (select.value === "cycle") {
    instantForm.style.display = "none";
    cycleForm.style.display = "block";
  } else if (select.value === "select") {
    instantForm.style.display = "none";
    cycleForm.style.display = "none";
  } else if (select.value === "faucet") {
    instantForm.style.display = "block";
    cycleForm.style.display = "none";
  }
}

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
    const url = `https://api.tornano.cc/faucet/${toAddress}`;

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
    fetch('https://api.tornano.cc/create', {
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
          document.getElementById('allForm').style.display = 'none';
          document.getElementById('loading').style.display = 'block';
          

          if (data.deposit) {
            // Hide loading gif and display reception address
            setTimeout(() => {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('address').value = data.deposit;
              document.getElementById('srCode').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=nano:${data.deposit}`;
              document.getElementById('receptionAddress').style.display = 'block';

              // Start checking user status every 5 seconds
              setInterval(() => checkUserStatus(data.deposit), 5000);
            }, 5000);
          }
        }
      });
  }
}

// Function to check user status
function checkUserStatus(user) {
  // Send GET request to the Tornano API endpoint
  fetch(`https://api.tornano.cc/users/${user}`)
    .then(response => response.json())
    .then(data => {
      if (data.status === "true") {
        // Display success message and hide reception address
        document.getElementById('receptionAddress').style.display = 'none';
        document.getElementById('success').style.display = 'block';
      } else {
        // Display pending message
        document.getElementById('statusMessage').textContent = 'Dépôt en attente...';
      }
    });
}

function copyAdd() {
  const addressInput = document.getElementById('address');
  addressInput.select();
  document.execCommand('copy');
}


export default function App() {
  return (
    <NextUIProvider theme={theme}>
    <div>
      <NavBarre></NavBarre>
      
      <Container style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
           
          <Card isHoverable variant="bordered" css={{ mw: "400px" }}>
            <div id="allForm">
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  <select id="selectType" onChange={showForm}>
                    <option value="select" selected>Type 👌</option>
                    <option value="instant">Instant 🚀</option>
                    <option value="cycle">By Cycle 🛒</option>
                    <option value="faucet">Faucet 🎁</option>
                  </select>
                </Card.Header>
                <Card.Divider />
          
                <div id="allForm">
                  <div id="cycleForm" style={{display: "none"}}>
                    <form id="cycleTornanoForm" class="app-form" onSubmit={handleFormSubmission}>
                      <div class="app-form-group">
                      <br></br>
                      <Input
                        rounded
                        bordered
                        label="To Adresse"
                        placeholder="nano_1..."
                        color="primary"
                        name="toAddressCycle"
                        id="toAddressCycle"
                        required
                      />
                      </div>
                      <div class="app-form-group">
                        <br></br>
                        <Input
                          rounded
                          bordered
                          label="Number of cycles"
                          placeholder="Number of cycles"
                          color="primary"
                          name="cycles"
                          id="cycles"
                          type="number"
                          required
                        />
                        
                      </div>
                      <div class="app-form-group">
                        <br></br>
                        <Input
                          rounded
                          bordered
                          label="Wait cycles"
                          placeholder="Number of wait cycles"
                          color="primary"
                          name="decalage"
                          id="decalage"
                          type="number"
                          required
                        />
                        
                      </div>
                      <div class="app-form-group buttons">
                        <br></br>
                        <Button shadow color="gradient" auto type="submit"> Send 🚀 </Button>
                      </div>
                    </form>
                  </div>
                      
                  <div id="instantForm" style={{display: "none"}}>
                    <form id="instantTornanoForm" class="app-form" onSubmit={handleFormSubmission}>
                      <div class="app-form-group">
                        <br></br>
                        <Input
                          rounded
                          bordered
                          label="To Adresse"
                          placeholder="nano_1..."
                          color="primary"
                          name="toAddressInstant"
                          id="toAddressInstant"
                          required
                        />
                        <br></br>
                      </div>
                      <div class="app-form-group buttons">
                        <br></br>
                        <Button shadow color="gradient" auto type="submit"> Send 🚀 </Button>
                      </div>
                    </form>
                  </div>
                  
                </div>
              </Card.Body>
            </div>

            <div id="loading" style={{display: "none"}}>
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  <Text>Loading...</Text>
                </Card.Header>
                <Card.Divider />
                <Image src="https://github.com/MyEcoria/tornano/blob/dev/data/img/XOsX.gif?raw=true" alt="Loading..." />
              </Card.Body>
            </div>

            <div id="error" style={{display: "none"}}>
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  <Text>Error</Text>
                </Card.Header>
                <Card.Divider />
                <Image src="https://github.com/MyEcoria/tornano/blob/dev/data/img/error.gif?raw=true" alt="Loading..." />
              </Card.Body>
            </div>

            <div id="success" style={{display: "none"}}>
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  <Text>Success</Text>
                </Card.Header>
                <Card.Divider />
                <Image src="https://github.com/MyEcoria/tornano/blob/dev/data/img/success.gif?raw=true" alt="Loading..." />
              </Card.Body>
            </div>

            <div id="receptionAddress" style={{display: "none"}}>
              <Card.Body style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Card.Header>
                  <Text>Sucess</Text>
                </Card.Header>
                <Card.Divider />
                <br/>
                <div class="app-form-group">
                  <Input
                    rounded
                    bordered
                    color="primary"
                    name="address"
                    id="address"
                    required
                    readOnly
                  />

                  <button type="button" class="app-form-button" id="copyButton" onClick={copyAdd}>Copier</button>
                </div>
                <br/>
                <Image id="srCode" src="" alt="deposit"/>
                <div id="statusMessage"></div>
              </Card.Body>
            </div>
          </Card>

      
    </Container>
    </div>
    </NextUIProvider>
  )
}