import { Card, Page, Layout, TextContainer, Image, Stack, Link, Heading, Frame } from "@shopify/polaris";

import { TitleBar, useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";

import { ProductsCard, IndexForm, DashBoard } from '../components';

import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';
import { useState } from "react";

const config = {
  apiKey: process.env.SHOPIFY_API_KEY,
  host: new URLSearchParams(location.search).get("host"),
  forceRedirect: true
};
const app = createApp(config);
const redirect = Redirect.create(app);

export default function HomePage() {

  const isMerchantLoggedIn = sessionStorage.getItem("isMerchantLoggedIn");
  const navigate = useNavigate();
  if (isMerchantLoggedIn == 'true') {
    navigate('/DashBoardPage');
    return '';
  }

  const [check, setCheck] = useState(false);
  const privateFetch = useAuthenticatedFetch();
  const goToEditor = () => {
    setCheck(prevCheck => !prevCheck);
    privateFetch('/api/shopDomain').then(r => r.text())
      .then(shop_domain => {
        setCheck(prevCheck => !prevCheck);
        redirect.dispatch(Redirect.Action.REMOTE, {
          url: `https://${shop_domain}/admin/themes/current/editor?context=apps`,
          newContext: true,
        });
      });
  };

  return (
    <Frame>
      <Page narrowWidth>
        <TitleBar title="Merchant Form" primaryAction={{
          content: "Activate app from editor",
          onAction: () => goToEditor(),
          loading: check
        }}
          secondaryActions={[
            {
              content: 'Support',
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: `https://mailto:connect@pincodecredits.com`,
                  newContext: true,
                });
              },
            }
          ]} />
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
