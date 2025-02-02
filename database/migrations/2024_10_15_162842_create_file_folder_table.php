<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('file_folder', function (Blueprint $table) {
            $table->foreignId('folder_id')->references('id')->on('folders')->onDelete('cascade');
            $table->foreignId('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->primary(['folder_id', 'file_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('folder_file');
    }
};
