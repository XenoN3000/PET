using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) 
        : base(options)
    {
    }

    public DbSet<QcProtocol> QcProtocols => Set<QcProtocol>();
    public DbSet<PhantomSpec> PhantomSpecs => Set<PhantomSpec>();
    public DbSet<TestStep> TestSteps => Set<TestStep>();
    public DbSet<AcceptanceCriterion> AcceptanceCriteria => Set<AcceptanceCriterion>();
    public DbSet<Quiz> Quizzes => Set<Quiz>();
    public DbSet<QuizQuestion> QuizQuestions => Set<QuizQuestion>();
    public DbSet<QuizOption> QuizOptions => Set<QuizOption>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);

            entity.HasMany(e => e.Questions)
                .WithOne()
                .HasForeignKey(q => q.QuizId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuestionText).IsRequired().HasMaxLength(1000);

            entity.HasMany(e => e.Options)
                .WithOne()
                .HasForeignKey(o => o.QuizQuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuizOption>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OptionText).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ClinicalRationale).IsRequired().HasMaxLength(1000);
        });

        modelBuilder.Entity<QcProtocol>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Standard).HasMaxLength(100);

            entity.HasOne(e => e.Phantom)
                .WithOne()
                .HasForeignKey<PhantomSpec>(p => p.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Steps)
                .WithOne()
                .HasForeignKey(s => s.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.AcceptanceCriteria)
                .WithOne()
                .HasForeignKey(a => a.QcProtocolId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TestStep>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<AcceptanceCriterion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ParameterName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.ComparisonOperator).HasMaxLength(10);
            entity.Property(e => e.Unit).HasMaxLength(20);
        });
    }
}
