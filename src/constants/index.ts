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
  limit: number;
  currentPage: number;
}

const initialPageProps: PageProps = {
  limit: 10,
  currentPage: 1,
};

export interface InitData<T = any> {
  data: Array<T>; // Blog[];
  total: number;
  pagination: Pagination;
}

export type Pagination = {
  currentPage: number;
  limit: number;
  pages: number;
}

export const initialPagination: Pagination = {
  currentPage: 1,
  limit: 5,
  pages: 1
}

export const initialData: InitData = {
  data: [],
  total: 0,
  pagination: initialPagination,
}

export { pagingConfig, initialPageProps };
