import { Collapse, Text, Grid, Table, createTheme, NextUIProvider } from "@nextui-org/react";
import { NavBarre } from "./utils/navbar";

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

export default function App() {
  return (
    <NextUIProvider theme={theme}>
    <div>
      <NavBarre></NavBarre>
        <Grid.Container gap={2}>
        <Collapse.Group splitted style={{width: "100%"}}>
            <Grid>
                <Collapse
                  shadow
                  title="General explanations"
                  subtitle="More general explanations"
                >
                </Collapse>
              </Grid>
              <Collapse title="What is Tornano's goal?">
                <Text>
                The main goal of this program is to protect users' privacy by masking the links between the sending and receiving addresses of Nano transactions. It implements various anonymization techniques to make transactions harder to trace and associate with specific identities.
                </Text>
              </Collapse>
              <Collapse title="Are there any fees ?">
                <Text>
                <Table
                  aria-label="Table fee"
                  css={{
                    height: "auto",
                    minWidth: "100%",
                  }}
                >
                  <Table.Header>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>Fees</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row key="1">
                      <Table.Cell>By Cycle</Table.Cell>
                      <Table.Cell>0.1 - 5 %</Table.Cell>
                    </Table.Row>
                    <Table.Row key="2">
                      <Table.Cell>Instant</Table.Cell>
                      <Table.Cell>0%</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                </Text>
              </Collapse>
              <Collapse title="Who developed the app?">
                <Text>
                I am the developer of this app, MyEcoria and you can donate to me at this address:
                <a href="https://www.nanolooker.com/account/nano_3ktmq6dpwcc694hrnjzfdykbqeuj4w5w8nut3uqm5pgwa4m9jmstoc4ntu6p">nano_3ktmq6dpwcc694hrnjzfdykbqeuj4w5w8nut3uqm5pgwa4m9jmstoc4ntu6p</a>
                </Text>
              </Collapse>
            </Collapse.Group>
          <Grid>
            
          </Grid>
        </Grid.Container>

        <Grid.Container gap={2}>
        <Collapse.Group splitted style={{width: "100%"}}>
            <Grid>
                <Collapse
                  shadow
                  title="Services"
                  subtitle="More information about services"
                >
                  <Text>
                    Explanations and examples of each type of tornano transaction 😉
                  </Text>
                </Collapse>
              </Grid>
              <Collapse title="By Cycle">
                <Text>
                The "By cycle" service makes it possible to truly anonymize transactions over time. To use this service, you have a form, "to", "Number of cycles", "wait cycles".
                <br/>"To" means the transaction receiving address
                <br/>"Number of cycles" means the number of cycles, one cycle = one day, for example if you choose 3 your deposit will be divided by 3 minus a random percentage then every day, a part will be sent with all the other transactions
                <br/>"wait cycles" means, the number of wait cycles before starting to send transactions, for example if you choose 3 wait cycles, you will start receiving nano after 3 days.
                </Text>
              </Collapse>
              <Collapse title="Instant">
                <Text>
                The "instant" service does not make transactions anonymous, just cut the direct link between your wallet and the reception address, for example by sending 1 nano, 1 nano will be sent directly to you with one of our wallets to the chosen reception address, there is no charge for this service and it is instantaneous.
                </Text>
              </Collapse>
              <Collapse title="Who developed the app?">
                <Text>
                The faucet just allows you to test the crypto nano, there is a rate limit and even if you spam it, you won't get rich 😂
                </Text>
              </Collapse>
            </Collapse.Group>
          <Grid>
            
          </Grid>
        </Grid.Container>
      </div>
      </NextUIProvider>
  );
}