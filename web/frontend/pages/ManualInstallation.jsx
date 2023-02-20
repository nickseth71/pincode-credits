import { Card, Page, Layout, TextContainer, Heading } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function ManualInstallation() {
    return (
        <Page>
            <TitleBar
                title="Manual Installation"
                primaryAction={{
                    content: "Support",
                    onAction: () => window.open('mailto:pincode.app2022@gmail.com', '_blank'),
                  }}
            />
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
