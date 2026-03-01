

export interface Student {
  id: string;
  name: string;
  lastname: string;
  file: string; 
  email?: string; 
  dateofbirth?: string;
  Id?: string;
  Name?: string;
  Lastname?: string;
  File?: string;
}

export interface ClassroomStudent {
  classroomId: string;
  studentId: string;
  student?: Student;
  ClassroomId?: string;
  StudentId?: string;
  Student?: Student;
}

export interface PublishedGame {
  id: string;
  title: string;
  description: string;
  level: string;
  gameId: string;
  topicId?: string;
  classroomId?: string;
  startDate?: string;
  endDate?: string;
  Id?: string;
  Title?: string;
  Description?: string;
  Level?: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  accessCode: number;
  createdAt?: string;
  teacherId?: string;
  classroomStudents?: ClassroomStudent[];
  publishedGames?: PublishedGame[];
  studentCount?: number;
  publishedGamesCount?: number;
  Id?: string;
  Name?: string;
  Description?: string;
  AccessCode?: number;
  ClassroomStudents?: ClassroomStudent[];
  PublishedGames?: PublishedGame[];
}

export interface PublishGameRequest {
  gameId: string;
  title: string;
  level: string;
  topic?: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  publishedGames?: any[];
  words?: any[];
  Id?: string;
  Name?: string;
  Description?: string;
}