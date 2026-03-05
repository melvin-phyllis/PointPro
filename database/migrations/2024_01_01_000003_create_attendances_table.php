<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Créer la table des pointages (présences).
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            // Pointage arrivée
            $table->timestamp('check_in')->nullable();
            // Pointage départ
            $table->timestamp('check_out')->nullable();
            // Géolocalisation à l'arrivée
            $table->decimal('check_in_latitude', 10, 8)->nullable();
            $table->decimal('check_in_longitude', 11, 8)->nullable();
            // Géolocalisation au départ
            $table->decimal('check_out_latitude', 10, 8)->nullable();
            $table->decimal('check_out_longitude', 11, 8)->nullable();
            // Zones géographiques associées
            $table->foreignId('check_in_location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->foreignId('check_out_location_id')->nullable()->constrained('locations')->nullOnDelete();
            // Statut de présence
            $table->enum('status', ['present', 'late', 'absent', 'half_day', 'excused'])->default('absent');
            $table->integer('late_minutes')->default(0);
            $table->decimal('worked_hours', 5, 2)->nullable();
            $table->decimal('overtime_hours', 5, 2)->default(0);
            // Vérification géographique
            $table->boolean('is_geo_verified')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Index pour optimiser les requêtes
            $table->unique(['user_id', 'date']);
            $table->index(['company_id', 'date']);
            $table->index(['company_id', 'status']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Supprimer la table des pointages.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
