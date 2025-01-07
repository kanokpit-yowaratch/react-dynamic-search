import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../reducers/userSlice';
import { store } from '../../stores';
import { Table, Flex, Space } from 'antd';
import { Container } from '@mui/material';
import { ColumnsType } from 'antd/es/table';
import Search from 'antd/es/input/Search';
import { debounce } from 'lodash';
import { User, UserState } from '../../interfaces/common.interface';
import { initialPageProps, pagingConfig } from '../../constants';

const UserList = () => {
	const dispatch = useDispatch();
	const users = useSelector((state: { user: UserState }) => state.user.users);

	useEffect(() => {
		store.dispatch(fetchUsers({ pagination: initialPageProps }));
	}, [dispatch]);

	const onPagingChange = ({ currentPage, limit }: any) => {
		const pageProps = {
			limit,
			currentPage
		};
		store.dispatch(fetchUsers({ pagination: pageProps }));
	};

	const handleSearch = (query: string) => {
		const optios = { search: query, pagination: initialPageProps };
		store.dispatch(fetchUsers(optios));
	};

	const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

	const columns: ColumnsType<any> = [
		{
			title: 'No.',
			render: (_, __, index) => {
				const no = (index + 1 + ((users.pagination.currentPage - 1) * users.pagination.limit));
				return no;
			},
			align: 'center',
			width: 10,
		},
		{
			title: 'Name',
			dataIndex: 'first_name',
			render: (_, { firstName, lastName }, index) => {
				return firstName && lastName ? `${firstName} ${lastName ? lastName : ''}` : '-';
			},
			width: 72,
		},
		{
			title: 'Username | Email',
			dataIndex: 'email',
			render: (_, { username, email }, index) => {
				return email ? email : username;
			},
			width: 72,
		},
		{
			title: 'Role',
			dataIndex: 'role',
			width: 72,
		}
	];

	return (
		<Container maxWidth="lg" sx={{ p: 2 }}>
			<h2>React dynamic search</h2>
			<Space direction="vertical" size="middle" style={{ display: 'flex' }}>
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
					dataSource={users.data}
					columns={columns}
					pagination={{ ...pagingConfig, ...users.pagination }}
					onChange={onPagingChange}
					bordered
				/>
			</Space>
		</Container>
	);
};

export default UserList;
