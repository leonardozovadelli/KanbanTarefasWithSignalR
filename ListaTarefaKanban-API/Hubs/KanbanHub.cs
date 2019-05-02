using ListaTarefaKanban_Repository;
using Microsoft.AspNetCore.SignalR;

namespace ListaTarefaKanban_API.Hubs
{
    public class KanbanHub : Hub<ITypedHubClient>
    {
        public readonly IListaTarefaKanbanRepository _repo;
        public KanbanHub(IListaTarefaKanbanRepository repository)
        {
            _repo = repository;
        }
        
        public async void getEnviar(){
            var tarefa = await _repo.GetTarefaStatusAsync();
            await Clients.All.Geral(tarefa);
        }

        // public async void mudarStatus(){
        //     var tarefa = await _repo.Get();
        // }

    }
}