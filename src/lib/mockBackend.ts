// src/lib/mockBackend.ts

// تم استيراد الأنواع والبيانات المشتركة من ملف types.ts الجديد
import { UserRole, AttendanceNote } from "./types";

//======================================================================
//  المحاكاة الوهمية للواجهة الخلفية (Mock Backend)
//======================================================================

const mockBackend = (() => {
    interface User {
        id: string;
        roles: UserRole[];
        password: string;
        status: "active" | "paused" | "pending";
        fullName?: string;
        specialty?: string;
        phoneNumber?: string;
        grade?: string;
        groupType?: string;
        subject?: string;
        parentPhoneNumber?: string;
        studentId?: string;
        [key: string]: unknown;
    }

    // تم الاحتفاظ ببعض الأمثلة للحفاظ على وظائف الاختبار مع حذف البيانات الشخصية
    const mockUsers = new Map<string, User>();
    mockUsers.set("adminuser", { id: "adminuser", roles: ["admin"], password: "adminpassword", status: "active", fullName: "المدير العام" });
    mockUsers.set("accountantuser", { id: "accountantuser", roles: ["accountant"], password: "accpassword", status: "active", fullName: "المحاسب المسؤول" });
    mockUsers.set("teacheruser", { id: "teacheruser", roles: ["teacher"], password: "teacherpassword", fullName: "أستاذ فرنسي", specialty: "french", phoneNumber: "01012345678", status: "active" });
    mockUsers.set("studentuser", { id: "studentuser", roles: ["student"], password: "studentpassword", fullName: "طالب متفوق", grade: "secondary3", groupType: "private", subject: "french", phoneNumber: "01098765432", status: "active" });
    mockUsers.set("parentuser", { id: "parentuser", roles: ["parent"], password: "parentpassword", fullName: "ولي أمر طالب", studentId: "studentuser", phoneNumber: "01122334455", status: "active" });
    mockUsers.set("supervisoruser", { id: "supervisoruser", roles: ["supervisor"], password: "superpassword", fullName: "المشرف الأكاديمي", status: "active" });

    const mockTeachers = new Map<string, User>();
    Array.from(mockUsers.values()).forEach(user => {
        if (user.roles.includes("teacher")) {
            mockTeachers.set(user.id, user);
        }
    });

    let pendingStudents: User[] = [];
    let pendingTeachers: User[] = [];
    
    interface AssignedTeacher {
        teacherUsername: string;
        grade: string;
        subject: string;
    }
    const assignedTeachers: AssignedTeacher[] = [{ teacherUsername: "teacheruser", grade: "secondary3", subject: "french" }];
    
    const studentAttendanceAndNotes: AttendanceNote[] = [];

    const checkUsernameExists = (username: string) =>
        mockUsers.has(username) ||
        pendingStudents.some(u => u.id === username) ||
        pendingTeachers.some(u => u.id === username);

    const registerUser = (username: string, role: UserRole, data: Record<string, unknown>) => {
        if (checkUsernameExists(username)) {
            return { success: false, error: "اسم المستخدم موجود بالفعل." };
        }
        const newRequest = {
            id: username,
            roles: [role],
            password: typeof data.password === "string" ? data.password : "",
            status: "pending",
            ...data
        };
        if (role === "student") {
            pendingStudents.push(newRequest as User);
        } else if (role === "teacher") {
            pendingTeachers.push(newRequest as User);
        } else {
            return { success: false, error: "دور المستخدم غير مدعوم للتسجيل." };
        }
        return { success: true };
    };

    const approveUser = (id: string, role: UserRole) => {
        let user: User | undefined;
        if (role === "student") {
            const index = pendingStudents.findIndex(req => req.id === id);
            if (index > -1) {
                user = pendingStudents.splice(index, 1)[0];
                mockUsers.set(user.id, { ...user, roles: ["student"], status: "active" });
                const parentId = `parent_${user.id}`;
                mockUsers.set(parentId, { id: parentId, roles: ["parent"], password: "parentpassword", fullName: `ولي أمر ${user.fullName || user.id}`, studentId: user.id, status: "active", phoneNumber: user.parentPhoneNumber || "" });
                return { success: true };
            }
        } else if (role === "teacher") {
            const index = pendingTeachers.findIndex(req => req.id === id);
            if (index > -1) {
                user = pendingTeachers.splice(index, 1)[0];
                mockUsers.set(user.id, { ...user, roles: ["teacher"], status: "active" });
                mockTeachers.set(user.id, { ...user, roles: ["teacher"], status: "active" });
                return { success: true };
            }
        }
        return { success: false, error: "لم يتم العثور على الطلب." };
    };

    const rejectUser = (id: string, role: UserRole) => {
        if (role === "student") {
            const index = pendingStudents.findIndex(req => req.id === id);
            if (index > -1) {
                pendingStudents.splice(index, 1);
                return { success: true };
            }
        } else if (role === "teacher") {
            const index = pendingTeachers.findIndex(req => req.id === id);
            if (index > -1) {
                pendingTeachers.splice(index, 1);
                return { success: true };
            }
        }
        return { success: false, error: "لم يتم العثور على الطلب." };
    };

    const assignRolesToTeacher = (username: string, newRoles: UserRole[]) => {
        const user = mockUsers.get(username);
        if (user && (user.roles.includes("teacher") || user.roles.includes("accountant") || user.roles.includes("supervisor") || user.roles.includes("admin"))) {
            mockUsers.set(username, { ...user, roles: newRoles });
            if (mockTeachers.has(username)) {
                mockTeachers.set(username, { ...user, roles: newRoles });
            } else if (newRoles.includes("teacher")) {
                mockTeachers.set(username, { ...user, roles: newRoles });
            }
            return { success: true };
        }
        return { success: false, error: "المستخدم غير موجود أو غير مخول لتعديل الأدوار." };
    };

    const getStudentsByTeacherAssignment = (teacherUsername: string) => {
        const assigned = assignedTeachers.find(a => a.teacherUsername === teacherUsername);
        if (!assigned) {
            return [];
        }
        return Array.from(mockUsers.values()).filter(user =>
            user.roles.includes("student") &&
            user.subject === assigned.subject &&
            user.grade === assigned.grade
        );
    };

    const getTeachers = () => Array.from(mockTeachers.values());
    const getAllStudents = () => Array.from(mockUsers.values()).filter(user => user.roles.includes("student"));
    const getAllStaff = () => Array.from(mockUsers.values()).filter(user =>
        user.roles.includes("teacher") ||
        user.roles.includes("accountant") ||
        user.roles.includes("supervisor") ||
        user.roles.includes("admin")
    );
    const getAllParents = () => Array.from(mockUsers.values()).filter(user => user.roles.includes("parent"));
    const getAllUsers = () => Array.from(mockUsers.values());

    const getStudents = (filters: { grade?: string; subject?: string; groupType?: string; teacher?: string }) => {
        const allStudents = getAllStudents();
        return allStudents.filter(student => {
            let matches = true;
            if (filters.grade && student.grade !== filters.grade) { matches = false; }
            if (filters.subject && student.subject !== filters.subject) { matches = false; }
            if (filters.groupType && student.groupType !== filters.groupType) { matches = false; }
            if (filters.teacher && !assignedTeachers.some(a => a.teacherUsername === filters.teacher && a.grade === student.grade && a.subject === student.subject)) {
                matches = false;
            }
            return matches;
        });
    };

    const updateUserStatus = (username: string, status: "active" | "paused") => {
        const user = mockUsers.get(username);
        if (user) {
            mockUsers.set(username, { ...user, status });
            if (mockTeachers.has(username)) {
                mockTeachers.set(username, { ...user, status });
            }
            return { success: true };
        }
        return { success: false, error: "المستخدم غير موجود." };
    };

    const deleteUser = (username: string) => {
        if (mockUsers.has(username)) {
            mockUsers.delete(username);
            mockTeachers.delete(username);
            const deletedUser = Array.from(mockUsers.values()).find(u => u.id === username);
            if (deletedUser && deletedUser.roles.includes("student")) {
                mockUsers.delete(`parent_${username}`);
            }
            return { success: true };
        }
        return { success: false, error: "المستخدم غير موجود." };
    };

    const saveAttendanceAndNotes = (data: AttendanceNote) => {
        const existingIndex = studentAttendanceAndNotes.findIndex(
            item => item.studentUsername === data.studentUsername && item.date === data.date && item.teacherUsername === data.teacherUsername
        );
        if (existingIndex > -1) {
            studentAttendanceAndNotes[existingIndex] = data;
        } else {
            studentAttendanceAndNotes.push(data);
        }
        return { success: true };
    };

    const getAttendanceAndNotes = (studentUsername: string) => {
        return studentAttendanceAndNotes.filter(item => item.studentUsername === studentUsername);
    };

    return {
        signInWithPassword: async ({ username, password }: { username: string, password: string }) => {
            const user = mockUsers.get(username);
            if (user && user.password === password) {
                return { data: { user: { id: username, roles: user.roles, status: user.status } }, error: null };
            }
            return { data: { user: null }, error: new Error("بيانات الاعتماد غير صحيحة") };
        },
        getUserRoles: (username: string) => mockUsers.get(username)?.roles,
        getUser: (username: string) => mockUsers.get(username),
        getPendingStudents: () => [...pendingStudents],
        getPendingTeachers: () => [...pendingTeachers],
        getTeachers,
        getStudentsByTeacherAssignment,
        registerUser,
        approveUser,
        rejectUser,
        assignRolesToTeacher,
        getStudents,
        getAllStudents,
        getAllStaff,
        getAllParents,
        getAllUsers,
        updateUserStatus,
        deleteUser,
        saveAttendanceAndNotes,
        getAttendanceAndNotes,
    };
})();

export default mockBackend;
