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

import { ProductsCard, IndexForm, DashBoard } from '../components';

import createApp from '@shopify/app-bridge';
import { Redirect } from '@shopify/app-bridge/actions';

const config = {
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URLSearchParams(location.search).get("host"),
    forceRedirect: true
};


export default function DashBoardPage() {
    const app = createApp(config);
    const redirect = Redirect.create(app);

    const navigate = useNavigate();
    const isMerchantLoggedIn = sessionStorage.getItem("isMerchantLoggedIn");

    if (isMerchantLoggedIn != 'true') {
        navigate("/")
        return '';
    }

    return (
        <Frame>
            {(isMerchantLoggedIn == 'true') &&
                <Page fullWidth>
                    <TitleBar title="Dashboard" primaryAction={{
                        content: "Support",
                        onAction: () => {
                            redirect.dispatch(Redirect.Action.REMOTE, {
                                url: `https://mailto:connect@pincodecredits.com`,
                                newContext: true,
                            });
                        },
                    }} />
                    <Layout>
                        <Layout.Section>
                            <Card title="" sectioned>
                                <DashBoard />
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>}
        </Frame>
    );
}
