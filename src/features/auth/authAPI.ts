export type LoginRequest = {
    email: string
    password: string
}
export type RegisterRequest = {
    email: string
    password: string
}

export const authAPI = {
    login: async (userData: LoginRequest) => {
        localStorage.setItem('auth', JSON.stringify(userData));

        return userData;
    },
    logout: () => localStorage.removeItem('auth')
};