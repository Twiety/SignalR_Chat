using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Chat.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(string message);
        Task ReceiveMessage(string user, string message);
        Task ReceiveMessage(string group, string user, string message);
    }
}
