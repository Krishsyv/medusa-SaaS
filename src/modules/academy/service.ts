import { MedusaService } from "@medusajs/framework/utils";
import {
  Student,
  Class,
  Section,
  Language,
  StudentProfile,
  ClassKit,
  Kit,
} from "./models";

class AcademyService extends MedusaService({
  Kit,
  Class,
  Section,
  Language,
  Student,
  ClassKit,
  StudentProfile,
}) {}

export default AcademyService;
