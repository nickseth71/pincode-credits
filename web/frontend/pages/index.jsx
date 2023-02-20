import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Frame,
} from "@shopify/polaris";
import { TitleBar, useNavigate } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard, IndexForm, DashBoard } from '../components'

export default function HomePage() {

  const isMerchantLoggedIn = sessionStorage.getItem("isMerchantLoggedIn");
  const navigate = useNavigate();
  if (isMerchantLoggedIn == 'true') {
    navigate('/DashBoardPage');
    return '';
  }

  return (
    <Frame>
      <Page narrowWidth>
        <TitleBar title="Merchant Form" primaryAction={{
          content: "Support",
          onAction: () => window.open('mailto:pincode.app2022@gmail.com', '_blank'),
        }} />
        <Layout>
          <Layout.Section>
            <Card title="Authentication - Merchant Login" sectioned>
              <IndexForm />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}
