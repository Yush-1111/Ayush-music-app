import { useSignIn } from "@clerk/react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  const { signIn } = useSignIn();

  const signInWithGoogle = async () => {
    if (!signIn) return;

    try {
      await signIn.create({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback"
      });
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    }
  };

  return (
    <Button
      onClick={signInWithGoogle}
      variant="secondary"
      className="w-full text-white border-zinc-200 h-11"
    >
      <img src="/google.png" alt="Google" className="size-5" />
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;