using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("individual_persons")]
public class IndividualPerson
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    // User Reference

    [Required]
    [Column("user_id")]
    public Guid UserId { get; private set; }

    [ForeignKey(nameof(UserId))]
    public User? User { get; private set; }

    // Properties

    [Required]
    [Column("name")]
    public string? Name { get; private set; }

    [Required]
    [StringLength(11)]
    [Column("cpf", TypeName = "char(11)")]
    public string? CPF { get; private set; }

    [Required]
    [StringLength(9)]
    [Column("rg", TypeName = "char(9)")]
    public string? RG { get; private set; }

    [Required]
    [Column("birth_date")]
    public DateOnly BirthDate { get; private set; }

    protected IndividualPerson()
    {
    }

    public IndividualPerson(Guid userId, string name, string cpf, string rg, DateOnly birthDate)
    {
        Id = Guid.NewGuid();

        UserId = userId;
        Name = name;
        CPF = cpf;
        RG = rg;
        BirthDate = birthDate;
    }
}
