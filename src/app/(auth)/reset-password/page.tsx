"use client"

import { resetPassword } from "@/lib/auth/client"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import logo from "../../../../public/logo.jpg"
import {
    PASSWORD_REGEX,
    PASSWORD_MIN_LENGTH,
    PASSWORD_LENGTH_MSG,
    PASSWORD_ERROR_MSG,
} from "@/lib/validation/password"


export default function ResetPasswordPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null)

    const router = useRouter();

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token')

        if (!token) {
            router.replace('/login')
            return;
        }

        setToken(token)
    }, [router])


    return (<div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
            <div>
                <Image
                    alt="Skill Match"
                    src={logo}
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Reset your password
                </h2>
            </div>
            <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault()

                setError("")
                setLoading(true)

                const form = new FormData(e.target as HTMLFormElement)

                const password = form.get('password') as string;
                const confirmPassword = form.get('confirm-password') as string;

                if (password.length < PASSWORD_MIN_LENGTH) {
                    setError(PASSWORD_LENGTH_MSG)
                    setLoading(false)
                    return;
                }

                if (!PASSWORD_REGEX.test(password)) {
                    setError(PASSWORD_ERROR_MSG)
                    setLoading(false)
                    return;
                }

                if (password !== confirmPassword) {
                    setError("Passwords do not match")
                    setLoading(false)
                    return;
                }

                const { error } = await resetPassword({
                    newPassword: form.get('password') as string,
                    token: token!,
                })

                setLoading(false)

                if (error) {
                    setError(error.message || "An error occurred")
                    return;
                }

                toast.success("Password reset successfully.")

                router.push('/login')
            }}>
                <div>
                    <div className="col-span-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            autoComplete="password"
                            aria-label="Password"
                            className="block w-full rounded-t-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    <div className="-mt-px">
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            placeholder="Confirm Password"
                            autoComplete="confirm-password"
                            aria-label="Confirm Password"
                            className="block w-full rounded-b-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>

                {error && <div className="text-sm/6 text-red-600">
                    {error}
                </div>}

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:bg-indigo-600"
                        disabled={loading}
                    >
                        Reset Password
                    </button>
                </div>
            </form>

            <p className="text-center text-sm/6 text-gray-500">
                Remembered your password?{' '}
                <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </p>
        </div>
    </div>)
}