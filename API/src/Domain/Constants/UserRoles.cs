namespace Domain.Constants;

public static class UserRoles
{
    public const string Admin = "Admin";
    public const string Teacher = "Teacher";
    public const string Student = "Student";
    public static IReadOnlyCollection<string> All = [Admin, Teacher, Student];
    public static bool IsInRoles(string roleName) => All.Contains(roleName);
    public static bool IsAdmin(string roleName) => roleName == Admin;
    public static bool IsTeacher(string roleName) => roleName == Teacher;
    public static bool IsStudent(string roleName) => roleName == Student;
}