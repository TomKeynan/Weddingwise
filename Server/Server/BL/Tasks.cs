namespace Server.BL
{
    public class Tasks
    {
        private int taskID;
        private string taskName;
        private string _email;
        private bool completed;
        private List<SubTask> subTasks;

        public int TaskID { get => taskID; set => taskID = value; }
        public string TaskName { get => taskName; set => taskName = value; }
        public string Email { get => _email; set => _email = value; }
        public bool Completed { get => completed; set => completed = value; }
        public List<SubTask> SubTasks { get => subTasks; set => subTasks = value; }

        //public int TaskId { get; set; }
        //public string CoupleEmail { get; set; }
        //public string Title { get; set; }
        //public bool Completed { get; set; }
        //public List<SubTask> SubTasks { get; set; }
    }
}
