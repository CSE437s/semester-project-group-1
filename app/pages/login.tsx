/**
 * v0 by Vercel.
 * @see https://v0.dev/t/XNlTLb7
 */
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

// check if we are on the dev env or prod, and assign BASE accordingly
const BASE = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "TODO" //FIXME:
console.log(BASE)

const validEmail = (email: string): boolean => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
}

export default function Login() {
    const supabaseClient = useSupabaseClient()
    const router = useRouter()
    // const user = useUser()

    const [sent, setSent] = useState(false)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleCodeSubmit = async () => {
        if (code === "") {
            alert("Please enter a code.")
            return
        }
        setLoading(true)
        const { 
            data: { session },
            error
        } = await supabaseClient.auth.verifyOtp({
            email,
            token: code,
            type: 'email',
        })

        if (error) {
            alert("There was an error. Please try again.") // TODO: make better
            return
        }
        setLoading(false)
        if (session) {
            // set session
            // redirect to /studios
            await supabaseClient.auth.setSession(session)
            await router.push("/")
        }
    }

    const handleClick = async () => {
        try {
            if (email === "") {
                alert("Please enter an email.")
                return
            }
            if (!validEmail(email)) {
                alert("Please enter a valid email.")
                return
            }
            setLoading(true)
            const { error } = await supabaseClient.auth.signInWithOtp({
                email: email,
            })
            if (error) {
                switch (error.message) {
                    case "Signups not allowed for otp":
                        alert("No account exists. Please sign up") //FIXME:
                        break
                    default:
                        alert("There was an error. Please try again.") // TODO: make better
                        break
                }
                setLoading(false)
                setEmail("")
                return
            }
            setLoading(false)
            setSent(true)
        } catch (e) {
            // alert("There was an error. Please try again.") // TODO: make better
            setLoading(false)
        }
    }

    return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center ">
        <div className="max-w-sm rounded-lg shadow-lg bg-white p-6 space-y-6 border border-gray-200 dark:border-gray-700 w-[40vw]">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Log In</h1>
                <p className="text-zinc-500 dark:text-zinc-400">
                {sent ? "Enter the one-time code sent to your email" : "Enter your email to log in"}
                </p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    {loading ? <p className="text-center">Loading...</p> : <>
                    <Label htmlFor="email">{sent ? "One-Time Code" : "Email"}</Label>
                    <div className="flex flex-row">
                        {sent ? 
                            <>
                                <Input id="code" placeholder={"123456"} required type="text" value={code} onChange={(e) => setCode(e.target.value)} onSubmit={handleCodeSubmit}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCodeSubmit()
                                    }
                                }}
                                />
                                <Button className="mx-2" onClick={handleCodeSubmit}
                                onKeyDown={(e: { key: string }) => {
                                    if (e.key === "Enter") {
                                        handleCodeSubmit()
                                    }
                                }}
                                >Go</Button>
                            </> :
                        <>
                            <Input id="email" placeholder={"m@example.com"} required type="email" value={email} onChange={handleChange} onSubmit={handleClick}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleClick()
                                }
                            }}
                            />
                            <Button className="mx-2" onClick={handleClick}
                            onKeyDown={(e: { key: string }) => {
                                if (e.key === "Enter") {
                                    handleClick()
                                }
                            }}
                            >Go</Button>
                        </>}
                    </div>
                    </>}
                </div>
            </div>
        </div>
    </div>
    )
}
