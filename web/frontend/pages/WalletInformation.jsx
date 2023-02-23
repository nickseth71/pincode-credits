import { ChoiceList, DatePicker, Card, Page, Layout, TextField, IndexTable, Filters, Select, useIndexResourceState } from "@shopify/polaris";
import { useState, useCallback, useEffect } from 'react';
import { TitleBar, useNavigate } from "@shopify/app-bridge-react";
import HttpRequest from '../utility/HttpRequest';

export default function WalletInformation() {
    const isMerchantLoggedIn = sessionStorage.getItem("isMerchantLoggedIn");
    const brandId = sessionStorage.getItem("merchantBrandId");
    const [WalletData, setWalletData] = useState([]);
    const navigate = useNavigate()
    if (isMerchantLoggedIn != 'true') {
        navigate("/")
        return '';
    }
    const formData = new FormData();
    formData.append("userid", brandId);

    useEffect(() => {
        const fetchWalletData = async () => {
            var WalletDataAll = await HttpRequest('https://pincodecredits.com/PincodeAdmin/API/V1/merchant_wallet_history', 'POST', formData);
            setWalletData(WalletDataAll[0].data);
        };
        fetchWalletData()
    }, []);

    console.log('WalletData>>>>>', WalletData);
    const resourceName = {
        singular: 'wallet',
        plural: 'wallets',
    };



    const [type, setType] = useState('');
    const [balance, setBalance] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const [queryValue, setQueryValue] = useState('');

    const [{ month, year }, setDatePicker] = useState({ month: new Date().getMonth(), year: new Date().getFullYear() });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date('Sun Jan 12 1900 00:00:00 GMT-0500 (IST)'),
        end: new Date('Sun Jan 12 1900 00:00:00 GMT-0500 (IST)'),
    });

    const [Aselected, setASelect] = useState('Greater than');
    const handleAConditionChange = useCallback((value) => setASelect(value), []);

    const [Bselected, setBSelect] = useState('Greater than');
    const handleBConditionChange = useCallback((value) => setBSelect(value), []);

    // console.log('>>>>', formatDate(selectedDates.start), formatDate(selectedDates.end), '<<<<');
    const handleMonthChange = useCallback(
        (month, year) => setDatePicker({ month, year }),
        []
    );

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
    const handleDateRemove = useCallback(() => setSelectedDates({ start: new Date('Sun Jan 12 1900 00:00:00 GMT-0500 (IST)'), end: new Date('Sun Jan 12 1900 00:00:00 GMT-0500 (IST)') }), []);
    const handleBalanceRemove = useCallback(() => setBalance(''), []);
    const handleTypeRemove = useCallback(() => setType(''), []);

    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleClearAll = useCallback(() => {
        handleAmountRemove();
        handleDateRemove();
        handleBalanceRemove();
        handleTypeRemove();
        handleQueryValueRemove();
    }, [handleQueryValueRemove, handleAmountRemove, handleDateRemove, handleBalanceRemove, handleTypeRemove]);

    const filters = [
        {
            key: 'type',
            label: 'Type',
            filter: (
                <ChoiceList
                    title="Wallet Type"
                    titleHidden
                    choices={[
                        { label: 'Debit', value: 'debit' },
                        { label: 'Credit', value: 'credit' },
                        { label: 'Pending', value: 'pending' },
                    ]}
                    selected={type || []}
                    onChange={handleTypeChange}
                    allowMultiple={false}
                />
            ),
            shortcut: true,
        },
        {
            key: 'amount',
            label: 'Amount',
            filter: (
                <TextField
                    label="Amount"
                    value={amount}
                    type="number"
                    onChange={handleAmountChange}
                    autoComplete="off"
                    labelHidden
                    connectedRight={
                        <Select
                            label="Condition"
                            labelHidden
                            value={Aselected}
                            onChange={handleAConditionChange}
                            options={['Greater than', 'Less than', 'Equal to']}
                        />
                    }
                />
            ),
            shortcut: false,
        },
        {
            key: 'balance',
            label: 'Balance',
            filter: (
                <TextField
                    label="Balance"
                    value={balance}
                    type="number"
                    onChange={handleBalanceChange}
                    autoComplete="off"
                    labelHidden
                    connectedRight={
                        <Select
                            label="Condition"
                            labelHidden
                            value={Bselected}
                            onChange={handleBConditionChange}
                            options={['Greater than', 'Less than', 'Equal to']}
                        />
                    }
                />
            ),
            shortcut: false,
        },
        {
            key: 'date',
            label: 'Date',
            filter: (
                <DatePicker
                    month={month}
                    year={year}
                    onChange={setSelectedDates}
                    onMonthChange={handleMonthChange}
                    selected={selectedDates}
                    multiMonth={false}
                    allowRange={false}
                />
            ),
            shortcut: false,
        },
    ];



    const dDate = (formatDate(selectedDates.start, true) == 1900) ? '' : formatDate(selectedDates.start);
    const appliedFilters = [];
    if (!isEmpty(amount)) {
        const key = 'amount';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, amount),
            onRemove: handleAmountRemove,
        });
    }
    if (!isEmpty(type)) {
        const key = 'type';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, type),
            onRemove: handleTypeRemove,
        });
    }
    if (!isEmpty(dDate)) {
        const key = 'date';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, formatDate(selectedDates.start)),
            onRemove: handleDateRemove,
        });
    }
    if (!isEmpty(balance)) {
        const key = 'balance';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, balance),
            onRemove: handleBalanceRemove,
        });
    }

    const keys = ["amount", "balance", "type", "remark", "created_at"];
    let ifAny = (amount != '' || balance != '' || type != '' || date != '');
    const search = (data) => {
        if (queryValue == '' && amount == '' && balance == '' && type == '' && dDate != '') {
            return data.filter((item) => (item['created_at'].toLowerCase().includes(dDate)));
        } else if (queryValue == '' && amount == '' && balance == '' && type != '' && dDate == '') {
            return data.filter((item) => (item['type'].toLowerCase().includes(type)));
        } else if (queryValue == '' && amount == '' && balance != '' && type == '' && dDate == '') {
            return data.filter((item) => (getConditionVal(item['balance'], balance, Bselected)));
        } else if (queryValue == '' && amount != '' && balance == '' && type == '' && dDate == '') {
            return data.filter((item) => (getConditionVal(item['amount'], amount, Aselected)));
        } else if (queryValue == '' && ifAny) {
            return data.filter((item) => (getConditionVal(item['amount'], amount, Aselected) && getConditionVal(item['balance'], balance, Bselected) && item['type'].toLowerCase().includes(type) && item['created_at'].toLowerCase().includes(dDate)))
        } else {
            return data.filter((item) => keys.some((key) => item[key].toLowerCase().includes(queryValue.toLowerCase())))
        }
    }

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(search(WalletData));
    const rowMarkup = search(WalletData).map(
        ({ id, amount, balance, type, remark, created_at }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                selected={selectedResources.includes(id)}
                position={index}
            >
                <IndexTable.Cell>{index + 1}</IndexTable.Cell>
                <IndexTable.Cell>{amount}</IndexTable.Cell>
                <IndexTable.Cell>{balance}</IndexTable.Cell>
                <IndexTable.Cell>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</IndexTable.Cell>
                <IndexTable.Cell>{remark}</IndexTable.Cell>
                <IndexTable.Cell>{created_at}</IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <Page fullWidth>
            <TitleBar
                title="Wallet Information"
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
                            itemCount={search(WalletData).length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            hasMoreItems={false}
                            lastColumnSticky
                            selectable={false}
                            headings={[
                                { title: 'Sr No.' },
                                { title: 'Amount' },
                                { title: 'Wallet Balance' },
                                { title: 'Type' },
                                { title: 'Remark' },
                                { title: 'Date' }
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
            case 'balance':
                return `Wallet Balance: ${value}`;
            case 'type':
                return `Type: ${value}`;
            case 'date':
                return `Date: ${value}`;
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

    function formatDate(date, getYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (getYear) { return year; }
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    function getConditionVal(Gval, Sval, type) {
        let res = false;
        Gval = parseFloat(Gval);
        Sval = parseFloat(Sval);
        if (type == 'Greater than') {
            res = (Gval > Sval);
        } else if (type == 'Less than') {
            res = (Gval < Sval);
        } else {
            res = (Gval == Sval);
        }
        return res;
    }
}
