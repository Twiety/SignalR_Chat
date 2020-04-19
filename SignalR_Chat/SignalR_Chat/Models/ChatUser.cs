using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Chat.Models
{
    public class ChatUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string ConnectionID { get; set; }

        public bool IsOverhead { get; set; }
    }
}
