namespace Server.BL
{
    public class SubTask
    {
        public int? subTaskId;
        public int taskId;
        public string subTaskName;

        public int? SubTaskId { get => subTaskId; set => subTaskId = value; }
        public int TaskId { get => taskId; set => taskId = value; }
        public string SubTaskName { get => subTaskName; set => subTaskName = value; }
    }
}
