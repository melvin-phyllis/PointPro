<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Créer la table des journaux d'activité.
     */
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            // Type d'action (check_in, check_out, employee_created, etc.)
            $table->string('action', 100);
            $table->text('description')->nullable();
            // Relation polymorphique (le sujet de l'action)
            $table->string('subject_type')->nullable();
            $table->unsignedBigInteger('subject_id')->nullable();
            // Propriétés additionnelles en JSON
            $table->json('properties')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->index(['company_id', 'created_at']);
            $table->index(['user_id', 'action']);
        });
    }

    /**
     * Supprimer la table des journaux d'activité.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
