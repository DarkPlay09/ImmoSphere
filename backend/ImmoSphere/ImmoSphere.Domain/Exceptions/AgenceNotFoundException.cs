namespace ImmoSphere.Domain.Exceptions;

public class AgenceNotFoundException : Exception
{
    public int AgenceId { get; }

    public AgenceNotFoundException(int agenceId)
        : base($"L'agence avec l'identifiant {agenceId} n'existe pas.")
    {
        AgenceId = agenceId;
    }
}
