import { Module } from "@medusajs/framework/utils";
import { APP_MODULE } from "src/constants";
import AcademyService from "./service";

export default Module(APP_MODULE.ACADEMY, { service: AcademyService });
