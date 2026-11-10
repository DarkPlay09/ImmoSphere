using ImmoSphere.Domain.Core.Bien;
using ImmoSphere.Domain.Repository;
using ImmoSphere.Infrastructure.Mappers;
using ImmoSphere.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ImmoSphere.Infrastructure.Repositories;

public class BienRepository : IBienRepository
{
    private readonly ILogger<BienRepository> _logger;
    private readonly ApplicationDbContext _context;

    public BienRepository(
        ApplicationDbContext context,
        ILogger<BienRepository> logger)
    {
        _logger = logger;
        _context = context;
    }

    public Bien getBienById(int id)
    {
        var entity = _context.Biens
            .AsNoTracking()

            // Tables de référence
            .Include(b => b.TypeBien)
            .Include(b => b.PebBien)
            .Include(b => b.TypeTransaction)
            .Include(b => b.Etat)
            .Include(b => b.EtatVente)
            .Include(b => b.TypeConfiguration)
            .Include(b => b.Province)
            .Include(b => b.TypeChauffage)

            // Rendez-vous et leur statut
            .Include(b => b.RendezVous)
            .ThenInclude(r => r.StatutRendezVous)

            // Disponibilités et leur statut
            .Include(b => b.Disponibilites)
            .ThenInclude(d => d.StatutDisponibilite)

            // Informations annexes et leurs libellés
            .Include(b => b.InformationsAnnexes)
            .ThenInclude(i => i.InformationAnnexe)

            // Favoris
            .Include(b => b.Favoris)
            .AsSplitQuery()
            .FirstOrDefault(b => b.Id == id);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Le bien avec l'ID {id} n'existe pas.");
        }

        return BienMapper.BienToDomain(entity);
    }
}