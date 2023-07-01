import { Navbar, Button, Link, Text, User } from "@nextui-org/react";


export const NavBarre = () => (
    <Navbar isBordered variant="floating" NormalWeights="white" >
          <Navbar.Brand>
            <User
              src="https://github.com/MyEcoria/tornano/blob/dev/data/img/logo2.png?raw=true"
            />
            <Text b color="inherit" hideIn="xs">
              Tornano App
            </Text>
          </Navbar.Brand>
          <Navbar.Content>
            <Navbar.Link color="inherit" href="/">
              Home
            </Navbar.Link>
            <Navbar.Item>
              <Button auto flat as={Link} href="/faq">
                FAQ
              </Button>
            </Navbar.Item>
          </Navbar.Content>
        </Navbar>
);
  