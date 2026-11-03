using System;

namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class RendezVousEntity
{
    public int Id { get; set; }
    public DateTime DateHeure { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public int? BienId { get; set; }
    public BienEntity? Bien { get; set; }

    public int? ProposeParId { get; set; }
    public UtilisateurEntity? ProposePar { get; set; }

    public int? StatutRendezVousId { get; set; }
    public StatutRendezVousEntity? StatutRendezVous { get; set; }
}
