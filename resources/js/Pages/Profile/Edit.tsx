import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UserMetaCard from "./UserMetaCard";
import UserInfoCard from "./UserInfoCard";

export default function Edit({ user }: any) {
  return (
    <AuthenticatedLayout>
      <PageMeta
        title="Pengaturan Akun | E-Surat"
        description="Halaman Pengaturan Akun"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard user={user} />
          <UserInfoCard user={user} />
        </div>

        {/* Forgot Password */}
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm text-gray-500 dark:text-gray-400">Ingin mengganti password?</span>
            <Link
              href={route('password.request')}
              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium transition-colors"
            >
              Lupa Password?
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
