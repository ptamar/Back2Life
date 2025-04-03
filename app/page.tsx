import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="mobile-container flex flex-col items-center justify-center p-6 text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <Image src="/images/logo.png" alt="Back2Life Logo" width={250} height={150} className="mb-4" />

        <h1 className="text-3xl font-bold text-green-800">Welcome to Back2Life</h1>

        <p className="text-gray-600 max-w-xs">
          Your personal rehabilitation companion that helps you recover through the joy of nurturing life.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
          <Button asChild className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-full">
            <Link href="/register">Get Started</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50 py-6 rounded-full"
          >
            <Link href="/login">I Already Have an Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

