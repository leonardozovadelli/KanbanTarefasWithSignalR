using Microsoft.AspNetCore.SignalR;

namespace ListaTarefaKanban_API.Hubs
{
    public class KanbanAPI
    {
        private IHubContext<KanbanHub, ITypedHubClient> _hubContext;

        public KanbanAPI(IHubContext<KanbanHub, ITypedHubClient> hubContext)
        {
            _hubContext = hubContext;
        }
    }
}