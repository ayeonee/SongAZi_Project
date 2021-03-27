import style from "../Auth.module.scss";
import KakaoLogin from 'react-kakao-login';
import { useDispatch } from "react-redux";
import { kLoginUser } from "../../../_actions/userAction";
import { useHistory } from "react-router-dom";

function KLogin(){
  const history = useHistory();
  const dispatch = useDispatch<any>();

  const submitLogin = (response : any) => {
   const body ={
     tokenId : response.response.accessToken
   }
   dispatch(kLoginUser(body))
    .then((res: any) => {
      if (res.payload.loginSuccess) {
        history.push({
          pathname: "/schedule",
        });
      } else {
        alert(res.payload.message);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
  }

  const responseFail=()=>{
    console.error();
  }
  return (
      <>
        <KakaoLogin
            token="d61079c156018c7a8055d9a015191dfa"
            render={renderProps => (
                <button className={style.KakaoBtn} onClick={renderProps.onClick}>
                <span className={style.KakaoIcon}></span>
                <span className={style.KakaoText}>카카오로 로그인하기</span>
                </button>
            )}
            onSuccess={submitLogin}
            onFail={responseFail}
        />
      </>
    );
}

export default KLogin;