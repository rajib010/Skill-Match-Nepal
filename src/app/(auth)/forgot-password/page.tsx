"use client"

import { forgetPassword } from "@/lib/auth/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import logo from "../../../../public/logo.jpg"

export default function ForgotPasswordPage() {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    return (<div className="flex min-h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm space-y-10">
            <div>
                <Image
                    alt="Skill Match"
                    src={logo}
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Forgot your password?
                </h2>
            </div>
            <form className="space-y-6" onSubmit={async (e) => {
                e.preventDefault()

                setError("")
                setLoading(true)

                const form = new FormData(e.target as HTMLFormElement)

                const { error } = await forgetPassword({
                    email: form.get('email') as string,
                    redirectTo: '/reset-password'
                })

                setLoading(false)

                if (error) {
                    setError(error.message || "An error occurred")
                    return;
                }

                toast.success("If an account exists with the email address, you will receive a password reset link shortly. Please check your inbox and your spam folder.")
            }}>
                <div>
                    <div className="col-span-2">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email address"
                            autoComplete="email"
                            aria-label="Email address"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:relative focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                        Send Reset Link
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