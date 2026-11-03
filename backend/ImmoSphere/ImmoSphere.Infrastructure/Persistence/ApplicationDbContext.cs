using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Persistence;

// Identity gère les comptes et rôles ; UtilisateurEntity contient le profil métier (relation 1-1).
public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<BienEntity> Biens => Set<BienEntity>();
    public DbSet<TypeBienEntity> TypesBien => Set<TypeBienEntity>();
    public DbSet<TypeTransactionEntity> TypesTransaction => Set<TypeTransactionEntity>();
    public DbSet<PebBienEntity> PebBiens => Set<PebBienEntity>();
    public DbSet<ImageEntity> Images => Set<ImageEntity>();
    public DbSet<EtatEntity> Etats => Set<EtatEntity>();
    public DbSet<EtatVenteEntity> EtatsVente => Set<EtatVenteEntity>();
    public DbSet<UtilisateurEntity> Utilisateurs => Set<UtilisateurEntity>();
    public DbSet<AgenceEntity> Agences => Set<AgenceEntity>();
    public DbSet<DemandeCreationAgenceEntity> DemandesCreationAgence => Set<DemandeCreationAgenceEntity>();
    public DbSet<AvisEntity> Avis => Set<AvisEntity>();
    public DbSet<RendezVousEntity> RendezVous => Set<RendezVousEntity>();
    public DbSet<StatutRendezVousEntity> StatutsRendezVous => Set<StatutRendezVousEntity>();
    public DbSet<DisponibiliteEntity> Disponibilites => Set<DisponibiliteEntity>();
    public DbSet<StatutDisponibiliteEntity> StatutsDisponibilite => Set<StatutDisponibiliteEntity>();
    public DbSet<AbonnementEntity> Abonnements => Set<AbonnementEntity>();
    public DbSet<SouscriptionEntity> Souscriptions => Set<SouscriptionEntity>();
    public DbSet<StatutSouscriptionEntity> StatutsSouscription => Set<StatutSouscriptionEntity>();
    public DbSet<ProvinceEntity> Provinces => Set<ProvinceEntity>();
    public DbSet<TypeChauffageEntity> TypesChauffage => Set<TypeChauffageEntity>();
    public DbSet<TypeConfigurationEntity> TypesConfiguration => Set<TypeConfigurationEntity>();
    public DbSet<InformationAnnexeEntity> InformationsAnnexes => Set<InformationAnnexeEntity>();
    public DbSet<SpecificationEntity> Specifications => Set<SpecificationEntity>();
    public DbSet<EmoticonEntity> Emoticons => Set<EmoticonEntity>();
    public DbSet<FaqEntity> Faqs => Set<FaqEntity>();
    public DbSet<FavoriEntity> Favoris => Set<FavoriEntity>();
    public DbSet<AgenceAdministrateurEntity> AgencesAdministrateurs => Set<AgenceAdministrateurEntity>();
    public DbSet<AgenceSpecificationEntity> AgencesSpecifications => Set<AgenceSpecificationEntity>();
    public DbSet<BienInformationAnnexeEntity> BiensInformationsAnnexes => Set<BienInformationAnnexeEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); // Conserve les tables ASP.NET Core Identity
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
