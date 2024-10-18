<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassController extends Controller
{
    public function index()
    {
        return Classe::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        return Classe::create($request->all());
    }

    public function show($id)
    {
        try {
            $class = Classe::with(['students', 'absences'])->findOrFail($id);
            // Assuming you want to send both class details and absences together
            return response()->json([
                'classDetails' => $class,
                'absences' => $class->absences
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch class details with absences', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Server error occurred.'], 500);
        }
    }
    

    public function update(Request $request, $id)
    {
        $class = Classe::findOrFail($id);

        $request->validate([
            'name' => 'string|max:255',
            'user_id' => 'exists:users,id',
        ]);

        $class->update($request->all());

        return $class;
    }

    public function destroy($id)
    {
        $class = Classe::findOrFail($id);
        $class->delete();

        return response()->noContent();
    }

    public function teacherClasses(Request $request)
    {
        $teacher = $request->user();
        if ($teacher) {
            return response()->json($teacher->classes);  // Assuming 'classes' is the correct relationship name
        } else {
            return response()->json(['message' => 'Teacher not found'], 404);
        }
    }
    
    public function students($classId)
    {
        Log::info("Fetching students for class ID: ", ['classId' => $classId]);
    
        $students = Student::where('class_id', $classId)->get();
        if ($students->isEmpty()) {
            return response()->json(['message' => 'No students found'], 404);
        }
        return response()->json($students);
    }
    
    public function absences($classId)
    {
    Log::info("Fetching students for class ID: ", ['classId' => $classId]);
    
    $class = Classe::with(['absences.student'])->findOrFail($classId);       
      if ($class->absences->isEmpty()) {
        return response()->json(['message' => 'No absences recorded for this class'], 404);
        }
        return response()->json($class);

    }

}
