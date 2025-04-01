import React , { useEffect , useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './CalendarComponent';
import { useAuth } from './AuthContext'; // AuthContext import
import "./mainPageHeader.css"

function MainPage(props) {
    const navigate = useNavigate();
    const {isLoggedIn, setIsLoggedIn } = useAuth(); // 로그인 상태 가져오기


    useEffect(() => {
        const email = sessionStorage.getItem("email");
        const storeId = sessionStorage.getItem("storeid");
        const name = sessionStorage.getItem("name");

        // 세션 스토리지가 비어 있지 않으면 로그인 상태로 설정
        if (email && storeId && name) {
            // setLocalLoggedIn(true);
            setIsLoggedIn(true); // AuthContext의 로그인 상태도 업데이트
        } else {
            alert("로그인이 필요합니다.");
            navigate('/goLogin'); // 로그인 페이지로 리다이렉트
        }
    }, [navigate, setIsLoggedIn]);


    const handleLogout = () => {
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("storeid");
        sessionStorage.removeItem("name");
        setIsLoggedIn(false); // 로그아웃 시 로그인 상태 업데이트
        navigate('/goLogin')
        console.log("로그아웃 성공");
    };

    const userName = sessionStorage.getItem("name"); // 사용자 이름 가져오기

    return (
        <div>
             {!isLoggedIn ? (
                <button onClick={() => { navigate('/goLogin'); }}>로그인</button>
            ) : (
                <div class="header-name">
                <span>{userName} 님의 일정</span> {/* 사용자 이름 표시 */}
                <button onClick={handleLogout}>로그아웃</button>
                </div>
            )}
            <CalendarComponent />
        </div>
    
    )
}

export default MainPage;
