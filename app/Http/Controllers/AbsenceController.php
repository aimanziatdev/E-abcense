<?php

namespace App\Http\Controllers;

use App\Models\Absence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AbsenceController extends Controller
{
    public function index()
    {
        return Absence::with('student')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            '*.student_id' => 'required|exists:students,id',
            '*.date' => 'required|date',
            '*.justified' => 'boolean',
            '*.is_present' => 'boolean',
        ]);

        $absences = [];
        foreach ($request->all() as $absenceData) {
            $absences[] = Absence::create($absenceData);
        }

        return response()->json(['message' => 'Absences saved successfully!', 'absences' => $absences]);
    }

    public function show($id)
    {
        return Absence::with('student')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $absence = Absence::findOrFail($id);

        $request->validate([
            'student_id' => 'exists:students,id',
            'date' => 'date',
            'justified' => 'boolean',
            'is_present' => 'boolean',
        ]);

        $absence->update($request->all());

        return $absence;
    }

    public function destroy($id)
    {
        $absence = Absence::findOrFail($id);
        $absence->delete();

        return response()->noContent();
    }

    public function updateJustified(Request $request)
    {
        Log::info('Received payload: ', $request->all());

        $absences = $request->all();

        foreach ($absences as $absenceData) {
            Log::info('Processing absence: ', $absenceData);

            $absence = Absence::find($absenceData['id']);
            if ($absence) {
                $absence->justified = $absenceData['justified'];
                $absence->save();
            }
        }

        return response()->json(['message' => 'Absences updated successfully']);
    }

    public function getAbsenceDates($classId)
    {
        $dates = Absence::where('class_id', $classId)
                        ->distinct()
                        ->pluck('date');
    
        return response()->json($dates);
    }
    
    
}
