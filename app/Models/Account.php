<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'normal_balance',
        'initial_balance',
    ];

    public function jurnalItems()
    {
        return $this->hasMany(jurnalItem::class, 'account_id');
    }
}
