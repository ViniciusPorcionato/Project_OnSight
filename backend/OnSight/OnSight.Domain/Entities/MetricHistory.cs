using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnSight.Domain.Entities;

[Table("metric_histories")]
public class MetricHistory
{
    [Key]
    [Column("id")]
    public Guid Id { get; private set; }

    // Metric Category Reference

    [Required]
    [Column("metric_category_id")]
    public Guid MetricCategoryId { get; private set; }

    [ForeignKey(nameof(MetricCategoryId))]
    public MetricCategory? MetricCategory { get; private set; }

    // Properties

    [Required]
    [Column("value")]
    public decimal Value { get; private set; }

    [Required]
    [Column("percentual_delta")]
    public decimal PercentualDelta { get; private set; }

    [Required]
    [Column("metric_date_time")]
    public DateTime MetricDateTime { get; private set; }

    protected MetricHistory()
    {
    }

    public MetricHistory(Guid metricCategoryId, decimal value, decimal percentualDelta)
    {
        Id = Guid.NewGuid();

        MetricCategoryId = metricCategoryId;
        Value = value;

        MetricDateTime = DateTime.UtcNow;
    }
}
