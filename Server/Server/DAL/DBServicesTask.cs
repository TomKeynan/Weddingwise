using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Server.BL;

namespace Server.DAL
{
    public class DBServicesTask
    {
        private SqlConnection Connect()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }

        public int InsertTask(Tasks task)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPInsertTask", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@couple_email", task.Email);
                    cmd.Parameters.AddWithValue("@title", task.TaskName);
                    cmd.Parameters.AddWithValue("@completed", task.Completed);
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public int updateTask(Tasks task)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPUpdateTask", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@task_id", task.TaskID);
                    cmd.Parameters.AddWithValue("@couple_email", task.Email);
                    cmd.Parameters.AddWithValue("@title", task.TaskName);
                    cmd.Parameters.AddWithValue("@completed", task.Completed);
                    return cmd.ExecuteNonQuery();
                }
            }
        }

        public List<Tasks> GetTasks(string coupleEmail)
        {
            List<Tasks> tasks = new List<Tasks>();
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPGetTasks", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@couple_email", coupleEmail);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Tasks task = new Tasks
                            {
                                TaskID = Convert.ToInt32(reader["task_id"]),
                                Email = reader["couple_email"].ToString(),
                                TaskName = reader["title"].ToString(),
                                Completed = Convert.ToBoolean(reader["completed"]),
                                SubTasks = GetSubTasks(Convert.ToInt32(reader["task_id"]))
                            };
                            tasks.Add(task);
                        }
                    }
                }
            }
            return tasks;
        }
        public int UpdateTaskNotes(Tasks task)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPUpdateTaskNotes", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@task_id", task.TaskID); // Use TaskID
                    cmd.Parameters.AddWithValue("@notes", task.Notes);
                    return cmd.ExecuteNonQuery();
                }
            }
        }


        public List<SubTask> GetSubTasks(int taskId)
        {
            List<SubTask> subTasks = new List<SubTask>();
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPGetSubTasks", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@task_id", taskId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SubTask subTask = new SubTask
                            {
                                SubTaskId = Convert.ToInt32(reader["subtask_id"]),
                                TaskId = Convert.ToInt32(reader["task_id"]),
                                SubTaskName = reader["title"].ToString()
                            };
                            subTasks.Add(subTask);
                        }
                    }
                }
            }
            return subTasks;
        }

        public int InsertSubTask(SubTask subTask)
        {
            using (SqlConnection con = Connect())
            {
                using (SqlCommand cmd = new SqlCommand("SPInsertSubTask", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@task_id", subTask.TaskId);
                    cmd.Parameters.AddWithValue("@subtask_name", subTask.SubTaskName);
                    return cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
