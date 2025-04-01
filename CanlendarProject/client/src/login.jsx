// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from './AuthContext'; // AuthContext import
import "./login.css";

function alertCheck(type) {
  if(type) {
    alert('사용할 수 있는 아이디입니다');
  } else {
    alert('이미 존재하는 아이디입니다');
  }
}

function Login() {
    //로그인 폼의 변수
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //회원가입 폼의 변수
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [regPass, setRegPass] = useState("");
    const [idChecked, setIdChecked] = useState(false);

    const [loginCheck, setLoginCheck] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsSignup((prevState) => !prevState);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        await new Promise((r) => setTimeout(r, 1000));
        
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        const result = await response.json();

        if (response.status === 200) {
            setLoginCheck(false);
            setIsLoggedIn(true);
            sessionStorage.setItem("email", result.id);
            sessionStorage.setItem("storeid", result.member_id);
            sessionStorage.setItem("name", result.name);
            console.log("로그인 성공, 이메일 주소:" + result.id);
            navigate("/goMainPage"); // 로그인 성공 시 홈으로 이동
        } else {
            alert("로그인 실패");
            setLoginCheck(true);
        }
    };

    const handleRegist = async (event) => {
      if(!idChecked) {
        alert("아이디 중복 체크를 먼저 해주세요");
      } else {
        event.preventDefault();
        //await new Promise((r) => setTimeout(r, 1000));
        
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                id: id,
                password: regPass,
            }),
        });
        const result = await response.json();

        if (response.status === 201) {
            navigate("/goMainPage"); // 로그인 성공 시 홈으로 이동
        } else {
            alert("회원가입 실패");
        }
      }
    };

    const handleIdCheck = async (event) => {
      event.preventDefault();
      await new Promise((r) => setTimeout(r, 1000));
      
      const response = await fetch("/idcheck", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
              id: id
          }),
      });
      const result = await response.json();

      if (response.status === 200) {
          setIdChecked(false);
          alert("이미 존재하는 아이디입니다");
        } else {
          setIdChecked(true);
          alert("사용할 수 있는 아이디입니다");
      }
    };

    return (
        <div className="login-page">
            <div className={`cont ${isSignup ? 's--signup' : ''}`}>
                {/* 로그인 폼 */}
                <form className="login-form" onSubmit={handleLogin}>
                    <div className={`form sign-in ${isSignup ? 'hidden' : ''}`}>
                        <h2 className="title">Welcome</h2>
                        <label className="form-label">
                            <span className="label-text">ID</span>
                            <input 
                                type="text" 
                                id="username" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </label>
                        <label className="form-label">
                            <span className="label-text">Password</span>
                            <input 
                                type="password" 
                                id="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </label>
                        <p className="forgot-pass">Forgot password?</p>
                        <button type="submit" className="submit">Sign In</button>
                        {loginCheck && (
                            <label style={{ color: "red" }}>아이디 혹은 비밀번호가 틀렸습니다.</label>
                        )}
                    </div>
                </form>
    
                {/* 서브 콘텐츠 (이미지 및 텍스트) */}
                <div className="sub-cont">
                    <div className="img">
                        <div className={`img__text m--up ${isSignup ? 'hidden' : ''}`}>
                            <h3>Don't have an account? Please Sign up!</h3>
                        </div>
                        <div className={`img__text m--in ${isSignup ? '' : 'hidden'}`}>
                            <h3>If you already have an account, just sign in.</h3>
                        </div>
                        <div className="img__btn" onClick={toggleForm}>
                            <span className="m--up">Sign Up</span>
                            <span className="m--in">Sign In</span>
                        </div>
                    </div>
    
                    {/* 회원가입 폼 */}
                    <form className="regist-form" onSubmit={handleRegist}>
                        <div className={`form sign-up ${isSignup ? '' : 'hidden'}`}>
                            <h2 className="title">Create your Account</h2>
                            <label className="form-label">
                                <span className="label-text">ID</span>
                                <input 
                                    type="text"
                                    id="id"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)} 
                                />
                                <button type="button" onClick={handleIdCheck} className="submit">중복확인</button>
                            </label>
                            <label className="form-label">
                                <span className="label-text">Name</span>
                                <input 
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </label>
                            <label className="form-label">
                                <span className="label-text">Password</span>
                                <input 
                                    type="password"
                                    id="regPass"
                                    value={regPass}
                                    onChange={(e) => setRegPass(e.target.value)} 
                                />
                            </label>
                            <button type="submit" className="submit">Sign Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
    
}

export default Login;