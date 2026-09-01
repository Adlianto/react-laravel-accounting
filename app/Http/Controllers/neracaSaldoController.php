<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Inertia\Inertia;

class neracaSaldoController extends Controller
{
    public function index()
    {
        $accounts = Account::with('jurnalItems')->orderBy('code', 'asc')->get();

        $rows = [];
        $totalInitialDebit = 0;
        $totalInitialCredit = 0;
        $totalMutationDebit = 0;
        $totalMutationCredit = 0;
        $totalEndingDebit = 0;
        $totalEndingCredit = 0;

        foreach ($accounts as $account) {
            $initialDebit = $account->normal_balance === 'debit' ? (float) $account->initial_balance : 0;
            $initialCredit = $account->normal_balance === 'credit' ? (float) $account->initial_balance : 0;

            $mutationDebit = (float) $account->jurnalItems->sum('debit');
            $mutationCredit = (float) $account->jurnalItems->sum('credit');

            $allDebit = $initialDebit + $mutationDebit;
            $allCredit = $initialCredit + $mutationCredit;

            $endingDebit = 0;
            $endingCredit = 0;

            if ($allDebit >= $allCredit) {
                $endingDebit = $allDebit - $allCredit;
            } else {
                $endingCredit = $allCredit - $allDebit;
            }

            $rows[] = [
                'id'             => $account->id,
                'code'           => $account->code,
                'name'           => $account->name,
                'category'       => $account->category,
                'normal_balance' => $account->normal_balance,
                'initial_debit'  => $initialDebit,
                'initial_credit' => $initialCredit,
                'mutation_debit' => $mutationDebit,
                'mutation_credit'=> $mutationCredit,
                'ending_debit'   => $endingDebit,
                'ending_credit'  => $endingCredit,
            ];

            $totalInitialDebit += $initialDebit;
            $totalInitialCredit += $initialCredit;
            $totalMutationDebit += $mutationDebit;
            $totalMutationCredit += $mutationCredit;
            $totalEndingDebit += $endingDebit;
            $totalEndingCredit += $endingCredit;
        }

        return Inertia::render('neracaSaldo', [
            'rows'   => $rows,
            'totals' => [
                'initial_debit'   => $totalInitialDebit,
                'initial_credit'  => $totalInitialCredit,
                'mutation_debit'  => $totalMutationDebit,
                'mutation_credit' => $totalMutationCredit,
                'ending_debit'    => $totalEndingDebit,
                'ending_credit'   => $totalEndingCredit,
                'is_balanced'     => round($totalEndingDebit, 2) === round($totalEndingCredit, 2),
            ],
        ]);
    }
}