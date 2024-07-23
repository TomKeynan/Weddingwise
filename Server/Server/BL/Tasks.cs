using Server.DAL;
using System.Collections.Generic;

namespace Server.BL
{
    public class Tasks
    {
        private int? _taskID;
        private string _taskName;
        private string _email;
        private bool _completed;
        private string? _notes;
        private List<SubTask>? _subTasks;

        public Tasks() { }

        public Tasks(string taskName, string email, bool completed)
        {
            _taskName = taskName;
            _email = email;
            _completed = completed;
        }

        public int? TaskID { get => _taskID; set => _taskID = value; }
        public string TaskName { get => _taskName; set => _taskName = value; }
        public string Email { get => _email; set => _email = value; }
        public string Notes { get => _notes; set => _notes = value; }
        public bool Completed { get => _completed; set => _completed = value; }
        public List<SubTask>? SubTasks { get => _subTasks; set => _subTasks = value; }

        public int InsertTask()
        {
            DBServicesTask dBServicesTask = new DBServicesTask();
            return dBServicesTask.InsertTask(this);
        }

        public static void insertCoupleInitialTasks(string email)
        {
            List<Tasks> tasksList = new List<Tasks>
            {
                new Tasks("יצירת רשימת מוזמנים", email, false),
                new Tasks("בחירת תאריך", email, true),
                new Tasks("פתיחת חשבון בנק משותף", email, false),
                new Tasks("בחירת ספקים", email, false),
                new Tasks("יצירת סידור הושבה", email, false),
                new Tasks("שליחת שמרו את התאריך", email, false),
                new Tasks("עיצוב הזמנות לחתונה", email, false),
                new Tasks("ניהול אישורי הגעה", email, false),
                new Tasks("מתן ביקורות ספקים", email, false)
            };

            foreach (Tasks task in tasksList)
            {
                task.InsertTask();
            }
        }
    }
}
