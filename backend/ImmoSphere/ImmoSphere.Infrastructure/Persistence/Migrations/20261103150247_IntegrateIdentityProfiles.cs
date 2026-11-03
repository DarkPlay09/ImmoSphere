using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ImmoSphere.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class IntegrateIdentityProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "abonnement",
                columns: table => new
                {
                    id_abonnement = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "text", nullable: false),
                    prix = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    duree = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_abonnement", x => x.id_abonnement);
                });

            migrationBuilder.CreateTable(
                name: "agence",
                columns: table => new
                {
                    id_agence = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    logo = table.Column<string>(type: "text", nullable: true),
                    img_background = table.Column<string>(type: "text", nullable: true),
                    localite = table.Column<string>(type: "text", nullable: true),
                    rue = table.Column<string>(type: "text", nullable: true),
                    numero = table.Column<string>(type: "text", nullable: true),
                    code_postal = table.Column<string>(type: "text", nullable: true),
                    numero_tel = table.Column<string>(type: "text", nullable: true),
                    mail = table.Column<string>(type: "text", nullable: true),
                    lien_plateforme = table.Column<string>(type: "text", nullable: true),
                    bce = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agence", x => x.id_agence);
                });

            migrationBuilder.CreateTable(
                name: "emoticon",
                columns: table => new
                {
                    id_emoticon = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    chemin = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_emoticon", x => x.id_emoticon);
                });

            migrationBuilder.CreateTable(
                name: "etat",
                columns: table => new
                {
                    id_etat = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_etat", x => x.id_etat);
                });

            migrationBuilder.CreateTable(
                name: "etat_vente",
                columns: table => new
                {
                    id_etat = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_etat_vente", x => x.id_etat);
                });

            migrationBuilder.CreateTable(
                name: "informations_annexes",
                columns: table => new
                {
                    id_information = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_informations_annexes", x => x.id_information);
                });

            migrationBuilder.CreateTable(
                name: "peb_bien",
                columns: table => new
                {
                    id_peb = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_peb_bien", x => x.id_peb);
                });

            migrationBuilder.CreateTable(
                name: "province",
                columns: table => new
                {
                    id_province = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_province", x => x.id_province);
                });

            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    id_role = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.id_role);
                });

            migrationBuilder.CreateTable(
                name: "statut",
                columns: table => new
                {
                    id_statut = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statut", x => x.id_statut);
                });

            migrationBuilder.CreateTable(
                name: "statut_dispo",
                columns: table => new
                {
                    id_statut = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statut_dispo", x => x.id_statut);
                });

            migrationBuilder.CreateTable(
                name: "statut2",
                columns: table => new
                {
                    id_statut = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_statut2", x => x.id_statut);
                });

            migrationBuilder.CreateTable(
                name: "type_bien",
                columns: table => new
                {
                    id_type = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_bien", x => x.id_type);
                });

            migrationBuilder.CreateTable(
                name: "type_chauffage",
                columns: table => new
                {
                    id_chauffage = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_chauffage", x => x.id_chauffage);
                });

            migrationBuilder.CreateTable(
                name: "type_configuration",
                columns: table => new
                {
                    id_configuration = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_configuration", x => x.id_configuration);
                });

            migrationBuilder.CreateTable(
                name: "type_transaction",
                columns: table => new
                {
                    id_transaction = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_type_transaction", x => x.id_transaction);
                });

            migrationBuilder.CreateTable(
                name: "specifications",
                columns: table => new
                {
                    id_specification = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titre = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    emoticon = table.Column<string>(type: "text", nullable: true),
                    id_emoticon = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_specifications", x => x.id_specification);
                    table.ForeignKey(
                        name: "FK_specifications_emoticon_id_emoticon",
                        column: x => x.id_emoticon,
                        principalTable: "emoticon",
                        principalColumn: "id_emoticon",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "utilisateur",
                columns: table => new
                {
                    id_utilisateur = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "text", nullable: false),
                    prenom = table.Column<string>(type: "text", nullable: false),
                    identity_user_id = table.Column<string>(type: "character varying(450)", maxLength: 450, nullable: false),
                    telephone = table.Column<string>(type: "text", nullable: true),
                    photo_profil = table.Column<string>(type: "text", nullable: true),
                    id_agence = table.Column<int>(type: "integer", nullable: true),
                    RoleEntityId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_utilisateur", x => x.id_utilisateur);
                    table.ForeignKey(
                        name: "FK_utilisateur_AspNetUsers_identity_user_id",
                        column: x => x.identity_user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_utilisateur_agence_id_agence",
                        column: x => x.id_agence,
                        principalTable: "agence",
                        principalColumn: "id_agence",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_utilisateur_role_RoleEntityId",
                        column: x => x.RoleEntityId,
                        principalTable: "role",
                        principalColumn: "id_role");
                });

            migrationBuilder.CreateTable(
                name: "agence_specification",
                columns: table => new
                {
                    id_agence = table.Column<int>(type: "integer", nullable: false),
                    id_specification = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agence_specification", x => new { x.id_agence, x.id_specification });
                    table.ForeignKey(
                        name: "FK_agence_specification_agence_id_agence",
                        column: x => x.id_agence,
                        principalTable: "agence",
                        principalColumn: "id_agence",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_agence_specification_specifications_id_specification",
                        column: x => x.id_specification,
                        principalTable: "specifications",
                        principalColumn: "id_specification",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "agence_administrateur",
                columns: table => new
                {
                    id_agence = table.Column<int>(type: "integer", nullable: false),
                    id_utilisateur = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_agence_administrateur", x => new { x.id_agence, x.id_utilisateur });
                    table.ForeignKey(
                        name: "FK_agence_administrateur_agence_id_agence",
                        column: x => x.id_agence,
                        principalTable: "agence",
                        principalColumn: "id_agence",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_agence_administrateur_utilisateur_id_utilisateur",
                        column: x => x.id_utilisateur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "avis",
                columns: table => new
                {
                    id_avis = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    libelle = table.Column<string>(type: "text", nullable: true),
                    nb_etoiles = table.Column<int>(type: "integer", nullable: true),
                    id_utilisateur_auteur = table.Column<int>(type: "integer", nullable: true),
                    id_utilisateur_evalue = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_avis", x => x.id_avis);
                    table.ForeignKey(
                        name: "FK_avis_utilisateur_id_utilisateur_auteur",
                        column: x => x.id_utilisateur_auteur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_avis_utilisateur_id_utilisateur_evalue",
                        column: x => x.id_utilisateur_evalue,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bien",
                columns: table => new
                {
                    id_bien = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titre = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    rue = table.Column<string>(type: "text", nullable: true),
                    numero = table.Column<string>(type: "text", nullable: true),
                    code_postal = table.Column<string>(type: "text", nullable: true),
                    localite = table.Column<string>(type: "text", nullable: true),
                    vue_360 = table.Column<string>(type: "text", nullable: true),
                    annee_constr = table.Column<int>(type: "integer", nullable: true),
                    cons_energie = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    num_peb = table.Column<string>(type: "text", nullable: true),
                    chemin_peb = table.Column<string>(type: "text", nullable: true),
                    prix = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    etage = table.Column<int>(type: "integer", nullable: true),
                    boite = table.Column<string>(type: "text", nullable: true),
                    surface_hab = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    surface_jard = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    surface_terrain = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    surface_terrasse = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    nb_chambres = table.Column<int>(type: "integer", nullable: true),
                    nb_sdb = table.Column<int>(type: "integer", nullable: true),
                    nb_toilettes = table.Column<int>(type: "integer", nullable: true),
                    nb_etage = table.Column<int>(type: "integer", nullable: true),
                    a_garage = table.Column<bool>(type: "boolean", nullable: true),
                    a_parking = table.Column<bool>(type: "boolean", nullable: true),
                    a_jardin = table.Column<bool>(type: "boolean", nullable: true),
                    a_terrasse = table.Column<bool>(type: "boolean", nullable: true),
                    a_balcon = table.Column<bool>(type: "boolean", nullable: true),
                    a_cave = table.Column<bool>(type: "boolean", nullable: true),
                    a_grenier = table.Column<bool>(type: "boolean", nullable: true),
                    a_ascenseur = table.Column<bool>(type: "boolean", nullable: true),
                    a_piscine = table.Column<bool>(type: "boolean", nullable: true),
                    a_cheminee = table.Column<bool>(type: "boolean", nullable: true),
                    est_visible = table.Column<bool>(type: "boolean", nullable: true),
                    est_brouillon = table.Column<bool>(type: "boolean", nullable: true),
                    est_adresse_confidentielle = table.Column<bool>(type: "boolean", nullable: true),
                    id_type = table.Column<int>(type: "integer", nullable: true),
                    id_peb = table.Column<int>(type: "integer", nullable: true),
                    id_transaction = table.Column<int>(type: "integer", nullable: true),
                    id_etat = table.Column<int>(type: "integer", nullable: true),
                    id_etat_vente = table.Column<int>(type: "integer", nullable: true),
                    id_configuration = table.Column<int>(type: "integer", nullable: true),
                    id_province = table.Column<int>(type: "integer", nullable: true),
                    id_chauffage = table.Column<int>(type: "integer", nullable: true),
                    id_utilisateur_publication = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bien", x => x.id_bien);
                    table.ForeignKey(
                        name: "FK_bien_etat_id_etat",
                        column: x => x.id_etat,
                        principalTable: "etat",
                        principalColumn: "id_etat",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_etat_vente_id_etat_vente",
                        column: x => x.id_etat_vente,
                        principalTable: "etat_vente",
                        principalColumn: "id_etat",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_peb_bien_id_peb",
                        column: x => x.id_peb,
                        principalTable: "peb_bien",
                        principalColumn: "id_peb",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_province_id_province",
                        column: x => x.id_province,
                        principalTable: "province",
                        principalColumn: "id_province",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_type_bien_id_type",
                        column: x => x.id_type,
                        principalTable: "type_bien",
                        principalColumn: "id_type",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_type_chauffage_id_chauffage",
                        column: x => x.id_chauffage,
                        principalTable: "type_chauffage",
                        principalColumn: "id_chauffage",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_type_configuration_id_configuration",
                        column: x => x.id_configuration,
                        principalTable: "type_configuration",
                        principalColumn: "id_configuration",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_type_transaction_id_transaction",
                        column: x => x.id_transaction,
                        principalTable: "type_transaction",
                        principalColumn: "id_transaction",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_bien_utilisateur_id_utilisateur_publication",
                        column: x => x.id_utilisateur_publication,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "demande_creation_agence",
                columns: table => new
                {
                    id_creation = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    nom = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    id_utilisateur = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_demande_creation_agence", x => x.id_creation);
                    table.ForeignKey(
                        name: "FK_demande_creation_agence_utilisateur_id_utilisateur",
                        column: x => x.id_utilisateur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "faq",
                columns: table => new
                {
                    id_faq = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    titre = table.Column<string>(type: "text", nullable: false),
                    libelle = table.Column<string>(type: "text", nullable: true),
                    id_utilisateur = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_faq", x => x.id_faq);
                    table.ForeignKey(
                        name: "FK_faq_utilisateur_id_utilisateur",
                        column: x => x.id_utilisateur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "souscription",
                columns: table => new
                {
                    id_souscription = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date_debut = table.Column<DateOnly>(type: "date", nullable: true),
                    date_fin = table.Column<DateOnly>(type: "date", nullable: true),
                    id_utilisateur = table.Column<int>(type: "integer", nullable: true),
                    id_abonnement = table.Column<int>(type: "integer", nullable: true),
                    id_statut = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_souscription", x => x.id_souscription);
                    table.ForeignKey(
                        name: "FK_souscription_abonnement_id_abonnement",
                        column: x => x.id_abonnement,
                        principalTable: "abonnement",
                        principalColumn: "id_abonnement",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_souscription_statut2_id_statut",
                        column: x => x.id_statut,
                        principalTable: "statut2",
                        principalColumn: "id_statut",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_souscription_utilisateur_id_utilisateur",
                        column: x => x.id_utilisateur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "bien_information_annexe",
                columns: table => new
                {
                    id_bien = table.Column<int>(type: "integer", nullable: false),
                    id_information = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bien_information_annexe", x => new { x.id_bien, x.id_information });
                    table.ForeignKey(
                        name: "FK_bien_information_annexe_bien_id_bien",
                        column: x => x.id_bien,
                        principalTable: "bien",
                        principalColumn: "id_bien",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_bien_information_annexe_informations_annexes_id_information",
                        column: x => x.id_information,
                        principalTable: "informations_annexes",
                        principalColumn: "id_information",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "disponibilite",
                columns: table => new
                {
                    id_disponibilite = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    heure = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    id_bien = table.Column<int>(type: "integer", nullable: true),
                    id_statut = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_disponibilite", x => x.id_disponibilite);
                    table.ForeignKey(
                        name: "FK_disponibilite_bien_id_bien",
                        column: x => x.id_bien,
                        principalTable: "bien",
                        principalColumn: "id_bien",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_disponibilite_statut_dispo_id_statut",
                        column: x => x.id_statut,
                        principalTable: "statut_dispo",
                        principalColumn: "id_statut",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "favori",
                columns: table => new
                {
                    id_utilisateur = table.Column<int>(type: "integer", nullable: false),
                    id_bien = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favori", x => new { x.id_utilisateur, x.id_bien });
                    table.ForeignKey(
                        name: "FK_favori_bien_id_bien",
                        column: x => x.id_bien,
                        principalTable: "bien",
                        principalColumn: "id_bien",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_favori_utilisateur_id_utilisateur",
                        column: x => x.id_utilisateur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "image",
                columns: table => new
                {
                    id_image = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    chemin = table.Column<string>(type: "text", nullable: false),
                    id_bien = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_image", x => x.id_image);
                    table.ForeignKey(
                        name: "FK_image_bien_id_bien",
                        column: x => x.id_bien,
                        principalTable: "bien",
                        principalColumn: "id_bien",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "rendez_vous",
                columns: table => new
                {
                    id_rdv = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    date_heure = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    id_bien = table.Column<int>(type: "integer", nullable: true),
                    id_utilisateur_proposeur = table.Column<int>(type: "integer", nullable: true),
                    id_statut = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rendez_vous", x => x.id_rdv);
                    table.ForeignKey(
                        name: "FK_rendez_vous_bien_id_bien",
                        column: x => x.id_bien,
                        principalTable: "bien",
                        principalColumn: "id_bien",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_rendez_vous_statut_id_statut",
                        column: x => x.id_statut,
                        principalTable: "statut",
                        principalColumn: "id_statut",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_rendez_vous_utilisateur_id_utilisateur_proposeur",
                        column: x => x.id_utilisateur_proposeur,
                        principalTable: "utilisateur",
                        principalColumn: "id_utilisateur",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_agence_administrateur_id_utilisateur",
                table: "agence_administrateur",
                column: "id_utilisateur");

            migrationBuilder.CreateIndex(
                name: "IX_agence_specification_id_specification",
                table: "agence_specification",
                column: "id_specification");

            migrationBuilder.CreateIndex(
                name: "IX_avis_id_utilisateur_auteur",
                table: "avis",
                column: "id_utilisateur_auteur");

            migrationBuilder.CreateIndex(
                name: "IX_avis_id_utilisateur_evalue",
                table: "avis",
                column: "id_utilisateur_evalue");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_chauffage",
                table: "bien",
                column: "id_chauffage");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_configuration",
                table: "bien",
                column: "id_configuration");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_etat",
                table: "bien",
                column: "id_etat");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_etat_vente",
                table: "bien",
                column: "id_etat_vente");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_peb",
                table: "bien",
                column: "id_peb");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_province",
                table: "bien",
                column: "id_province");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_transaction",
                table: "bien",
                column: "id_transaction");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_type",
                table: "bien",
                column: "id_type");

            migrationBuilder.CreateIndex(
                name: "IX_bien_id_utilisateur_publication",
                table: "bien",
                column: "id_utilisateur_publication");

            migrationBuilder.CreateIndex(
                name: "IX_bien_information_annexe_id_information",
                table: "bien_information_annexe",
                column: "id_information");

            migrationBuilder.CreateIndex(
                name: "IX_demande_creation_agence_id_utilisateur",
                table: "demande_creation_agence",
                column: "id_utilisateur");

            migrationBuilder.CreateIndex(
                name: "IX_disponibilite_id_bien",
                table: "disponibilite",
                column: "id_bien");

            migrationBuilder.CreateIndex(
                name: "IX_disponibilite_id_statut",
                table: "disponibilite",
                column: "id_statut");

            migrationBuilder.CreateIndex(
                name: "IX_faq_id_utilisateur",
                table: "faq",
                column: "id_utilisateur");

            migrationBuilder.CreateIndex(
                name: "IX_favori_id_bien",
                table: "favori",
                column: "id_bien");

            migrationBuilder.CreateIndex(
                name: "IX_image_id_bien",
                table: "image",
                column: "id_bien");

            migrationBuilder.CreateIndex(
                name: "IX_rendez_vous_id_bien",
                table: "rendez_vous",
                column: "id_bien");

            migrationBuilder.CreateIndex(
                name: "IX_rendez_vous_id_statut",
                table: "rendez_vous",
                column: "id_statut");

            migrationBuilder.CreateIndex(
                name: "IX_rendez_vous_id_utilisateur_proposeur",
                table: "rendez_vous",
                column: "id_utilisateur_proposeur");

            migrationBuilder.CreateIndex(
                name: "IX_souscription_id_abonnement",
                table: "souscription",
                column: "id_abonnement");

            migrationBuilder.CreateIndex(
                name: "IX_souscription_id_statut",
                table: "souscription",
                column: "id_statut");

            migrationBuilder.CreateIndex(
                name: "IX_souscription_id_utilisateur",
                table: "souscription",
                column: "id_utilisateur");

            migrationBuilder.CreateIndex(
                name: "IX_specifications_id_emoticon",
                table: "specifications",
                column: "id_emoticon");

            migrationBuilder.CreateIndex(
                name: "IX_utilisateur_id_agence",
                table: "utilisateur",
                column: "id_agence");

            migrationBuilder.CreateIndex(
                name: "IX_utilisateur_identity_user_id",
                table: "utilisateur",
                column: "identity_user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_utilisateur_RoleEntityId",
                table: "utilisateur",
                column: "RoleEntityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "agence_administrateur");

            migrationBuilder.DropTable(
                name: "agence_specification");

            migrationBuilder.DropTable(
                name: "avis");

            migrationBuilder.DropTable(
                name: "bien_information_annexe");

            migrationBuilder.DropTable(
                name: "demande_creation_agence");

            migrationBuilder.DropTable(
                name: "disponibilite");

            migrationBuilder.DropTable(
                name: "faq");

            migrationBuilder.DropTable(
                name: "favori");

            migrationBuilder.DropTable(
                name: "image");

            migrationBuilder.DropTable(
                name: "rendez_vous");

            migrationBuilder.DropTable(
                name: "souscription");

            migrationBuilder.DropTable(
                name: "specifications");

            migrationBuilder.DropTable(
                name: "informations_annexes");

            migrationBuilder.DropTable(
                name: "statut_dispo");

            migrationBuilder.DropTable(
                name: "bien");

            migrationBuilder.DropTable(
                name: "statut");

            migrationBuilder.DropTable(
                name: "abonnement");

            migrationBuilder.DropTable(
                name: "statut2");

            migrationBuilder.DropTable(
                name: "emoticon");

            migrationBuilder.DropTable(
                name: "etat");

            migrationBuilder.DropTable(
                name: "etat_vente");

            migrationBuilder.DropTable(
                name: "peb_bien");

            migrationBuilder.DropTable(
                name: "province");

            migrationBuilder.DropTable(
                name: "type_bien");

            migrationBuilder.DropTable(
                name: "type_chauffage");

            migrationBuilder.DropTable(
                name: "type_configuration");

            migrationBuilder.DropTable(
                name: "type_transaction");

            migrationBuilder.DropTable(
                name: "utilisateur");

            migrationBuilder.DropTable(
                name: "agence");

            migrationBuilder.DropTable(
                name: "role");
        }
    }
}
