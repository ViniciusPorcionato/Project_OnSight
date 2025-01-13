using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("addresses")]
public class Address
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    [Required]
    [StringLength(8, MinimumLength = 8)]
    [Column("cep", TypeName = "char(8)")]
    public string? CEP { get; private set; }

    [Required]
    [Column("number")]
    public string? Number { get; private set; }

    [Required]
    [Column("complement")]
    public string? Complement { get; private set; }

    [Required]
    [Column("latitude")]
    public decimal Latitude { get; private set; }
    
    [Required]
    [Column("longitude")]
    public decimal Longitude { get; private set; }

    protected Address()
    {
    }

    public Address(string cep, string number, string complement, decimal latitude, decimal longitude)
    {
        Id = Guid.NewGuid();

        CEP = cep;
        Number = number;
        Complement = complement;
        Latitude = latitude;
        Longitude = longitude;
    }
}
