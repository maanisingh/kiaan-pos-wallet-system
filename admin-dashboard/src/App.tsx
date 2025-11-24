import { Refine } from '@refinedev/core';
import { RefineThemes, ThemedLayoutV2, notificationProvider } from '@refinedev/antd';
import routerProvider from '@refinedev/react-router-v6';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import '@refinedev/antd/dist/reset.css';
import {
  DashboardOutlined,
  UserOutlined,
  CreditCardOutlined,
  TransactionOutlined,
  ShopOutlined,
  ShoppingOutlined,
  WalletOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

// Custom data provider
import { customDataProvider } from './dataProvider';

// Pages
import { DashboardPage } from './pages/dashboard';
import { CustomerList, CustomerShow } from './pages/customers';
import { CardList, CardShow } from './pages/cards';
import { TransactionList } from './pages/transactions';
import { POSTerminal } from './pages/pos-terminal';
import { TopUpPage } from './pages/topup';
import { ReportsPage } from './pages/reports';
import { CardRegistration } from './pages/card-registration';
import { BranchesList } from './pages/branches';

const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4500/api'
  : 'https://kiaan.alexandratechlab.com/api';

function App() {
  return (
    <BrowserRouter basename="/admin">
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            routerProvider={routerProvider}
            dataProvider={customDataProvider(API_URL)}
            notificationProvider={notificationProvider}
            resources={[
              {
                name: 'dashboard',
                list: '/',
                meta: {
                  label: 'Dashboard',
                  icon: <DashboardOutlined />,
                },
              },
              {
                name: 'pos-terminal',
                list: '/pos-terminal',
                meta: {
                  label: 'POS Terminal',
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: 'topup',
                list: '/topup',
                meta: {
                  label: 'Top-Up',
                  icon: <WalletOutlined />,
                },
              },
              {
                name: 'card-registration',
                list: '/card-registration',
                meta: {
                  label: 'Register Card',
                  icon: <PlusCircleOutlined />,
                },
              },
              {
                name: 'customers',
                list: '/customers',
                show: '/customers/show/:id',
                meta: {
                  label: 'Customers',
                  icon: <UserOutlined />,
                },
              },
              {
                name: 'cards',
                list: '/cards',
                show: '/cards/show/:id',
                meta: {
                  label: 'NFC Cards',
                  icon: <CreditCardOutlined />,
                },
              },
              {
                name: 'transactions',
                list: '/transactions',
                meta: {
                  label: 'Transactions',
                  icon: <TransactionOutlined />,
                },
              },
              {
                name: 'reports',
                list: '/reports',
                meta: {
                  label: 'Reports',
                  icon: <FileTextOutlined />,
                },
              },
              {
                name: 'branches',
                list: '/branches',
                meta: {
                  label: 'Branches',
                  icon: <ShopOutlined />,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2>
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="/pos-terminal" element={<POSTerminal />} />
                <Route path="/topup" element={<TopUpPage />} />
                <Route path="/card-registration" element={<CardRegistration />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/customers">
                  <Route index element={<CustomerList />} />
                  <Route path="show/:id" element={<CustomerShow />} />
                </Route>
                <Route path="/cards">
                  <Route index element={<CardList />} />
                  <Route path="show/:id" element={<CardShow />} />
                </Route>
                <Route path="/transactions" element={<TransactionList />} />
                <Route path="/branches" element={<BranchesList />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
