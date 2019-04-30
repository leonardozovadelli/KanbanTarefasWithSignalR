using System.Threading.Tasks;

namespace ListaTarefaKanban_API.Hubs
{
    public interface ITypedHubClient
    {
         Task Geral(object obj);
    }
}