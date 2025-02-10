import { Module } from "@medusajs/framework/utils";
import { APP_MODULE } from "src/constants";
import AdminUserService from "./service";

export default Module(APP_MODULE.ADMIN_USER, { service: AdminUserService });
