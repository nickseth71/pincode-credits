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


export default function DashBoardPage() {

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
                        onAction: () => window.open('mailto:pincode.app2022@gmail.com', '_blank'),
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
