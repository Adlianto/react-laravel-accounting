<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\JurnalController;
use App\Http\Controllers\bukuBesarController;
use App\Http\Controllers\neracaSaldoController;
use App\Http\Controllers\labaRugiController;
use Illuminate\Support\Facades\Route;

Route::get('/', [AccountController::class, 'index'])->name('home');
Route::get('/jurnal', [JurnalController::class, 'index'])->name('jurnal.index');
Route::post('/jurnal', [JurnalController::class, 'store'])->name('jurnal.store');
Route::get('/bukuBesar', [bukuBesarController::class, 'index'])->name('buku-besar.index');
Route::get('/neracaSaldo', [neracaSaldoController::class, 'index'])->name('neracaSaldo.index');
Route::get('/labaRugi', [labaRugiController::class, 'index'])->name('labaRugi.index');
Route::get('/accounts', [AccountController::class, 'index'])->name('accounts.index');
Route::post('/accounts', [AccountController::class, 'store'])->name('accounts.store');
Route::put('/accounts/{account}', [AccountController::class, 'update'])->name('accounts.update');
Route::delete('/accounts/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');
Route::get('/jurnal', [JurnalController::class, 'index'])->name('jurnal.index');
Route::post('/jurnal', [JurnalController::class, 'store'])->name('jurnal.store');
Route::put('/jurnal/{jurnal}', [JurnalController::class, 'update'])->name('jurnal.update');
Route::delete('/jurnal/{jurnal}', [JurnalController::class, 'destroy'])->name('jurnal.destroy');