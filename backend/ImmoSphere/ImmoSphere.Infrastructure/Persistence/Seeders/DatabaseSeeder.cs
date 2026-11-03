using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ImmoSphere.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ImmoSphere.Infrastructure.Persistence.Seeders;

/// <summary>
/// Données de démonstration pour l'environnement Development uniquement.
/// Le schéma doit déjà être à jour (migrations appliquées).
/// N'insère aucun utilisateur ni mot de passe : l'authentification utilise Identity.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        await using var transaction = await db.Database.BeginTransactionAsync();

        // 1) Tables de référence. Ajout de chaque libellé manquant, même si
        // la table contient déjà des enregistrements d'une exécution précédente.
        await SeedLookupAsync(db.TypesBien, x => x.Libelle, s => new TypeBienEntity { Libelle = s },
            "Maison", "Appartement", "Studio", "Villa", "Terrain", "Commerce / Bureau");
        await SeedLookupAsync(db.TypesTransaction, x => x.Libelle, s => new TypeTransactionEntity { Libelle = s },
            "Vente", "Location", "Viager");
        await SeedLookupAsync(db.PebBiens, x => x.Libelle, s => new PebBienEntity { Libelle = s },
            "A++", "A+", "A", "B", "C", "D", "E", "F", "G");
        await SeedLookupAsync(db.Etats, x => x.Libelle, s => new EtatEntity { Libelle = s },
            "Neuf", "Bon état", "À rafraîchir", "À rénover");
        await SeedLookupAsync(db.EtatsVente, x => x.Libelle, s => new EtatVenteEntity { Libelle = s },
            "À vendre", "À louer", "Vendu", "Archivé");
        await SeedLookupAsync(db.StatutsRendezVous, x => x.Libelle, s => new StatutRendezVousEntity { Libelle = s },
            "Proposé", "Accepté", "Refusé", "Annulé");
        await SeedLookupAsync(db.StatutsDisponibilite, x => x.Libelle, s => new StatutDisponibiliteEntity { Libelle = s },
            "Créneau non réservé", "Créneau réservé");
        await SeedLookupAsync(db.StatutsSouscription, x => x.Libelle, s => new StatutSouscriptionEntity { Libelle = s },
            "Actif", "Expiré", "Annulé");
        await SeedLookupAsync(db.Provinces, x => x.Libelle, s => new ProvinceEntity { Libelle = s },
            "Liège", "Namur", "Hainaut", "Brabant wallon", "Luxembourg");
        await SeedLookupAsync(db.TypesChauffage, x => x.Libelle, s => new TypeChauffageEntity { Libelle = s },
            "Gaz", "Mazout", "Électrique", "Pompe à chaleur", "Bois / pellets");
        await SeedLookupAsync(db.TypesConfiguration, x => x.Libelle, s => new TypeConfigurationEntity { Libelle = s },
            "2 façades", "3 façades", "4 façades", "Autre configuration");
        await SeedLookupAsync(db.InformationsAnnexes, x => x.Libelle, s => new InformationAnnexeEntity { Libelle = s },
            "Prix négociable", "Frais à charge de l'acquéreur", "Revenu cadastral disponible", "Charges mensuelles");
        await db.SaveChangesAsync();

        // 2) Agences + FAQ + spécifications + abonnements (sans utilisateur fictif).
        var agencesDemo = new[]
        {
            new AgenceEntity
            {
                Nom = "Immo Meuse (démo)", Description = "Agence immobilière fictive de démonstration.",
                Localite = "Liège", Rue = "Rue des Guillemins", Numero = "24",
                CodePostal = "4000", Mail = "liege@example.test", NumeroTel = "000000000"
            },
            new AgenceEntity
            {
                Nom = "Habitat Mosan (démo)", Description = "Agence immobilière fictive de démonstration.",
                Localite = "Namur", Rue = "Rue de Fer", Numero = "18",
                CodePostal = "5000", Mail = "namur@example.test", NumeroTel = "000000000"
            },
            new AgenceEntity
            {
                Nom = "Clés & Quartiers (démo)", Description = "Agence immobilière fictive de démonstration.",
                Localite = "Mons", Rue = "Rue de Nimy", Numero = "31",
                CodePostal = "7000", Mail = "mons@example.test", NumeroTel = "000000000"
            }
        };
        foreach (var agence in agencesDemo)
            if (!await db.Agences.AnyAsync(x => x.Nom == agence.Nom)) db.Agences.Add(agence);

        var faqsDemo = new[]
        {
            new FaqEntity { Titre = "Comment rechercher un bien ?", Libelle = "Utilisez les filtres de localisation, prix et caractéristiques." },
            new FaqEntity { Titre = "Comment contacter une agence ?", Libelle = "Consultez la fiche de l'agence pour ses coordonnées." },
            new FaqEntity { Titre = "Comment publier un bien ?", Libelle = "Connectez-vous avec un compte autorisé et ouvrez l'espace de publication." }
        };
        foreach (var faq in faqsDemo)
            if (!await db.Faqs.AnyAsync(x => x.Titre == faq.Titre)) db.Faqs.Add(faq);

        var specsDemo = new[]
        {
            new SpecificationEntity { Titre = "Proximité des transports", Description = "Arrêt de transport en commun à proximité." },
            new SpecificationEntity { Titre = "Isolation renforcée", Description = "Isolation thermique améliorée." },
            new SpecificationEntity { Titre = "Espace extérieur", Description = "Jardin, balcon ou terrasse." }
        };
        foreach (var spec in specsDemo)
            if (!await db.Specifications.AnyAsync(x => x.Titre == spec.Titre)) db.Specifications.Add(spec);

        var abonnementsDemo = new[]
        {
            new AbonnementEntity { Nom = "Découverte (démo)", Prix = 0m, Duree = 30 },
            new AbonnementEntity { Nom = "Premium (démo)", Prix = 19.99m, Duree = 30 }
        };
        foreach (var abo in abonnementsDemo)
            if (!await db.Abonnements.AnyAsync(x => x.Nom == abo.Nom)) db.Abonnements.Add(abo);

        await db.SaveChangesAsync();

        // 3) Charger les références existantes et associer chaque bien.
        // Navigation plutôt qu'IDs codés en dur : fonctionne quelle que soit
        // la séquence des identifiants PostgreSQL.
        var typesBien = (await db.TypesBien.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var typesTransactions = (await db.TypesTransaction.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var pebs = (await db.PebBiens.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var etats = (await db.Etats.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var etatsVente = (await db.EtatsVente.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var provinces = (await db.Provinces.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var configurations = (await db.TypesConfiguration.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);
        var chauffages = (await db.TypesChauffage.ToListAsync()).ToDictionary(x => x.Libelle, StringComparer.OrdinalIgnoreCase);

        var biensDemo = new List<BienEntity>
        {
            new BienEntity
            {
                TypeBien = typesBien["Maison"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["C"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeConfiguration = configurations["2 façades"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Maison 3 chambres avec jardin à Liège (démo)",
                Description = "Maison familiale lumineuse, séjour ouvert, terrasse et jardin.",
                Rue = "Rue des Vennes", Numero = "42", CodePostal = "4020", Localite = "Liège",
                Prix = 289000m, SurfaceHab = 145m, SurfaceTerrain = 310m, SurfaceJard = 180m,
                SurfaceTerrasse = 22m, NbChambres = 3, NbSdb = 1, NbToilettes = 2,
                AnneeConstr = 1998, AGarage = true, AParking = true, AJardin = true,
                ATerrasse = true, ACave = true, EstVisible = true, EstBrouillon = false,
                EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Appartement"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["B"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Appartement 2 chambres à Liège-Centre (démo)",
                Description = "Appartement proche des commerces, balcon et ascenseur.",
                Rue = "Boulevard d'Avroy", Numero = "85", Boite = "12",
                CodePostal = "4000", Localite = "Liège",
                Prix = 219000m, SurfaceHab = 88m, Etage = 3, NbChambres = 2,
                NbSdb = 1, NbToilettes = 1, ABalcon = true, AAscenseur = true,
                EstVisible = true, EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Studio"],
                TypeTransaction = typesTransactions["Location"],
                PebBien = pebs["D"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À louer"],
                Province = provinces["Liège"],
                TypeChauffage = chauffages["Électrique"],

                Titre = "Studio à louer près de l'université (démo)",
                Description = "Studio meublable, idéal pour étudiant. Loyer mensuel hors charges.",
                Rue = "Rue Saint-Gilles", Numero = "114", Boite = "3",
                CodePostal = "4000", Localite = "Liège",
                Prix = 590m, SurfaceHab = 32m, Etage = 1, NbChambres = 0,
                NbSdb = 1, NbToilettes = 1, EstVisible = true, EstBrouillon = false,
                EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Villa"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["B"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeConfiguration = configurations["4 façades"],
                TypeChauffage = chauffages["Pompe à chaleur"],

                Titre = "Villa 4 façades à Spa (démo)",
                Description = "Villa spacieuse avec grand terrain, piscine et garage.",
                Rue = "Avenue Reine Astrid", Numero = "63", CodePostal = "4900", Localite = "Spa",
                Prix = 595000m, SurfaceHab = 245m, SurfaceTerrain = 1100m,
                SurfaceJard = 780m, SurfaceTerrasse = 65m, NbChambres = 4, NbSdb = 2,
                NbToilettes = 3, APiscine = true, AGarage = true, AParking = true,
                AJardin = true, ATerrasse = true, ACheminee = true,
                EstVisible = true, EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Appartement"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["C"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Namur"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Duplex 3 chambres à Namur (démo)",
                Description = "Duplex rénové à proximité du centre, terrasse ensoleillée.",
                Rue = "Rue de Bruxelles", Numero = "56", Boite = "2",
                CodePostal = "5000", Localite = "Namur", Prix = 325000m,
                SurfaceHab = 132m, SurfaceTerrasse = 20m, Etage = 2, NbChambres = 3,
                NbSdb = 2, NbToilettes = 2, ATerrasse = true, ACave = true,
                EstVisible = true, EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Maison"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["E"],
                Etat = etats["À rafraîchir"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeConfiguration = configurations["2 façades"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Maison mitoyenne à Seraing (démo)",
                Description = "Maison à rafraîchir avec cour et deux chambres.",
                Rue = "Rue du Pairay", Numero = "72", CodePostal = "4100", Localite = "Seraing",
                Prix = 169000m, SurfaceHab = 105m, SurfaceTerrain = 140m,
                NbChambres = 2, NbSdb = 1, NbToilettes = 1, ACave = true,
                EstVisible = true, EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Appartement"],
                TypeTransaction = typesTransactions["Location"],
                PebBien = pebs["C"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À louer"],
                Province = provinces["Hainaut"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Appartement 1 chambre à louer à Mons (démo)",
                Description = "Appartement fonctionnel à louer, loyer mensuel hors charges.",
                Rue = "Rue de la Coupe", Numero = "28", Boite = "4",
                CodePostal = "7000", Localite = "Mons", Prix = 720m,
                SurfaceHab = 58m, Etage = 2, NbChambres = 1, NbSdb = 1,
                NbToilettes = 1, EstVisible = true, EstBrouillon = false,
                EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Terrain"],
                TypeTransaction = typesTransactions["Vente"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],

                Titre = "Terrain à bâtir à Waremme (démo)",
                Description = "Terrain constructible à proximité des commodités ; surface de terrain uniquement.",
                Rue = "Rue de Huy", Numero = "19", CodePostal = "4300", Localite = "Waremme",
                Prix = 99000m, SurfaceTerrain = 820m, EstVisible = true,
                EstBrouillon = false, EstAdresseConfidentielle = true
            },
            new BienEntity
            {
                TypeBien = typesBien["Maison"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["C"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Brabant wallon"],
                TypeConfiguration = configurations["3 façades"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Maison 4 chambres à Waterloo (démo)",
                Description = "Maison familiale quatre chambres avec jardin et garage.",
                Rue = "Chaussée de Bruxelles", Numero = "176",
                CodePostal = "1410", Localite = "Waterloo", Prix = 465000m,
                SurfaceHab = 185m, SurfaceTerrain = 470m, SurfaceJard = 280m,
                NbChambres = 4, NbSdb = 2, NbToilettes = 2, AGarage = true,
                AJardin = true, ATerrasse = true, EstVisible = true, EstBrouillon = false,
                EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Commerce / Bureau"],
                TypeTransaction = typesTransactions["Location"],
                PebBien = pebs["D"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À louer"],
                Province = provinces["Hainaut"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Commerce à louer à Charleroi (démo)",
                Description = "Surface commerciale en rez-de-chaussée. Loyer mensuel hors charges.",
                Rue = "Rue de la Montagne", Numero = "39",
                CodePostal = "6000", Localite = "Charleroi", Prix = 1150m,
                SurfaceHab = 96m, NbToilettes = 1, EstVisible = true,
                EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Maison"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["D"],
                Etat = etats["Bon état"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeConfiguration = configurations["3 façades"],
                TypeChauffage = chauffages["Mazout"],

                Titre = "Maison de campagne à Huy (démo)",
                Description = "Maison avec grand jardin, cave et dépendances.",
                Rue = "Rue du Marché", Numero = "17", CodePostal = "4500", Localite = "Huy",
                Prix = 249000m, SurfaceHab = 155m, SurfaceTerrain = 640m,
                SurfaceJard = 420m, NbChambres = 3, NbSdb = 1, NbToilettes = 2,
                AJardin = true, ACave = true, AGrenier = true, AParking = true,
                EstVisible = true, EstBrouillon = false, EstAdresseConfidentielle = false
            },
            new BienEntity
            {
                TypeBien = typesBien["Appartement"],
                TypeTransaction = typesTransactions["Vente"],
                PebBien = pebs["D"],
                Etat = etats["À rénover"],
                EtatVente = etatsVente["À vendre"],
                Province = provinces["Liège"],
                TypeChauffage = chauffages["Gaz"],

                Titre = "Appartement en brouillon à Verviers (démo)",
                Description = "Annonce non publiée pour tester la visibilité et les brouillons.",
                Rue = "Rue du Collège", Numero = "8", Boite = "1",
                CodePostal = "4800", Localite = "Verviers", Prix = 139000m,
                SurfaceHab = 66m, NbChambres = 2, NbSdb = 1, NbToilettes = 1,
                EstVisible = false, EstBrouillon = true, EstAdresseConfidentielle = false
            }
        };

        foreach (var bien in biensDemo)
        {
            var existant = await db.Biens.FirstOrDefaultAsync(x => x.Titre == bien.Titre);
            if (existant is null)
            {
                db.Biens.Add(bien);
            }
            else
            {
                // Complète aussi les anciennes données démo qui auraient
                // été enregistrées avant l'ajout des relations EF Core.
                existant.TypeBien ??= bien.TypeBien;
                existant.TypeTransaction ??= bien.TypeTransaction;
                existant.PebBien ??= bien.PebBien;
                existant.Etat ??= bien.Etat;
                existant.EtatVente ??= bien.EtatVente;
                existant.Province ??= bien.Province;
                existant.TypeConfiguration ??= bien.TypeConfiguration;
                existant.TypeChauffage ??= bien.TypeChauffage;
            }
        }
        await db.SaveChangesAsync();

        // 4) Relations N-N ne dépendant pas d'un compte utilisateur.
        var agenceLiege = await db.Agences.SingleAsync(x => x.Nom == "Immo Meuse (démo)");
        var agenceNamur = await db.Agences.SingleAsync(x => x.Nom == "Habitat Mosan (démo)");
        var specTransport = await db.Specifications.SingleAsync(x => x.Titre == "Proximité des transports");
        var specIsolation = await db.Specifications.SingleAsync(x => x.Titre == "Isolation renforcée");
        var specExterieur = await db.Specifications.SingleAsync(x => x.Titre == "Espace extérieur");
        await AddAgenceSpecIfMissing(db, agenceLiege.Id, specTransport.Id);
        await AddAgenceSpecIfMissing(db, agenceLiege.Id, specIsolation.Id);
        await AddAgenceSpecIfMissing(db, agenceNamur.Id, specExterieur.Id);

        var maisonLiege = await db.Biens.SingleAsync(x => x.Titre == "Maison 3 chambres avec jardin à Liège (démo)");
        var studioLiege = await db.Biens.SingleAsync(x => x.Titre == "Studio à louer près de l'université (démo)");
        var infoNegociable = await db.InformationsAnnexes.SingleAsync(x => x.Libelle == "Prix négociable");
        var infoCharges = await db.InformationsAnnexes.SingleAsync(x => x.Libelle == "Charges mensuelles");
        await AddBienInfoIfMissing(db, maisonLiege.Id, infoNegociable.Id);
        await AddBienInfoIfMissing(db, studioLiege.Id, infoCharges.Id);

        // 5) Quelques créneaux de visite. Insérés uniquement si aucun
        // créneau n'existe, pour ne pas créer de doublons à chaque démarrage.
        if (!await db.Disponibilites.AnyAsync())
        {
            var libre = await db.StatutsDisponibilite.SingleAsync(x => x.Libelle == "Créneau non réservé");
            var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));
            db.Disponibilites.AddRange(
                new DisponibiliteEntity { Bien = maisonLiege, StatutDisponibilite = libre, Date = date, Heure = new TimeOnly(10, 0) },
                new DisponibiliteEntity { Bien = maisonLiege, StatutDisponibilite = libre, Date = date, Heure = new TimeOnly(14, 0) },
                new DisponibiliteEntity { Bien = studioLiege, StatutDisponibilite = libre, Date = date.AddDays(1), Heure = new TimeOnly(15, 0) }
            );
        }

        // Les tables dépendant d'un compte utilisateur (favoris, avis,
        // souscriptions, RDV, agences administrées) ne sont PAS remplies ici.
        // Idem pour les images, conformément à la demande.
        await db.SaveChangesAsync();
        await transaction.CommitAsync();
    }

    private static async Task SeedLookupAsync<TEntity>(
        DbSet<TEntity> set,
        Func<TEntity, string> getLabel,
        Func<string, TEntity> create,
        params string[] labels) where TEntity : class
    {
        var dejaPresents = (await set.ToListAsync())
            .Select(getLabel)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var label in labels)
            if (dejaPresents.Add(label)) set.Add(create(label));
    }

    private static async Task AddAgenceSpecIfMissing(ApplicationDbContext db, int agenceId, int specId)
    {
        if (!await db.AgencesSpecifications.AnyAsync(x => x.AgenceId == agenceId && x.SpecificationId == specId))
            db.AgencesSpecifications.Add(new AgenceSpecificationEntity { AgenceId = agenceId, SpecificationId = specId });
    }

    private static async Task AddBienInfoIfMissing(ApplicationDbContext db, int bienId, int infoId)
    {
        if (!await db.BiensInformationsAnnexes.AnyAsync(x => x.BienId == bienId && x.InformationAnnexeId == infoId))
            db.BiensInformationsAnnexes.Add(new BienInformationAnnexeEntity { BienId = bienId, InformationAnnexeId = infoId });
    }
}
