import { ChoiceList, DatePicker, Card, Page, Layout, TextField, IndexTable, Filters, Select, useIndexResourceState } from "@shopify/polaris";
import { useState, useCallback, useEffect } from 'react';
import { TitleBar, useNavigate } from "@shopify/app-bridge-react";
import HttpRequest from '../utility/HttpRequest';

export default function SalesInformation() {
    const isMerchantLoggedIn = sessionStorage.getItem("isMerchantLoggedIn");
    const brandId = sessionStorage.getItem("merchantBrandId");
    const [SalesData, setSalesData] = useState([]);
    const navigate = useNavigate()
    if (isMerchantLoggedIn != 'true') {
        navigate("/")
        return '';
    }
    const formData = new FormData();

    const [{ month, year }, setDatePicker] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date('Wed Feb 07 2018 00:00:00 GMT-0500 (IST)'),
        end: new Date('Mon Mar 12 2018 00:00:00 GMT-0500 (IST)'),
    });

    console.log('>>>>', formatDate(selectedDates.start), formatDate(selectedDates.end), '<<<<');
    const handleMonthChange = useCallback(
        (month, year) => setDatePicker({ month, year }),
        [],
    );

    formData.append("userid", brandId);
    formData.append("from_date", formatDate(selectedDates.start));
    formData.append("to_date", formatDate(selectedDates.end));

    useEffect(() => {
        const fetchSalesData = async () => {
            var SalesDataAll = await HttpRequest('https://pincodecredits.com/PincodeAdmin/API/V1/merchant_sales_history', 'POST', formData);
            setSalesData(SalesDataAll[0].data);
        };
        fetchSalesData()
    }, []);

    console.log('SalesData>>>>>', SalesData);
    const resourceName = {
        singular: 'Sale',
        plural: 'Sales',
    };

    const [type, setType] = useState('');
    const [balance, setBalance] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [mobile_no, setMobile] = useState('');
    

    const [queryValue, setQueryValue] = useState('');

    const handleMobileChange = useCallback((value) => {
        setMobile(value);
        setQueryValue('');
    }, [], []);

    const handleTypeChange = useCallback((value) => {
        setType(value);
        setQueryValue('');
    }, [], []);

    const handleBalanceChange = useCallback((value) => {
        setBalance(value);
        setQueryValue('');
    }, [], []);

    const handleAmountChange = useCallback((value) => {
        setAmount(value);
        setQueryValue('');
    }, [], []);

    const handleDateChange = useCallback((value) => {
        setDate(value);
        setQueryValue('');
    }, [], []);

    const handleAmountRemove = useCallback(() => setAmount(''), []);
    const handleDateRemove = useCallback(() => setDate(''), []);
    const handleBalanceRemove = useCallback(() => setBalance(''), []);
    const handleTypeRemove = useCallback(() => setType(''), []);
    const handleMobileRemove = useCallback(() => setMobile(''), []);
    

    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleClearAll = useCallback(() => {
        handleMobileRemove();
        handleAmountRemove();
        handleDateRemove();
        handleBalanceRemove();
        handleTypeRemove();
        handleQueryValueRemove();
    }, [handleQueryValueRemove, handleAmountRemove,handleMobileRemove, handleDateRemove, handleBalanceRemove, handleTypeRemove]);

    const filters = [
        {
            key: "datepicker",
            label: "Selected Date",
            filter: (
                <DatePicker
                    month={month}
                    year={year}
                    onChange={setSelectedDates}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    multiMonth
                    allowRange
                />
            ),
            shortcut: true
        },
        {
            key: 'amount',
            label: 'User Name',
            filter: (
                <TextField
                    label="User Name"
                    value={amount}
                    onChange={handleAmountChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: false,
        },
        {
            key: 'mobile_no',
            label: 'Mobile Number',
            filter: (
                <TextField
                    label="Mobile Number"
                    value={mobile_no}
                    type="number"
                    onChange={handleMobileChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: false,
        }
    ];




    const appliedFilters = [];
    if (!isEmpty(amount)) {
        const key = 'amount';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, amount),
            onRemove: handleAmountRemove,
        });
    }
    if (!isEmpty(mobile_no)) {
        const key = 'mobile_no';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, mobile_no),
            onRemove: handleMobileRemove,
        });
    }

    const keys = ["amount", "balance", "type", "remark", "created_at"];
    let ifAny = (amount != '' || balance != '' || type != '' || date != '');
    const search = (data) => {
        if (queryValue == '' && amount == '' && balance == '' && type == '' && date != '') {
            return data.filter((item) => (item['created_at'].toLowerCase().includes(date)));
        } else if (queryValue == '' && amount == '' && balance == '' && type != '' && date == '') {
            return data.filter((item) => (item['type'].toLowerCase().includes(type)));
        } else if (queryValue == '' && amount == '' && balance != '' && type == '' && date == '') {
            return data.filter((item) => (item['balance'].toLowerCase().includes(balance)));
        } else if (queryValue == '' && amount != '' && balance == '' && type == '' && date == '') {
            return data.filter((item) => (item['amount'].toLowerCase().includes(amount)));
        } else if (queryValue == '' && ifAny) {
            return data.filter((item) => (item['amount'].toLowerCase().includes(amount) && item['balance'].toLowerCase().includes(balance) && item['type'].toLowerCase().includes(type) && item['created_at'].toLowerCase().includes(date)))
        } else {
            return data.filter((item) => keys.some((key) => item[key].toLowerCase().includes(queryValue)))
        }
    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(search(SalesData));
    const rowMarkup = search(SalesData).map(
        ({ id, type, txn_id, sale_amount, commision_per, commision_amt, tax_per, tax_amt, sale_description, created_at }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>{index + 1}</IndexTable.Cell>
                <IndexTable.Cell>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</IndexTable.Cell>
                <IndexTable.Cell>{txn_id}</IndexTable.Cell>
                <IndexTable.Cell>{txn_id}</IndexTable.Cell>
                <IndexTable.Cell>{sale_amount}</IndexTable.Cell>
                <IndexTable.Cell>{commision_per}</IndexTable.Cell>
                <IndexTable.Cell>{commision_amt}</IndexTable.Cell>
                <IndexTable.Cell>{tax_per}</IndexTable.Cell>
                <IndexTable.Cell>{tax_amt}</IndexTable.Cell>
                <IndexTable.Cell>{sale_description}</IndexTable.Cell>
                <IndexTable.Cell>{created_at}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <Page fullWidth>
            <TitleBar
                title="Sales Information"
                primaryAction={{
                    content: "Support",
                    onAction: () => window.open('mailto:pincode.app2022@gmail.com', '_blank'),
                }}
            />
            <Layout>
                <Layout.Section>
                    <Card>
                        <div style={{ padding: '16px', display: 'flex' }}>
                            <div style={{ flex: 1 }}>
                                <Filters
                                    queryValue={queryValue}
                                    filters={filters}
                                    appliedFilters={appliedFilters}
                                    onQueryChange={setQueryValue}
                                    onQueryClear={handleQueryValueRemove}
                                    onClearAll={handleClearAll}
                                />
                            </div>
                        </div>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={search(SalesData).length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            hasMoreItems={false}
                            lastColumnSticky
                            selectable={false}
                            headings={[
                                { title: 'Sr No.' },
                                { title: 'User Name' },
                                { title: 'Mobile Number' },
                                { title: 'Transaction ID' },
                                { title: 'Sales Amount' },
                                { title: 'Commision %' },
                                { title: 'Commision Amount' },
                                { title: 'GST %' },
                                { title: 'GST Amount' },
                                { title: 'Sales Desc' },
                                { title: 'Date Time' }
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
    function disambiguateLabel(key, value) {
        switch (key) {
            case 'amount':
                return `Amount: ${value}`;
            case 'mobile_no':
                return `Mobile: ${value}`;
            default:
                return value;
        }
    }

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        } else {
            return value === '' || value == null;
        }
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
}
