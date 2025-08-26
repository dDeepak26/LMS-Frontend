export interface instructor {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface lecture {
  order?: number;
  title: string;
  lectureDescription: string;
  preview: boolean;
  videoUrl: any;
}

export interface courseType {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: string;
  outcomes: string;
  skillsGained: string[];
  price: number;
  discount: number;
  imageUrl: any;
  lectures: lecture[];
  instructor: instructor;
  createdAt: string;
  updatedAt: string;
}

export interface enrolledCoursesType {
  _id: string;
  user: string;
  course: courseType;
  createdAt: string;
  updatedAt: string;
}
