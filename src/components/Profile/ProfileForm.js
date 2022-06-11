import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const newEnteredPassword = passwordInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBDor3rxb0hjvs87vCEMcOSK6YMG_M34GI",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newEnteredPassword,
          returnSecureToken: false,
        }),
        headers: { "content-type": "applicatoin/json" },
      }
    );
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={passwordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
