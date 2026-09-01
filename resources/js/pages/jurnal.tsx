import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';

interface Account {
    id: number;
    code: string;
    name: string;
}

interface JurnalItemData {
    id?: number;
    account_id: number | '';
    debit: number;
    credit: number;
    account?: Account;
}

interface JurnalData {
    id: number;
    transaction_date: string;
    reference_number: string;
    description: string | null;
    items: JurnalItemData[];
}

interface Props {
    accounts: Account[];
    jurnals: JurnalData[];
}

export default function Jurnal({ accounts = [], jurnals = [] }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, reset, clearErrors } = useForm({
        transaction_date: new Date().toISOString().split('T')[0],
        reference_number: '',
        description: '',
        items: [
            { account_id: '', debit: 0, credit: 0 },
            { account_id: '', debit: 0, credit: 0 },
        ],
    });

    const addItemRow = () => {
        setData('items', [...data.items, { account_id: '', debit: 0, credit: 0 }]);
    };

    const removeItemRow = (index: number) => {
        if (data.items.length <= 2) {
            alert('Transaksi jurnal minimal harus memiliki 2 baris akun!');
            return;
        }
        const updated = data.items.filter((_, i) => i !== index);
        setData('items', updated);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updated = [...data.items];
        updated[index] = { ...updated[index], [field]: value };
        setData('items', updated);
    };

    const totalDebit = data.items.reduce((acc, curr) => acc + (Number(curr.debit) || 0), 0);
    const totalCredit = data.items.reduce((acc, curr) => acc + (Number(curr.credit) || 0), 0);
    const isBalanced = totalDebit > 0 && totalDebit === totalCredit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isBalanced) {
            alert('Debit dan Kredit harus seimbang sebelum disimpan!');
            return;
        }

        if (editingId) {
            put(`/jurnal/${editingId}`, {
                onSuccess: () => cancelEdit(),
            });
        } else {
            post('/jurnal', {
                onSuccess: () => reset(),
            });
        }
    };

    const startEdit = (j: JurnalData) => {
        setEditingId(j.id);
        setData({
            transaction_date: j.transaction_date,
            reference_number: j.reference_number,
            description: j.description || '',
            items: j.items.map((it) => ({
                account_id: it.account_id,
                debit: Number(it.debit),
                credit: Number(it.credit),
            })),
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleDelete = (j: JurnalData) => {
        if (confirm(`Yakin ingin menghapus jurnal "${j.reference_number}"?`)) {
            router.delete(`/jurnal/${j.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Jurnal Umum" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold">Jurnal Umum</h1>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/accounts" className="text-blue-600 hover:underline">Account</a>
                        <a href="/jurnal" className="text-blue-600 hover:underline">Jurnal Umum</a>
                        <a href="/bukuBesar" className="text-blue-600 hover:underline">Buku Besar</a>
                        <a href="/neracaSaldo" className="text-blue-600 hover:underline">Neraca Saldo</a>
                        <a href="/labaRugi" className="text-blue-600 hover:underline">Laba Rugi</a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">
                        {editingId ? 'Edit Transaksi Jurnal' : 'Tambah Transaksi Jurnal'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tanggal</label>
                                <input
                                    type="date"
                                    value={data.transaction_date}
                                    onChange={(e) => setData('transaction_date', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">No. Bukti / Referensi</label>
                                <input
                                    type="text"
                                    value={data.reference_number}
                                    onChange={(e) => setData('reference_number', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Keterangan</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border-t pt-4">
                            <h3 className="text-sm font-semibold text-gray-700">Detail Akun Transaksi</h3>
                            {data.items.map((row, idx) => (
                                <div key={idx} className="flex gap-3 items-center">
                                    <select
                                        value={row.account_id}
                                        onChange={(e) => handleItemChange(idx, 'account_id', Number(e.target.value))}
                                        className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">-- Pilih Akun --</option>
                                        {accounts.map((acc) => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.code} - {acc.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Debit"
                                        value={row.debit || ''}
                                        onChange={(e) => handleItemChange(idx, 'debit', Number(e.target.value))}
                                        className="w-36 border p-2 rounded text-right focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Kredit"
                                        value={row.credit || ''}
                                        onChange={(e) => handleItemChange(idx, 'credit', Number(e.target.value))}
                                        className="w-36 border p-2 rounded text-right focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItemRow(idx)}
                                        className="text-rose-500 hover:text-rose-700 font-bold px-2"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="text-sm text-blue-600 font-medium hover:underline mt-2 inline-block"
                            >
                                + Tambah Baris Akun
                            </button>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <div className="flex items-center gap-4 text-sm font-medium">
                                <span>Debit: <b>Rp {totalDebit.toLocaleString('id-ID')}</b></span>
                                <span>Kredit: <b>Rp {totalCredit.toLocaleString('id-ID')}</b></span>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${isBalanced
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                    }`}>
                                    <span className="relative flex h-2.5 w-2.5">
                                        {isBalanced && (
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        )}
                                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isBalanced ? 'bg-emerald-500' : 'bg-rose-500'
                                            }`}></span>
                                    </span>
                                    {isBalanced ? 'Seimbang' : 'Belum Seimbang'}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={!isBalanced}
                                    className={`px-5 py-2 rounded text-sm font-medium text-white ${isBalanced ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {editingId ? 'Simpan Perubahan' : 'Simpan Transaksi'}
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
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                    <h2 className="text-lg font-bold mb-4">Riwayat Jurnal Umum</h2>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2 text-left">Tanggal</th>
                                <th className="border p-2 text-left">No. Bukti</th>
                                <th className="border p-2 text-left">Akun</th>
                                <th className="border p-2 text-right">Debit</th>
                                <th className="border p-2 text-right">Kredit</th>
                                <th className="border p-2 text-center">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jurnals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">Belum ada riwayat transaksi jurnal.</td>
                                </tr>
                            ) : (
                                jurnals.map((j) => (
                                    <React.Fragment key={j.id}>
                                        <tr className="bg-gray-50/80 border-t-2 border-gray-300 font-medium">
                                            <td className="border p-2">{j.transaction_date}</td>
                                            <td className="border p-2 font-mono font-bold text-blue-700">{j.reference_number}</td>
                                            <td className="border p-2 text-gray-600 italic">{j.description || '-'}</td>
                                            <td className="border p-2 text-right text-gray-400">-</td>
                                            <td className="border p-2 text-right text-gray-400">-</td>
                                            <td className="border p-2 text-center" rowSpan={j.items.length + 1}>
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => startEdit(j)}
                                                        className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded text-xs shadow-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(j)}
                                                        className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded text-xs shadow-sm"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {j.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="border p-2 bg-gray-50/30"></td>
                                                <td className="border p-2 bg-gray-50/30"></td>
                                                <td className={`border p-2 ${Number(item.credit) > 0 ? 'pl-8 text-gray-700' : 'font-medium text-gray-900'}`}>
                                                    {item.account?.code} - {item.account?.name}
                                                </td>
                                                <td className="border p-2 text-right font-mono">
                                                    {Number(item.debit) > 0 ? `Rp ${Number(item.debit).toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : '-'}
                                                </td>
                                                <td className="border p-2 text-right font-mono">
                                                    {Number(item.credit) > 0 ? `Rp ${Number(item.credit).toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}