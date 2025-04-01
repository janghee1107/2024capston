import React, { createContext, useContext, useState , useEffect  } from 'react';

// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 애플리케이션 시작 시 sessionStorage에서 로그인 상태 확인
        const email = sessionStorage.getItem("email");
        const storeId = sessionStorage.getItem("storeid");
        const name = sessionStorage.getItem("name");

        if (email && storeId && name) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    return useContext(AuthContext);
};
