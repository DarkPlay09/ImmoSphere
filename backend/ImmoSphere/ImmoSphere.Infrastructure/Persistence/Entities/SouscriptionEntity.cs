using System;

namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class SouscriptionEntity
{
    public int Id { get; set; }
    public DateOnly? DateDebut { get; set; }
    public DateOnly? DateFin { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? UtilisateurId { get; set; }
    public UtilisateurEntity? Utilisateur { get; set; }

    public int? AbonnementId { get; set; }
    public AbonnementEntity? Abonnement { get; set; }

    public int? StatutSouscriptionId { get; set; }
    public StatutSouscriptionEntity? StatutSouscription { get; set; }
}
