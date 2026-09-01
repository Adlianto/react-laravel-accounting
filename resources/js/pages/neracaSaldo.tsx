import React from 'react';
import { Head } from '@inertiajs/react';

interface AccountRow {
    id: number;
    code: string;
    name: string;
    category: string;
    normal_balance: string;
    initial_debit: number;
    initial_credit: number;
    mutation_debit: number;
    mutation_credit: number;
    ending_debit: number;
    ending_credit: number;
}

interface Totals {
    initial_debit: number;
    initial_credit: number;
    mutation_debit: number;
    mutation_credit: number;
    ending_debit: number;
    ending_credit: number;
    is_balanced: boolean;
}

interface Props {
    rows: AccountRow[];
    totals: Totals;
}

export default function NeracaSaldo({ rows = [], totals }: Props) {
    const formatRp = (val: number) => {
        if (!val || val === 0) return '-';
        return `Rp ${val.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Neraca Saldo" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <div>
                        <h1 className="text-2xl font-bold">Neraca Saldo</h1>
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/accounts" className="text-blue-600 hover:text-blue-800 hover:underline">Account</a>
                        <a href="/jurnal" className="text-blue-600 hover:text-blue-800 hover:underline">Jurnal Umum</a>
                        <a href="/bukuBesar" className="text-blue-600 hover:text-blue-800 hover:underline">Buku Besar</a>
                        <a href="/neracaSaldo" className="text-blue-600 hover:text-blue-800 hover:underline">Neraca Saldo</a>
                        <a href="/labaRugi" className="text-blue-600 hover:text-blue-800 hover:underline">Laba Rugi</a>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Status Neraca Saldo Akhir:</span>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${totals.is_balanced
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                        <span className="relative flex h-2.5 w-2.5">
                            {totals.is_balanced && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${totals.is_balanced ? 'bg-emerald-500' : 'bg-rose-500'
                                }`}></span>
                        </span>
                        {totals.is_balanced ? 'Seimbang' : 'Tidak Seimbang'}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th rowSpan={2} className="border p-2 text-left">Kode</th>
                                <th rowSpan={2} className="border p-2 text-left">Nama Akun</th>
                                <th colSpan={2} className="border p-2 text-center bg-blue-50/50">Saldo Awal</th>
                                <th colSpan={2} className="border p-2 text-center bg-amber-50/50">Mutasi Jurnal</th>
                                <th colSpan={2} className="border p-2 text-center bg-emerald-50/50">Saldo Akhir</th>
                            </tr>
                            <tr className="bg-gray-50 text-gray-600 text-xs">
                                <th className="border p-2 text-right bg-blue-50/30">Debit</th>
                                <th className="border p-2 text-right bg-blue-50/30">Kredit</th>
                                <th className="border p-2 text-right bg-amber-50/30">Debit</th>
                                <th className="border p-2 text-right bg-amber-50/30">Kredit</th>
                                <th className="border p-2 text-right bg-emerald-50/30">Debit</th>
                                <th className="border p-2 text-right bg-emerald-50/30">Kredit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center p-4 text-gray-500">Belum ada data akun.</td>
                                </tr>
                            ) : (
                                rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="border p-2 font-mono font-medium">{row.code}</td>
                                        <td className="border p-2">{row.name}</td>
                                        <td className="border p-2 text-right text-gray-600">{formatRp(row.initial_debit)}</td>
                                        <td className="border p-2 text-right text-gray-600">{formatRp(row.initial_credit)}</td>
                                        <td className="border p-2 text-right text-gray-600">{formatRp(row.mutation_debit)}</td>
                                        <td className="border p-2 text-right text-gray-600">{formatRp(row.mutation_credit)}</td>
                                        <td className="border p-2 text-right font-medium text-gray-900 bg-emerald-50/20">{formatRp(row.ending_debit)}</td>
                                        <td className="border p-2 text-right font-medium text-gray-900 bg-emerald-50/20">{formatRp(row.ending_credit)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-bold text-gray-800 border-t-2 border-gray-400">
                                <td colSpan={2} className="border p-2 text-center uppercase tracking-wider">Total</td>
                                <td className="border p-2 text-right">{formatRp(totals.initial_debit)}</td>
                                <td className="border p-2 text-right">{formatRp(totals.initial_credit)}</td>
                                <td className="border p-2 text-right">{formatRp(totals.mutation_debit)}</td>
                                <td className="border p-2 text-right">{formatRp(totals.mutation_credit)}</td>
                                <td className="border p-2 text-right text-emerald-800 bg-emerald-100/50">{formatRp(totals.ending_debit)}</td>
                                <td className="border p-2 text-right text-emerald-800 bg-emerald-100/50">{formatRp(totals.ending_credit)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}