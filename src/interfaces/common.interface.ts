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
    fname: string;
    lname: string;
    avatar: string;
}

export interface UserState {
    users: any[]
    currentUser: any;
    loading: boolean;
    error: any;
    pagination: any;
};