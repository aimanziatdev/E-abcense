<?php
use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return $request->user(); });

    // General Resource Routes
    Route::apiResource('users', UserController::class);
    Route::apiResource('classes', ClassController::class);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('absences', AbsenceController::class);

    // Specific Routes for Class and Student Management
    Route::get('teacher/classes', [ClassController::class, 'teacherClasses']);  // Corrected route to a potentially correct method
    Route::get('classes/{class}/students', [ClassController::class, 'students']); // Shows students in a specific class
    Route::get('classes/{class}/absences', [ClassController::class, 'absences']); // Shows absences in a specific class

    // Update Justified Absences
    
    // Additional POST Routes (already covered by apiResource but explicitly defined for clarity if needed)
    Route::post('classes', [ClassController::class, 'store'])->name('classes.store');
    Route::post('students', [StudentController::class, 'store'])->name('students.store');
    Route::put('absences/updateJustified', [AbsenceController::class, 'updateJustified']);
    Route::get('/classes/{classId}/absence-dates', [AbsenceController::class, 'getAbsenceDates']);

    
    // Users listing (covered by apiResource, redundant unless specific modifications are needed)
    Route::get('users', [UserController::class, 'index']);
});

// Authentication Routes
Route::post('login', [AuthController::class, 'login']);
