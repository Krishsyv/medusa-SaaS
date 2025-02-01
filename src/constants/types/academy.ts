export enum CLASS_KIT_TYPE {
  OPEN = "open",
  CLOSED = "closed",
}

export enum GENDER {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export type RegisterStudentInput = {
  portal_id: string;
  student_enrollment_code: string;
  email: string; // To maintain uniqueness for customer, we are storing student id as email
  first_name: string;
  last_name: string;
  password: string;
};

export type NameInput = {
  portal_id: string;
  name: string;
};

export type KitInput = {
  portal_id: string;
  product_id: string;
  qty: number;
  status: boolean;
};

export type ClassKitInput = {
  portal_id: string;
  kit_id: string;
  class_id: string;
  type: CLASS_KIT_TYPE;
  is_customizable: boolean;
  second_language: string;
  third_language: string;
  third_language_status: boolean;
  status: boolean;
};

export type StudentProfileInput = {
  student_name?: string;
  father_name?: string;
  mother_name?: string;
  mother_phone?: string;
  mother_email?: string;
  gender?: string;
  hap?: number;
  hasdp?: number;
  first_term_paid?: boolean;
  house?: string;
  ai?: boolean;
  academic_year?: number;
  date_of_admission?: Date;
  application_no?: number;
  locality?: string;
  otp?: string;
  active?: boolean;
  referral_code?: string;
  is_sheffler?: boolean;
  // relations
  class?: string;
  section?: string;
  second_language?: string;
  third_language?: string;
  fourth_language?: string;
};
