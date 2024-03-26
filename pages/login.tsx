/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XNlTLb7
 */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { validEmail } from "@/lib/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function Login() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleCodeSubmit = async () => {
    let otp: string | null = "";
    otp =
      document.getElementById("otp")!.getAttribute("value") === null
        ? ""
        : document.getElementById("otp")!.getAttribute("value");
    console.log(otp);
    if (otp !== null) {
      setCode(otp);
    }
    if (code === "") {
      alert("Please enter a code.");
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error) {
      alert("Incorrect OTP. Please try again."); // TODO: make better
      setLoading(false);
      setSent(true);
      return;
    }
    setLoading(false);
    if (session) {
      setLoading(true);
      await supabaseClient.auth.setSession(session);
      await router.push("/");
    }
  };

  const handleClick = async () => {
    try {
      if (email === "") {
        alert("Please enter an email.");
        return;
      }
      if (!validEmail(email)) {
        alert("Please enter a valid email.");
        return;
      }
      setLoading(true);
      const { error } = await supabaseClient.auth.signInWithOtp({
        email: email,
      });
      if (error) {
        console.log(error.message);
        switch (error.message) {
          case "Signups not allowed for otp":
            alert("No account exists. Please sign up"); //FIXME:
            break;
          case "Email rate limit exceeded":
            alert(
              "Email rate limit exceeded due to Supabase free tier limitations. Please try again later."
            );
          case "For security purposes, you can only request this once every 60 seconds":
            alert("60 second rate limit hit, please try again in a minute");
            break;
          default:
            alert("There was an error. Please try again."); // TODO: make better
            break;
        }
        setLoading(false);
        setEmail("");
        return;
      }
      setLoading(false);
      setSent(true);
    } catch (e) {
      // alert("There was an error. Please try again.") // TODO: make better
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center relative overflow-y-hidden overflow-x-hidden">
      <div className="bg-[#3d5a80] w-[125vw] min-h-[80vh] z-0  rounded-b-full absolute top-0 -left-[12.5vw]"></div>
      <div className="text-4xl z-10 text-[#ee6c4d] font-bold mt-4">
        Travel you can't imagine
      </div>
      <div className="text-xl z-10 text-white mt-4 w-[500px] text-center  my-5">
        Find and save flights at your finger tips. Search with complicated
        queries if you don't know where to go, or input dates and locations if
        you know where you want to go. With TYCI, the possibilities are
        limitless.
      </div>
      <div className="flex z-10 items-center flex-col justify-center max-w-sm rounded-lg my-10 shadow-lg bg-[#e0fbfc] space-y-6 border border-gray-200 dark:border-gray-700 w-auto p-4 py-8 h-auto overflow-y-hidden overflow-x-hidden">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Log In</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {sent
              ? "Enter the one-time code sent to your email"
              : "Enter your email to log in"}
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                <Label className="text-center" htmlFor="email">
                  {sent ? "One-Time Code" : "Email"}
                </Label>
                <div className="flex flex-row">
                  {sent ? (
                    <>
                      {/* <Input
                        id="code"
                        placeholder={"123456"}
                        required
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        onSubmit={handleCodeSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCodeSubmit();
                          }
                        }}
                      /> */}

                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        id="otp"
                        required
                        onSubmit={handleCodeSubmit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleCodeSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <Button
                        className="mx-2"
                        onClick={handleCodeSubmit}
                        onKeyDown={(e: { key: string }) => {
                          if (e.key === "Enter") {
                            handleCodeSubmit();
                          }
                        }}
                      >
                        Go
                      </Button>
                    </>
                  ) : (
                    <>
                      <Input
                        id="email"
                        placeholder={"m@example.com"}
                        required
                        type="email"
                        value={email}
                        onChange={handleChange}
                        onSubmit={handleClick}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleClick();
                          }
                        }}
                      />
                      <Button
                        className="mx-2"
                        onClick={handleClick}
                        onKeyDown={(e: { key: string }) => {
                          if (e.key === "Enter") {
                            handleClick();
                          }
                        }}
                      >
                        Go
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
