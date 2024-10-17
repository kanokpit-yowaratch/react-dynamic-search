import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from '../../reducers/userSlice';
import { store } from '../../stores';
import { Table, Flex } from 'antd';
import { Container } from '@mui/material';
import { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';
import { debounce } from 'lodash';
import { User, UserState } from '../../interfaces/common.interface';
import { initialPageProps, pagingConfig } from '../../constants';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: { user: UserState }) => state.user.users);
  const pagination = useSelector((state: { user: UserState }) => state.user.pagination);

  useEffect(() => {
    store.dispatch(fetchUsers({ pagination: initialPageProps }));
  }, [dispatch]);

  const onPagingChange = ({ current, pageSize }: any) => {
    const pageProps = {
      pageSize,
      current
    };
    store.dispatch(fetchUsers({ pagination: pageProps }));
  };

  const handleSearch = (query: string) => {
    const optios = { search: query, pagination: initialPageProps };
    store.dispatch(fetchUsers(optios));
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const deleteUserAction = (userId: string) => {
    if (userId) {
      if (window.confirm('deleteUser')) {
        store.dispatch(deleteUser(userId));
      }
    }
  };

  const handleDelete = useCallback(deleteUserAction, []);

  const columns: ColumnsType<any> = [
    {
      title: 'No.',
      render: (_, __, index) => {
        const no = (index + 1 + ((pagination.currentPage - 1) * pagination.limit));
        return no;
      },
      align: 'center',
      width: 10,
    },
    {
      title: 'Name',
      dataIndex: 'first_name',
      render: (_, { first_name, last_name }, index) => {
        const fullName = `${first_name} ${last_name ? last_name : ''}`;
        return fullName;
      },
      align: 'center',
      width: 72,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      align: 'center',
      width: 72,
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <h2>React dynamic search</h2>
      <Flex justify='space-between'>
        <Search
          placeholder="Search user"
          allowClear
          className='search-content'
          size="large"
          onChange={(e) => debouncedHandleSearch(e.target.value)}
        />
      </Flex>
      <Table
        id="tb_result"
        rowKey={(record: User) => `${record.id}-${record.username}`}
        rowSelection={undefined}
        className="table-striped-rows user-table"
        dataSource={users}
        columns={columns}
        pagination={{ ...pagingConfig, ...pagination }}
        onChange={onPagingChange}
        bordered
      />
    </Container>
  );
};

export default UserList;
