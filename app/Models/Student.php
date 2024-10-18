<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'class_id'];

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function absences()
    {
        return $this->hasMany(Absence::class);
    }
}
