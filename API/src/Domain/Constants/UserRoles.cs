namespace Domain.Constants;

public static class UserRoles
{
    public const string Admin = "Admin";
    public const string Teacher = "Teacher";
    public const string Student = "Student";
    public const string Patient = "Patient";
    public static IReadOnlyCollection<string> All = [Admin, Teacher, Student, Patient];
    public static bool IsInRoles(string roleName) => All.Contains(roleName);
    public static bool IsAdmin(string roleName) => roleName == Admin;
    public static bool IsTeacher(string roleName) => roleName == Teacher;
    public static bool IsStudent(string roleName) => roleName == Student;
    public static bool IsPatient(string roleName) => roleName == Patient;
}