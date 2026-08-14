import { GoogleLogin } from "@react-oauth/google";

import { useGoogleLoginMutation } from "@/modules/public/auth/api/authMutations";
import { useAppDispatch } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../authSlice";

export function GoogleAuthButton() {
  const googleLoginMutation = useGoogleLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <GoogleLogin
      theme="outline"
      shape="rectangular"
      size="large"
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) return;

        googleLoginMutation.mutate(
          {
            id_token: credentialResponse.credential,
          },
          {
            onSuccess: (response) => {
              

              dispatch(
                setCredentials({
                  user: response.user,
                  accessToken: response.access,
                }),
              );
              navigate("/dashboard");
            },

            onError: (error) => {
              console.error(error);
            },
          },
        );
      }}
      onError={() => {
        console.error("Google login failed.");
      }}
    />
  );
}
