import { isAuthenticated } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    if (await isAuthenticated()) {
        redirect('/dashboard');
    }

    return (
        <div>
            {children}
        </div>
    )
}