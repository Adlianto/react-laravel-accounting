import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Account {
    id: number;
    code: string;
    name: string;
    category: string;
    normal_balance: string;
    initial_balance: number;
}

interface Props {
    accounts: Account[];
    errors?: Record<string, string>;
}

export default function Accounts({ accounts = [], errors = {} }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, reset, clearErrors } = useForm({
        code: '',
        name: '',
        category: 'asset',
        normal_balance: 'debit',
        initial_balance: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            put(`/accounts/${editingId}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/accounts', {
                onSuccess: () => reset(),
            });
        }
    };

    const startEdit = (acc: Account) => {
        setEditingId(acc.id);
        setData({
            code: acc.code,
            name: acc.name,
            category: acc.category,
            normal_balance: acc.normal_balance,
            initial_balance: acc.initial_balance,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleDelete = (acc: Account) => {
        if (confirm(`Yakin ingin menghapus akun "${acc.code} - ${acc.name}"?`)) {
            router.delete(`/accounts/${acc.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Chart of Accounts" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold">Chart of Accounts</h1>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/accounts" className="text-blue-600 hover:underline">Account</a>
                        <a href="/jurnal" className="text-blue-600 hover:underline">Jurnal Umum</a>
                        <a href="/bukuBesar" className="text-blue-600 hover:underline">Buku Besar</a>
                        <a href="/neracaSaldo" className="text-blue-600 hover:underline">Neraca Saldo</a>
                        <a href="/labaRugi" className="text-blue-600 hover:underline">Laba Rugi</a>
                    </div>
                </div>

                {errors.delete && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
                        {errors.delete}
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">
                        {editingId ? 'Edit Akun' : 'Tambah Akun Baru'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kode Akun</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Nama Akun</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Kategori</label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="asset">Asset</option>
                                    <option value="liability">Liability</option>
                                    <option value="equity">Equity</option>
                                    <option value="revenue">Revenue</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Saldo Normal</label>
                                <select
                                    value={data.normal_balance}
                                    onChange={(e) => setData('normal_balance', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="debit">Debit</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Saldo Awal</label>
                            <input
                                type="number"
                                value={data.initial_balance}
                                onChange={(e) => setData('initial_balance', Number(e.target.value))}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium"
                            >
                                {editingId ? 'Simpan Perubahan' : 'Simpan Akun'}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded text-sm font-medium"
                                >
                                    Batal
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2 text-left">Kode</th>
                                <th className="border p-2 text-left">Nama Akun</th>
                                <th className="border p-2 text-left">Kategori</th>
                                <th className="border p-2 text-center">Saldo Normal</th>
                                <th className="border p-2 text-right">Saldo Awal</th>
                                <th className="border p-2 text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">Belum ada akun.</td>
                                </tr>
                            ) : (
                                accounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-gray-50">
                                        <td className="border p-2 font-mono font-medium">{acc.code}</td>
                                        <td className="border p-2">{acc.name}</td>
                                        <td className="border p-2 capitalize">{acc.category}</td>
                                        <td className="border p-2 text-center capitalize">{acc.normal_balance}</td>
                                        <td className="border p-2 text-right font-mono">
                                            Rp {Number(acc.initial_balance).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="border p-2 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => startEdit(acc)}
                                                    className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(acc)}
                                                    className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded text-xs"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}