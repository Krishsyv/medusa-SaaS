import { Module } from "@medusajs/framework/utils";
import { APP_MODULE } from "src/constants";
import PortalService from "./service";

export default Module(APP_MODULE.PORTAL, { service: PortalService });
