import { useList } from '@refinedev/core';
import { List, Table, Tag, Space, Select, DatePicker, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState } from 'react';

const { RangePicker } = DatePicker;

export const TransactionList = () => {
  const [filters, setFilters] = useState<any>({});

  const { data, isLoading } = useList({
    resource: 'transactions',
    filters: Object.entries(filters).map(([field, value]) => ({
      field,
      operator: 'eq',
      value,
    })),
  });

  const columns = [
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
      render: (ref: string) => <code style={{ fontSize: 11 }}>{ref}</code>,
    },
    {
      title: 'Card UID',
      dataIndex: 'card_uid',
      key: 'card_uid',
      render: (uid: string) => <code style={{ fontSize: 11 }}>{uid?.substring(0, 16)}...</code>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (name: string) => name || 'N/A',
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type: string) => (
        <Tag color={type === 'topup' ? 'green' : type === 'purchase' ? 'blue' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Select type"
            value={selectedKeys[0]}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              setFilters({ ...filters, transaction_type: value });
              confirm();
            }}
            style={{ width: 200 }}
            options={[
              { label: 'All', value: '' },
              { label: 'Purchase', value: 'purchase' },
              { label: 'Top-up', value: 'topup' },
              { label: 'Refund', value: 'refund' },
            ]}
          />
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `UGX ${parseFloat(amount).toLocaleString()}`,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: 'Balance Before',
      dataIndex: 'balance_before',
      key: 'balance_before',
      render: (balance: number) => `UGX ${parseFloat(balance).toLocaleString()}`,
    },
    {
      title: 'Balance After',
      dataIndex: 'balance_after',
      key: 'balance_after',
      render: (balance: number) => `UGX ${parseFloat(balance).toLocaleString()}`,
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method: string) => method || 'N/A',
    },
    {
      title: 'Date & Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm:ss'),
      sorter: (a: any, b: any) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <List
      title="Transactions"
      canCreate={false}
      headerButtons={
        <Space>
          <Input
            placeholder="Search by card UID or reference"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setFilters({ ...filters, search: value });
              } else {
                const { search, ...rest } = filters;
                setFilters(rest);
              }
            }}
            style={{ width: 300 }}
          />
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setFilters({
                  ...filters,
                  start_date: dates[0]?.format('YYYY-MM-DD'),
                  end_date: dates[1]?.format('YYYY-MM-DD'),
                });
              } else {
                const { start_date, end_date, ...rest } = filters;
                setFilters(rest);
              }
            }}
          />
        </Space>
      }
    >
      <Table
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 20,
          showTotal: (total) => `Total ${total} transactions`,
        }}
        scroll={{ x: 1500 }}
      />
    </List>
  );
};
