import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600">SaaS Clínica</h1>
        <p className="text-gray-600">Sistema de Gestão para Clínicas e Estética.</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Acessar Sistema
          </Link>

          <Link
            href="/register-clinic"
            className="block w-full py-3 px-6 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Cadastrar Nova Clínica
          </Link>
        </div>
      </div>
    </div>
  );
}
