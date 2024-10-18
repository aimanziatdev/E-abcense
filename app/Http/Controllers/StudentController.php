<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return Student::with('Classe')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:Classes,id',
        ]);

        $student = Student::create($request->all());

        return response()->json($student, 201);
    }

    public function show($id)
    {
        return Student::with('Classe')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'class_id' => 'exists:class_rooms,id',
        ]);

        $student->update($request->all());

        return response()->json($student, 200);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->noContent();
    }
}

