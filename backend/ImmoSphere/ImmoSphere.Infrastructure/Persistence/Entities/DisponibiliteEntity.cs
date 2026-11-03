using System;

namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class DisponibiliteEntity
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly Heure { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? BienId { get; set; }
    public BienEntity? Bien { get; set; }

    public int? StatutDisponibiliteId { get; set; }
    public StatutDisponibiliteEntity? StatutDisponibilite { get; set; }
}
