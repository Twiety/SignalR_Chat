using Microsoft.AspNetCore.SignalR;
using SignalR_Chat.Data;
using SignalR_Chat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace SignalR_Chat.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        private readonly DataContext _datacontext;
        private static Dictionary<string, ChatUser> _users = new Dictionary<string, ChatUser>();

        public ChatHub(DataContext datacontext)
        {
            _datacontext = datacontext;
        }

        public async Task SendMessage(string user, string message)
        {
            message = "[" + _users.Count.ToString() + "]";

            await Clients.All.ReceiveMessage(user, message);
        }

        public Task SendMessageToCaller(string message)
        {
            return Clients.Caller.ReceiveMessage("self",message);
        }

        public Task SendMessageToGroup(string group, string user, string message)
        {
            return Clients.Group(group).ReceiveMessage(user, message);
        }

        
        public override async Task OnConnectedAsync()
        {
            string username = Context.User.Identity.Name;
            int userID = 0;
            bool isOverhead = false;

            if (username.IndexOf("\\") >= 0)
            {
                username = username.Substring(username.IndexOf("\\") + 1);
            }

            
            var userDb = _datacontext.Users.FirstOrDefault(u => u.UserName == username);

            
            if (userDb != null)
            {
                userID = userDb.Id;
                isOverhead = userDb.IsOverhead;
            }

            if (_users.ContainsKey(username))
            {
                username += System.DateTime.Now.Ticks.ToString();
            }

            ChatUser _user = new ChatUser()
            {
                UserName = username,
                ConnectionID = Context.ConnectionId
            };
            _users.Add(username, _user);

            // User einer Gruppe hinzufügen
            await Groups.AddToGroupAsync(Context.ConnectionId, "Test");


            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Test");
            await base.OnDisconnectedAsync(exception);
        }

        //public override Task OnConnectedAsync()
        //{
        //    return base.OnConnectedAsync();
        //}

    }
}
