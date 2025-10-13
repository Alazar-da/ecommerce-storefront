import Link from "next/link";
import { useParams } from "next/navigation";



export default function PaymentSuccess() {
  const params = useParams() as { amount: string };
  const amount = params.amount  || "0.00";
  return (
    <section className="min-h-screen relative bg-gray-50 flex flex-col items-center justify-center w-full">
       <nav className="flex absolute top-5 left-15 z-10" aria-label="Breadcrumb">
          <ol className="flex space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/orders" className="text-gray-500 hover:text-gray-700">
                Orders
              </Link>
            </li>
          </ol>
        </nav>
      <section className="max-w-6xl mx-auto p-10 text-white text-center border rounded-md bg-gradient-to-tr from-emerald-500 to-cyan-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-emerald-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>
      </div>
      </section>
    </section>
  );
}
