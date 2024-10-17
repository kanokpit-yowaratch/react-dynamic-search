import { TablePaginationConfig, type PaginationProps } from 'antd';

const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

const pagingConfig: TablePaginationConfig = {
  showTotal,
  showQuickJumper: true,
  showSizeChanger: true,
  pageSizeOptions: [10, 20, 50, 100],
  position: ['bottomLeft'],
};

interface PageProps {
  total: number;
  pageSize: number;
  current: number;
}

const initialPageProps: PageProps = {
  total: 0,
  pageSize: 10,
  current: 1,
};

export type Pagination = {
  currentPage: number;
  limit: number;
  pages: number;
  total: number;
}

export { pagingConfig, initialPageProps };
