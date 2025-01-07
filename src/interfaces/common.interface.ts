import { Pagination } from "../constants";

export interface SearchParam {
    page: number;
    limit: number;
    search?: string;
}
export interface UserTemplate {
    id: string;
    username: string;
    email: string;
}

export interface User extends UserTemplate {
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface ResponseData {
    data: any[];
    total: number;
    pagination: Pagination;
}

export interface UserState {
    users: ResponseData;
    currentUser: any;
    loading: boolean;
    error: any;
};