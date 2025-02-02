<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\FileController;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Support\Facades\Route;

Route::get('/login', [LoginController::class, 'page'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::delete('/login', [LoginController::class, 'logout']);

Route::middleware(Authenticate::class)->group(function () {
    Route::name('account.')
        ->prefix('account')
        ->group(function () {
            Route::get('/', [AccountController::class, 'edit'])->name('edit');
            Route::put('/', [AccountController::class, 'update'])->name('update');
        });

    Route::name('folder.')
        ->prefix('/folders')
        ->group(function () {
            Route::post('/', [FolderController::class, 'store'])
                ->name('store')
                ->can('create', Folder::class);
            Route::put('/{folder}', [FolderController::class, 'update'])
                ->name('update')
                ->can('update', 'folder');
            Route::delete('/{folder}', [FolderController::class, 'destroy'])
                ->name('destroy')
                ->can('delete', 'folder');
        });

    Route::get('/', [FileController::class, 'media'])->name('media');
    Route::redirect('/media', '/');
    Route::get('/all', [FileController::class, 'all'])->name('all');
    Route::get('/code', [FileController::class, 'code'])->name('code');

    Route::name('file.')
        ->prefix('/file')
        ->group(function () {
            Route::post('/upload', [FileController::class, 'upload'])
                ->name('upload')
                ->can('create', File::class);

            Route::put('/{file}', [FileController::class, 'update'])->name('update')->can('update', 'file');
            Route::delete('/{file}', [FileController::class, 'destroy'])
                ->name('destroy')
                ->can('delete', 'file');
        });
});

// Unprotected routes
Route::get('/file/{file}', [FileController::class, 'show'])->name('file.show');
Route::get('/file/{file}/download', [FileController::class, 'download'])->name('file.download');
Route::get('/folder/{folder}/zip', [FolderController::class, 'zip'])
    ->name('folder.zip');
Route::get('/folder/{folder}', [FolderController::class, 'show'])
    ->name('folder.show');