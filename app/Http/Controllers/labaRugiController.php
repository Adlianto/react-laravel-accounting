<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Inertia\Inertia;

class labaRugiController extends Controller
{
    public function index()
    {
        $revenueAccounts = Account::with('jurnalItems')
            ->where('category', 'revenue')
            ->orderBy('code', 'asc')
            ->get();

        $revenues = [];
        $totalRevenue = 0;

        foreach ($revenueAccounts as $account) {
            $initial = $account->normal_balance === 'credit' ? (float)$account->initial_balance : -(float)$account->initial_balance;
            $mutation = (float)$account->jurnalItems->sum('credit') - (float)$account->jurnalItems->sum('debit');
            $balance = $initial + $mutation;

            $revenues[] = [
                'id'      => $account->id,
                'code'    => $account->code,
                'name'    => $account->name,
                'balance' => $balance,
            ];
            $totalRevenue += $balance;
        }

        $expenseAccounts = Account::with('jurnalItems')
            ->where('category', 'expense')
            ->orderBy('code', 'asc')
            ->get();

        $expenses = [];
        $totalExpense = 0;

        foreach ($expenseAccounts as $account) {
            $initial = $account->normal_balance === 'debit' ? (float)$account->initial_balance : -(float)$account->initial_balance;
            $mutation = (float)$account->jurnalItems->sum('debit') - (float)$account->jurnalItems->sum('credit');
            $balance = $initial + $mutation;

            $expenses[] = [
                'id'      => $account->id,
                'code'    => $account->code,
                'name'    => $account->name,
                'balance' => $balance,
            ];
            $totalExpense += $balance;
        }

        $netProfit = $totalRevenue - $totalExpense;

        return Inertia::render('labaRugi', [
            'revenues'     => $revenues,
            'expenses'     => $expenses,
            'totalRevenue' => $totalRevenue,
            'totalExpense' => $totalExpense,
            'netProfit'    => $netProfit,
        ]);
    }
}