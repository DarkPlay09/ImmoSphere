using ImmoSphere.Infrastructure.Persistence;

namespace ImmoSphere.Infrastructure.Persistence.Entities;

// Propriétés tirées du MCD V3 ; types et nullabilités à valider avec le MLD/SQL.
public class UtilisateurEntity
{
    public int Id { get; set; }
    public string Nom { get; set; } = string.Empty;
    public string Prenom { get; set; } = string.Empty;
    // Compte Identity associé (AspNetUsers.Id : string).
    public string IdentityUserId { get; set; } = string.Empty;
    public ApplicationUser IdentityUser { get; set; } = null!;
    public string? Telephone { get; set; }
    public string? PhotoProfil { get; set; }

    // Relations EF Core (choix à vérifier contre le MLD Looping)
    public ICollection<BienEntity> BiensPublies { get; set; } = new List<BienEntity>();

    public int? AgenceId { get; set; }
    public AgenceEntity? Agence { get; set; }

    public ICollection<AvisEntity> AvisRediges { get; set; } = new List<AvisEntity>();

    public ICollection<AvisEntity> AvisRecus { get; set; } = new List<AvisEntity>();

    public ICollection<DemandeCreationAgenceEntity> DemandesCreationAgence { get; set; } = new List<DemandeCreationAgenceEntity>();

    public ICollection<RendezVousEntity> RendezVousProposes { get; set; } = new List<RendezVousEntity>();

    public ICollection<SouscriptionEntity> Souscriptions { get; set; } = new List<SouscriptionEntity>();

    public ICollection<FaqEntity> Faqs { get; set; } = new List<FaqEntity>();

    public ICollection<FavoriEntity> Favoris { get; set; } = new List<FavoriEntity>();

    public ICollection<AgenceAdministrateurEntity> AgencesAdministrees { get; set; } = new List<AgenceAdministrateurEntity>();
}
