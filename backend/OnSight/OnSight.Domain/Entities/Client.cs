using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("clients")]
public class Client
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
    [Column("trade_name")]
    public string? TradeName { get; private set; }

    [Required]
    [Column("company_name")]
    public string? CompanyName { get; private set; }

    [Required]
    [StringLength(14, MinimumLength = 14)]
    [Column("cnpj", TypeName = "char(14)")]
    public string? CNPJ { get; private set; }

    protected Client()
    {
    }

    public Client(Guid userId, string tradeName, string companyName, string cnpj)
    {
        Id = Guid.NewGuid();

        UserId = userId;
        TradeName = tradeName;
        CompanyName = companyName;
        CNPJ = cnpj;
    }
}
