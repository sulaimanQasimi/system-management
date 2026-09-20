<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('active_directory_users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->string('lastname')->index();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('job')->nullable()->index();
            $table->string('pbx')->nullable()->index();
            $table->string('phone')->nullable()->index();
            $table->date('date')->nullable()->index();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('active_directory_users');
    }
};
