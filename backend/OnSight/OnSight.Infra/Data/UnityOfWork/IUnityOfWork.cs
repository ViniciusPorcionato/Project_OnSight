namespace OnSight.Infra.Data.UnityOfWork;

public interface IUnityOfWork
{
    Task<bool> Commit();
    Task Rollback();
}
