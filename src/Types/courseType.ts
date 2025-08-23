export interface lecture {
  order?: number;
  title: string;
  lectureDescription: string;
  preview: boolean;
  videoUrl: any;
}

export interface courseType {
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
}
