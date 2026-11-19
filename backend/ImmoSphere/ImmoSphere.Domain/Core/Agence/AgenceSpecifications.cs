namespace ImmoSphere.Domain.Core.Agence;

/// <summary>Section « Spécifications de l'agence » du profil.</summary>
public class AgenceSpecifications
{
    public string Zone { get; set; } = string.Empty;
    public string TypesBiens { get; set; } = string.Empty;
    public string PolesTransaction { get; set; } = string.Empty;
    public IList<AgenceLangue> Langues { get; set; } = new List<AgenceLangue>();
}

public class AgenceLangue
{
    /// <summary>Code ISO : fr, nl, de ou en.</summary>
    public string Code { get; set; } = string.Empty;
    public bool Maternelle { get; set; }
}
