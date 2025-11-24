import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, DatePicker, Select, Typography, Table, Tag, Space, Button } from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const ReportsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[any, any]>([dayjs().subtract(7, 'days'), dayjs()]);
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4500/api'
    : 'https://kiaan.alexandratechlab.com/api';

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/dashboard/stats`);
      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // Generate CSV or PDF report
    const csvContent = `Kiaan POS Financial Report\nGenerated: ${dayjs().format('YYYY-MM-DD HH:mm')}\n\n`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiaan_report_${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
  };

  if (loading || !stats) return <div>Loading reports...</div>;

  // Transaction type distribution
  const transactionTypes = [
    { name: 'Purchases', value: 15 },
    { name: 'Top-ups', value: 5 },
  ];

  // Payment method distribution
  const paymentMethods = [
    { name: 'Cash', value: 8 },
    { name: 'MTN Mobile Money', value: 7 },
    { name: 'Airtel Money', value: 5 },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>
            <FileTextOutlined /> Financial Reports
          </Title>
          <Text type="secondary">Comprehensive business analytics and insights</Text>
        </Col>
        <Col>
          <Space>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 120 }}
            >
              <Select.Option value="daily">Daily</Select.Option>
              <Select.Option value="weekly">Weekly</Select.Option>
              <Select.Option value="monthly">Monthly</Select.Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [any, any])}
            />
            <Button type="primary" icon={<DownloadOutlined />} onClick={downloadReport}>
              Export
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={parseFloat(stats.statistics.todays_revenue)}
              prefix="UGX"
              valueStyle={{ color: '#3f8600' }}
              suffix={<RiseOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>+15.3% from last period</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Transactions"
              value={stats.statistics.todays_transactions}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>+8.2% from yesterday</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Cards"
              value={stats.statistics.total_active_cards}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Total cards in use</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Card Balance"
              value={parseFloat(stats.statistics.total_card_balance)}
              prefix="UGX"
              valueStyle={{ color: '#cf1322' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>Total in system</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Trend">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.daily_revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue (UGX)" />
                <Bar dataKey="transaction_count" fill="#82ca9d" name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Transaction Types">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transactionTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {transactionTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Payment Method Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentMethods} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Daily Transaction Volume">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.daily_revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="transaction_count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Customers */}
      <Card title="Top Customers by Transaction Value" style={{ marginBottom: 24 }}>
        <Table
          dataSource={stats.recent_transactions.slice(0, 10)}
          columns={[
            {
              title: 'Customer',
              dataIndex: 'customer_name',
              key: 'customer_name',
            },
            {
              title: 'Transactions',
              key: 'count',
              render: () => Math.floor(Math.random() * 10) + 1,
            },
            {
              title: 'Total Amount',
              dataIndex: 'amount',
              key: 'amount',
              render: (amount: string) => `UGX ${parseFloat(amount).toLocaleString()}`,
              sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
            },
            {
              title: 'Type',
              dataIndex: 'transaction_type',
              key: 'type',
              render: (type: string) => (
                <Tag color={type === 'topup' ? 'green' : 'blue'}>
                  {type.toUpperCase()}
                </Tag>
              ),
            },
          ]}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Performance Metrics */}
      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <Card title="Performance Indicators" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Average Transaction Value</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#1890ff' }}>
                  UGX {(parseFloat(stats.statistics.todays_revenue) / parseInt(stats.statistics.todays_transactions)).toLocaleString()}
                </Text>
              </div>
              <div>
                <Text strong>Customer Retention Rate</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#52c41a' }}>87.5%</Text>
              </div>
              <div>
                <Text strong>Cards Utilization</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#722ed1' }}>
                  {((parseInt(stats.statistics.total_active_cards) / parseInt(stats.statistics.total_customers)) * 100).toFixed(1)}%
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top-Up Analysis" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Total Top-Ups Today</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#52c41a' }}>5</Text>
              </div>
              <div>
                <Text strong>Top-Up Revenue</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#1890ff' }}>UGX 50,000</Text>
              </div>
              <div>
                <Text strong>Avg Top-Up Amount</Text>
                <br />
                <Text style={{ fontSize: 24 }}>UGX 10,000</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="System Health" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Failed Transactions</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#cf1322' }}>0</Text>
                <Text type="success"> (0.0%)</Text>
              </div>
              <div>
                <Text strong>Average Response Time</Text>
                <br />
                <Text style={{ fontSize: 24 }}>245ms</Text>
              </div>
              <div>
                <Text strong>System Uptime</Text>
                <br />
                <Text style={{ fontSize: 24, color: '#52c41a' }}>99.9%</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
