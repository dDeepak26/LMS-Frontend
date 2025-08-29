import type { courseType } from "./courseType";
import type { userType } from "./UserType";

interface lectureProgressType {
  lectureId: number;
  isCompleted: boolean;
}

export interface enrolledUserCourseType {
  _id: string;
  user: userType;
  course: courseType;
  markAsComplete: boolean;
  lectureProgress?: [lectureProgressType];
  createdAt: string;
  updatedAt: string;
}
