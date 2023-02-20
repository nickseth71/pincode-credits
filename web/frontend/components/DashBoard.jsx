import { Icon, Grid, Card } from '@shopify/polaris';
import { useState, useCallback, useEffect } from 'react';
import HttpRequest from '../utility/HttpRequest';
import {
    ArrowUpMinor
} from '@shopify/polaris-icons';



export const DashBoard = () => {
    const [DashData, setDashData] = useState();
    let brandId = sessionStorage.getItem("merchantBrandId");
    const formData = new FormData();
    formData.append("userid", brandId);
    const fetchDashData = async () => {
        var DashBoardData = await HttpRequest('https://pincodecredits.com/PincodeAdmin/API/V1/merchant_dashboard', 'POST', formData);
        setDashData(DashBoardData[0].data[0]);
        console.log('DashBoardData>>>>>', DashBoardData);
    };
    useEffect(() => {
        fetchDashData();
    }, []);

    return (
        <>
            {(DashData != null) &&
                <>
                    <Grid
                        gap={{ xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }}
                        columns={{ xs: 1, sm: 4, md: 4, lg: 8, xl: 8 }}
                        areas={{
                            xs: ['all_visitor', 'today_count', 'yesterday_count', 'week_count'],
                            sm: ['all_visitor', 'today_count', 'yesterday_count', 'week_count'],
                            md: ['all_visitor all_visitor today_count today_count yesterday_count yesterday_count week_count week_count'],
                            lg: ['all_visitor all_visitor today_count today_count yesterday_count yesterday_count week_count week_count'],
                            xl: ['all_visitor all_visitor today_count today_count yesterday_count yesterday_count week_count week_count'],
                        }}
                    >
                        <Grid.Cell area="all_visitor">
                            <Card title="Total Visitor" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.all_visitor}</span></p>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell area="today_count">
                            <Card title="Today Visitor" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.today_count}</span></p>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell area="yesterday_count">
                            <Card title="Yesterday Visitor" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.yesterday_count}</span></p>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell area="week_count">
                            <Card title="This week Visitor" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.week_count}</span></p>
                            </Card>
                        </Grid.Cell>
                    </Grid>
                    < div style={{
                        height: '20px',
                        background: 'transparent',
                    }} />
                    <Grid
                        gap={{ xs: '20px', sm: '20px', md: '20px', lg: '20px', xl: '20px' }}
                        columns={{ xs: 1, sm: 4, md: 4, lg: 8, xl: 8 }}
                        areas={{
                            xs: ['month_count', 'sales', 'wallet'],
                            sm: ['month_count', 'sales', 'wallet'],
                            md: ['month_count month_count sales sales wallet wallet'],
                            lg: ['month_count month_count sales sales wallet wallet'],
                            xl: ['month_count month_count sales sales wallet wallet'],
                        }}
                    >

                        <Grid.Cell area="month_count">
                            <Card title="This month Visitor" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.month_count}</span></p>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell area="sales">
                            <Card title="Sales" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.sales}</span></p>
                            </Card>
                        </Grid.Cell>
                        <Grid.Cell area="wallet">
                            <Card title="Wallet" sectioned>
                                <p className='SgIcon'><Icon
                                    source={ArrowUpMinor}
                                    color="base"
                                /> <span>{DashData.wallet}</span></p>
                            </Card>
                        </Grid.Cell>
                    </Grid>
                </>
            }
        </>
    )
}
