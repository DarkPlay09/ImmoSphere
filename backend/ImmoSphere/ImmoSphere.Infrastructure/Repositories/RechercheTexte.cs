using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace ImmoSphere.Infrastructure.Repositories;

/// <summary>
/// Recherche « contient » insensible à la casse et aux accents (« liege » trouve « Liège »),
/// traduite en SQL par <c>lower()</c> et <c>replace()</c> : l'extension <c>unaccent</c> de
/// PostgreSQL demanderait une migration.
/// </summary>
internal static class RechercheTexte
{
    // Caractères accentués courants en français, néerlandais et allemand (déjà en minuscules).
    private static readonly (string Accent, string Base)[] Accents =
    [
        ("à", "a"), ("á", "a"), ("â", "a"), ("ä", "a"), ("ã", "a"),
        ("é", "e"), ("è", "e"), ("ê", "e"), ("ë", "e"),
        ("í", "i"), ("ì", "i"), ("î", "i"), ("ï", "i"),
        ("ó", "o"), ("ò", "o"), ("ô", "o"), ("ö", "o"), ("õ", "o"),
        ("ú", "u"), ("ù", "u"), ("û", "u"), ("ü", "u"),
        ("ý", "y"), ("ÿ", "y"), ("ç", "c"), ("ñ", "n"),
        ("œ", "oe"), ("æ", "ae"), ("ß", "ss"),
    ];

    private static readonly MethodInfo ToLower =
        typeof(string).GetMethod(nameof(string.ToLower), Type.EmptyTypes)!;

    private static readonly MethodInfo Replace =
        typeof(string).GetMethod(nameof(string.Replace), [typeof(string), typeof(string)])!;

    private static readonly MethodInfo Contains =
        typeof(string).GetMethod(nameof(string.Contains), [typeof(string)])!;

    /// <summary>Normalisation côté C# du texte saisi : minuscules, sans accents, sans espaces aux bords.</summary>
    public static string Normaliser(string? valeur)
    {
        if (string.IsNullOrWhiteSpace(valeur))
        {
            return string.Empty;
        }

        var resultat = new StringBuilder(valeur.Length);
        foreach (char c in valeur.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD))
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
            {
                resultat.Append(c);
            }
        }

        string texte = resultat.ToString().Normalize(NormalizationForm.FormC);
        return texte.Replace("œ", "oe").Replace("æ", "ae").Replace("ß", "ss");
    }

    /// <summary>
    /// Construit <c>normaliser(champ).Contains(terme)</c> pour EF Core.
    /// <paramref name="terme"/> doit déjà être passé par <see cref="Normaliser"/>.
    /// </summary>
    public static Expression Contient(Expression champ, string terme)
    {
        Expression texte = Expression.Call(
            Expression.Coalesce(champ, Expression.Constant(string.Empty)),
            ToLower);

        foreach (var (accent, lettre) in Accents)
        {
            texte = Expression.Call(texte, Replace, Expression.Constant(accent), Expression.Constant(lettre));
        }

        return Expression.Call(texte, Contains, Parametre(terme));
    }

    /// <summary>Lit la valeur via un objet capturé pour qu'EF Core en fasse un paramètre SQL et non une constante.</summary>
    private static Expression Parametre(string valeur) =>
        Expression.Property(Expression.Constant(new Valeur(valeur)), nameof(Valeur.Texte));

    private sealed record Valeur(string Texte);
}
