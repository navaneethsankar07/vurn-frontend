import { GoogleLogin } from "@react-oauth/google";

import { useGoogleLoginMutation } from "@/modules/public/auth/api/authMutations";

export function GoogleAuthButton() {
  const googleLoginMutation = useGoogleLoginMutation();

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
              console.log("Message:", response.message);
              console.log("User:", response.user);
              console.log("Access Token:", response.access);

              // TODO:
              // Dispatch Redux
              // Navigate Dashboard
            },

            onError: (error) => {
              console.error(error);
            },
          }
        );
      }}
      onError={() => {
        console.error("Google login failed.");
      }}
    />
  );
}