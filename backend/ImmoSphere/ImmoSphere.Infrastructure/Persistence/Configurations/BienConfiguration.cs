using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ImmoSphere.Infrastructure.Persistence.Configurations;

public class BienConfiguration : IEntityTypeConfiguration<BienEntity>
{
    public void Configure(EntityTypeBuilder<BienEntity> builder)
    {
        builder.ToTable("bien");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id_bien").ValueGeneratedOnAdd();
        builder.Property(e => e.Titre).HasColumnName("titre").IsRequired();
        builder.Property(e => e.Description).HasColumnName("description");
        builder.Property(e => e.Rue).HasColumnName("rue");
        builder.Property(e => e.Numero).HasColumnName("numero");
        builder.Property(e => e.CodePostal).HasColumnName("code_postal");
        builder.Property(e => e.Localite).HasColumnName("localite");
        builder.Property(e => e.Vue360).HasColumnName("vue_360");
        builder.Property(e => e.AnneeConstr).HasColumnName("annee_constr");
        builder.Property(e => e.ConsEnergie).HasColumnName("cons_energie").HasPrecision(18, 2);
        builder.Property(e => e.NumPeb).HasColumnName("num_peb");
        builder.Property(e => e.CheminPeb).HasColumnName("chemin_peb");
        builder.Property(e => e.Prix).HasColumnName("prix").HasPrecision(18, 2);
        builder.Property(e => e.Etage).HasColumnName("etage");
        builder.Property(e => e.Boite).HasColumnName("boite");
        builder.Property(e => e.SurfaceHab).HasColumnName("surface_hab").HasPrecision(18, 2);
        builder.Property(e => e.SurfaceJard).HasColumnName("surface_jard").HasPrecision(18, 2);
        builder.Property(e => e.SurfaceTerrain).HasColumnName("surface_terrain").HasPrecision(18, 2);
        builder.Property(e => e.SurfaceTerrasse).HasColumnName("surface_terrasse").HasPrecision(18, 2);
        builder.Property(e => e.NbChambres).HasColumnName("nb_chambres");
        builder.Property(e => e.NbSdb).HasColumnName("nb_sdb");
        builder.Property(e => e.NbToilettes).HasColumnName("nb_toilettes");
        builder.Property(e => e.NbEtage).HasColumnName("nb_etage");
        builder.Property(e => e.AGarage).HasColumnName("a_garage");
        builder.Property(e => e.AParking).HasColumnName("a_parking");
        builder.Property(e => e.AJardin).HasColumnName("a_jardin");
        builder.Property(e => e.ATerrasse).HasColumnName("a_terrasse");
        builder.Property(e => e.ABalcon).HasColumnName("a_balcon");
        builder.Property(e => e.ACave).HasColumnName("a_cave");
        builder.Property(e => e.AGrenier).HasColumnName("a_grenier");
        builder.Property(e => e.AAscenseur).HasColumnName("a_ascenseur");
        builder.Property(e => e.APiscine).HasColumnName("a_piscine");
        builder.Property(e => e.ACheminee).HasColumnName("a_cheminee");
        builder.Property(e => e.EstVisible).HasColumnName("est_visible");
        builder.Property(e => e.EstBrouillon).HasColumnName("est_brouillon");
        builder.Property(e => e.EstAdresseConfidentielle).HasColumnName("est_adresse_confidentielle");

        // Associations et clés étrangères
        builder.Property(e => e.TypeBienId).HasColumnName("id_type");
        builder.HasOne(e => e.TypeBien)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.TypeBienId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.PebBienId).HasColumnName("id_peb");
        builder.HasOne(e => e.PebBien)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.PebBienId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.TypeTransactionId).HasColumnName("id_transaction");
        builder.HasOne(e => e.TypeTransaction)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.TypeTransactionId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.EtatId).HasColumnName("id_etat");
        builder.HasOne(e => e.Etat)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.EtatId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.EtatVenteId).HasColumnName("id_etat_vente");
        builder.HasOne(e => e.EtatVente)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.EtatVenteId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.TypeConfigurationId).HasColumnName("id_configuration");
        builder.HasOne(e => e.TypeConfiguration)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.TypeConfigurationId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.ProvinceId).HasColumnName("id_province");
        builder.HasOne(e => e.Province)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.TypeChauffageId).HasColumnName("id_chauffage");
        builder.HasOne(e => e.TypeChauffage)
            .WithMany(e => e.Biens)
            .HasForeignKey(e => e.TypeChauffageId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.PublieParId).HasColumnName("id_utilisateur_publication");
        builder.HasOne(e => e.PubliePar)
            .WithMany(e => e.BiensPublies)
            .HasForeignKey(e => e.PublieParId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
