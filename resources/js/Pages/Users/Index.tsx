import { useState, useMemo } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/UI/table";
import Pagination from "../../components/UI/pagination/Pagination";
import Badge from "../../components/UI/badge/Badge";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { showToast, showConfirm, showAlert } from "../../Utils/notifications";
import {
  ArrowUpDown as LuArrowUpDown,
  ArrowUp as LuArrowUp,
  ArrowDown as LuArrowDown,
  Plus as LuPlus,
  Pencil as LuPencil,
  Trash2 as LuTrash2,
  User as LuUser,
  Search as LuSearch,
} from "lucide-react";
import Button from "../../components/UI/button/Button";
import { Modal } from "../../components/UI/modal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import AuthenticatedLayout from "../../Layouts/AuthenticatedLayout";

interface Role {
  id: number;
  name: string;
}

interface Station {
  lemb_id: number;
  lemb_name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  lemb_id?: number | null;
  status: 'aktif' | 'nonaktif';
  role?: Role | null;
  lembaga?: Station | null;
  avatar?: string | null;
}

type SortConfig = {
  key: keyof User;
  direction: "asc" | "desc" | null;
};

export default function UserManagement() {
  const { users, roles, stations, auth } = usePage<{ users: User[], roles: Role[], stations: Station[], auth: any }>().props;
  const userPermissions = auth?.user?.role?.permissions || [];

  const canCreate = userPermissions.includes('users.create');
  const canEdit = userPermissions.includes('users.edit');
  const canDelete = userPermissions.includes('users.delete');

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "role_id",
    direction: "asc",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, setData, post, put, processing, reset, clearErrors } = useForm({
    name: "",
    email: "",
    password: "",
    role_id: "",
    lemb_id: "",
  });

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const handleSort = (key: SortConfig["key"]) => {
    let direction: SortConfig["direction"] = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          String(user.id).includes(term)
      );
    }

    if (sortConfig.direction) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) aValue = "";
        if (bValue === null || bValue === undefined) bValue = "";

        if (typeof aValue === "string" && typeof bValue === "string") {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, sortConfig, searchTerm]);

  // Pagination Logic
  const totalItems = filteredAndSortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (user?: User) => {
    setMissingFields([]);
    clearErrors();
    if (user) {
      setEditingId(user.id);
      setData({
        name: user.name,
        email: user.email,
        password: "",
        role_id: user.role_id ? String(user.role_id) : "",
        lemb_id: user.lemb_id ? String(user.lemb_id) : "",
      });
    } else {
      setEditingId(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const missing = [];
    if (!data.name.trim()) missing.push("name");
    if (!data.email.trim()) missing.push("email");
    if (!data.role_id) missing.push("role_id");
    if (!editingId && !data.password) missing.push("password");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      missing.push("email");
    }

    setMissingFields(missing);

    if (missing.length > 0) {
      if (data.email && !emailRegex.test(data.email)) {
        showAlert("error", "Validasi Gagal", "Masukkan alamat email yang valid.");
      } else {
        showAlert("error", "Validasi Gagal", "Mohon isi semua field yang wajib diisi dengan benar.");
      }
      return;
    }

    if (editingId) {
      const result = await showConfirm(
        'Perbarui Pengguna?',
        'Apakah Anda yakin ingin memperbarui data pengguna ini?',
        'Ya, perbarui'
      );
      if (!result.isConfirmed) return;

      put(route('users.update', editingId), {
        onSuccess: () => {
          showToast('success', 'Pengguna berhasil diperbarui');
          setIsModalOpen(false);
          reset();
        },
        onError: (errors: any) => {
          showAlert('error', 'Pembaruan Gagal', errors.message || 'Terjadi kesalahan');
        }
      });
    } else {
      post(route('users.store'), {
        onSuccess: () => {
          showToast('success', 'Pengguna berhasil ditambahkan');
          setIsModalOpen(false);
          reset();
        },
        onError: (errors: any) => {
          showAlert('error', 'Penambahan Gagal', errors.message || 'Terjadi kesalahan');
        }
      });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await showConfirm(
      'Hapus Pengguna?',
      'Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin melanjutkan?',
      'Ya, hapus pengguna'
    );

    if (!result.isConfirmed) return;

    router.delete(route('users.destroy', id), {
      onSuccess: () => {
        showToast('success', 'Pengguna berhasil dihapus');
      },
      onError: (errors: any) => {
        showAlert('error', 'Penghapusan Gagal', errors.message || 'Terjadi kesalahan');
      }
    });
  };

  const handleToggleStatus = (user: User) => {
    router.patch(route('users.toggle-status', user.id), {}, {
      onSuccess: () => {
        showToast('success', 'Status pengguna berhasil diperbarui');
      },
      onError: (errors: any) => {
        showAlert('error', 'Pembaruan Status Gagal', errors.message || 'Terjadi kesalahan');
      }
    });
  };

  const getSortIcon = (key: SortConfig["key"]) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      return <LuArrowUpDown className="ml-1 size-3.5 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <LuArrowUp className="ml-1 size-3.5 text-brand-500" />
    ) : (
      <LuArrowDown className="ml-1 size-3.5 text-brand-500" />
    );
  };

  const roleOptions = roles
    .filter(r => r.name.toLowerCase() !== 'approver')
    .map(r => ({
      value: String(r.id),
      label: r.name
    }));

  const stationOptions = stations.map(s => ({
    value: String(s.lemb_id),
    label: s.lemb_name
  }));

  return (
    <AuthenticatedLayout>
      <PageMeta
        title="User Management | JAS Airport Services"
        description="Manage system users"
      />
      <PageBreadcrumb pageTitle="User Management" />

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mt-4">
          {/* Header: Title + Search + Add Button */}
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Manajemen Pengguna
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kelola akun pengguna dan jabatan mereka.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-auto">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <LuSearch className="size-4" />
                </span>
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  className="pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-transparent outline-none focus:border-blue-500 dark:border-gray-800 dark:text-white transition-all w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {canCreate && (
                <Button
                  variant="primary"
                  size="sm"
                  startIcon={<LuPlus className="size-5" />}
                  onClick={() => handleOpenModal()}
                  className="rounded-xl shadow-lg shadow-brand-500/20 w-full sm:w-auto justify-center"
                >
                  Tambah Pengguna
                </Button>
              )}
            </div>
          </div>

          {/* ── Desktop Table (lg+) ── */}
          <div className="hidden lg:block max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Pengguna
                      {getSortIcon("name")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => handleSort("role_id")}
                  >
                    <div className="flex items-center">
                      Jabatan
                      {getSortIcon("role_id")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => handleSort("lemb_id")}
                  >
                    <div className="flex items-center">
                      Lembaga
                      {getSortIcon("lemb_id")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02]"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon("status")}
                    </div>
                  </TableCell>
                  <TableCell
                    isHeader
                    className="py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 overflow-hidden rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {user.avatar ? (
                              <img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {user.name}
                            </p>
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            user.role?.name.toLowerCase() === 'admin' ? 'success' :
                              user.role?.name.toLowerCase() === 'superadmin' ? 'error' :
                                'primary'
                          }
                        >
                          {user.role?.name || "No Role"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {user.lembaga ? (
                          <div className="flex items-center gap-1.5">
                            <Badge size="sm" color="info">
                              {user.lembaga.lemb_name}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Tidak Ada Lembaga</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={!canEdit}
                            onClick={() => handleToggleStatus(user)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.status === 'aktif'
                              ? 'bg-success-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                              } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                            role="switch"
                            aria-checked={user.status === 'aktif'}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.status === 'aktif' ? 'translate-x-4' : 'translate-x-0'
                                }`}
                            />
                          </button>
                          <span className={`text-sm font-medium ${user.status === 'aktif' ? 'text-success-600 dark:text-success-500' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {user.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => handleOpenModal(user)}
                              className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                              title="Edit User"
                            >
                              <LuPencil className="size-4.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                              title="Delete User"
                            >
                              <LuTrash2 className="size-4.5" />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-gray-500">
                      Tidak ada pengguna ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Tablet & Mobile Card Layout (< lg) ── */}
          <div className="lg:hidden">
            {currentUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] p-4 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
                  >
                    {/* Card Top: Avatar + Name + Email + Actions */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-11 overflow-hidden rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 shrink-0">
                        {user.avatar ? (
                          <img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white/90 text-sm truncate">
                          {user.name}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs truncate">
                          {user.email}
                        </p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {canEdit && (
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                            title="Edit User"
                          >
                            <LuPencil className="size-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="flex items-center justify-center size-8 rounded-lg text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                            title="Delete User"
                          >
                            <LuTrash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom: Role + Station badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Jabatan:</span>
                        <Badge
                          size="sm"
                          color={
                            user.role?.name.toLowerCase() === 'admin' ? 'success' :
                              user.role?.name.toLowerCase() === 'superadmin' ? 'error' :
                                'primary'
                          }
                        >
                          {user.role?.name || "No Role"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Lembaga:</span>
                        {user.lembaga ? (
                          <Badge size="sm" color="info">
                            {user.lembaga.lemb_name}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Tidak Ada Lembaga</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">Status:</span>
                        <button
                          type="button"
                          disabled={!canEdit}
                          onClick={() => handleToggleStatus(user)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.status === 'aktif'
                            ? 'bg-success-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                            } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                          role="switch"
                          aria-checked={user.status === 'aktif'}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.status === 'aktif' ? 'translate-x-4' : 'translate-x-0'
                              }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-gray-400 dark:text-gray-500 text-sm">
                Tidak ada pengguna ditemukan.
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-[550px]"
      >
        <div className="flex flex-col h-full">
          <div className="px-6 py-5 lg:px-8 lg:py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
                <LuUser className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {editingId ? "Edit Akun Pengguna" : "Tambah Pengguna Baru"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {editingId ? "Perbarui detail dan jabatan pengguna yang ada." : "Buat akun pengguna baru dengan jabatan dan lembaga yang sesuai."}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6 lg:px-8 lg:py-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: Ahmad Fauzi"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="mt-1.5"
                    error={missingFields.includes("name")}
                  />
                </div>
                <div>
                  <Label>Alamat Email</Label>
                  <Input
                    type="email"
                    placeholder="contoh@gmail.com"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="mt-1.5"
                    error={missingFields.includes("email")}
                  />
                </div>
              </div>

              <div>
                <Label>{editingId ? "Password (kosongkan jika tidak ingin mengubah)" : "Password"}</Label>
                <Input
                  type="password"
                  placeholder={editingId ? "••••••••" : "Buat password baru"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className="mt-1.5"
                  error={missingFields.includes("password")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div>
                  <Label>Jabatan</Label>
                  <div className="mt-1.5">
                    <Select
                      options={roleOptions}
                      placeholder="Pilih jabatan"
                      value={data.role_id}
                      onChange={(val) => setData("role_id", val)}
                      className={missingFields.includes("role_id") ? "border-error-500" : ""}
                    />
                  </div>
                </div>
                <div>
                  <Label>Lembaga (Opsional)</Label>
                  <div className="mt-1.5">
                    <Select
                      options={stationOptions}
                      placeholder="Pilih lembaga"
                      value={data.lemb_id}
                      onChange={(val) => setData("lemb_id", val)}
                      className={missingFields.includes("lemb_id") ? "border-error-500" : ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 lg:px-8 lg:py-6 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/[0.02] rounded-b-3xl">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="px-6 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={processing}
              className="px-8 rounded-xl shadow-lg shadow-brand-500/25"
            >
              {processing ? "Menyimpan..." : editingId ? "Perbarui Pengguna" : "Tambah Pengguna"}
            </Button>
          </div>
        </div>
      </Modal>
    </AuthenticatedLayout>
  );
}
