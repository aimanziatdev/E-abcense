<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = ['student_id', 'class_id', 'date', 'is_present', 'justified'];

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

